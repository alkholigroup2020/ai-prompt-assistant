import type { FormInput, EnhancementResponse, APIError } from '~/types'

interface EnhancementState {
  loading: boolean
  error: APIError | null
  result: EnhancementResponse | null
  originalPrompt: string
}

/**
 * Composable for managing prompt enhancement functionality
 */
export function useEnhancement() {
  const api = useApi()

  // Reactive state for enhancement
  const state = reactive<EnhancementState>({
    loading: false,
    error: null,
    result: null,
    originalPrompt: '',
  })

  /**
   * Enhance a prompt using the AI API
   */
  async function enhance(input: FormInput): Promise<void> {
    // Reset previous state
    state.loading = true
    state.error = null
    state.result = null

    // Store original prompt for comparison
    state.originalPrompt = buildOriginalPrompt(input)

    try {
      const response = await api.enhancePrompt(input)
      state.result = response
    } catch (error) {
      state.error = error as APIError
      throw error
    } finally {
      state.loading = false
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
    state.loading = false
    state.error = null
    state.result = null
    state.originalPrompt = ''
  }

  /**
   * Check if enhancement is available
   */
  const hasResult = computed(() => state.result !== null)

  /**
   * Get quality score from result
   */
  const qualityScore = computed(() => state.result?.data?.qualityScore || 0)

  /**
   * Get enhanced prompt text
   */
  const enhancedPrompt = computed(() => state.result?.data?.enhancedPrompt || '')

  /**
   * Get improvements list
   */
  const improvements = computed(() => state.result?.data?.improvements || [])

  /**
   * Get suggestions list
   */
  const suggestions = computed(() => state.result?.data?.suggestions || [])

  /**
   * Get alternative versions
   */
  const alternativeVersions = computed(
    () => state.result?.data?.alternativeVersions
  )

  return {
    // State
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
  }
}
