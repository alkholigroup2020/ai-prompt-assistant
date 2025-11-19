/**
 * Gemini AI API Utility
 * Handles interactions with Google's Gemini API for prompt enhancement and analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FormInput } from '~/types/form';
import type {
  EnhancementData,
  QualityScoreBreakdown,
  AlternativeVersions
} from '~/types/api';

/**
 * Initialize Gemini API client
 */
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on validation errors or rate limits
      if (
        error instanceof Error &&
        (error.message.includes('VALIDATION') ||
         error.message.includes('RATE_LIMIT'))
      ) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);

      // Don't wait on the last attempt
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Build the enhancement prompt for Gemini
 */
function buildEnhancementPrompt(input: FormInput): string {
  const parts: string[] = [];

  parts.push('You are an expert AI prompt engineer. Your task is to enhance and optimize the following prompt request.');
  parts.push('');
  parts.push('**User Context:**');
  parts.push(`- Role: ${input.role}${input.roleOther ? ` (${input.roleOther})` : ''}`);
  parts.push(`- Target Audience: ${input.audience}${input.audienceOther ? ` (${input.audienceOther})` : ''}`);
  parts.push(`- Desired Tone: ${input.tone}`);
  parts.push(`- Output Format: ${input.outputFormat}${input.outputFormatOther ? ` (${input.outputFormatOther})` : ''}`);

  if (input.constraints && input.constraints.length > 0) {
    parts.push(`- Constraints: ${input.constraints.join(', ')}${input.constraintsOther ? `, ${input.constraintsOther}` : ''}`);
  }

  parts.push('');
  parts.push('**Original Task:**');
  parts.push(input.task);

  if (input.context) {
    parts.push('');
    parts.push('**Additional Context:**');
    parts.push(input.context);
  }

  if (input.examples) {
    parts.push('');
    parts.push('**Examples:**');
    parts.push(input.examples);
  }

  parts.push('');
  parts.push('**Instructions:**');

  if (input.enhancementLevel === 'quick') {
    parts.push('1. Create a clear, concise, and effective prompt that an AI assistant can easily understand and act upon.');
    parts.push('2. Ensure the prompt includes all necessary context and constraints.');
    parts.push('3. Make it specific and actionable.');
  } else {
    parts.push('1. Create a comprehensive, detailed, and highly effective prompt.');
    parts.push('2. Include all relevant context, constraints, and success criteria.');
    parts.push('3. Structure the prompt for maximum clarity and effectiveness.');
    parts.push('4. Add specific examples or formats if helpful.');
  }

  parts.push('');
  parts.push('**Required Response Format (JSON):**');
  parts.push('```json');
  parts.push('{');
  parts.push('  "shortTitle": "Brief title for this prompt (max 60 chars)",');
  parts.push('  "enhancedPrompt": "The fully enhanced and optimized prompt",');
  parts.push('  "improvements": ["list of key improvements made"],');
  parts.push('  "suggestions": ["optional additional suggestions for the user"]');
  parts.push('}');
  parts.push('```');
  parts.push('');
  parts.push('Respond ONLY with valid JSON. Do not include any other text or markdown.');

  return parts.join('\n');
}

/**
 * Parsed response interface
 */
interface ParsedGeminiResponse {
  shortTitle: string;
  enhancedPrompt: string;
  improvements: string[];
  suggestions?: string[];
}

/**
 * Parse Gemini response and extract JSON
 */
function parseGeminiResponse(responseText: string): ParsedGeminiResponse {
  try {
    // Try to extract JSON from code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to parse the entire response as JSON
    const trimmed = responseText.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed);
    }

    throw new Error('Could not parse JSON from response');
  } catch {
    // SECURITY: Don't log the full response text (could contain user data)
    console.error('Failed to parse Gemini response:', {
      responseLength: responseText.length,
      startsWithBrace: responseText.trim().startsWith('{'),
      timestamp: new Date().toISOString()
    });
    throw new Error('Invalid response format from AI');
  }
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
  };

  // Clarity: based on sentence structure and length
  const avgSentenceLength = enhanced.split(/[.!?]+/).filter(s => s.trim()).length;
  breakdown.clarity = Math.min(100, Math.max(0, 100 - (avgSentenceLength > 30 ? 20 : 0)));

  // Specificity: based on detail level and examples
  breakdown.specificity = Math.min(100,
    (input.examples ? 30 : 0) +
    (input.context ? 30 : 0) +
    (enhanced.length > original.length ? 40 : 20)
  );

  // Context: based on provided context and constraints
  breakdown.context = Math.min(100,
    (input.context ? 40 : 0) +
    (input.constraints.length * 10) +
    (input.audience ? 20 : 0) +
    (input.role ? 20 : 0)
  );

  // Structure: based on format and organization
  breakdown.structure = Math.min(100,
    (input.outputFormat !== 'paragraph' ? 30 : 20) +
    (enhanced.includes('\n') ? 30 : 0) +
    40 // Base score for being structured
  );

  // Completeness: based on all fields being filled
  const fieldsFilled = [
    input.role,
    input.audience,
    input.task,
    input.tone,
    input.outputFormat,
    input.constraints.length > 0
  ].filter(Boolean).length;
  breakdown.completeness = Math.min(100, (fieldsFilled / 6) * 100);

  // Calculate overall score
  const score = Math.round(
    (breakdown.clarity * 0.2) +
    (breakdown.specificity * 0.25) +
    (breakdown.context * 0.25) +
    (breakdown.structure * 0.15) +
    (breakdown.completeness * 0.15)
  );

  return { score, breakdown };
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
    return undefined;
  }

  // Simple heuristic-based alternatives
  const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim());

  return {
    concise: sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.',
    detailed: enhanced, // The enhanced version is already detailed
    technical: undefined // Could be generated with another API call if needed
  };
}

