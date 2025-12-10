/**
 * Queue Store
 * Tracks queue submission status and manages polling
 */

import { defineStore } from 'pinia'
import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest, EmailEnhanceResponse } from '~/types/email'
import type { EnhancementResponse, APIError } from '~/types/api'
import { useRateLimitStore } from './rateLimit'

/**
 * Queue job type
 */
export type QueueJobType = 'prompt' | 'email'

/**
 * Queue status
 */
export type QueueStatus = 'idle' | 'submitting' | 'queued' | 'processing' | 'completed' | 'failed'

/**
 * Queue state interface
 */
interface QueueState {
  /** Current job ID */
  jobId: string | null
  /** Current job type */
  jobType: QueueJobType | null
  /** Current status */
  status: QueueStatus
  /** Position in queue (1-based) */
  position: number
  /** Estimated wait time in seconds */
  estimatedWait: number
  /** Result when completed */
  result: EnhancementResponse | EmailEnhanceResponse | null
  /** Error when failed */
  error: APIError | null
  /** Polling interval ID */
  pollIntervalId: ReturnType<typeof setInterval> | null
  /** Queue stats */
  queueStats: {
    pending: number
    processing: number
  }
}

/**
 * Polling configuration
 */
const POLL_CONFIG = {
  INTERVAL_MS: 2500, // 2.5 seconds
  MAX_POLLS: 120, // 5 minutes max polling (120 * 2.5s)
}

/**
 * Queue store
 */
