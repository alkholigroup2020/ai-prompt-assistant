/**
 * Multi-Provider AI Service
 * Provides automatic failover between Groq (primary) and Gemini (fallback)
 *
 * Rate Limits:
 * - Groq: 30 RPM, 14,400 RPD (primary)
 * - Gemini: 5 RPM, 20 RPD (fallback)
 */

import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest } from '~/types/email'
import type { EnhancementData, QualityScoreBreakdown, AlternativeVersions } from '~/types/api'
import { isGroqAvailable, enhancePromptWithGroq, enhanceEmailWithGroq, mapGroqError } from './groq'
import { enhancePromptWithGemini } from './gemini'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildEmailEnhancementPrompt, parseEmailResponse } from './email-prompts'

/**
 * Provider types
 */
export type AIProvider = 'groq' | 'gemini'

/**
 * Provider status tracking
 */
interface ProviderStatus {
  available: boolean
  lastError?: string
  lastErrorTime?: number
  consecutiveErrors: number
}

// Track provider status (reset after 1 minute of errors)
const providerStatus: Record<AIProvider, ProviderStatus> = {
  groq: { available: true, consecutiveErrors: 0 },
  gemini: { available: true, consecutiveErrors: 0 }
}

// Error threshold before marking provider as temporarily unavailable
const ERROR_THRESHOLD = 3
const ERROR_RESET_TIME = 60000 // 1 minute

/**
 * Check if a provider should be skipped due to recent errors
 */
function shouldSkipProvider(provider: AIProvider): boolean {
  const status = providerStatus[provider]

  // Reset error count if enough time has passed
  if (status.lastErrorTime && Date.now() - status.lastErrorTime > ERROR_RESET_TIME) {
    status.consecutiveErrors = 0
    status.available = true
  }

  return status.consecutiveErrors >= ERROR_THRESHOLD
}

/**
 * Record a successful call to a provider
 */
function recordSuccess(provider: AIProvider): void {
  providerStatus[provider] = {
    available: true,
    consecutiveErrors: 0
  }
}

/**
 * Record a failed call to a provider
 */
function recordError(provider: AIProvider, error: string): void {
  const status = providerStatus[provider]
  status.consecutiveErrors++
  status.lastError = error
  status.lastErrorTime = Date.now()

  if (status.consecutiveErrors >= ERROR_THRESHOLD) {
    status.available = false
    console.warn(`Provider ${provider} temporarily disabled after ${ERROR_THRESHOLD} consecutive errors`)
  }
}

/**
 * Get the priority order of providers
 */
function getProviderOrder(): AIProvider[] {
  const providers: AIProvider[] = []

  // Groq is primary if available
  if (isGroqAvailable() && !shouldSkipProvider('groq')) {
    providers.push('groq')
  }

  // Gemini is fallback
  if (!shouldSkipProvider('gemini')) {
    providers.push('gemini')
  }

  return providers
}

/**
 * Response with provider metadata
 */
export interface EnhancementResult {
  data: EnhancementData
  provider: AIProvider
}

export interface EmailEnhancementResult {
  enhancedEmail: string
  suggestedSubject?: string
  improvements: string[]
  provider: AIProvider
}

/**
 * Calculate quality score based on prompt characteristics
 */
function calculateQualityScore(
  original: string,
  enhanced: string,
  input: FormInput
): { score: number; breakdown: QualityScoreBreakdown } {
  const breakdown: QualityScoreBreakdown = {
    clarity: 0,
    specificity: 0,
    context: 0,
    structure: 0,
    completeness: 0
  }

  // Clarity: based on sentence structure and length
  const avgSentenceLength = enhanced.split(/[.!?]+/).filter(s => s.trim()).length
  breakdown.clarity = Math.min(100, Math.max(0, 100 - (avgSentenceLength > 30 ? 20 : 0)))

  // Specificity: based on detail level and examples
  breakdown.specificity = Math.min(100,
    (input.examples ? 30 : 0) +
    (input.context ? 30 : 0) +
    (enhanced.length > original.length ? 40 : 20)
  )

  // Context: based on provided context and constraints
  breakdown.context = Math.min(100,
    (input.context ? 40 : 0) +
    (input.constraints.length * 10) +
    (input.audience ? 20 : 0) +
    (input.role ? 20 : 0)
  )

  // Structure: based on format and organization
  breakdown.structure = Math.min(100,
    (input.outputFormat !== 'paragraph' ? 30 : 20) +
    (enhanced.includes('\n') ? 30 : 0) +
    40 // Base score for being structured
  )

  // Completeness: based on all fields being filled
  const fieldsFilled = [
    input.role,
    input.audience,
    input.task,
    input.tone,
    input.outputFormat,
    input.constraints.length > 0
  ].filter(Boolean).length
  breakdown.completeness = Math.min(100, (fieldsFilled / 6) * 100)

  // Calculate overall score
  const score = Math.round(
    (breakdown.clarity * 0.2) +
    (breakdown.specificity * 0.25) +
    (breakdown.context * 0.25) +
    (breakdown.structure * 0.15) +
    (breakdown.completeness * 0.15)
  )

  return { score, breakdown }
}

