/**
 * GET /api/queue/status/:id
 * Check the status of a queued job
 *
 * Returns: { status, position?, result?, error?, estimatedWaitSeconds? }
 */

import type { APIError } from '~/types/api'
import { getJob, getJobPosition, getEstimatedWait, getQueueStats, getClientRateLimitInfo } from '../../../utils/request-queue'
import { tryProcessJobs, getProcessingStatus } from '../../../utils/queue-processor'

/**
 * Job status response
 */
interface JobStatusResponse {
  success: boolean
  jobId?: string
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  position?: number
  estimatedWaitSeconds?: number
  result?: unknown
  error?: APIError
  queueStats?: {
    pending: number
    processing: number
  }
  processingInfo?: {
    isProcessing: boolean
    timeSinceLastProcess: number
  }
}

/**
 * Main event handler
 */
export default defineEventHandler(async (event): Promise<JobStatusResponse> => {
  try {
    // Get job ID from route params
    const jobId = getRouterParam(event, 'id')

    if (!jobId) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: {
          code: 'INVALID_JOB_ID',
          message: 'Job ID is required',
        },
      }
    }

    // Try to process jobs (non-blocking)
    // This triggers the queue processor on each poll
    tryProcessJobs()

    // Get job
    const job = getJob(jobId)

    if (!job) {
      setResponseStatus(event, 404)
      return {
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found or has expired',
        },
      }
    }

    // Get queue stats
    const stats = getQueueStats()
    const processingStatus = getProcessingStatus()

    // Get rate limit info (based on recent jobs within 60s window)
    const rateLimitInfo = getClientRateLimitInfo(job.clientId)

    // Set rate limit headers
    setHeader(event, 'X-RateLimit-Limit', rateLimitInfo.limit)
    setHeader(event, 'X-RateLimit-Remaining', rateLimitInfo.remaining)
    setHeader(event, 'X-RateLimit-Reset', rateLimitInfo.resetAt)

    // Build response based on status
    const response: JobStatusResponse = {
      success: true,
      jobId: job.id,
      status: job.status,
      queueStats: {
        pending: stats.pending,
        processing: stats.processing,
      },
    }

    // Add status-specific fields
    switch (job.status) {
      case 'pending':
        response.position = getJobPosition(jobId)
        response.estimatedWaitSeconds = getEstimatedWait(jobId)
        break

      case 'processing':
        response.position = 0
        response.estimatedWaitSeconds = 0
        response.processingInfo = {
          isProcessing: processingStatus.isProcessing,
          timeSinceLastProcess: processingStatus.timeSinceLastProcess,
        }
        break

      case 'completed':
        response.result = job.result
        break

      case 'failed':
        response.error = job.error || {
          code: 'UNKNOWN_ERROR',
          message: 'Job failed for unknown reason',
        }
        break
    }

    return response
  } catch (error) {
    console.error('Queue status error:', {
      error: error instanceof Error ? error.message.split(':')[0] : 'Unknown',
      timestamp: new Date().toISOString(),
    })

    setResponseStatus(event, 500)
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get job status. Please try again.',
      },
    }
  }
})
