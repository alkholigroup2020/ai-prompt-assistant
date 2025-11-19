import type {
  PromptTemplate,
  TemplateCategory,
  TemplateDifficulty,
  APIError,
} from '~/types'

interface TemplatesState {
  templates: PromptTemplate[]
  currentTemplate: PromptTemplate | null
  loading: boolean
  error: APIError | null
  filters: {
    category: TemplateCategory | null
    difficulty: TemplateDifficulty | null
    search: string
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface TemplateCache {
  templates: PromptTemplate[]
  total: number
  timestamp: number
}

// Cache expiration time: 24 hours in milliseconds
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000
const CACHE_KEY = 'prompt-templates-cache'

/**
 * Get cached templates from localStorage
 */
function getCachedTemplates(): TemplateCache | null {
  if (import.meta.client) {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const data: TemplateCache = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is still valid
      if (now - data.timestamp < CACHE_EXPIRATION) {
        return data
      }

      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY)
    } catch {
      // Invalid cache data, remove it
      localStorage.removeItem(CACHE_KEY)
    }
  }
  return null
}

/**
 * Save templates to localStorage cache
 */
function setCachedTemplates(templates: PromptTemplate[], total: number): void {
  if (import.meta.client) {
    try {
      const cache: TemplateCache = {
        templates,
        total,
        timestamp: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      // localStorage might be full or unavailable
      console.warn('Failed to cache templates:', error)
    }
  }
}

/**
 * Composable for managing prompt templates
 */
export function useTemplates() {
  const api = useApi()

  // Reactive state for templates
  const state = reactive<TemplatesState>({
    templates: [],
    currentTemplate: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      difficulty: null,
      search: '',
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  })

  /**
   * Fetch templates list with current filters
   */
  async function fetchTemplates(): Promise<void> {
    state.loading = true
    state.error = null

    try {
      // Check if we can use cached data (no filters, first page)
      const noFilters =
        !state.filters.category &&
        !state.filters.difficulty &&
        !state.filters.search &&
        state.pagination.page === 1

      if (noFilters) {
        const cached = getCachedTemplates()
        if (cached) {
          // Use cached data
          state.templates = cached.templates
          state.pagination.total = cached.total
          state.pagination.totalPages = Math.ceil(
            cached.total / state.pagination.limit
          )
          state.loading = false
          return
        }
      }

      // Fetch from API
      const response = await api.fetchTemplates(
        state.filters.category || undefined,
        state.filters.difficulty || undefined,
        state.filters.search || undefined,
        state.pagination.page,
        state.pagination.limit
      )

      if (response.data) {
        state.templates = response.data.templates
        state.pagination.total = response.data.total
        state.pagination.totalPages = Math.ceil(
          response.data.total / response.data.pageSize
        )

        // Cache the templates if no filters (base template list)
        if (noFilters) {
          setCachedTemplates(response.data.templates, response.data.total)
        }
      }
    } catch (error) {
      state.error = error as APIError
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Fetch a single template by ID
   */
  async function fetchTemplate(id: string): Promise<void> {
    state.loading = true
    state.error = null

    try {
      const response = await api.fetchTemplate(id)
      if (response.data) {
        state.currentTemplate = response.data
      }
    } catch (error) {
      state.error = error as APIError
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Set category filter
   */
  function setCategory(category: TemplateCategory | null): void {
    state.filters.category = category
    state.pagination.page = 1 // Reset to first page
  }

  /**
   * Set difficulty filter
   */
  function setDifficulty(difficulty: TemplateDifficulty | null): void {
    state.filters.difficulty = difficulty
    state.pagination.page = 1 // Reset to first page
  }

  /**
   * Set search query
   */
  function setSearch(search: string): void {
    state.filters.search = search
    state.pagination.page = 1 // Reset to first page
  }

  /**
   * Clear all filters
   */
  function clearFilters(): void {
    state.filters.category = null
    state.filters.difficulty = null
    state.filters.search = ''
    state.pagination.page = 1
  }

  /**
   * Go to specific page
   */
  function goToPage(page: number): void {
    if (page >= 1 && page <= state.pagination.totalPages) {
      state.pagination.page = page
    }
  }

  /**
   * Go to next page
   */
  function nextPage(): void {
    if (state.pagination.page < state.pagination.totalPages) {
      state.pagination.page++
    }
  }

  /**
   * Go to previous page
   */
  function previousPage(): void {
    if (state.pagination.page > 1) {
      state.pagination.page--
    }
  }

  /**
   * Search templates by query
   */
  async function search(query: string): Promise<void> {
    setSearch(query)
    await fetchTemplates()
  }

  /**
   * Filter templates by category
   */
  async function filterByCategory(category: TemplateCategory | null): Promise<void> {
    setCategory(category)
    await fetchTemplates()
  }

  /**
   * Filter templates by difficulty
   */
  async function filterByDifficulty(
    difficulty: TemplateDifficulty | null
  ): Promise<void> {
    setDifficulty(difficulty)
    await fetchTemplates()
  }

  /**
   * Clear current template
   */
  function clearCurrentTemplate(): void {
    state.currentTemplate = null
  }

  // Computed properties
  const hasTemplates = computed(() => state.templates.length > 0)
  const hasCurrentTemplate = computed(() => state.currentTemplate !== null)
  const hasFilters = computed(
    () =>
      state.filters.category !== null ||
      state.filters.difficulty !== null ||
      state.filters.search !== ''
  )
  const hasNextPage = computed(
    () => state.pagination.page < state.pagination.totalPages
  )
  const hasPreviousPage = computed(() => state.pagination.page > 1)

  return {
    // State
    state: readonly(state),

    // Actions
    fetchTemplates,
    fetchTemplate,
    setCategory,
    setDifficulty,
    setSearch,
    clearFilters,
    goToPage,
    nextPage,
    previousPage,
    search,
    filterByCategory,
    filterByDifficulty,
    clearCurrentTemplate,

    // Computed
    hasTemplates,
    hasCurrentTemplate,
    hasFilters,
    hasNextPage,
    hasPreviousPage,
  }
}
