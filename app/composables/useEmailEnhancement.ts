import type { EmailEnhanceRequest, EmailEnhanceResponse } from '~/types/email'
import type { APIError } from '~/types/api'

interface EmailEnhancementState {
  loading: boolean
  error: APIError | null
  result: EmailEnhanceResponse | null
  originalEmail: string
}

/**
 * Composable for managing email enhancement functionality
 * Uses direct API call for Vercel serverless compatibility
 */
export function useEmailEnhancement() {
  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EmailEnhancementState>('email-enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalEmail: '',
  }))

  /**
   * Enhance an email using direct API call
   */
  async function enhance(input: EmailEnhanceRequest): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original email for comparison
    state.value.originalEmail = input.emailDraft

    try {
      // Call the direct API endpoint
      const response = await $fetch<EmailEnhanceResponse>('/api/enhance-email', {
        method: 'POST',
        body: input,
      })

      if (response.success && response.data) {
        state.value.result = response
      } else {
        state.value.error = response.error || {
          code: 'ENHANCEMENT_ERROR',
          message: 'Failed to enhance email',
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
   * Clear email enhancement state
   */
  function clear(): void {
    state.value.loading = false
    state.value.error = null
    state.value.result = null
    state.value.originalEmail = ''
  }

  /**
   * Check if enhancement result is available
   */
  const hasResult = computed(() => state.value.result !== null && state.value.result.success)

  /**
   * Get enhanced email text
   */
  const enhancedEmail = computed(() => state.value.result?.data?.enhancedEmail || '')

  /**
   * Get suggested subject line
   */
  const suggestedSubject = computed(() => state.value.result?.data?.suggestedSubject || '')

  /**
   * Get improvements list
   */
  const improvements = computed(() => state.value.result?.data?.improvements || [])

  /**
   * Get metadata
   */
  const metadata = computed(() => state.value.result?.data?.metadata)

  /**
   * Get loading state
   */
  const isLoading = computed(() => state.value.loading)

  /**
   * Get error state
   */
  const error = computed(() => state.value.error)

  /**
   * Get original email
   */
  const originalEmail = computed(() => state.value.originalEmail)

  /**
   * Calculate improvement percentage (character difference)
   */
  const improvementPercentage = computed(() => {
    if (!state.value.originalEmail || !enhancedEmail.value) return 0
    const originalLength = state.value.originalEmail.length
    const enhancedLength = enhancedEmail.value.length
    if (originalLength === 0) return 0
    return Math.round(((enhancedLength - originalLength) / originalLength) * 100)
  })

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
    enhancedEmail,
    suggestedSubject,
    improvements,
    metadata,
    isLoading,
    error,
    originalEmail,
    improvementPercentage,

    // Queue-specific (kept for compatibility)
    queuePosition,
    queueStatus,
    isQueued,
  }
}
