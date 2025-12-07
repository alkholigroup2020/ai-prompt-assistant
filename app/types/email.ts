/**
 * Email Enhancement Types
 * Type definitions for email checker and enhancement feature
 */

import type { APIError } from './api'

/**
 * Tone options for email enhancement
 */
export type EmailTone = 'professional' | 'friendly' | 'formal' | 'casual'

/**
 * Output language options
 */
export type EmailLanguage = 'en' | 'ar'

/**
 * Email enhancement request
 */
export interface EmailEnhanceRequest {
  emailDraft: string           // Required, 10-5000 chars
  outputLanguage: EmailLanguage  // Required
  tone?: EmailTone             // Optional tone selector
}

/**
 * Email metadata
 */
export interface EmailMetadata {
  originalLength: number
  enhancedLength: number
  processingTime: number
  language: string
  requestId?: string
  timestamp?: Date
}

/**
 * Email enhancement data
 */
export interface EmailEnhanceData {
  enhancedEmail: string
  suggestedSubject?: string
  improvements: string[]
  metadata: EmailMetadata
}

/**
 * Email enhancement response
 */
export interface EmailEnhanceResponse {
  success: boolean
  data?: EmailEnhanceData
  error?: APIError
}
