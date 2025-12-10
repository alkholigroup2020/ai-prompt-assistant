import type {
  EnhancementResponse,
  AnalysisResponse,
  ExportResponse,
  HealthResponse,
  APIError,
  FormInput,
} from '~/types'
import { apiCache, CACHE_TIMES } from '~/utils/apiCache'
import { useRateLimitStore } from '~/stores/rateLimit'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  retry?: number
  timeout?: number
  cache?: boolean
  cacheTime?: number
}

interface ApiState {
  loading: boolean
  error: APIError | null
}

/**
 * Extract rate limit headers from response and update store
 */
function updateRateLimitFromResponse(headers: Headers): void {
  // Only run on client side
  if (!import.meta.client) return

  // Debug: Log all headers in development
  if (import.meta.dev) {
    console.log('[useApi] Response headers:', {
      limit: headers.get('x-ratelimit-limit'),
      remaining: headers.get('x-ratelimit-remaining'),
      reset: headers.get('x-ratelimit-reset')
    })
  }

  const rateLimitStore = useRateLimitStore()
  rateLimitStore.updateFromHeaders(headers)
}

/**
 * Custom API composable with error handling, loading states, and retry logic
 */
export function useApi() {
  const config = useRuntimeConfig()

  // In development, use relative URLs (empty baseURL) to avoid CSP issues
  // In production, use the full production URL for proper SSR/API routing
  const isDevelopment = import.meta.dev || config.public.appUrl?.includes('localhost')
  const baseURL = isDevelopment ? '' : config.public.appUrl || ''

  /**
   * Generic fetch wrapper with error handling, retry logic, and caching
   */
  async function fetchWithRetry<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      retry = 3,
      timeout = 30000,
      cache = false,
      cacheTime = CACHE_TIMES.FIVE_MINUTES,
    } = options

    // Generate cache key from endpoint and body
    const cacheKey = cache ? `${endpoint}:${body ? JSON.stringify(body) : ''}` : ''

    // Check cache first if caching is enabled
    if (cache && cacheKey) {
      const cached = apiCache.get<T>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt < retry; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        // Use $fetch.raw to access response headers
        const response = await $fetch.raw<T>(endpoint, {
          baseURL,
          method,
          body: body as unknown as BodyInit,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        clearTimeout(timeoutId)

        // Extract rate limit headers and update store
        if (response.headers) {
          updateRateLimitFromResponse(response.headers)
        }

        const data = response._data as T

        // Cache the response if caching is enabled
        if (cache && cacheKey && data) {
          apiCache.set(cacheKey, data, cacheTime)
        }

        return data
      } catch (error) {
        lastError = error as Error

        // Try to extract rate limit headers from error response
        if (error && typeof error === 'object' && 'response' in error) {
          const errorResponse = error as { response?: { headers?: Headers } }
          if (errorResponse.response?.headers) {
            updateRateLimitFromResponse(errorResponse.response.headers)
          }
        }

        // Don't retry on client errors (4xx)
        if (error && typeof error === 'object' && 'statusCode' in error) {
          const statusCode = (error as { statusCode?: number }).statusCode
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            throw error
          }
        }

        // Exponential backoff for retries
        if (attempt < retry - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError
  }

  /**
   * Enhance a prompt using the AI API
   */
  async function enhancePrompt(input: FormInput): Promise<EnhancementResponse> {
    const state = reactive<ApiState>({ loading: true, error: null })

    try {
      const response = await fetchWithRetry<EnhancementResponse>('/api/enhance-prompt', {
        method: 'POST',
        body: input as unknown as Record<string, unknown>,
      })

      state.loading = false
      return response
    } catch (error) {
      state.loading = false
      state.error = error as APIError
      throw error
    }
  }

  /**
   * Analyze prompt quality without enhancement
   */
  async function analyzePrompt(prompt: string): Promise<AnalysisResponse> {
    return await fetchWithRetry<AnalysisResponse>('/api/analyze-prompt', {
      method: 'POST',
      body: { prompt },
    })
  }

  /**
   * Export prompt in specified format
   */
  async function exportPrompt(
    content: string,
    format: 'txt' | 'md' | 'json',
    metadata?: Record<string, unknown>
  ): Promise<ExportResponse> {
    return await fetchWithRetry<ExportResponse>('/api/export', {
      method: 'POST',
      body: { content, format, metadata },
      retry: 1,
    })
  }

  /**
   * Check API health status (cached for 1 minute)
   */
  async function checkHealth(): Promise<HealthResponse> {
    return await fetchWithRetry<HealthResponse>('/api/health', {
      retry: 1,
      cache: true,
      cacheTime: CACHE_TIMES.ONE_MINUTE,
    })
  }

  return {
    enhancePrompt,
    analyzePrompt,
    exportPrompt,
    checkHealth,
  }
}
