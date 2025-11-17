/**
 * Error Handler Middleware
 * Global error handler for unhandled errors in API routes
 */

import { randomUUID } from 'crypto';

/**
 * Sanitize error message (remove sensitive information)
 */
function sanitizeErrorMessage(error: Error | { message?: string }): string {
  const message = error.message || 'An unexpected error occurred';

  // Remove file paths and sensitive information
  return message
    .replace(/\/[^\s]+/g, '[path]')
    .replace(/at\s+.+\(.+\)/g, '')
    .replace(/Error:\s*/g, '')
    .trim();
}

/**
 * Determine if error should be logged
 */
function shouldLogError(statusCode: number): boolean {
  // Don't log client errors (4xx) except rate limits
  return statusCode >= 500 || statusCode === 429;
}

/**
 * Log error securely (without sensitive data)
 */
function logError(requestId: string, statusCode: number, error: Error | { message?: string; code?: string; stack?: string }, path: string): void {
  if (!shouldLogError(statusCode)) {
    return;
  }

  const logEntry = {
    requestId,
    statusCode,
    path,
    timestamp: new Date().toISOString(),
    error: {
      message: sanitizeErrorMessage(error),
      code: 'code' in error ? error.code : 'UNKNOWN_ERROR',
      // Don't log stack traces in production
      stack: process.env.NODE_ENV === 'development' && 'stack' in error ? error.stack : undefined
    }
  };

  console.error('API Error:', JSON.stringify(logEntry, null, 2));
}

export default defineEventHandler((event) => {
  // Attach error handler to the event
  event.node.res.on('finish', () => {
    const statusCode = event.node.res.statusCode;

    // Only handle errors (4xx, 5xx)
    if (statusCode >= 400) {
      const requestId = randomUUID();
      const path = event.node.req.url || 'unknown';

      // Create a mock error for logging
      const error = {
        statusCode,
        message: event.node.res.statusMessage || 'Error',
        code: 'HTTP_ERROR'
      };

      logError(requestId, statusCode, error, path);
    }
  });

  // Handle uncaught errors
  event.node.req.on('error', (error) => {
    const requestId = randomUUID();
    const path = event.node.req.url || 'unknown';

    console.error('Request Error:', {
      requestId,
      path,
      error: sanitizeErrorMessage(error),
      timestamp: new Date().toISOString()
    });
  });

  event.node.res.on('error', (error) => {
    const requestId = randomUUID();
    const path = event.node.req.url || 'unknown';

    console.error('Response Error:', {
      requestId,
      path,
      error: sanitizeErrorMessage(error),
      timestamp: new Date().toISOString()
    });
  });
});
