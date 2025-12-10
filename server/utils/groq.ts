/**
 * Groq AI API Utility
 * Handles interactions with Groq API for prompt and email enhancement
 * Groq offers 30 RPM free tier - 6x more than Gemini's 5 RPM
 */

import Groq from 'groq-sdk'
import type { FormInput } from '~/types/form'
import type { EmailEnhanceRequest } from '~/types/email'

/**
 * Initialize Groq API client (singleton)
 */
let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (!groqClient) {
    const config = useRuntimeConfig()
    const apiKey = config.groqApiKey

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured')
    }

    groqClient = new Groq({ apiKey })
  }

  return groqClient
}

/**
 * Check if Groq is available (has API key configured)
 */
export function isGroqAvailable(): boolean {
  const config = useRuntimeConfig()
  return !!config.groqApiKey
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelay = 500
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on validation errors or rate limits
      if (
        error instanceof Error &&
        (error.message.includes('VALIDATION') ||
         error.message.includes('rate_limit'))
      ) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)

      // Don't wait on the last attempt
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

/**
 * Build the prompt enhancement prompt for Groq
 */
function buildPromptEnhancementPrompt(input: FormInput): string {
  const parts: string[] = []
  const isArabic = input.language === 'ar'

  parts.push('You are an expert AI prompt engineer. Your task is to enhance and optimize the following prompt request.')

  // Add language instruction - CRITICAL for proper localization
  if (isArabic) {
    parts.push('')
    parts.push('**CRITICAL LANGUAGE REQUIREMENT:**')
    parts.push('The user is working in Arabic. You MUST respond ENTIRELY in Arabic (العربية).')
    parts.push('- The "shortTitle" MUST be in Arabic')
    parts.push('- The "enhancedPrompt" MUST be in Arabic')
    parts.push('- The "improvements" array MUST contain Arabic text')
    parts.push('- The "suggestions" array MUST contain Arabic text')
    parts.push('- Do NOT mix English and Arabic. Use Arabic ONLY.')
  }

  parts.push('')
  parts.push('**User Context:**')
  parts.push(`- Role: ${input.role}${input.roleOther ? ` (${input.roleOther})` : ''}`)
  parts.push(`- Target Audience: ${input.audience}${input.audienceOther ? ` (${input.audienceOther})` : ''}`)
  parts.push(`- Desired Tone: ${input.tone}`)
  parts.push(`- Output Format: ${input.outputFormat}${input.outputFormatOther ? ` (${input.outputFormatOther})` : ''}`)

  if (input.constraints && input.constraints.length > 0) {
    parts.push(`- Constraints: ${input.constraints.join(', ')}${input.constraintsOther ? `, ${input.constraintsOther}` : ''}`)
  }

  parts.push('')
  parts.push('**Original Task:**')
  parts.push(input.task)

  if (input.context) {
    parts.push('')
    parts.push('**Additional Context:**')
    parts.push(input.context)
  }

  if (input.examples) {
    parts.push('')
    parts.push('**Examples:**')
    parts.push(input.examples)
  }

  parts.push('')
  parts.push('**Instructions:**')

  if (input.enhancementLevel === 'quick') {
    parts.push('1. Create a clear, concise, and effective prompt that an AI assistant can easily understand and act upon.')
    parts.push('2. Ensure the prompt includes all necessary context and constraints.')
    parts.push('3. Make it specific and actionable.')
  } else {
    parts.push('1. Create a comprehensive, detailed, and highly effective prompt.')
    parts.push('2. Include all relevant context, constraints, and success criteria.')
    parts.push('3. Structure the prompt for maximum clarity and effectiveness.')
    parts.push('4. Add specific examples or formats if helpful.')
  }

  parts.push('')
  parts.push('**Required Response Format (JSON):**')
  parts.push('```json')
  parts.push('{')
  if (isArabic) {
    parts.push('  "shortTitle": "عنوان قصير للبرومبت (60 حرف كحد أقصى)",')
    parts.push('  "enhancedPrompt": "البرومبت المحسّن والمُطوَّر بالكامل",')
    parts.push('  "improvements": ["قائمة التحسينات الرئيسية التي تمت"],')
    parts.push('  "suggestions": ["اقتراحات إضافية اختيارية للمستخدم"]')
  } else {
    parts.push('  "shortTitle": "Brief title for this prompt (max 60 chars)",')
    parts.push('  "enhancedPrompt": "The fully enhanced and optimized prompt",')
    parts.push('  "improvements": ["list of key improvements made"],')
    parts.push('  "suggestions": ["optional additional suggestions for the user"]')
  }
  parts.push('}')
  parts.push('```')
  parts.push('')
  if (isArabic) {
    parts.push('IMPORTANT: Respond ONLY with valid JSON. All text content MUST be in Arabic. Do not include any other text or markdown.')
  } else {
    parts.push('Respond ONLY with valid JSON. Do not include any other text or markdown.')
  }

  return parts.join('\n')
}

/**
 * Build the email enhancement prompt for Groq
 */
