/**
 * GET /api/health
 * Health check endpoint to verify system status
 */

import type { HealthResponse } from '~/types/api';
import { checkGeminiConnection } from '../utils/gemini';

export default defineEventHandler(async (event): Promise<HealthResponse> => {
  const timestamp = new Date().toISOString();

  try {
    // Check Gemini API connection
    const geminiStatus = await checkGeminiConnection();

    // Build health response
    const response: HealthResponse = {
      status: geminiStatus ? 'ok' : 'error',
      version: '1.0.0',
      timestamp,
      services: {
        gemini: geminiStatus ? 'connected' : 'disconnected'
      }
    };

    // Set status code based on health
    setResponseStatus(event, geminiStatus ? 200 : 503);

    return response;

  } catch (error) {
    console.error('Health check error:', error);

    // Return error status
    setResponseStatus(event, 503);
    return {
      status: 'error',
      version: '1.0.0',
      timestamp,
      services: {
        gemini: 'disconnected'
      }
    };
  }
});
