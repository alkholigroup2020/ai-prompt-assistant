import type {
  EnhancementResponse,
  TemplateListResponse,
  TemplateDetailResponse,
  AnalysisResponse,
  ExportResponse,
  HealthResponse,
  APIError,
  FormInput,
} from '~/types'
import { apiCache, CACHE_TIMES } from '~/utils/apiCache'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  retry?: number
  timeout?: number
  cache?: boolean
  cacheTime?: number
}

interface ApiState {
  loading: boolean
  error: APIError | null
}

/**
 * Custom API composable with error handling, loading states, and retry logic
 */
export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.appUrl || ''

  /**
   * Generic fetch wrapper with error handling, retry logic, and caching
   */
  async function fetchWithRetry<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      retry = 3,
      timeout = 30000,
      cache = false,
      cacheTime = CACHE_TIMES.FIVE_MINUTES,
    } = options

    // Generate cache key from endpoint and body
    const cacheKey = cache
      ? `${endpoint}:${body ? JSON.stringify(body) : ''}`
      : ''

    // Check cache first if caching is enabled
    if (cache && cacheKey) {
      const cached = apiCache.get<T>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt < retry; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await $fetch<T>(endpoint, {
          baseURL,
          method,
          body: body as unknown as BodyInit,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        clearTimeout(timeoutId)

        // Cache the response if caching is enabled
        if (cache && cacheKey && response) {
          apiCache.set(cacheKey, response, cacheTime)
        }

        return response as T
      } catch (error) {
        lastError = error as Error

        // Don't retry on client errors (4xx)
        if (error && typeof error === 'object' && 'statusCode' in error) {
          const statusCode = (error as { statusCode?: number }).statusCode
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            throw error
          }
        }

        // Exponential backoff for retries
        if (attempt < retry - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          )
        }
      }
    }

    throw lastError
  }

  /**
   * Enhance a prompt using the AI API
   */
  async function enhancePrompt(input: FormInput): Promise<EnhancementResponse> {
    const state = reactive<ApiState>({ loading: true, error: null })

    try {
      const response = await fetchWithRetry<EnhancementResponse>('/api/enhance-prompt', {
        method: 'POST',
        body: input as unknown as Record<string, unknown>,
      })

      state.loading = false
      return response
    } catch (error) {
      state.loading = false
      state.error = error as APIError
      throw error
    }
  }

  /**
   * Fetch all templates with optional filters
   */
  async function fetchTemplates(
    category?: string,
    difficulty?: string,
    search?: string,
    page = 1,
    limit = 20
  ): Promise<TemplateListResponse> {
    const params = new URLSearchParams()

    if (category) params.append('category', category)
    if (difficulty) params.append('difficulty', difficulty)
    if (search) params.append('search', search)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const endpoint = `/api/templates?${params.toString()}`

    return await fetchWithRetry<TemplateListResponse>(endpoint, { retry: 2 })
  }

  /**
   * Fetch a single template by ID
   */
  async function fetchTemplate(id: string): Promise<TemplateDetailResponse> {
    return await fetchWithRetry<TemplateDetailResponse>(`/api/templates/${id}`, {
      retry: 2,
    })
  }

  /**
   * Analyze prompt quality without enhancement
   */
  async function analyzePrompt(prompt: string): Promise<AnalysisResponse> {
    return await fetchWithRetry<AnalysisResponse>('/api/analyze-prompt', {
      method: 'POST',
      body: { prompt },
    })
  }

  /**
   * Export prompt in specified format
   */
  async function exportPrompt(
    content: string,
    format: 'txt' | 'md' | 'json',
    metadata?: Record<string, unknown>
  ): Promise<ExportResponse> {
    return await fetchWithRetry<ExportResponse>('/api/export', {
      method: 'POST',
      body: { content, format, metadata },
      retry: 1,
    })
  }

  /**
   * Check API health status (cached for 1 minute)
   */
  async function checkHealth(): Promise<HealthResponse> {
    return await fetchWithRetry<HealthResponse>('/api/health', {
      retry: 1,
      cache: true,
      cacheTime: CACHE_TIMES.ONE_MINUTE,
    })
  }

  return {
    enhancePrompt,
    fetchTemplates,
    fetchTemplate,
    analyzePrompt,
    exportPrompt,
    checkHealth,
  }
}
