/**
 * POST /api/enhance-email
 * Endpoint for email enhancement using Gemini AI
 */

import { randomUUID } from 'crypto'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EmailEnhanceRequest, EmailEnhanceResponse } from '~/types/email'
import type { APIError } from '~/types/api'
import { enforceRateLimit } from '../utils/rate-limit'
import { sanitizeInput } from '../utils/security'
import { buildEmailEnhancementPrompt, parseEmailResponse } from '../utils/email-prompts'

/**
 * Validation rules for email enhancement
 */
const EMAIL_VALIDATION_RULES = {
  emailDraft: { min: 10, max: 5000 },
  outputLanguage: ['en', 'ar'],
  tone: ['professional', 'friendly', 'formal', 'casual']
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
        message: `Request payload too large (max ${MAX_PAYLOAD_SIZE} bytes)`
      }
    }
  }

  // Type check
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Request body must be a valid JSON object'
      }
    }
  }

  const input = body as Record<string, unknown>
  const errors: { field: string; message: string }[] = []

  // Validate emailDraft (required)
  if (!input.emailDraft || typeof input.emailDraft !== 'string') {
    errors.push({ field: 'emailDraft', message: 'Email draft is required' })
  }
  else {
    const length = input.emailDraft.trim().length
    if (length < EMAIL_VALIDATION_RULES.emailDraft.min) {
      errors.push({
        field: 'emailDraft',
        message: `Email draft must be at least ${EMAIL_VALIDATION_RULES.emailDraft.min} characters`
      })
    }
    if (length > EMAIL_VALIDATION_RULES.emailDraft.max) {
      errors.push({
        field: 'emailDraft',
        message: `Email draft must not exceed ${EMAIL_VALIDATION_RULES.emailDraft.max} characters`
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
  }
  else if (!EMAIL_VALIDATION_RULES.outputLanguage.includes(input.outputLanguage)) {
    errors.push({
      field: 'outputLanguage',
      message: `Output language must be one of: ${EMAIL_VALIDATION_RULES.outputLanguage.join(', ')}`
    })
  }

  // Validate tone (optional)
  if (input.tone && typeof input.tone !== 'string') {
    errors.push({ field: 'tone', message: 'Tone must be a string' })
  }
  else if (input.tone && !EMAIL_VALIDATION_RULES.tone.includes(input.tone as string)) {
    errors.push({
      field: 'tone',
      message: `Tone must be one of: ${EMAIL_VALIDATION_RULES.tone.join(', ')}`
    })
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { fields: errors }
      }
    }
  }

  // Sanitize and return
  const sanitized: EmailEnhanceRequest = {
    emailDraft: sanitizeInput(input.emailDraft as string, {
      escapeHtml: false,
      allowNewlines: true
    }),
    outputLanguage: input.outputLanguage as 'en' | 'ar',
    tone: input.tone as 'professional' | 'friendly' | 'formal' | 'casual' | undefined
  }

  return {
    valid: true,
    sanitized
  }
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    }
    catch (error) {
      lastError = error as Error

      // Don't retry on validation errors or rate limits
      if (
        error instanceof Error
        && (error.message.includes('VALIDATION') || error.message.includes('RATE_LIMIT'))
      ) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)

      // Don't wait on the last attempt
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
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
        error: validation.error
      }
    }

    // Get sanitized input
    const sanitizedInput = validation.sanitized!

    // Initialize Gemini client
    const config = useRuntimeConfig()
    const apiKey = config.geminiApiKey

    if (!apiKey) {
      throw new Error('GEMINI_API_ERROR: API key not configured')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // Use gemini-2.5-flash (gemini-2.0-flash has quota issues)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build prompt
    const prompt = buildEmailEnhancementPrompt(sanitizedInput)

    // Call Gemini API with retry logic
    let responseText: string
    try {
      responseText = await retryWithBackoff(async () => {
        const response = await model.generateContent(prompt)
        return response.response.text()
      })
    }
    catch (geminiError) {
      // Convert Gemini errors to properly tagged errors for consistent handling
      const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown error'

      if (errorMessage.includes('API key') || errorMessage.includes('invalid_api_key') || errorMessage.includes('API_KEY_INVALID')) {
        throw new Error('GEMINI_API_ERROR: Invalid API key configuration')
      }
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('GEMINI_API_ERROR: API quota exceeded')
      }
      if (errorMessage.includes('not found') || errorMessage.includes('NOT_FOUND')) {
        throw new Error('GEMINI_API_ERROR: Model not found - check model name')
      }
      // Wrap any other Gemini error
      throw new Error('GEMINI_API_ERROR: Unable to enhance email')
    }

    // Parse the response
    const parsed = parseEmailResponse(responseText)

    // Validate required fields
    if (!parsed.enhancedEmail || !parsed.improvements) {
      throw new Error('Incomplete response from AI')
    }

    // Calculate processing time
    const processingTime = Date.now() - startTime

    // Build successful response
    const response: EmailEnhanceResponse = {
      success: true,
      data: {
        enhancedEmail: parsed.enhancedEmail,
        suggestedSubject: parsed.suggestedSubject,
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        metadata: {
          originalLength: sanitizedInput.emailDraft.length,
          enhancedLength: parsed.enhancedEmail.length,
          processingTime,
          language: sanitizedInput.outputLanguage,
          requestId,
          timestamp: new Date()
        }
      }
    }

    // Set success status
    setResponseStatus(event, 200)

    return response
  }
  catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error'
    console.error('Email enhancement error:', {
      requestId,
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString()
    })

    // Determine error type and status code
    let statusCode = 500
    let errorCode = 'INTERNAL_ERROR'
    let errorMessage = 'An unexpected error occurred while enhancing your email'

    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_ERROR')) {
        statusCode = 502
        errorCode = 'GEMINI_API_ERROR'
        errorMessage = 'AI service temporarily unavailable. Please try again.'
      }
      else if (error.message.includes('TIMEOUT')) {
        statusCode = 504
        errorCode = 'TIMEOUT'
        errorMessage = 'Request took too long. Please try a shorter email.'
      }
      else if (error.message.includes('RATE_LIMIT')) {
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
        message: errorMessage
      }
    }
  }
})
