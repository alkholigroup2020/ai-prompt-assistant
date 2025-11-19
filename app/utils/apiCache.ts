/**
 * API Response Cache Utility
 * Provides in-memory caching for API responses with expiration
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresIn: number
}

class ApiCache {
  private cache: Map<string, CacheEntry<unknown>>

  constructor() {
    this.cache = new Map()
  }

  /**
   * Get cached data by key
   * Returns null if cache is expired or doesn't exist
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now - entry.timestamp > entry.expiresIn) {
      // Cache expired, remove it
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set cache data with expiration time
   * @param key - Cache key
   * @param data - Data to cache
   * @param expiresIn - Expiration time in milliseconds
   */
  set<T>(key: string, data: T, expiresIn: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    })
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size
  }
}

// Export singleton instance
export const apiCache = new ApiCache()

// Cache expiration presets (in milliseconds)
export const CACHE_TIMES = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const

// Clear expired entries every 5 minutes
if (import.meta.client) {
  setInterval(() => {
    apiCache.clearExpired()
  }, CACHE_TIMES.FIVE_MINUTES)
}
