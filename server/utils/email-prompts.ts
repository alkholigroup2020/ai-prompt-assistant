/**
 * Email Enhancement Prompts
 * Gemini AI prompt builders for email enhancement
 */

import type { EmailEnhanceRequest } from '~/types/email'

/**
 * Build the email enhancement prompt for Gemini
 */
export function buildEmailEnhancementPrompt(input: EmailEnhanceRequest): string {
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
 * Parsed Gemini response interface for email enhancement
 */
export interface ParsedEmailResponse {
  enhancedEmail: string
  suggestedSubject?: string
  improvements: string[]
}

/**
 * Parse Gemini response and extract JSON
 */
export function parseEmailResponse(responseText: string): ParsedEmailResponse {
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
  }
  catch {
    // SECURITY: Don't log the full response text (could contain user data)
    console.error('Failed to parse Gemini email response:', {
      responseLength: responseText.length,
      startsWithBrace: responseText.trim().startsWith('{'),
      timestamp: new Date().toISOString()
    })
    throw new Error('Invalid response format from AI')
  }
}
