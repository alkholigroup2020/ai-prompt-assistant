/**
 * POST /api/queue/submit
 * Submit a job to the enhancement queue
 *
 * Body: { type: 'prompt' | 'email', payload: FormInput | EmailEnhanceRequest }
 * Returns: { success: true, jobId, position, estimatedWaitSeconds }
 */

import type { H3Event } from 'h3'
import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest } from '~/types/email'
import type { APIError } from '~/types/api'
import { validateFormInput } from '../../utils/validation'
import { sanitizeInput } from '../../utils/security'
import { createJob, getQueueStats, getClientRateLimitInfo } from '../../utils/request-queue'
import { tryProcessJobs } from '../../utils/queue-processor'

/**
 * Email validation rules (same as enhance-email.post.ts)
 */
const EMAIL_VALIDATION_RULES = {
  emailDraft: { min: 10, max: 5000 },
  outputLanguage: ['en', 'ar'],
  tone: ['professional', 'friendly', 'formal', 'casual'],
}

/**
 * Get client identifier from request (same logic as rate limiter)
 */
function getClientId(event: H3Event): string {
  const sessionId = getHeader(event, 'x-session-id')
  if (sessionId) {
    return `session:${sessionId}`
  }

  const forwardedFor = getHeader(event, 'x-forwarded-for')
  const ip = forwardedFor
    ? forwardedFor.split(',')[0]?.trim() || 'unknown'
    : event.node.req.socket.remoteAddress || 'unknown'

  return `ip:${ip}`
}

/**
 * Validate email enhancement request
 */
function validateEmailRequest(body: unknown): {
  valid: boolean
  sanitized?: EmailEnhanceRequest
  error?: APIError
} {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Request body must be a valid JSON object',
      },
    }
  }

  const input = body as Record<string, unknown>
  const errors: { field: string; message: string }[] = []

  // Validate emailDraft
  if (!input.emailDraft || typeof input.emailDraft !== 'string') {
    errors.push({ field: 'emailDraft', message: 'Email draft is required' })
  } else {
    const length = input.emailDraft.trim().length
    if (length < EMAIL_VALIDATION_RULES.emailDraft.min) {
      errors.push({
        field: 'emailDraft',
        message: `Email draft must be at least ${EMAIL_VALIDATION_RULES.emailDraft.min} characters`,
      })
    }
    if (length > EMAIL_VALIDATION_RULES.emailDraft.max) {
      errors.push({
        field: 'emailDraft',
        message: `Email draft must not exceed ${EMAIL_VALIDATION_RULES.emailDraft.max} characters`,
      })
    }
  }

  // Validate outputLanguage
  if (!input.outputLanguage || typeof input.outputLanguage !== 'string') {
    errors.push({ field: 'outputLanguage', message: 'Output language is required' })
  } else if (!EMAIL_VALIDATION_RULES.outputLanguage.includes(input.outputLanguage)) {
    errors.push({
      field: 'outputLanguage',
      message: `Output language must be one of: ${EMAIL_VALIDATION_RULES.outputLanguage.join(', ')}`,
    })
  }

  // Validate tone (optional)
  if (input.tone && typeof input.tone !== 'string') {
    errors.push({ field: 'tone', message: 'Tone must be a string' })
  } else if (input.tone && !EMAIL_VALIDATION_RULES.tone.includes(input.tone as string)) {
    errors.push({
      field: 'tone',
      message: `Tone must be one of: ${EMAIL_VALIDATION_RULES.tone.join(', ')}`,
    })
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { fields: errors },
      },
    }
  }

  const sanitized: EmailEnhanceRequest = {
    emailDraft: sanitizeInput(input.emailDraft as string, {
      escapeHtml: false,
      allowNewlines: true,
    }),
    outputLanguage: input.outputLanguage as 'en' | 'ar',
    tone: input.tone as 'professional' | 'friendly' | 'formal' | 'casual' | undefined,
  }

  return { valid: true, sanitized }
}

/**
 * Queue submission response
 */
interface QueueSubmitResponse {
  success: boolean
  jobId?: string
  position?: number
  estimatedWaitSeconds?: number
  queueStats?: {
    pending: number
    processing: number
  }
  error?: APIError
}

/**
 * Main event handler
 */
export default defineEventHandler(async (event): Promise<QueueSubmitResponse> => {
  try {
    // Parse request body
    const body = await readBody(event)

    // Validate job type
    if (!body || typeof body !== 'object') {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Request body must be a valid JSON object',
        },
      }
    }

    const { type, payload } = body as { type?: string; payload?: unknown }

    if (!type || !['prompt', 'email'].includes(type)) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: {
          code: 'INVALID_TYPE',
          message: 'Job type must be "prompt" or "email"',
        },
      }
    }

    if (!payload || typeof payload !== 'object') {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Payload is required',
        },
      }
    }

    // Validate payload based on type
    let validatedPayload: FormInput | EmailEnhanceRequest

    if (type === 'prompt') {
      const validation = validateFormInput(payload)
      if (!validation.valid) {
        setResponseStatus(event, 400)
        return {
          success: false,
          error: validation.error,
        }
      }
      validatedPayload = validation.sanitized!
    } else {
      const validation = validateEmailRequest(payload)
      if (!validation.valid) {
        setResponseStatus(event, 400)
        return {
          success: false,
          error: validation.error,
        }
      }
      validatedPayload = validation.sanitized!
    }

    // Get client ID
    const clientId = getClientId(event)

    // Create job
    const result = createJob(clientId, type as 'prompt' | 'email', validatedPayload)

    // Get rate limit info (based on recent jobs within 60s window)
    const rateLimitInfo = getClientRateLimitInfo(clientId)

    // Set rate limit headers
    setHeader(event, 'X-RateLimit-Limit', rateLimitInfo.limit)
    setHeader(event, 'X-RateLimit-Remaining', rateLimitInfo.remaining)
    setHeader(event, 'X-RateLimit-Reset', rateLimitInfo.resetAt)

    if (!result.success) {
      // Queue is full or client limit exceeded
      setResponseStatus(event, 429)
      return {
        success: false,
        error: result.error,
      }
    }

    // Try to process jobs (non-blocking)
    tryProcessJobs()

    // Get queue stats
    const stats = getQueueStats()

    // Return success with job details
    return {
      success: true,
      jobId: result.jobId,
      position: result.position,
      estimatedWaitSeconds: result.position * 2, // ~2 seconds per job
      queueStats: {
        pending: stats.pending,
        processing: stats.processing,
      },
    }
  } catch (error) {
    console.error('Queue submit error:', {
      error: error instanceof Error ? error.message.split(':')[0] : 'Unknown',
      timestamp: new Date().toISOString(),
    })

    setResponseStatus(event, 500)
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to submit request to queue. Please try again.',
      },
    }
  }
})
