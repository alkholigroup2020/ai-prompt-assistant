/**
 * API Response Types
 * Type definitions for API responses and errors
 */

/**
 * Quality score type (0-100)
 */
export type QualityScore = number;

/**
 * Quality score breakdown
 */
export interface QualityScoreBreakdown {
  clarity: number;         // 0-100
  specificity: number;     // 0-100
  context: number;         // 0-100
  structure: number;       // 0-100
  completeness: number;    // 0-100
}

/**
 * Alternative versions of the enhanced prompt
 */
export interface AlternativeVersions {
  concise: string;
  detailed: string;
  technical?: string;
}

/**
 * AI Provider type
 */
export type AIProvider = 'groq' | 'gemini';

/**
 * API metadata
 */
export interface APIMetadata {
  processingTime: number;       // milliseconds
  enhancementLevel: string;
  originalLength: number;
  enhancedLength: number;
  language: string;
  requestId?: string;
  timestamp?: Date;
  provider?: AIProvider;        // Which AI provider was used (groq or gemini)
}

/**
 * API Error interface
 */
export interface APIError {
  code: string;
  message: string;
  retryAfter?: number;          // Seconds to wait before retrying
  details?: Record<string, unknown>;
}

/**
 * Enhancement response data
 */
export interface EnhancementData {
  shortTitle: string;           // Max 60 chars
  enhancedPrompt: string;       // The enhanced prompt
  qualityScore: QualityScore;   // 0-100 quality rating
  improvements: string[];       // List of improvements made
  suggestions?: string[];       // Additional suggestions
  alternativeVersions?: AlternativeVersions;  // Optional alternative phrasings
  breakdown?: QualityScoreBreakdown;          // Detailed score breakdown
}

/**
 * Main enhancement response interface
 */
export interface EnhancementResponse {
  success: boolean;
  data?: EnhancementData;
  metadata: APIMetadata;
  error?: APIError;
}

/**
 * Prompt analysis response
 */
export interface AnalysisResponse {
  success: boolean;
  data?: {
    qualityScore: QualityScore;
    breakdown: QualityScoreBreakdown;
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
  };
  error?: APIError;
}

/**
 * Export response
 */
export interface ExportResponse {
  success: boolean;
  data?: {
    content: string;
    format: 'txt' | 'md' | 'json';
    filename: string;
  };
  error?: APIError;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  version: string;
  timestamp: string;
  services: {
    groq?: 'connected' | 'disconnected';   // Primary AI provider
    gemini: 'connected' | 'disconnected';  // Fallback AI provider
    database?: 'connected' | 'disconnected';
  };
}

/**
 * Rate limit error details
 */
export interface RateLimitError extends APIError {
  code: 'RATE_LIMIT_EXCEEDED';
  retryAfter: number;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Validation error details
 */
export interface ValidationError extends APIError {
  code: 'VALIDATION_ERROR' | 'PAYLOAD_TOO_LARGE' | 'INVALID_PAYLOAD';
  fields: {
    field: string;
    message: string;
  }[];
}