function buildEmailPrompt(input: EmailEnhanceRequest): string {
  const parts: string[] = []
  const isArabic = input.outputLanguage === 'ar'
  const tone = input.tone || 'professional'

  parts.push('You are a professional email editor. Your task is to enhance and improve the following email draft.')

  // Add language instruction - CRITICAL for proper localization
  if (isArabic) {
    parts.push('')
    parts.push('**CRITICAL LANGUAGE REQUIREMENT:**')
    parts.push('The user wants the email in Arabic. You MUST respond ENTIRELY in Arabic (العربية).')
    parts.push('- The "enhancedEmail" MUST be in Arabic')
    parts.push('- The "suggestedSubject" MUST be in Arabic')
    parts.push('- The "improvements" array MUST contain Arabic text')
    parts.push('- Do NOT mix English and Arabic. Use Arabic ONLY.')
  } else {
    parts.push('')
    parts.push('**LANGUAGE REQUIREMENT:**')
    parts.push('The user wants the email in English. Respond ENTIRELY in English.')
  }

  parts.push('')
  parts.push('**Requirements:**')
  parts.push('1. Fix all grammar and spelling errors')
  parts.push('2. Improve clarity and readability')
  parts.push('3. Maintain the original intent and meaning')
  parts.push('4. Preserve the sender\'s voice and style where appropriate')
  parts.push(`5. Use a ${tone} tone throughout the email`)
  parts.push('6. If no subject line is present in the email, suggest an appropriate one')
  parts.push('7. Ensure proper email formatting (greeting, body, closing)')

  parts.push('')
  parts.push('**Original Email Draft:**')
  parts.push(input.emailDraft)

  parts.push('')
  parts.push('**Required Response Format (JSON):**')
  parts.push('```json')
  parts.push('{')
  if (isArabic) {
    parts.push('  "enhancedEmail": "البريد الإلكتروني المحسّن والمُطوَّر بالكامل",')
    parts.push('  "suggestedSubject": "عنوان مقترح للبريد الإلكتروني (اختياري)",')
    parts.push('  "improvements": ["قائمة التحسينات الرئيسية التي تمت"]')
  } else {
    parts.push('  "enhancedEmail": "The fully corrected and enhanced email",')
    parts.push('  "suggestedSubject": "Suggested subject line (optional)",')
    parts.push('  "improvements": ["List of key improvements made"]')
  }
  parts.push('}')
  parts.push('```')
  parts.push('')
  if (isArabic) {
    parts.push('IMPORTANT: Respond ONLY with valid JSON. All text content MUST be in Arabic. Do not include any other text or markdown.')
  } else {
    parts.push('IMPORTANT: Respond ONLY with valid JSON. Do not include any other text or markdown.')
  }

  return parts.join('\n')
}

/**
 * Parse JSON response from Groq
 */
function parseJsonResponse<T>(responseText: string): T {
  try {
    // Try to extract JSON from code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1])
    }

    // Try to parse the entire response as JSON
    const trimmed = responseText.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed)
    }

    throw new Error('Could not parse JSON from response')
  } catch {
    console.error('Failed to parse Groq response:', {
      responseLength: responseText.length,
      startsWithBrace: responseText.trim().startsWith('{'),
      timestamp: new Date().toISOString()
    })
    throw new Error('Invalid response format from AI')
  }
}

/**
 * Parsed response interface for prompt enhancement
 */
interface ParsedPromptResponse {
  shortTitle: string
  enhancedPrompt: string
  improvements: string[]
  suggestions?: string[]
}

/**
 * Parsed response interface for email enhancement
 */
interface ParsedEmailResponse {
  enhancedEmail: string
  suggestedSubject?: string
  improvements: string[]
}

/**
 * Enhance a prompt using Groq API
 */
export async function enhancePromptWithGroq(input: FormInput): Promise<ParsedPromptResponse> {
  const client = getGroqClient()
  const prompt = buildPromptEnhancementPrompt(input)

  // Use llama-3.3-70b-versatile for best quality
  const result = await retryWithBackoff(async () => {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('Empty response from Groq')
    }

    return content
  })

  const parsed = parseJsonResponse<ParsedPromptResponse>(result)

  // Validate required fields
  if (!parsed.shortTitle || !parsed.enhancedPrompt || !parsed.improvements) {
    throw new Error('Incomplete response from AI')
  }

  return parsed
}

/**
 * Enhance an email using Groq API
 */
export async function enhanceEmailWithGroq(input: EmailEnhanceRequest): Promise<ParsedEmailResponse> {
  const client = getGroqClient()
  const prompt = buildEmailPrompt(input)

  // Use llama-3.3-70b-versatile for best quality
  const result = await retryWithBackoff(async () => {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('Empty response from Groq')
    }

    return content
  })

  const parsed = parseJsonResponse<ParsedEmailResponse>(result)

  // Validate required fields
  if (!parsed.enhancedEmail || !parsed.improvements) {
    throw new Error('Incomplete response from AI')
  }

  return parsed
}

/**
 * Check if Groq API is accessible
 */
export async function checkGroqConnection(): Promise<boolean> {
  try {
    const client = getGroqClient()

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10
    })

    return !!completion.choices[0]?.message?.content
  } catch (error) {
    const fullErrorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Groq connection check failed:', {
      errorType: fullErrorMessage.split(':')[0],
      timestamp: new Date().toISOString()
    })
    return false
  }
}

/**
 * Map Groq errors to standardized error messages
 */
export function mapGroqError(error: unknown): Error {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorLower = errorMessage.toLowerCase()

  if (errorLower.includes('api key') || errorLower.includes('authentication') || errorLower.includes('unauthorized')) {
    return new Error('GROQ_API_ERROR: Invalid API key configuration')
  }
  if (errorLower.includes('rate_limit') || errorLower.includes('429') || errorLower.includes('too many requests')) {
    return new Error('GROQ_API_ERROR: API quota exceeded')
  }
  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return new Error('GROQ_API_ERROR: Model not found')
  }
  if (errorLower.includes('timeout') || errorLower.includes('deadline')) {
    return new Error('GROQ_API_ERROR: Request timeout')
  }
  if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('enotfound')) {
    return new Error('GROQ_API_ERROR: Network error - cannot reach Groq API')
  }

  return new Error(`GROQ_API_ERROR: ${errorMessage}`)
}
