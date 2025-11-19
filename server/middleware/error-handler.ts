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

  // Remove sensitive information patterns
  return message
    // Remove file paths (Windows and Unix)
    .replace(/[A-Za-z]:\\[^\s]+/g, '[path]')
    .replace(/\/[^\s]+/g, '[path]')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '[url]')
    // Remove API keys (common patterns)
    .replace(/[A-Za-z0-9]{32,}/g, '[redacted]')
    // Remove stack trace references
    .replace(/at\s+.+\(.+\)/g, '')
    .replace(/Error:\s*/g, '')
    // Remove IP addresses
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[ip]')
    // Remove email addresses
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]')
    .trim();
}

/**
 * Sanitize log path (remove query parameters that might contain sensitive data)
 */
function sanitizePath(path: string): string {
  try {
    const url = new URL(path, 'http://localhost');
    // Remove query parameters to avoid logging sensitive data
    return url.pathname;
  } catch {
    // If path is not a valid URL, just return the first part before ?
    return path.split('?')[0] || path;
  }
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
 * SECURITY: Never logs stack traces, API keys, or sensitive information
 */
function logError(requestId: string, statusCode: number, error: Error | { message?: string; code?: string; stack?: string }, path: string): void {
  if (!shouldLogError(statusCode)) {
    return;
  }

  const logEntry = {
    requestId,
    statusCode,
    path: sanitizePath(path),
    timestamp: new Date().toISOString(),
    error: {
      message: sanitizeErrorMessage(error),
      code: 'code' in error ? error.code : 'UNKNOWN_ERROR'
      // SECURITY: Stack traces are NEVER included in logs, even in development
      // Use debugger or local development tools to view stack traces
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
