import type { FormInput, EnhancementResponse, APIError } from '~/types'

interface EnhancementState {
  loading: boolean
  error: APIError | null
  result: EnhancementResponse | null
  originalPrompt: string
}

/**
 * Composable for managing prompt enhancement functionality
 * Uses direct API call for Vercel serverless compatibility
 */
export function useEnhancement() {
  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EnhancementState>('enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalPrompt: '',
  }))

  /**
   * Enhance a prompt using direct API call
   */
  async function enhance(input: FormInput): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original prompt for comparison
    state.value.originalPrompt = buildOriginalPrompt(input)

    try {
      // Call the direct API endpoint
      const response = await $fetch<EnhancementResponse>('/api/enhance-prompt', {
        method: 'POST',
        body: input,
      })

      if (response.success && response.data) {
        state.value.result = response
      } else {
        state.value.error = response.error || {
          code: 'ENHANCEMENT_ERROR',
          message: 'Failed to enhance prompt',
        }
        throw state.value.error
      }
    } catch (error) {
      // Handle fetch errors
      if (!state.value.error) {
        const fetchError = error as { data?: { error?: APIError }; statusCode?: number }
        if (fetchError.data?.error) {
          state.value.error = fetchError.data.error
        } else if (fetchError.statusCode === 429) {
          state.value.error = {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please wait before trying again.',
          }
        } else {
          state.value.error = {
            code: 'NETWORK_ERROR',
            message: 'Failed to connect to server. Please try again.',
          }
        }
      }
      throw state.value.error
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

  /**
   * Queue position (always 0 - no queue)
   */
  const queuePosition = computed(() => 0)

  /**
   * Queue status (mapped from loading state for compatibility)
   */
  const queueStatus = computed(() => {
    if (state.value.loading) return 'processing'
    if (state.value.error) return 'failed'
    if (state.value.result) return 'completed'
    return 'idle'
  })

  /**
   * Check if in queue (always false - direct API)
   */
  const isQueued = computed(() => false)

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

    // Queue-specific (kept for compatibility)
    queuePosition,
    queueStatus,
    isQueued,
  }
}
