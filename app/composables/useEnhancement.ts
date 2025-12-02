import type { FormInput, EnhancementResponse, APIError } from '~/types'

interface EnhancementState {
  loading: boolean
  error: APIError | null
  result: EnhancementResponse | null
  originalPrompt: string
}

/**
 * Composable for managing prompt enhancement functionality
 * Uses useState to persist state across page navigations
 */
export function useEnhancement() {
  const api = useApi()

  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EnhancementState>('enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalPrompt: '',
  }))

  /**
   * Enhance a prompt using the AI API
   */
  async function enhance(input: FormInput): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original prompt for comparison
    state.value.originalPrompt = buildOriginalPrompt(input)

    try {
      const response = await api.enhancePrompt(input)
      state.value.result = response
    } catch (error) {
      state.value.error = error as APIError
      throw error
    } finally {
      state.value.loading = false
    }
  }

  /**
   * Build original prompt text from form input for comparison
   */
  function buildOriginalPrompt(input: FormInput): string {
    const parts: string[] = []

    if (input.role) {
      parts.push(`Role: ${input.role}`)
    }

    if (input.audience) {
      parts.push(`Audience: ${input.audience}`)
    }

    if (input.task) {
      parts.push(`Task: ${input.task}`)
    }

    if (input.tone) {
      parts.push(`Tone: ${input.tone}`)
    }

    if (input.outputFormat) {
      parts.push(`Output Format: ${input.outputFormat}`)
    }

    if (input.constraints && input.constraints.length > 0) {
      parts.push(`Constraints: ${input.constraints.join(', ')}`)
    }

    if (input.examples) {
      parts.push(`Examples: ${input.examples}`)
    }

    if (input.context) {
      parts.push(`Context: ${input.context}`)
    }

    return parts.join('\n\n')
  }

  /**
   * Clear enhancement state
   */
  function clear(): void {
    state.value.loading = false
    state.value.error = null
    state.value.result = null
    state.value.originalPrompt = ''
  }

  /**
   * Check if enhancement is available
   */
  const hasResult = computed(() => state.value.result !== null)

  /**
   * Get quality score from result
   */
  const qualityScore = computed(() => state.value.result?.data?.qualityScore || 0)

  /**
   * Get enhanced prompt text
   */
  const enhancedPrompt = computed(() => state.value.result?.data?.enhancedPrompt || '')

  /**
   * Get improvements list
   */
  const improvements = computed(() => state.value.result?.data?.improvements || [])

  /**
   * Get suggestions list
   */
  const suggestions = computed(() => state.value.result?.data?.suggestions || [])

  /**
   * Get alternative versions
   */
  const alternativeVersions = computed(
    () => state.value.result?.data?.alternativeVersions
  )

  /**
   * Get loading state
   */
  const isLoading = computed(() => state.value.loading)

  /**
   * Get error state
   */
  const error = computed(() => state.value.error)

  /**
   * Get original prompt
   */
  const originalPrompt = computed(() => state.value.originalPrompt)

  return {
    // State (expose as readonly ref)
    state: readonly(state),

    // Actions
    enhance,
    clear,

    // Computed
    hasResult,
    qualityScore,
    enhancedPrompt,
    improvements,
    suggestions,
    alternativeVersions,
    isLoading,
    error,
    originalPrompt,
  }
}
