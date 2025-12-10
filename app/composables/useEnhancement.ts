import type { FormInput, EnhancementResponse, APIError } from '~/types'
import { useQueueStore } from '~/stores/queue'

interface EnhancementState {
  loading: boolean
  error: APIError | null
  result: EnhancementResponse | null
  originalPrompt: string
}

/**
 * Composable for managing prompt enhancement functionality
 * Uses queue-based processing for all requests
 */
export function useEnhancement() {
  const queueStore = useQueueStore()

  // Use Nuxt's useState for persistent state across page navigations
  const state = useState<EnhancementState>('enhancement-state', () => ({
    loading: false,
    error: null,
    result: null,
    originalPrompt: '',
  }))

  /**
   * Enhance a prompt using the queue
   */
  async function enhance(input: FormInput): Promise<void> {
    // Reset previous state
    state.value.loading = true
    state.value.error = null
    state.value.result = null

    // Store original prompt for comparison
    state.value.originalPrompt = buildOriginalPrompt(input)

    try {
      // Submit to queue
      await queueStore.submitToQueue('prompt', input)

      // Wait for completion by watching the store
      await waitForCompletion()

      // Check result
      if (queueStore.status === 'completed' && queueStore.result) {
        // Extract the result - queue returns { success, data, provider }
        const queueResult = queueStore.result as { success?: boolean; data?: EnhancementResponse['data']; provider?: string }

        if (queueResult.data) {
          state.value.result = {
            success: true,
            data: queueResult.data,
            metadata: {
              processingTime: 0,
              enhancementLevel: input.enhancementLevel || 'quick',
              originalLength: state.value.originalPrompt.length,
              enhancedLength: queueResult.data.enhancedPrompt?.length || 0,
              language: input.language || 'en',
              requestId: queueStore.jobId || '',
              provider: queueResult.provider as 'groq' | 'gemini' | undefined,
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
    queueStore.reset()
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
   * Get loading state (includes queue status)
   */
  const isLoading = computed(() => state.value.loading || queueStore.hasActiveJob)

  /**
   * Get error state
   */
  const error = computed(() => state.value.error || queueStore.error)

  /**
   * Get original prompt
   */
  const originalPrompt = computed(() => state.value.originalPrompt)

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
  const isQueued = computed(() => queueStore.status === 'queued' || queueStore.status === 'processing')

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

    // Queue-specific
    queuePosition,
    queueStatus,
    isQueued,
    queueStore,
  }
}
