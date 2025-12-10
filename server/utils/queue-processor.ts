/**
 * Queue Processor - Processes jobs from the request queue
 *
 * Processing is triggered by status polling requests.
 * This "lazy" processing model works well with serverless environments
 * where there's no persistent background process.
 */

import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest } from '~/types/email'
import type { APIError } from '~/types/api'
import {
  getNextPendingJob,
  updateJobStatus,
  isProcessing,
  getProcessingJob,
  type QueueJob,
} from './request-queue'
import { enhancePrompt, enhanceEmail } from './ai-provider'

/**
 * Processing configuration
 */
const PROCESSOR_CONFIG = {
  // Minimum interval between processing jobs (ms)
  // ~30 jobs/minute = 2000ms interval
  MIN_INTERVAL_MS: 2000,

  // Maximum time a job can be processing before being marked stale (ms)
  STALE_THRESHOLD_MS: 60000, // 60 seconds
}

/**
 * Track last processing time
 * Note: This is in-memory and resets on cold start
 */
let lastProcessTime = 0

/**
 * Processing lock to prevent concurrent processing
 */
let isProcessingLock = false

/**
 * Check if we should process the next job
 */
function shouldProcessNext(): boolean {
  const now = Date.now()

  // Check minimum interval
  if (now - lastProcessTime < PROCESSOR_CONFIG.MIN_INTERVAL_MS) {
    return false
  }

  // Check if already processing
  if (isProcessingLock) {
    return false
  }

  // Check for stale processing job
  const processingJob = getProcessingJob()
  if (processingJob && processingJob.startedAt) {
    const elapsed = now - processingJob.startedAt
    if (elapsed < PROCESSOR_CONFIG.STALE_THRESHOLD_MS) {
      // Still processing, don't start another
      return false
    }
    // Job is stale, will be marked as failed by getNextPendingJob
  }

  return true
}

/**
 * Process the next pending job
 * This function is called on each status poll request
 *
 * Returns true if a job was processed, false otherwise
 */
export async function processNextJob(): Promise<boolean> {
  // Check if we should process
  if (!shouldProcessNext()) {
    return false
  }

  // Get next pending job
  const job = getNextPendingJob()
  if (!job) {
    return false
  }

  // Acquire lock
  isProcessingLock = true
  lastProcessTime = Date.now()

  // Mark as processing
  updateJobStatus(job.id, 'processing')

  try {
    // Process based on job type
    let result: unknown

    if (job.type === 'prompt') {
      const promptResult = await enhancePrompt(job.payload as FormInput)
      result = {
        success: true,
        data: promptResult.data,
        provider: promptResult.provider,
      }
    } else if (job.type === 'email') {
      const emailResult = await enhanceEmail(job.payload as EmailEnhanceRequest)
      result = {
        success: true,
        data: {
          enhancedEmail: emailResult.enhancedEmail,
          suggestedSubject: emailResult.suggestedSubject,
          improvements: emailResult.improvements,
        },
        provider: emailResult.provider,
      }
    }

    // Mark as completed
    updateJobStatus(job.id, 'completed', result)

    return true
  } catch (error) {
    // Determine error type
    let apiError: APIError

    if (error instanceof Error) {
      if (error.message.includes('RATE_LIMIT') || error.message.includes('rate limit')) {
        apiError = {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'AI service rate limit reached. Please try again in a moment.',
        }
      } else if (error.message.includes('TIMEOUT')) {
        apiError = {
          code: 'TIMEOUT',
          message: 'Request timed out. Please try again.',
        }
      } else if (
        error.message.includes('AI_PROVIDER_ERROR') ||
        error.message.includes('GROQ_API_ERROR') ||
        error.message.includes('GEMINI_API_ERROR')
      ) {
        apiError = {
          code: 'AI_PROVIDER_ERROR',
          message: 'AI service temporarily unavailable. Please try again.',
        }
      } else {
        apiError = {
          code: 'PROCESSING_ERROR',
          message: 'Failed to process request. Please try again.',
        }
      }
    } else {
      apiError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      }
    }

    // Mark as failed
    updateJobStatus(job.id, 'failed', undefined, apiError)

    // Log error (sanitized)
    console.error('Queue processing error:', {
      jobId: job.id,
      type: job.type,
      errorCode: apiError.code,
      timestamp: new Date().toISOString(),
    })

    return true // Job was processed (even if failed)
  } finally {
    // Release lock
    isProcessingLock = false
  }
}

/**
 * Try to process jobs (non-blocking)
 * Call this on each status poll to potentially process the next job
 */
export function tryProcessJobs(): void {
  // Don't await - fire and forget
  processNextJob().catch((err) => {
    console.error('Queue processor error:', {
      error: err instanceof Error ? err.message.split(':')[0] : 'Unknown',
      timestamp: new Date().toISOString(),
    })
  })
}

/**
 * Get processing status
 */
export function getProcessingStatus(): {
  isProcessing: boolean
  lastProcessTime: number
  timeSinceLastProcess: number
} {
  return {
    isProcessing: isProcessingLock || isProcessing(),
    lastProcessTime,
    timeSinceLastProcess: Date.now() - lastProcessTime,
  }
}