/**
 * Enhance a prompt using Gemini API
 */
export async function enhancePrompt(input: FormInput): Promise<EnhancementData> {

  try {
    const client = getGeminiClient();
    const config = useRuntimeConfig();
    const modelName = config.public.geminiModel || 'gemini-pro';
    const model = client.getGenerativeModel({ model: modelName });

    const prompt = buildEnhancementPrompt(input);

    // Call Gemini API with retry logic
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    // Parse the response
    const parsed = parseGeminiResponse(result);

    // Validate required fields
    if (!parsed.shortTitle || !parsed.enhancedPrompt || !parsed.improvements) {
      throw new Error('Incomplete response from AI');
    }

    // Calculate quality score
    const { score, breakdown } = calculateQualityScore(
      input.task,
      parsed.enhancedPrompt,
      input
    );

    // Generate alternatives if detailed enhancement
    const alternativeVersions = generateAlternativeVersions(
      parsed.enhancedPrompt,
      input
    );

    const enhancementData: EnhancementData = {
      shortTitle: parsed.shortTitle.substring(0, 60),
      enhancedPrompt: parsed.enhancedPrompt,
      qualityScore: score,
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : undefined,
      alternativeVersions,
      breakdown
    };

    return enhancementData;

  } catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', {
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString()
    });

    if (error instanceof Error) {
      // SECURITY: Never log the actual API key or sensitive error details
      if (error.message.includes('API key') || error.message.includes('invalid_api_key')) {
        throw new Error('GEMINI_API_ERROR: Invalid API key configuration');
      }
      if (error.message.includes('quota') || error.message.includes('429')) {
        throw new Error('GEMINI_API_ERROR: API quota exceeded');
      }
    }

    throw new Error('GEMINI_API_ERROR: Unable to enhance prompt');
  }
}

/**
 * Analyze prompt quality without enhancement
 */
export async function analyzePromptQuality(prompt: string): Promise<{
  qualityScore: number;
  breakdown: QualityScoreBreakdown;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}> {
  const breakdown: QualityScoreBreakdown = {
    clarity: 0,
    specificity: 0,
    context: 0,
    structure: 0,
    completeness: 0
  };

  const suggestions: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Clarity analysis
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
  const avgWordCount = prompt.split(/\s+/).length / Math.max(sentences.length, 1);

  if (avgWordCount < 15) {
    breakdown.clarity = 90;
    strengths.push('Clear and concise sentences');
  } else if (avgWordCount < 25) {
    breakdown.clarity = 70;
  } else {
    breakdown.clarity = 50;
    weaknesses.push('Some sentences are too long');
    suggestions.push('Break down complex sentences for better clarity');
  }

  // Specificity analysis
  const hasNumbers = /\d+/.test(prompt);
  const hasExamples = /example|such as|like|e\.g\.|i\.e\./i.test(prompt);

  breakdown.specificity = 40;
  if (hasNumbers) {
    breakdown.specificity += 30;
    strengths.push('Includes specific numbers or metrics');
  } else {
    suggestions.push('Add specific numbers, metrics, or examples');
  }
  if (hasExamples) {
    breakdown.specificity += 30;
    strengths.push('Provides examples');
  }

  // Context analysis
  const hasRole = /(?:as a|i am|role|position)/i.test(prompt);
  const hasAudience = /(?:audience|for|target|reader)/i.test(prompt);
  const hasPurpose = /(?:goal|purpose|objective|aim)/i.test(prompt);

  breakdown.context = 0;
  if (hasRole) {
    breakdown.context += 33;
    strengths.push('Defines role or perspective');
  } else {
    suggestions.push('Specify your role or perspective');
  }
  if (hasAudience) {
    breakdown.context += 33;
    strengths.push('Identifies target audience');
  } else {
    suggestions.push('Define your target audience');
  }
  if (hasPurpose) {
    breakdown.context += 34;
    strengths.push('States clear purpose');
  } else {
    suggestions.push('Clarify the purpose or goal');
  }

  // Structure analysis
  const hasFormatting = prompt.includes('\n') || prompt.includes('  ');
  const isOrganized = sentences.length > 1;

  breakdown.structure = isOrganized ? 60 : 30;
  if (hasFormatting) {
    breakdown.structure += 40;
    strengths.push('Well-formatted and organized');
  } else if (prompt.length > 200) {
    suggestions.push('Use formatting to organize longer prompts');
  }

  // Completeness analysis
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount < 10) {
    breakdown.completeness = 20;
    weaknesses.push('Prompt is too brief');
    suggestions.push('Add more details and context');
  } else if (wordCount < 30) {
    breakdown.completeness = 50;
    suggestions.push('Consider adding more context or constraints');
  } else if (wordCount < 100) {
    breakdown.completeness = 80;
  } else {
    breakdown.completeness = 100;
    strengths.push('Comprehensive and detailed');
  }

  // Calculate overall score
  const qualityScore = Math.round(
    (breakdown.clarity * 0.2) +
    (breakdown.specificity * 0.25) +
    (breakdown.context * 0.25) +
    (breakdown.structure * 0.15) +
    (breakdown.completeness * 0.15)
  );

  return {
    qualityScore,
    breakdown,
    suggestions,
    strengths,
    weaknesses
  };
}

/**
 * Check if Gemini API is accessible
 */
export async function checkGeminiConnection(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const config = useRuntimeConfig();
    const modelName = config.public.geminiModel || 'gemini-pro';
    const model = client.getGenerativeModel({ model: modelName });

    // Try a simple generation
    const result = await model.generateContent('Hello');
    return !!result.response.text();
  } catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini connection check failed:', {
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString()
    });
    return false;
  }
}
