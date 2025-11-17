/**
 * GET /api/templates/:id
 * Retrieves a specific template by ID
 */

import type { TemplateDetailResponse } from '~/types/api';
import { getTemplateById } from '../../utils/templates';

export default defineEventHandler(async (event): Promise<TemplateDetailResponse> => {
  try {
    // Get template ID from route params
    const id = getRouterParam(event, 'id');

    if (!id) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Template ID is required'
        }
      };
    }

    // Get template
    const template = getTemplateById(id);

    if (!template) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Template with ID '${id}' not found`
        }
      };
    }

    // Return template
    setResponseStatus(event, 200);
    return {
      success: true,
      data: template
    };

  } catch (error) {
    console.error('Template retrieval error:', error);

    setResponseStatus(event, 500);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve template'
      }
    };
  }
});
