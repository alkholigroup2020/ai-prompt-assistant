/**
 * Request Queue - In-memory job queue for AI enhancement requests
 *
 * Features:
 * - FIFO processing with priority support
 * - Job status tracking (pending, processing, completed, failed)
 * - TTL-based cleanup (5 minutes)
 * - Per-client job limits (max 3 pending)
 * - Queue size limits (max 100 jobs)
 */

import { randomUUID } from 'crypto'
import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest } from '~/types/email'
import type { APIError } from '~/types/api'

/**
 * Job status enum
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Job type enum
 */
export type JobType = 'prompt' | 'email'

/**
 * Queue job interface
 */
export interface QueueJob {
  id: string
  clientId: string
  type: JobType
  payload: FormInput | EmailEnhanceRequest
  status: JobStatus
  result?: unknown
  error?: APIError
  createdAt: number
  startedAt?: number
  completedAt?: number
}

/**
 * Queue statistics
 */
export interface QueueStats {
  pending: number
  processing: number
  completed: number
  failed: number
  total: number
}

/**
 * Queue configuration
 */
const QUEUE_CONFIG = {
  MAX_QUEUE_SIZE: 100,
  MAX_JOBS_PER_CLIENT: 5,
  JOB_TTL_MS: 5 * 60 * 1000, // 5 minutes
  CLEANUP_INTERVAL_MS: 60 * 1000, // 1 minute
  PROCESSING_TIMEOUT_MS: 60 * 1000, // 60 seconds
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 60 seconds - time window for rate limiting
}

/**
 * In-memory job storage
 * Map<jobId, QueueJob>
 */
const jobQueue: Map<string, QueueJob> = new Map()

/**
 * Ordered list of pending job IDs (FIFO)
 */
const pendingQueue: string[] = []

/**
 * Currently processing job ID (null if none)
 */
let processingJobId: string | null = null

/**
 * Last cleanup timestamp
 */
let lastCleanupTime = 0

/**
 * Create a new job and add to queue
 */
export function createJob(
  clientId: string,
  type: JobType,
  payload: FormInput | EmailEnhanceRequest
): { success: true; jobId: string; position: number } | { success: false; error: APIError } {
  // Run cleanup if needed
  maybeCleanupExpiredJobs()

  // Check queue size limit
  if (jobQueue.size >= QUEUE_CONFIG.MAX_QUEUE_SIZE) {
    return {
      success: false,
      error: {
        code: 'QUEUE_FULL',
        message: 'Queue is full. Please try again later.',
      },
    }
  }

  // Check per-client rate limit (recent jobs within 60s window)
  const recentJobs = getClientRecentJobs(clientId)
  if (recentJobs >= QUEUE_CONFIG.MAX_JOBS_PER_CLIENT) {
    // Calculate time until oldest job expires from window
    const rateLimitInfo = getClientRateLimitInfo(clientId)
    const secondsUntilReset = Math.max(0, rateLimitInfo.resetAt - Math.floor(Date.now() / 1000))

    return {
      success: false,
      error: {
        code: 'CLIENT_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. You can make ${QUEUE_CONFIG.MAX_JOBS_PER_CLIENT} requests per minute. Try again in ${secondsUntilReset} seconds.`,
      },
    }
  }

  // Create job
  const job: QueueJob = {
    id: randomUUID(),
    clientId,
    type,
    payload,
    status: 'pending',
    createdAt: Date.now(),
  }

  // Add to storage and queue
  jobQueue.set(job.id, job)
  pendingQueue.push(job.id)

  // Calculate position (1-based)
  const position = pendingQueue.length

  return {
    success: true,
    jobId: job.id,
    position,
  }
}

/**
 * Get a job by ID
 */
export function getJob(jobId: string): QueueJob | null {
  return jobQueue.get(jobId) || null
}

/**
 * Get job position in queue (1-based, 0 if not pending)
 */
export function getJobPosition(jobId: string): number {
  const index = pendingQueue.indexOf(jobId)
  if (index === -1) return 0
  return index + 1
}

/**
 * Get estimated wait time in seconds
 */
export function getEstimatedWait(jobId: string): number {
  const position = getJobPosition(jobId)
  if (position === 0) return 0
  // Estimate ~2 seconds per job
  return position * 2
}

/**
 * Update job status
 */
export function updateJobStatus(
  jobId: string,
  status: JobStatus,
  result?: unknown,
  error?: APIError
): boolean {
  const job = jobQueue.get(jobId)
  if (!job) return false

  job.status = status

  if (status === 'processing') {
    job.startedAt = Date.now()
    // Remove from pending queue
    const index = pendingQueue.indexOf(jobId)
    if (index !== -1) {
      pendingQueue.splice(index, 1)
    }
    processingJobId = jobId
  } else if (status === 'completed' || status === 'failed') {
    job.completedAt = Date.now()
    if (result) job.result = result
    if (error) job.error = error
    if (processingJobId === jobId) {
      processingJobId = null
    }
  }

  return true
}

/**
 * Get next pending job for processing
 */
