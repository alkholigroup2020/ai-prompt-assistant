/**
 * Rate Limiting Test Suite
 * Tests rate limiting functionality to ensure API abuse prevention
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

// Mock H3Event for testing
function createMockEvent(sessionId?: string, ip?: string): H3Event {
  const headers: Record<string, string> = {}

  if (sessionId) {
    headers['x-session-id'] = sessionId
  }

  if (ip) {
    headers['x-forwarded-for'] = ip
  }

  const mockHeaders = new Map<string, string>()

  return {
    path: '/api/test',
    node: {
      req: {
        socket: {
          remoteAddress: ip || '127.0.0.1'
        },
        headers
      }
    },
    _headers: mockHeaders
  } as unknown as H3Event
}

// Mock getHeader function
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
  createError: (options: unknown) => {
    const error = new Error('Rate limit exceeded') as Error & { statusCode?: number; data?: unknown }
    error.statusCode = (options as { statusCode: number }).statusCode
    error.data = (options as { data: unknown }).data
    return error
  }
}))

describe('Rate Limiting Utilities', () => {
  beforeEach(() => {
    // Clear any previous rate limits before each test
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within the rate limit', () => {
      const event = createMockEvent('test-session-1')
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
      const event = createMockEvent('test-session-2')
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

    it('should track different clients separately', () => {
      const config = { windowMs: 60000, maxRequests: 2 }

      const event1 = createMockEvent('session-1')
      const event2 = createMockEvent('session-2')

      // Both clients should have their own rate limits
      const result1 = checkRateLimit(event1, config)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(1)

      const result2 = checkRateLimit(event2, config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(1)
    })

    it('should fallback to IP address when no session ID is provided', () => {
      const event = createMockEvent(undefined, '192.168.1.100')
      const config = { windowMs: 60000, maxRequests: 5 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(5)
    })

    it('should return correct reset timestamp', () => {
      const event = createMockEvent('test-session-3')
      const config = { windowMs: 60000, maxRequests: 10 }
      const beforeCheck = Date.now()

      const result = checkRateLimit(event, config)
      const afterCheck = Date.now()

      expect(result.resetAt).toBeInstanceOf(Date)
      expect(result.resetAt.getTime()).toBeGreaterThan(beforeCheck)
      expect(result.resetAt.getTime()).toBeLessThanOrEqual(afterCheck + config.windowMs)
    })

    it('should handle custom configuration', () => {
      const event = createMockEvent('test-session-4')
      const customConfig = { windowMs: 120000, maxRequests: 100 }

      const result = checkRateLimit(event, customConfig)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(100)
      expect(result.remaining).toBe(99)
    })

    it('should calculate retry after time correctly', () => {
      const event = createMockEvent('test-session-5')
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
      const event = createMockEvent('test-session-6')
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
      const event = createMockEvent('test-session-7')
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
      const event = createMockEvent('test-session-8')
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
      const event = createMockEvent('test-session-9')
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
      const event = createMockEvent('test-session-10')
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
    it('should clear rate limit for a specific client', () => {
      const event = createMockEvent('test-session-11')
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
      const event = createMockEvent('test-session-12')
      const config = { windowMs: 60000, maxRequests: 10 }

      // Make 3 requests
      checkRateLimit(event, config)
      checkRateLimit(event, config)
      checkRateLimit(event, config)

      const status = getRateLimitStatus(event)
      expect(status.clientId).toContain('session:test-session-12')
      expect(status.requestCount).toBe(3)
      expect(status.requests).toHaveLength(3)
    })

    it('should return zero count for new clients', () => {
      const event = createMockEvent('new-session')
      const status = getRateLimitStatus(event)

      expect(status.clientId).toContain('session:new-session')
      expect(status.requestCount).toBe(0)
      expect(status.requests).toHaveLength(0)
    })
  })

  describe('Sliding Window Behavior', () => {
    it('should allow requests after window expires', async () => {
      const event = createMockEvent('test-session-13')
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
      const event = createMockEvent('test-session-14')
      const config = { windowMs: 60000, maxRequests: 0 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(false)
      expect(result.limit).toBe(0)
      expect(result.remaining).toBe(0)
    })

    it('should handle very high max requests', () => {
      const event = createMockEvent('test-session-15')
      const config = { windowMs: 60000, maxRequests: 1000000 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(1000000)
      expect(result.remaining).toBe(999999)
    })

    it('should handle events without session ID or IP', () => {
      const event = createMockEvent()
      const config = { windowMs: 60000, maxRequests: 10 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)

      const status = getRateLimitStatus(event)
      expect(status.clientId).toBeDefined()
    })

    it('should handle multiple IPs in X-Forwarded-For header', () => {
      const event = createMockEvent(undefined, '192.168.1.1, 10.0.0.1, 172.16.0.1')
      const config = { windowMs: 60000, maxRequests: 5 }

      const result = checkRateLimit(event, config)
      expect(result.allowed).toBe(true)

      const status = getRateLimitStatus(event)
      // Should use the first IP in the chain
      expect(status.clientId).toContain('192.168.1.1')
    })
  })

  describe('Concurrent Requests', () => {
    it('should handle concurrent requests correctly', () => {
      const event = createMockEvent('test-session-16')
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
      const event = createMockEvent('test-session-17')
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
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('session:***')
      )

      consoleSpy.mockRestore()
    })

    it('should not log sensitive information in rate limit logs', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const event = createMockEvent('very-sensitive-session-id-12345')
      const config = { windowMs: 60000, maxRequests: 1 }

      enforceRateLimit(event, config)

      try {
        enforceRateLimit(event, config)
      } catch {
        // Error is expected
      }

      const logCalls = consoleSpy.mock.calls
      logCalls.forEach(call => {
        // Should not contain the full session ID
        expect(call[0]).not.toContain('very-sensitive-session-id-12345')
        // Should be sanitized with ***
        expect(call[0]).toContain('***')
      })

      consoleSpy.mockRestore()
    })
  })
})
