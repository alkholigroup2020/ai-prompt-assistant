/**
 * Form Input Types
 * Type definitions for the prompt builder form
 */

/**
 * Tone options for prompt generation
 */
export enum ToneOption {
  PROFESSIONAL = 'professional',
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
  CASUAL = 'casual',
  PERSUASIVE = 'persuasive',
  INFORMATIVE = 'informative',
  CREATIVE = 'creative',
  TECHNICAL = 'technical',
  EMPATHETIC = 'empathetic'
}

/**
 * Output format options
 */
export enum OutputFormat {
  PARAGRAPH = 'paragraph',
  BULLET_POINTS = 'bullets',
  NUMBERED_LIST = 'numbered',
  EMAIL = 'email',
  REPORT = 'report',
  PRESENTATION = 'presentation',
  CODE_COMMENTS = 'code_comments',
  SOCIAL_POST = 'social_post',
  EXECUTIVE_SUMMARY = 'executive_summary',
  TABLE = 'table',
  DIALOGUE = 'dialogue',
  STEP_BY_STEP = 'steps',
  FAQ = 'faq',
  OTHER = 'other'
}

/**
 * Constraint options for prompt generation
 */
export enum Constraint {
  WORD_LIMIT_100 = 'max_100_words',
  WORD_LIMIT_300 = 'max_300_words',
  WORD_LIMIT_500 = 'max_500_words',
  INCLUDE_CITATIONS = 'citations',
  USE_PROVIDED_DATA = 'provided_data_only',
  NO_JARGON = 'no_jargon',
  TECHNICAL_DETAIL = 'technical_detail',
  BEGINNER_FRIENDLY = 'beginner_friendly',
  ACTION_ORIENTED = 'action_oriented',
  DATA_DRIVEN = 'data_driven'
}

/**
 * Enhancement level options
 */
export type EnhancementLevel = 'quick' | 'detailed';

/**
 * Supported languages
 */
export type Language = 'en' | 'ar';

/**
 * Main form input interface
 */
export interface FormInput {
  // Core Fields
  role: string;                    // User's role/profession
  roleOther?: string;              // Custom role if "other" selected
  audience: string;                // Target audience for output
  audienceOther?: string;          // Custom audience if "other" selected
  task: string;                    // Main task description (10-1000 chars)

  // Enhancement Options
  tone?: ToneOption;               // Writing tone (optional, starts empty)
  outputFormat?: OutputFormat;     // Desired output structure (optional, starts empty)
  outputFormatOther?: string;      // Custom format if "other"

  // Advanced Options
  constraints: Constraint[];       // Array of selected constraints
  constraintsOther?: string;       // Additional custom constraints
  examples?: string;               // Optional examples (max 3000 chars)
  context?: string;                // Additional context (max 1500 chars)

  // Enhancement Settings
  enhancementLevel: EnhancementLevel;  // Quick polish vs deep enhancement
  language: Language;              // Interface language

  // Metadata
  timestamp: Date;                 // Submission time
  sessionId: string;              // Anonymous session tracking
}
