/**
 * POST /api/enhance-prompt
 * Main endpoint for prompt enhancement using AI (Groq primary, Gemini fallback)
 */

import { randomUUID } from 'crypto';
import type { EnhancementResponse } from '~/types/api';
import { validateFormInput } from '../utils/validation';
import { enforceRateLimit } from '../utils/rate-limit';
import { enhancePrompt } from '../utils/ai-provider';

export default defineEventHandler(async (event): Promise<EnhancementResponse> => {
  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    // Apply rate limiting
    enforceRateLimit(event);

    // Parse request body
    const body = await readBody(event);

    // Validate and sanitize input
    const validation = validateFormInput(body);

    if (!validation.valid) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: validation.error,
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementLevel: body.enhancementLevel || 'quick',
          originalLength: 0,
          enhancedLength: 0,
          language: body.language || 'en',
          requestId
        }
      };
    }

    // Get sanitized input
    const sanitizedInput = validation.sanitized!;

    // Call AI provider (Groq primary, Gemini fallback)
    const result = await enhancePrompt(sanitizedInput);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Build successful response
    const response: EnhancementResponse = {
      success: true,
      data: result.data,
      metadata: {
        processingTime,
        enhancementLevel: sanitizedInput.enhancementLevel || 'quick',
        originalLength: sanitizedInput.task?.length || 0,
        enhancedLength: result.data.enhancedPrompt.length,
        language: sanitizedInput.language || 'en',
        requestId,
        timestamp: new Date(),
        provider: result.provider // Track which provider was used
      }
    };

    // Set success status
    setResponseStatus(event, 200);

    return response;

  } catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Enhancement error:', {
      requestId,
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString()
    });

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred while enhancing your prompt';

    // Check for H3 errors with statusCode (like rate limit errors)
    const errorObj = error as { statusCode?: number; statusMessage?: string };
    if (errorObj.statusCode === 429) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
      errorMessage = 'Too many requests. Please wait before trying again.';
    } else if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_ERROR') || error.message.includes('GROQ_API_ERROR') || error.message.includes('AI_PROVIDER_ERROR')) {
        statusCode = 502;
        errorCode = 'AI_PROVIDER_ERROR';
        errorMessage = 'AI service temporarily unavailable. Please try again.';
      } else if (error.message.includes('TIMEOUT')) {
        statusCode = 504;
        errorCode = 'TIMEOUT';
        errorMessage = 'Request took too long. Please try a shorter prompt.';
      } else if (error.message.includes('RATE_LIMIT')) {
        statusCode = 429;
        errorCode = 'RATE_LIMIT_EXCEEDED';
        errorMessage = 'Too many requests. Please wait before trying again.';
      }
    }

    // Set error status
    setResponseStatus(event, statusCode);

    // SECURITY: Return generic error message to client (never expose internal details)
    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage
      },
      metadata: {
        processingTime: Date.now() - startTime,
        enhancementLevel: 'quick',
        originalLength: 0,
        enhancedLength: 0,
        language: 'en',
        requestId
      }
    };
  }
});
