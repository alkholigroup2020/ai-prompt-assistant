import type { EmailEnhanceRequest, EmailEnhanceResponse } from '~/types/email'
import type { APIError } from '~/types/api'
import { useQueueStore } from '~/stores/queue'

interface EmailEnhancementState {
  loading: boolean
  error: APIError | null
  result: EmailEnhanceResponse | null
  originalEmail: string
}

/**
 * Composable for managing email enhancement functionality
 * Uses queue-based processing for all requests
 */
export function useEmailEnhancement() {
  const queueStore = useQueueStore()

  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EmailEnhancementState>('email-enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalEmail: '',
  }))

  /**
   * Enhance an email using the queue
   */
  async function enhance(input: EmailEnhanceRequest): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original email for comparison
    state.value.originalEmail = input.emailDraft

    try {
      // Submit to queue
      await queueStore.submitToQueue('email', input)

      // Wait for completion by watching the store
      await waitForCompletion()

      // Check result
      if (queueStore.status === 'completed' && queueStore.result) {
        // Extract the result - queue returns { success, data, provider }
        const queueResult = queueStore.result as {
          success?: boolean
          data?: {
            enhancedEmail: string
            suggestedSubject: string
            improvements: string[]
          }
          provider?: string
        }

        if (queueResult.data) {
          state.value.result = {
            success: true,
            data: {
              enhancedEmail: queueResult.data.enhancedEmail,
              suggestedSubject: queueResult.data.suggestedSubject,
              improvements: queueResult.data.improvements || [],
              metadata: {
                originalLength: state.value.originalEmail.length,
                enhancedLength: queueResult.data.enhancedEmail?.length || 0,
                processingTime: 0,
                language: input.outputLanguage,
                requestId: queueStore.jobId || '',
                timestamp: new Date(),
                provider: queueResult.provider as 'groq' | 'gemini' | undefined,
              },
            },
          }
        }
      } else if (queueStore.status === 'failed') {
        state.value.error = queueStore.error || {
          code: 'QUEUE_ERROR',
          message: 'Failed to process request',
        }
        throw state.value.error
      }
    } catch (error) {
      if (!state.value.error) {
        state.value.error = error as APIError
      }
      throw error
    } finally {
      state.value.loading = false
    }
  }

  /**
   * Wait for queue job to complete
   */
  function waitForCompletion(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already complete
      if (queueStore.status === 'completed' || queueStore.status === 'failed') {
        if (queueStore.status === 'failed') {
          reject(queueStore.error)
        } else {
          resolve()
        }
        return
      }

      // Watch for status changes
      const unwatch = watch(
        () => queueStore.status,
        (status) => {
          if (status === 'completed') {
            unwatch()
            resolve()
          } else if (status === 'failed' || status === 'idle') {
            unwatch()
            reject(queueStore.error || new Error('Queue processing failed'))
          }
        },
        { immediate: false }
      )

      // Timeout after 5 minutes
      setTimeout(() => {
        unwatch()
        reject(new Error('Queue timeout'))
      }, 5 * 60 * 1000)
    })
  }

  /**
   * Clear email enhancement state
   */
  function clear(): void {
    state.value.loading = false
    state.value.error = null
    state.value.result = null
    state.value.originalEmail = ''
    queueStore.reset()
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
   * Get loading state (includes queue status)
   */
  const isLoading = computed(() => state.value.loading || queueStore.hasActiveJob)

  /**
   * Get error state
   */
  const error = computed(() => state.value.error || queueStore.error)

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
   * Get queue position
   */
  const queuePosition = computed(() => queueStore.position)

  /**
   * Get queue status
   */
  const queueStatus = computed(() => queueStore.status)

  /**
   * Check if in queue
   */
  const isQueued = computed(
    () => queueStore.status === 'queued' || queueStore.status === 'processing'
  )

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

    // Queue-specific
    queuePosition,
    queueStatus,
    isQueued,
    queueStore,
  }
}
