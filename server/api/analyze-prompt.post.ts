/**
 * POST /api/analyze-prompt
 * Analyzes prompt quality without enhancement
 */

import type { AnalysisResponse } from '~/types/api';
import { validatePromptAnalysis } from '../utils/validation';
import { enforceRateLimit } from '../utils/rate-limit';
import { analyzePromptQuality } from '../utils/gemini';

export default defineEventHandler(async (event): Promise<AnalysisResponse> => {
  try {
    // Apply rate limiting (less strict for analysis)
    enforceRateLimit(event, { maxRequests: 120 }); // 120 requests per minute

    // Parse request body
    const body = await readBody(event);

    // Validate input
    const validation = validatePromptAnalysis(body);

    if (!validation.valid) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: validation.error
      };
    }

    // Analyze the prompt
    const analysis = await analyzePromptQuality(validation.sanitized!);

    // Build response
    const response: AnalysisResponse = {
      success: true,
      data: {
        qualityScore: analysis.qualityScore,
        breakdown: analysis.breakdown,
        suggestions: analysis.suggestions,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses
      }
    };

    setResponseStatus(event, 200);
    return response;

  } catch (error) {
    console.error('Analysis error:', error);

    setResponseStatus(event, 500);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to analyze prompt'
      }
    };
  }
});
