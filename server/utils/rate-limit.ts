/**
 * Rate Limiting Utility
 * Implements sliding window rate limiting to prevent API abuse
 */

import type { H3Event } from 'h3';
import type { RateLimitError } from '~/types/api';

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
}

/**
 * Request tracking entry
 */
interface RequestEntry {
  timestamp: number;
  count: number;
}

/**
 * In-memory store for request tracking
 * In production, this should be replaced with Redis or similar
 */
const requestStore = new Map<string, RequestEntry[]>();

/**
 * Cleanup old entries periodically (every 5 minutes)
 */
let cleanupInterval: NodeJS.Timeout;

function startCleanup() {
  if (cleanupInterval) {
    return;
  }

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entries] of requestStore.entries()) {
      const validEntries = entries.filter(entry => now - entry.timestamp < maxAge);

      if (validEntries.length === 0) {
        requestStore.delete(key);
      } else {
        requestStore.set(key, validEntries);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes

  // Prevent the interval from keeping the process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

// Start cleanup on module load
startCleanup();

/**
 * Get client identifier from request
 */
function getClientId(event: H3Event): string {
  // Try to get session ID from headers or cookies
  const sessionId = getHeader(event, 'x-session-id');
  if (sessionId) {
    return `session:${sessionId}`;
  }

  // Fallback to IP address
  const forwardedFor = getHeader(event, 'x-forwarded-for');
  const ip = forwardedFor
    ? forwardedFor.split(',')[0]?.trim() || 'unknown'
    : event.node.req.socket.remoteAddress || 'unknown';

  return `ip:${ip}`;
}

/**
 * Get default rate limit configuration
 */
function getDefaultConfig(): RateLimitConfig {
  const config = useRuntimeConfig();

  return {
    windowMs: parseInt(config.rateLimitWindow as string) || 60000, // 1 minute
    maxRequests: parseInt(config.rateLimitMaxRequests as string) || 60
  };
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  event: H3Event,
  config?: Partial<RateLimitConfig>
): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
} {
  const fullConfig = { ...getDefaultConfig(), ...config };
  const clientId = getClientId(event);
  const now = Date.now();
  const windowStart = now - fullConfig.windowMs;

  // Get or initialize request history
  let requests = requestStore.get(clientId) || [];

  // Remove requests outside the current window
  requests = requests.filter(entry => entry.timestamp > windowStart);

  // Calculate total requests in the current window
  const totalRequests = requests.reduce((sum, entry) => sum + entry.count, 0);

  // Check if limit is exceeded
  const allowed = totalRequests < fullConfig.maxRequests;
  const remaining = Math.max(0, fullConfig.maxRequests - totalRequests);

  // Calculate reset time (end of current window)
  const resetAt = new Date(now + fullConfig.windowMs);

  // If allowed, add this request to the tracking
  if (allowed) {
    requests.push({
      timestamp: now,
      count: 1
    });
    requestStore.set(clientId, requests);
  }

  // Calculate retry after (seconds until oldest request expires)
  let retryAfter: number | undefined;
  if (!allowed && requests.length > 0) {
    const oldestRequest = requests[0];
    if (oldestRequest) {
      const timeUntilExpiry = (oldestRequest.timestamp + fullConfig.windowMs) - now;
      retryAfter = Math.ceil(timeUntilExpiry / 1000);
    }
  }

  return {
    allowed,
    limit: fullConfig.maxRequests,
    remaining,
    resetAt,
    retryAfter
  };
}

/**
 * Set rate limit headers on response
 */
export function setRateLimitHeaders(
  event: H3Event,
  limit: number,
  remaining: number,
  resetAt: Date
): void {
  setHeader(event, 'X-RateLimit-Limit', limit.toString());
  setHeader(event, 'X-RateLimit-Remaining', remaining.toString());
  setHeader(event, 'X-RateLimit-Reset', Math.floor(resetAt.getTime() / 1000).toString());
}

/**
 * Create rate limit error response
 */
export function createRateLimitError(
  limit: number,
  remaining: number,
  resetAt: Date,
  retryAfter: number
): RateLimitError {
  return {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later.',
    retryAfter,
    limit,
    remaining,
    resetAt
  };
}

/**
 * Middleware function to enforce rate limiting
 */
export function enforceRateLimit(
  event: H3Event,
  config?: Partial<RateLimitConfig>
): void {
  const result = checkRateLimit(event, config);

  // Set rate limit headers
  setRateLimitHeaders(event, result.limit, result.remaining, result.resetAt);

  // If rate limit exceeded, log and throw error
  if (!result.allowed) {
    const clientId = getClientId(event);
    const path = event.path || 'unknown';

    // Log rate limit violation (sanitized - no sensitive data)
    console.warn(`[RATE_LIMIT_EXCEEDED] Client: ${clientId.split(':')[0]}:*** | Path: ${path} | Limit: ${result.limit} | Retry After: ${result.retryAfter}s`);

    const error = createRateLimitError(
      result.limit,
      result.remaining,
      result.resetAt,
      result.retryAfter || 60
    );

    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: {
        success: false,
        error
      }
    });
  }
}

/**
 * Clear rate limit for a specific client (for testing)
 */
export function clearRateLimit(event: H3Event): void {
  const clientId = getClientId(event);
  requestStore.delete(clientId);
}

/**
 * Get current rate limit status (for debugging)
 */
export function getRateLimitStatus(event: H3Event): {
  clientId: string;
  requestCount: number;
  requests: RequestEntry[];
} {
  const clientId = getClientId(event);
  const requests = requestStore.get(clientId) || [];
  const requestCount = requests.reduce((sum, entry) => sum + entry.count, 0);

  return {
    clientId,
    requestCount,
    requests
  };
}