/**
 * Generate alternative versions of the prompt
 */
function generateAlternativeVersions(
  enhanced: string,
  input: FormInput
): AlternativeVersions | undefined {
  // For quick enhancement, don't generate alternatives
  if (input.enhancementLevel === 'quick') {
    return undefined
  }

  // Simple heuristic-based alternatives
  const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim())

  return {
    concise: sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.',
    detailed: enhanced,
    technical: undefined
  }
}

/**
 * Enhance a prompt using available AI providers
 * Tries Groq first (30 RPM), falls back to Gemini (5 RPM)
 */
export async function enhancePrompt(input: FormInput): Promise<EnhancementResult> {
  const providers = getProviderOrder()

  if (providers.length === 0) {
    throw new Error('AI_PROVIDER_ERROR: All AI providers are temporarily unavailable')
  }

  let lastError: Error | null = null

  for (const provider of providers) {
    try {
      console.log(`Attempting prompt enhancement with ${provider}...`)

      if (provider === 'groq') {
        const result = await enhancePromptWithGroq(input)

        // Calculate quality score
        const { score, breakdown } = calculateQualityScore(
          input.task,
          result.enhancedPrompt,
          input
        )

        // Generate alternatives if detailed enhancement
        const alternativeVersions = generateAlternativeVersions(
          result.enhancedPrompt,
          input
        )

        const enhancementData: EnhancementData = {
          shortTitle: result.shortTitle.substring(0, 60),
          enhancedPrompt: result.enhancedPrompt,
          qualityScore: score,
          improvements: Array.isArray(result.improvements) ? result.improvements : [],
          suggestions: Array.isArray(result.suggestions) ? result.suggestions : undefined,
          alternativeVersions,
          breakdown
        }

        recordSuccess('groq')
        console.log('Prompt enhanced successfully with Groq')

        return { data: enhancementData, provider: 'groq' }
      } else {
        // Use Gemini
        const result = await enhancePromptWithGemini(input)

        recordSuccess('gemini')
        console.log('Prompt enhanced successfully with Gemini')

        return { data: result, provider: 'gemini' }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`${provider} failed:`, errorMsg)

      recordError(provider, errorMsg)
      lastError = provider === 'groq' ? mapGroqError(error) : error as Error

      // Continue to next provider
    }
  }

  // All providers failed
  throw lastError || new Error('AI_PROVIDER_ERROR: All providers failed')
}

/**
 * Enhance an email using available AI providers
 * Tries Groq first (30 RPM), falls back to Gemini (5 RPM)
 */
export async function enhanceEmail(input: EmailEnhanceRequest): Promise<EmailEnhancementResult> {
  const providers = getProviderOrder()

  if (providers.length === 0) {
    throw new Error('AI_PROVIDER_ERROR: All AI providers are temporarily unavailable')
  }

  let lastError: Error | null = null

  for (const provider of providers) {
    try {
      console.log(`Attempting email enhancement with ${provider}...`)

      if (provider === 'groq') {
        const result = await enhanceEmailWithGroq(input)

        recordSuccess('groq')
        console.log('Email enhanced successfully with Groq')

        return {
          enhancedEmail: result.enhancedEmail,
          suggestedSubject: result.suggestedSubject,
          improvements: result.improvements,
          provider: 'groq'
        }
      } else {
        // Use Gemini directly
        const config = useRuntimeConfig()
        const apiKey = config.geminiApiKey

        if (!apiKey) {
          throw new Error('GEMINI_API_KEY is not configured')
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = buildEmailEnhancementPrompt(input)
        const response = await model.generateContent(prompt)
        const responseText = response.response.text()

        const parsed = parseEmailResponse(responseText)

        recordSuccess('gemini')
        console.log('Email enhanced successfully with Gemini')

        return {
          enhancedEmail: parsed.enhancedEmail,
          suggestedSubject: parsed.suggestedSubject,
          improvements: parsed.improvements,
          provider: 'gemini'
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`${provider} failed:`, errorMsg)

      recordError(provider, errorMsg)
      lastError = provider === 'groq' ? mapGroqError(error) : error as Error

      // Continue to next provider
    }
  }

  // All providers failed
  throw lastError || new Error('AI_PROVIDER_ERROR: All providers failed')
}

/**
 * Get current provider status (for debugging/monitoring)
 */
export function getProviderStatus(): Record<AIProvider, ProviderStatus> {
  return { ...providerStatus }
}

/**
 * Check health of all providers
 */
export async function checkProvidersHealth(): Promise<Record<AIProvider, boolean>> {
  const health: Record<AIProvider, boolean> = {
    groq: false,
    gemini: false
  }

  // Check Groq
  if (isGroqAvailable()) {
    try {
      const { checkGroqConnection } = await import('./groq')
      health.groq = await checkGroqConnection()
    } catch {
      health.groq = false
    }
  }

  // Check Gemini
  try {
    const { checkGeminiConnection } = await import('./gemini')
    health.gemini = await checkGeminiConnection()
  } catch {
    health.gemini = false
  }

  return health
}