export function getNextPendingJob(): QueueJob | null {
  // Check if current processing job is stale
  if (processingJobId) {
    const processingJob = jobQueue.get(processingJobId)
    if (processingJob && processingJob.startedAt) {
      const elapsed = Date.now() - processingJob.startedAt
      if (elapsed > QUEUE_CONFIG.PROCESSING_TIMEOUT_MS) {
        // Mark as failed due to timeout
        updateJobStatus(processingJobId, 'failed', undefined, {
          code: 'TIMEOUT',
          message: 'Request timed out. Please try again.',
        })
      } else {
        // Still processing, don't start another
        return null
      }
    }
  }

  // Get next pending job
  if (pendingQueue.length === 0) return null

  const nextJobId = pendingQueue[0]
  if (!nextJobId) return null // TypeScript safety check
  const job = jobQueue.get(nextJobId)

  if (!job) {
    // Job was removed, clean up queue
    pendingQueue.shift()
    return getNextPendingJob()
  }

  return job
}

/**
 * Check if there's a job currently processing
 */
export function isProcessing(): boolean {
  return processingJobId !== null
}

/**
 * Get currently processing job
 */
export function getProcessingJob(): QueueJob | null {
  if (!processingJobId) return null
  return jobQueue.get(processingJobId) || null
}

/**
 * Count pending jobs for a client
 */
export function getClientPendingJobs(clientId: string): number {
  let count = 0
  for (const job of jobQueue.values()) {
    if (job.clientId === clientId && (job.status === 'pending' || job.status === 'processing')) {
      count++
    }
  }
  return count
}

/**
 * Count recent jobs for a client (within rate limit window)
 * This includes all jobs created in the last 60 seconds, regardless of status
 * Used for rate limiting to show accurate "requests remaining" count
 */
export function getClientRecentJobs(clientId: string): number {
  const now = Date.now()
  const windowStart = now - QUEUE_CONFIG.RATE_LIMIT_WINDOW_MS
  let count = 0

  for (const job of jobQueue.values()) {
    if (job.clientId === clientId && job.createdAt >= windowStart) {
      count++
    }
  }
  return count
}

/**
 * Get rate limit info for a client
 * Returns limit, remaining, and reset timestamp
 */
export function getClientRateLimitInfo(clientId: string): {
  limit: number
  remaining: number
  resetAt: number
} {
  const recentJobs = getClientRecentJobs(clientId)
  const remaining = Math.max(0, QUEUE_CONFIG.MAX_JOBS_PER_CLIENT - recentJobs)

  // Find the oldest job in the window to determine reset time
  const now = Date.now()
  const windowStart = now - QUEUE_CONFIG.RATE_LIMIT_WINDOW_MS
  let oldestJobTime = now

  for (const job of jobQueue.values()) {
    if (job.clientId === clientId && job.createdAt >= windowStart) {
      if (job.createdAt < oldestJobTime) {
        oldestJobTime = job.createdAt
      }
    }
  }

  // Reset time is when the oldest job in the window expires from the window
  const resetAt = Math.floor((oldestJobTime + QUEUE_CONFIG.RATE_LIMIT_WINDOW_MS) / 1000)

  return {
    limit: QUEUE_CONFIG.MAX_JOBS_PER_CLIENT,
    remaining,
    resetAt,
  }
}

/**
 * Get queue statistics
 */
export function getQueueStats(): QueueStats {
  let pending = 0
  let processing = 0
  let completed = 0
  let failed = 0

  for (const job of jobQueue.values()) {
    switch (job.status) {
      case 'pending':
        pending++
        break
      case 'processing':
        processing++
        break
      case 'completed':
        completed++
        break
      case 'failed':
        failed++
        break
    }
  }

  return {
    pending,
    processing,
    completed,
    failed,
    total: jobQueue.size,
  }
}

/**
 * Clean up expired jobs
 */
export function cleanupExpiredJobs(): number {
  const now = Date.now()
  let cleaned = 0

  for (const [jobId, job] of jobQueue.entries()) {
    // Check if job has expired
    const age = now - job.createdAt
    if (age > QUEUE_CONFIG.JOB_TTL_MS) {
      // Remove from pending queue if present
      const index = pendingQueue.indexOf(jobId)
      if (index !== -1) {
        pendingQueue.splice(index, 1)
      }
      // Clear processing job if it's this one
      if (processingJobId === jobId) {
        processingJobId = null
      }
      // Remove from storage
      jobQueue.delete(jobId)
      cleaned++
    }
  }

  lastCleanupTime = now
  return cleaned
}

/**
 * Maybe run cleanup if interval has passed
 */
function maybeCleanupExpiredJobs(): void {
  const now = Date.now()
  if (now - lastCleanupTime > QUEUE_CONFIG.CLEANUP_INTERVAL_MS) {
    cleanupExpiredJobs()
  }
}

/**
 * Delete a specific job
 */
export function deleteJob(jobId: string): boolean {
  const job = jobQueue.get(jobId)
  if (!job) return false

  // Remove from pending queue
  const index = pendingQueue.indexOf(jobId)
  if (index !== -1) {
    pendingQueue.splice(index, 1)
  }

  // Clear processing job if it's this one
  if (processingJobId === jobId) {
    processingJobId = null
  }

  // Remove from storage
  jobQueue.delete(jobId)
  return true
}

/**
 * Clear all jobs (for testing)
 */
export function clearAllJobs(): void {
  jobQueue.clear()
  pendingQueue.length = 0
  processingJobId = null
  lastCleanupTime = 0
}
