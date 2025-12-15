/**
 * Rate Limiting Utility
 * Implements sliding window rate limiting using signed cookies
 * Compatible with Vercel Edge runtime (no Node.js crypto required)
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
 * Cookie data structure for rate limiting
 */
interface RateLimitCookieData {
  /** Array of request timestamps within the current window */
  timestamps: number[];
  /** Signature to prevent tampering */
  signature: string;
}

const COOKIE_NAME = 'rl_data';
const COOKIE_MAX_AGE = 3600; // 1 hour in seconds

/**
 * Get the signing secret from runtime config or use a default
 */
function getSigningSecret(): string {
  try {
    const config = useRuntimeConfig();
    return (config.rateLimitSecret as string) || 'ai-prompt-assistant-rate-limit-secret-key-2024';
  } catch {
    return 'ai-prompt-assistant-rate-limit-secret-key-2024';
  }
}

/**
 * Simple hash function that works in Edge runtime (no Node.js crypto needed)
 * Uses djb2 algorithm - fast and good distribution for strings
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // Convert to hex and ensure positive
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Create signature for data using simple hash with secret
 */
function createSignature(data: string): string {
  const secret = getSigningSecret();
  // Combine data with secret and hash multiple times for better security
  const combined = secret + data + secret;
  const hash1 = simpleHash(combined);
  const hash2 = simpleHash(hash1 + combined);
  return hash1 + hash2;
}

/**
 * Verify signature
 */
function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = createSignature(data);
  return expectedSignature === signature;
}

/**
 * Parse and validate rate limit cookie
 */
function parseCookie(cookieValue: string | undefined): number[] {
  if (!cookieValue) {
    return [];
  }

  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
    const data: RateLimitCookieData = JSON.parse(decoded);

    // Verify signature
    const timestampsStr = JSON.stringify(data.timestamps);
    if (!verifySignature(timestampsStr, data.signature)) {
      console.warn('[RateLimit] Invalid cookie signature, resetting');
      return [];
    }

    // Validate timestamps array
    if (!Array.isArray(data.timestamps)) {
      return [];
    }

    return data.timestamps.filter(t => typeof t === 'number' && t > 0);
  } catch {
    return [];
  }
}

/**
 * Serialize rate limit data to signed cookie value
 */
function serializeCookie(timestamps: number[]): string {
  const timestampsStr = JSON.stringify(timestamps);
  const signature = createSignature(timestampsStr);

  const data: RateLimitCookieData = {
    timestamps,
    signature
  };

  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * Get default rate limit configuration
 */
function getDefaultConfig(): RateLimitConfig {
  try {
    const config = useRuntimeConfig();
    return {
      windowMs: parseInt(config.rateLimitWindow as string) || 600000, // 10 minutes
      maxRequests: parseInt(config.rateLimitMaxRequests as string) || 5
    };
  } catch {
    return {
      windowMs: 600000,
      maxRequests: 5
    };
  }
}

/**
 * Check if request is within rate limit
 * Uses signed cookies for serverless compatibility
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
  const now = Date.now();
  const windowStart = now - fullConfig.windowMs;

  // Get existing timestamps from cookie
  const cookieValue = getCookie(event, COOKIE_NAME);
  let timestamps = parseCookie(cookieValue);

  // Remove timestamps outside the current window
  timestamps = timestamps.filter(t => t > windowStart);

  // Count requests in the current window
  const totalRequests = timestamps.length;

  // Check if limit is exceeded
  const allowed = totalRequests < fullConfig.maxRequests;

  // Calculate reset time based on oldest request in window
  let resetAt: Date;
  if (timestamps.length > 0) {
    const oldestTimestamp = Math.min(...timestamps);
    resetAt = new Date(oldestTimestamp + fullConfig.windowMs);
  } else {
    resetAt = new Date(now + fullConfig.windowMs);
  }

  // If allowed, add this request to the tracking
  if (allowed) {
    timestamps.push(now);
  }

  // Update the cookie with new timestamps
  const newCookieValue = serializeCookie(timestamps);
  setCookie(event, COOKIE_NAME, newCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  });

  // Calculate remaining AFTER counting the current request
  const remaining = allowed
    ? Math.max(0, fullConfig.maxRequests - totalRequests - 1)
    : 0;

  // Calculate retry after (seconds until oldest request expires)
  let retryAfter: number | undefined;
  if (!allowed && timestamps.length > 0) {
    const oldestTimestamp = Math.min(...timestamps);
    const timeUntilExpiry = (oldestTimestamp + fullConfig.windowMs) - now;
    retryAfter = Math.ceil(timeUntilExpiry / 1000);
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
    const path = event.path || 'unknown';

    // Log rate limit violation (sanitized - no sensitive data)
    console.warn(`[RATE_LIMIT_EXCEEDED] Path: ${path} | Limit: ${result.limit} | Retry After: ${result.retryAfter}s`);

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
 * Clear rate limit for current client (for testing)
 */
export function clearRateLimit(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME);
}

/**
 * Get current rate limit status (for debugging)
 */
export function getRateLimitStatus(event: H3Event): {
  requestCount: number;
  timestamps: number[];
} {
  const cookieValue = getCookie(event, COOKIE_NAME);
  const timestamps = parseCookie(cookieValue);

  const fullConfig = getDefaultConfig();
  const windowStart = Date.now() - fullConfig.windowMs;
  const validTimestamps = timestamps.filter(t => t > windowStart);

  return {
    requestCount: validTimestamps.length,
    timestamps: validTimestamps
  };
}
