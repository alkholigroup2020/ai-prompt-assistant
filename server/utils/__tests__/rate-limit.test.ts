/**
 * Rate Limiting Test Suite
 * Tests cookie-based rate limiting functionality for serverless compatibility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { H3Event } from 'h3'
import {
  checkRateLimit,
  setRateLimitHeaders,
  createRateLimitError,
  enforceRateLimit,
  clearRateLimit,
  getRateLimitStatus,
} from '../rate-limit'

// Store cookies per event for testing
const cookieStores = new WeakMap<object, Map<string, string>>()

// Mock H3Event for testing with cookie support
function createMockEvent(): H3Event {
  const mockHeaders = new Map<string, string>()
  const cookieStore = new Map<string, string>()

  const event = {
    path: '/api/test',
    node: {
      req: {
        socket: {
          remoteAddress: '127.0.0.1'
        },
        headers: {}
      }
    },
    _headers: mockHeaders,
    _cookieStore: cookieStore
  } as unknown as H3Event

  cookieStores.set(event, cookieStore)
  return event
}

// Mock H3 functions
vi.mock('h3', () => ({
  getHeader: (event: H3Event, name: string) => {
    const headers = event.node?.req?.headers as Record<string, string>
    return headers?.[name]
  },
  setHeader: (event: H3Event, name: string, value: string) => {
    const headers = (event as { _headers?: Map<string, string> })._headers
    if (!headers) {
      (event as { _headers?: Map<string, string> })._headers = new Map()
    }
    const eventHeaders = (event as { _headers?: Map<string, string> })._headers
    if (eventHeaders) {
      eventHeaders.set(name, value)
    }
  },
  getCookie: (event: H3Event, name: string) => {
    const store = cookieStores.get(event)
    return store?.get(name)
  },
  setCookie: (event: H3Event, name: string, value: string) => {
    const store = cookieStores.get(event)
    store?.set(name, value)
  },
  deleteCookie: (event: H3Event, name: string) => {
    const store = cookieStores.get(event)
    store?.delete(name)
  },
  createError: (options: unknown) => {
    const error = new Error('Rate limit exceeded') as Error & { statusCode?: number; data?: unknown }
    error.statusCode = (options as { statusCode: number }).statusCode
    error.data = (options as { data: unknown }).data
    return error
  }
}))

describe('Rate Limiting Utilities (Cookie-based)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within the rate limit', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 5 }

      // First request should be allowed
      const result1 = checkRateLimit(event, config)
      expect(result1.allowed).toBe(true)
      expect(result1.limit).toBe(5)
      expect(result1.remaining).toBe(4)

      // Second request should be allowed
      const result2 = checkRateLimit(event, config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(3)

      // Third request should be allowed
      const result3 = checkRateLimit(event, config)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(2)
    })

    it('should block requests when rate limit is exceeded', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 3 }

      // Make 3 requests to reach the limit
      checkRateLimit(event, config)
      checkRateLimit(event, config)
      checkRateLimit(event, config)

      // Fourth request should be blocked
      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeDefined()
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should track different events separately (via cookies)', () => {
      const config = { windowMs: 60000, maxRequests: 2 }

      // Each event has its own cookie store
      const event1 = createMockEvent()
      const event2 = createMockEvent()

      // Both events should have their own rate limits
      const result1 = checkRateLimit(event1, config)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(1)

      const result2 = checkRateLimit(event2, config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(1)
    })

    it('should return correct reset timestamp', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }
      const beforeCheck = Date.now()

      const result = checkRateLimit(event, config)
      const afterCheck = Date.now()

      expect(result.resetAt).toBeInstanceOf(Date)
      expect(result.resetAt.getTime()).toBeGreaterThan(beforeCheck)
      expect(result.resetAt.getTime()).toBeLessThanOrEqual(afterCheck + config.windowMs)
    })

    it('should handle custom configuration', () => {
      const event = createMockEvent()
      const customConfig = { windowMs: 120000, maxRequests: 100 }

      const result = checkRateLimit(event, customConfig)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(100)
      expect(result.remaining).toBe(99)
    })

    it('should calculate retry after time correctly', () => {
      const event = createMockEvent()
      const config = { windowMs: 10000, maxRequests: 1 } // 10 seconds window, 1 request max

      // First request is allowed
      checkRateLimit(event, config)

      // Second request should be blocked with retry after time
      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeDefined()
      expect(result.retryAfter).toBeGreaterThan(0)
      expect(result.retryAfter).toBeLessThanOrEqual(10) // Should be within 10 seconds
    })
  })

  describe('setRateLimitHeaders', () => {
    it('should set correct rate limit headers', () => {
      const event = createMockEvent()
      const limit = 60
      const remaining = 45
      const resetAt = new Date(Date.now() + 60000)

      setRateLimitHeaders(event, limit, remaining, resetAt)

      const headers = (event as { _headers?: Map<string, string> })._headers
      expect(headers?.get('X-RateLimit-Limit')).toBe('60')
      expect(headers?.get('X-RateLimit-Remaining')).toBe('45')
      expect(headers?.get('X-RateLimit-Reset')).toBeDefined()
    })

    it('should convert reset timestamp to Unix time (seconds)', () => {
      const event = createMockEvent()
      const resetAt = new Date('2025-01-01T00:00:00Z')

      setRateLimitHeaders(event, 60, 30, resetAt)

      const headers = (event as { _headers?: Map<string, string> })._headers
      const resetHeader = headers?.get('X-RateLimit-Reset')
      expect(resetHeader).toBeDefined()

      const expectedUnixTime = Math.floor(resetAt.getTime() / 1000)
      expect(resetHeader).toBe(expectedUnixTime.toString())
    })
  })

  describe('createRateLimitError', () => {
    it('should create proper rate limit error object', () => {
      const resetAt = new Date(Date.now() + 60000)
      const error = createRateLimitError(60, 0, resetAt, 60)

      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
      expect(error.message).toBe('Too many requests. Please try again later.')
      expect(error.retryAfter).toBe(60)
      expect(error.limit).toBe(60)
      expect(error.remaining).toBe(0)
      expect(error.resetAt).toEqual(resetAt)
    })
  })

  describe('enforceRateLimit', () => {
    it('should not throw error when within rate limit', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }

      expect(() => {
        enforceRateLimit(event, config)
      }).not.toThrow()

      // Verify headers were set
      const headers = (event as { _headers?: Map<string, string> })._headers
      expect(headers?.get('X-RateLimit-Limit')).toBe('10')
      expect(headers?.get('X-RateLimit-Remaining')).toBeDefined()
    })

    it('should throw 429 error when rate limit is exceeded', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 2 }

      // Make 2 requests to reach limit
      enforceRateLimit(event, config)
      enforceRateLimit(event, config)

      // Third request should throw
      expect(() => {
        enforceRateLimit(event, config)
      }).toThrow()

      try {
        enforceRateLimit(event, config)
      } catch (error) {
        expect((error as { statusCode?: number }).statusCode).toBe(429)
        expect((error as { data?: { error?: { code?: string } } }).data?.error?.code).toBe('RATE_LIMIT_EXCEEDED')
      }
    })

    it('should set rate limit headers even when limit is exceeded', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 1 }

      // First request
      enforceRateLimit(event, config)

      // Second request should throw but still set headers
      try {
        enforceRateLimit(event, config)
      } catch {
        // Error is expected
      }

      const headers = (event as { _headers?: Map<string, string> })._headers
      expect(headers?.get('X-RateLimit-Limit')).toBe('1')
      expect(headers?.get('X-RateLimit-Remaining')).toBe('0')
      expect(headers?.get('X-RateLimit-Reset')).toBeDefined()
    })
  })

  describe('clearRateLimit', () => {
    it('should clear rate limit for current client', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 1 }

      // Make one request to reach limit
      checkRateLimit(event, config)

      // Verify limit is reached
      const blockedResult = checkRateLimit(event, config)
      expect(blockedResult.allowed).toBe(false)

      // Clear the rate limit
      clearRateLimit(event)

      // Now request should be allowed again
      const allowedResult = checkRateLimit(event, config)
      expect(allowedResult.allowed).toBe(true)
    })
  })

  describe('getRateLimitStatus', () => {
    it('should return current rate limit status', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }

      // Make 3 requests
      checkRateLimit(event, config)
      checkRateLimit(event, config)
      checkRateLimit(event, config)

      const status = getRateLimitStatus(event)
      expect(status.requestCount).toBe(3)
      expect(status.timestamps).toHaveLength(3)
    })

    it('should return zero count for new clients', () => {
      const event = createMockEvent()
      const status = getRateLimitStatus(event)

      expect(status.requestCount).toBe(0)
      expect(status.timestamps).toHaveLength(0)
    })
  })

  describe('Sliding Window Behavior', () => {
    it('should allow requests after window expires', async () => {
      const event = createMockEvent()
      // Use a very short window for testing (100ms)
      const config = { windowMs: 100, maxRequests: 1 }

      // First request should be allowed
      const result1 = checkRateLimit(event, config)
      expect(result1.allowed).toBe(true)

      // Second request immediately should be blocked
      const result2 = checkRateLimit(event, config)
      expect(result2.allowed).toBe(false)

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150))

      // After window expires, request should be allowed again
      const result3 = checkRateLimit(event, config)
      expect(result3.allowed).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero max requests', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 0 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(false)
      expect(result.limit).toBe(0)
      expect(result.remaining).toBe(0)
    })

    it('should handle very high max requests', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 1000000 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(1000000)
      expect(result.remaining).toBe(999999)
    })

    it('should handle events without cookies', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)
    })
  })

  describe('Concurrent Requests', () => {
    it('should handle concurrent requests correctly', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }

      // Make 10 concurrent requests
      const results = Array.from({ length: 10 }, () => checkRateLimit(event, config))

      // All 10 should be allowed
      const allowedCount = results.filter(r => r.allowed).length
      expect(allowedCount).toBe(10)

      // 11th request should be blocked
      const result11 = checkRateLimit(event, config)
      expect(result11.allowed).toBe(false)
    })
  })

  describe('Rate Limit Logging', () => {
    it('should log rate limit violations', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 1 }

      // First request is allowed
      enforceRateLimit(event, config)

      // Second request should throw and log
      try {
        enforceRateLimit(event, config)
      } catch {
        // Error is expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[RATE_LIMIT_EXCEEDED]')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Cookie Signature Verification', () => {
    it('should handle tampered cookies gracefully', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 5 }

      // Make a legitimate request first
      checkRateLimit(event, config)

      // Tamper with the cookie by setting an invalid value
      const store = cookieStores.get(event)
      store?.set('rl_data', 'invalid_base64_data_that_cannot_be_parsed')

      // Should reset and allow the request (cookie validation fails)
      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4) // Fresh start
    })
  })
})