export const useQueueStore = defineStore('queue', {
  /**
   * State
   */
  state: (): QueueState => ({
    jobId: null,
    jobType: null,
    status: 'idle',
    position: 0,
    estimatedWait: 0,
    result: null,
    error: null,
    pollIntervalId: null,
    queueStats: {
      pending: 0,
      processing: 0,
    },
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Check if there's an active job
     */
    hasActiveJob(): boolean {
      return this.status === 'queued' || this.status === 'processing' || this.status === 'submitting'
    },

    /**
     * Check if job is complete
     */
    isComplete(): boolean {
      return this.status === 'completed'
    },

    /**
     * Check if job failed
     */
    isFailed(): boolean {
      return this.status === 'failed'
    },

    /**
     * Get formatted position text
     */
    positionText(): string {
      if (this.position <= 0) return ''
      return `#${this.position}`
    },

    /**
     * Get formatted wait time
     */
    formattedWait(): string {
      if (this.estimatedWait <= 0) return ''
      if (this.estimatedWait < 60) {
        return `~${this.estimatedWait}s`
      }
      const minutes = Math.ceil(this.estimatedWait / 60)
      return `~${minutes}m`
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Submit a job to the queue
     */
    async submitToQueue(
      type: QueueJobType,
      payload: FormInput | EmailEnhanceRequest
    ): Promise<void> {
      // Reset state
      this.reset()
      this.status = 'submitting'
      this.jobType = type

      try {
        const rawResponse = await $fetch.raw<{
          success: boolean
          jobId?: string
          position?: number
          estimatedWaitSeconds?: number
          queueStats?: { pending: number; processing: number }
          error?: APIError
        }>('/api/queue/submit', {
          method: 'POST',
          body: { type, payload },
        })

        // Extract rate limit headers and update store
        const rateLimitStore = useRateLimitStore()
        rateLimitStore.updateFromHeaders(rawResponse.headers)

        const response = rawResponse._data

        if (!response?.success) {
          this.status = 'failed'
          this.error = response?.error || {
            code: 'SUBMIT_ERROR',
            message: 'Failed to submit to queue',
          }
          return
        }

        // Update state with queue info
        this.jobId = response.jobId || null
        this.position = response.position || 0
        this.estimatedWait = response.estimatedWaitSeconds || 0
        this.status = 'queued'

        if (response.queueStats) {
          this.queueStats = response.queueStats
        }

        // Start polling
        this.startPolling()
      } catch (err) {
        this.status = 'failed'

        if (err && typeof err === 'object' && 'data' in err) {
          const fetchError = err as { data?: { error?: APIError } }
          this.error = fetchError.data?.error || {
            code: 'NETWORK_ERROR',
            message: 'Failed to connect to server',
          }
        } else {
          this.error = {
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred',
          }
        }
      }
    },

    /**
     * Start polling for job status
     */
    startPolling(): void {
      if (!import.meta.client) return
      if (this.pollIntervalId) return
      if (!this.jobId) return

      let pollCount = 0

      this.pollIntervalId = setInterval(async () => {
        pollCount++

        // Stop polling after max polls
        if (pollCount > POLL_CONFIG.MAX_POLLS) {
          this.stopPolling()
          this.status = 'failed'
          this.error = {
            code: 'TIMEOUT',
            message: 'Request timed out. Please try again.',
          }
          return
        }

        await this.pollJobStatus()

        // Stop polling if job is complete or failed
        if (this.status === 'completed' || this.status === 'failed') {
          this.stopPolling()
        }
      }, POLL_CONFIG.INTERVAL_MS)
    },

    /**
     * Stop polling
     */
    stopPolling(): void {
      if (this.pollIntervalId) {
        clearInterval(this.pollIntervalId)
        this.pollIntervalId = null
      }
    },

    /**
     * Poll for job status
     */
    async pollJobStatus(): Promise<void> {
      if (!this.jobId) return

      try {
        const rawResponse = await $fetch.raw<{
          success: boolean
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          position?: number
          estimatedWaitSeconds?: number
          result?: unknown
          error?: APIError
          queueStats?: { pending: number; processing: number }
        }>(`/api/queue/status/${this.jobId}`)

        // Extract rate limit headers and update store
        const rateLimitStore = useRateLimitStore()
        rateLimitStore.updateFromHeaders(rawResponse.headers)

        const response = rawResponse._data

        if (!response?.success) {
          // Job not found or error
          this.status = 'failed'
          this.error = response?.error || {
            code: 'STATUS_ERROR',
            message: 'Failed to get job status',
          }
          return
        }

        // Update queue stats
        if (response.queueStats) {
          this.queueStats = response.queueStats
        }

        // Update state based on status
        switch (response.status) {
          case 'pending':
            this.status = 'queued'
            this.position = response.position || 0
            this.estimatedWait = response.estimatedWaitSeconds || 0
            break

          case 'processing':
            this.status = 'processing'
            this.position = 0
            this.estimatedWait = 0
            break

          case 'completed':
            this.status = 'completed'
            this.result = response.result as EnhancementResponse | EmailEnhanceResponse | null
            break

          case 'failed':
            this.status = 'failed'
            this.error = response?.error || {
              code: 'PROCESSING_ERROR',
              message: 'Job failed',
            }
            break
        }
      } catch (err) {
        // Network error - don't fail immediately, keep polling
        console.warn('Queue poll error:', err instanceof Error ? err.message : 'Unknown')
      }
    },

    /**
     * Cancel the current job (stops polling, job stays in queue)
     */
    cancel(): void {
      this.stopPolling()
      this.status = 'idle'
      // Note: Job stays in queue on server, will expire after TTL
    },

    /**
     * Reset queue state
     */
    reset(): void {
      this.stopPolling()
      this.jobId = null
      this.jobType = null
      this.status = 'idle'
      this.position = 0
      this.estimatedWait = 0
      this.result = null
      this.error = null
      this.queueStats = { pending: 0, processing: 0 }
    },

    /**
     * Get the enhancement result (for prompt type)
     */
    getPromptResult(): EnhancementResponse | null {
      if (this.jobType !== 'prompt' || !this.result) return null
      return this.result as EnhancementResponse
    },

    /**
     * Get the email result (for email type)
     */
    getEmailResult(): EmailEnhanceResponse | null {
      if (this.jobType !== 'email' || !this.result) return null
      return this.result as EmailEnhanceResponse
    },
  },
})
