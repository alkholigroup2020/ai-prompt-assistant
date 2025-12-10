/**
 * POST /api/enhance-email
 * Endpoint for email enhancement using AI (Groq primary, Gemini fallback)
 */

import { randomUUID } from 'crypto'
import type { EmailEnhanceRequest, EmailEnhanceResponse } from '~/types/email'
import type { APIError } from '~/types/api'
import { enforceRateLimit } from '../utils/rate-limit'
import { sanitizeInput } from '../utils/security'
import { enhanceEmail } from '../utils/ai-provider'

/**
 * Validation rules for email enhancement
 */
const EMAIL_VALIDATION_RULES = {
  emailDraft: { min: 10, max: 5000 },
  outputLanguage: ['en', 'ar'],
  tone: ['professional', 'friendly', 'formal', 'casual'],
}

/**
 * Maximum payload size (1MB)
 */
const MAX_PAYLOAD_SIZE = 1048576

/**
 * Validate email enhancement request
 */
function validateEmailRequest(body: unknown): {
  valid: boolean
  sanitized?: EmailEnhanceRequest
  error?: APIError
} {
  // Check payload size
  const bodyStr = JSON.stringify(body)
  if (bodyStr.length > MAX_PAYLOAD_SIZE) {
    return {
      valid: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: `Request payload too large (max ${MAX_PAYLOAD_SIZE} bytes)`,
      },
    }
  }

  // Type check
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

  // Validate emailDraft (required)
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

    // Note: We don't run validateSecurity() on email content because:
    // 1. Email content is natural language, not code
    // 2. Common phrases like "update me on where we are" trigger SQL injection false positives
    // 3. The content is sanitized before use and sent to Gemini API which handles it safely
  }

  // Validate outputLanguage (required)
  if (!input.outputLanguage || typeof input.outputLanguage !== 'string') {
    errors.push({ field: 'outputLanguage', message: 'Output language is required' })
  } else if (!EMAIL_VALIDATION_RULES.outputLanguage.includes(input.outputLanguage)) {
    errors.push({
      field: 'outputLanguage',
      message: `Output language must be one of: ${EMAIL_VALIDATION_RULES.outputLanguage.join(
        ', '
      )}`,
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

  // Return validation errors if any
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

  // Sanitize and return
  const sanitized: EmailEnhanceRequest = {
    emailDraft: sanitizeInput(input.emailDraft as string, {
      escapeHtml: false,
      allowNewlines: true,
    }),
    outputLanguage: input.outputLanguage as 'en' | 'ar',
    tone: input.tone as 'professional' | 'friendly' | 'formal' | 'casual' | undefined,
  }

  return {
    valid: true,
    sanitized,
  }
}

/**
 * Main event handler
 */
export default defineEventHandler(async (event): Promise<EmailEnhanceResponse> => {
  const startTime = Date.now()
  const requestId = randomUUID()

  try {
    // Apply rate limiting
    enforceRateLimit(event)

    // Parse request body
    const body = await readBody(event)

    // Validate and sanitize input
    const validation = validateEmailRequest(body)

    if (!validation.valid) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: validation.error,
      }
    }

    // Get sanitized input
    const sanitizedInput = validation.sanitized!

    // Call AI provider (Groq primary, Gemini fallback)
    const result = await enhanceEmail(sanitizedInput)

    // Calculate processing time
    const processingTime = Date.now() - startTime

    // Build successful response
    const response: EmailEnhanceResponse = {
      success: true,
      data: {
        enhancedEmail: result.enhancedEmail,
        suggestedSubject: result.suggestedSubject,
        improvements: Array.isArray(result.improvements) ? result.improvements : [],
        metadata: {
          originalLength: sanitizedInput.emailDraft.length,
          enhancedLength: result.enhancedEmail.length,
          processingTime,
          language: sanitizedInput.outputLanguage,
          requestId,
          timestamp: new Date(),
          provider: result.provider, // Track which provider was used
        },
      },
    }

    // Set success status
    setResponseStatus(event, 200)

    return response
  } catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error'
    console.error('Email enhancement error:', {
      requestId,
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString(),
    })

    // Determine error type and status code
    let statusCode = 500
    let errorCode = 'INTERNAL_ERROR'
    let errorMessage = 'An unexpected error occurred while enhancing your email'

    // Check for H3 errors with statusCode (like rate limit errors)
    const errorObj = error as { statusCode?: number; statusMessage?: string }
    if (errorObj.statusCode === 429) {
      statusCode = 429
      errorCode = 'RATE_LIMIT_EXCEEDED'
      errorMessage = 'Too many requests. Please wait before trying again.'
    } else if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_ERROR') || error.message.includes('GROQ_API_ERROR') || error.message.includes('AI_PROVIDER_ERROR')) {
        statusCode = 502
        errorCode = 'AI_PROVIDER_ERROR'
        errorMessage = 'AI service temporarily unavailable. Please try again.'
      } else if (error.message.includes('TIMEOUT')) {
        statusCode = 504
        errorCode = 'TIMEOUT'
        errorMessage = 'Request took too long. Please try a shorter email.'
      } else if (error.message.includes('RATE_LIMIT')) {
        statusCode = 429
        errorCode = 'RATE_LIMIT_EXCEEDED'
        errorMessage = 'Too many requests. Please wait before trying again.'
      }
    }

    // Set error status
    setResponseStatus(event, statusCode)

    // SECURITY: Return generic error message to client (never expose internal details)
    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    }
  }
})
