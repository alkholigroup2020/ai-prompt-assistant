/**
 * GET /api/templates
 * Retrieves available prompt templates with filtering and pagination
 */

import type { TemplateListResponse } from '~/types/api';
import type { TemplateCategory, TemplateDifficulty } from '~/types/template';
import { getTemplates } from '../../utils/templates';

export default defineEventHandler(async (event): Promise<TemplateListResponse> => {
  try {
    // Parse query parameters
    const query = getQuery(event);

    // Extract filters
    const category = query.category as TemplateCategory | undefined;
    const difficulty = query.difficulty as TemplateDifficulty | undefined;
    const search = query.search as string | undefined;
    const sortBy = query.sortBy as 'popular' | 'recent' | 'rating' | 'title' | undefined;
    const sortOrder = query.sortOrder as 'asc' | 'desc' | undefined;

    // Parse tags
    let tags: string[] | undefined;
    if (query.tags) {
      tags = Array.isArray(query.tags)
        ? query.tags as string[]
        : [query.tags as string];
    }

    // Parse pagination
    const page = parseInt(query.page as string) || 1;
    const pageSize = Math.min(
      parseInt(query.pageSize as string) || 20,
      50 // Max 50 items per page
    );

    // Get templates with filters
    const result = getTemplates(
      {
        category,
        difficulty,
        search,
        tags,
        sortBy,
        sortOrder
      },
      page,
      pageSize
    );

    // Build response
    const response: TemplateListResponse = {
      success: true,
      data: {
        templates: result.templates,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      }
    };

    setResponseStatus(event, 200);
    return response;

  } catch (error) {
    // SECURITY: Log errors securely without sensitive data or stack traces
    const sanitizedError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Templates retrieval error:', {
      // Only log error type, never the full error object or stack trace
      errorType: sanitizedError.split(':')[0],
      timestamp: new Date().toISOString()
    });

    setResponseStatus(event, 500);
    // SECURITY: Return generic error message to client (never expose internal details)
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve templates. Please try again.'
      }
    };
  }
});
