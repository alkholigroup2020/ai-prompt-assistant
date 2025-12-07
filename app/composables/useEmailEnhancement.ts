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
 * Uses useState to persist state across page navigations
 */
export function useEmailEnhancement() {
  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EmailEnhancementState>('email-enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalEmail: ''
  }))

  /**
   * Enhance an email using the AI API
   */
  async function enhance(input: EmailEnhanceRequest): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original email for comparison
    state.value.originalEmail = input.emailDraft

    try {
      const response = await $fetch<EmailEnhanceResponse>('/api/enhance-email', {
        method: 'POST',
        body: input
      })

      if (!response.success && response.error) {
        throw response.error
      }

      state.value.result = response
    }
    catch (error) {
      // Handle fetch errors
      if (error && typeof error === 'object' && 'data' in error) {
        const fetchError = error as { data?: EmailEnhanceResponse }
        if (fetchError.data?.error) {
          state.value.error = fetchError.data.error
        }
        else {
          state.value.error = {
            code: 'FETCH_ERROR',
            message: 'Failed to connect to the server. Please try again.'
          }
        }
      }
      else if (error && typeof error === 'object' && 'code' in error) {
        state.value.error = error as APIError
      }
      else {
        state.value.error = {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      }
      throw state.value.error
    }
    finally {
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
    improvementPercentage
  }
}
