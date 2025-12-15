/**
 * Rate Limit Store
 * Tracks remaining API requests and provides reactive state for UI
 * Persists to localStorage to survive page refreshes
 */

import { defineStore } from 'pinia'

/**
 * Rate limit state interface
 */
interface RateLimitState {
  /** Maximum requests allowed per window */
  limit: number
  /** Remaining requests in current window */
  remaining: number
  /** Timestamp (seconds) when the limit resets */
  resetAt: number
  /** Whether the rate limit info has been loaded */
  isLoaded: boolean
  /** Countdown timer (seconds until reset) */
  countdown: number
}

/**
 * Default state values
 */
const DEFAULT_STATE: RateLimitState = {
  limit: 5,
  remaining: 5,
  resetAt: 0,
  isLoaded: false,
  countdown: 0
}

const STORAGE_KEY = 'rate-limit-state'

/**
 * Check if we're running in the browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Load state from localStorage
 */
function loadFromStorage(): Partial<RateLimitState> | null {
  if (!isBrowser()) return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as RateLimitState
    const now = Math.floor(Date.now() / 1000)

    // If reset time has passed, return null to use defaults
    if (parsed.resetAt && parsed.resetAt < now) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

/**
 * Save state to localStorage
 */
function saveToStorage(state: RateLimitState): void {
  if (!isBrowser()) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      limit: state.limit,
      remaining: state.remaining,
      resetAt: state.resetAt
    }))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Rate limit store
 */
export const useRateLimitStore = defineStore('rateLimit', {
  /**
   * State
   */
  state: (): RateLimitState => ({ ...DEFAULT_STATE }),

  /**
   * Getters
   */
  getters: {
    /**
     * Check if rate limit is exceeded (no remaining requests)
     */
    isLimitExceeded(): boolean {
      return this.remaining <= 0 && this.isLoaded
    },

    /**
     * Check if rate limit is low (2 or fewer remaining)
     */
    isLimitLow(): boolean {
      return this.remaining <= 2 && this.remaining > 0
    },

    /**
     * Check if rate limit is warning level (5 or fewer remaining)
     */
    isLimitWarning(): boolean {
      return this.remaining <= 5 && this.remaining > 2
    },

    /**
     * Get percentage of requests remaining (0-100)
     */
    remainingPercentage(): number {
      if (this.limit <= 0) return 100
      return Math.round((this.remaining / this.limit) * 100)
    },

    /**
     * Get status color based on remaining requests
     */
    statusColor(): 'success' | 'warning' | 'error' {
      if (this.isLimitExceeded) return 'error'
      if (this.isLimitLow) return 'error'
      if (this.isLimitWarning) return 'warning'
      return 'success'
    },

    /**
     * Get formatted countdown time (MM:SS)
     */
    formattedCountdown(): string {
      if (this.countdown <= 0) return '0:00'
      const minutes = Math.floor(this.countdown / 60)
      const seconds = this.countdown % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },

    /**
     * Check if countdown should be shown
     */
    shouldShowCountdown(): boolean {
      return this.isLimitExceeded && this.countdown > 0
    }
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Update rate limit from API response headers
     */
    updateFromHeaders(headers: Headers | Record<string, string>): void {
      // Handle both Headers object and plain object
      const getHeader = (name: string): string | null => {
        if (headers instanceof Headers) {
          return headers.get(name)
        }
        return (headers as Record<string, string>)[name] || null
      }

      const limit = getHeader('x-ratelimit-limit')
      const remaining = getHeader('x-ratelimit-remaining')
      const resetAt = getHeader('x-ratelimit-reset')

      if (limit !== null) {
        this.limit = parseInt(limit, 10)
      }

      if (remaining !== null) {
        this.remaining = parseInt(remaining, 10)
      }

      if (resetAt !== null) {
        this.resetAt = parseInt(resetAt, 10)
        this.updateCountdown()
      }

      this.isLoaded = true

      // Persist to localStorage
      saveToStorage({
        limit: this.limit,
        remaining: this.remaining,
        resetAt: this.resetAt,
        isLoaded: this.isLoaded,
        countdown: this.countdown
      })
    },

    /**
     * Update countdown timer based on reset time
     */
    updateCountdown(): void {
      if (!isBrowser()) return

      const now = Math.floor(Date.now() / 1000)
      this.countdown = Math.max(0, this.resetAt - now)
    },

    /**
     * Start countdown timer
     */
    startCountdownTimer(): () => void {
      if (!isBrowser()) return () => {}

      const intervalId = setInterval(() => {
        this.updateCountdown()

        // Reset remaining when countdown reaches 0
        if (this.countdown <= 0 && this.remaining <= 0) {
          this.remaining = this.limit
        }
      }, 1000)

      // Return cleanup function
      return () => clearInterval(intervalId)
    },

    /**
     * Manually decrement remaining (optimistic update)
     */
    decrementRemaining(): void {
      if (this.remaining > 0) {
        this.remaining--
      }
    },

    /**
     * Reset rate limit state
     */
    reset(): void {
      this.limit = DEFAULT_STATE.limit
      this.remaining = DEFAULT_STATE.remaining
      this.resetAt = DEFAULT_STATE.resetAt
      this.isLoaded = false
      this.countdown = 0

      // Clear localStorage
      if (isBrowser()) {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // Ignore storage errors
        }
      }
    },

    /**
     * Initialize - load from localStorage if available
     * Only initializes once per session to prevent re-clearing data on component remount
     */
    initialize(): void {
      // Skip if already initialized with real data (not just defaults)
      // This prevents re-initialization when components remount
      if (this.isLoaded && this.resetAt > 0) {
        return
      }

      // Try to load from localStorage first
      const stored = loadFromStorage()

      if (stored) {
        if (stored.limit !== undefined) this.limit = stored.limit
        if (stored.remaining !== undefined) this.remaining = stored.remaining
        if (stored.resetAt !== undefined) {
          this.resetAt = stored.resetAt
          this.updateCountdown()
        }
        this.isLoaded = true
      } else {
        // Set default values if not loaded
        this.limit = 5
        this.remaining = 5
        this.isLoaded = true
      }
    }
  }
})
