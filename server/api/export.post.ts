/**
 * POST /api/export
 * Exports enhanced prompt in various formats
 */

import type { ExportResponse } from '~/types/api';
import { validateExportRequest } from '../utils/validation';
import { enforceRateLimit } from '../utils/rate-limit';

/**
 * Generate filename based on format and timestamp
 */
function generateFilename(format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `prompt-${timestamp}.${format}`;
}

/**
 * Export metadata interface
 */
interface ExportMetadata {
  title?: string;
  timestamp?: boolean;
  includeAnalysis?: boolean;
  qualityScore?: number;
  improvements?: string[];
  suggestions?: string[];
}

/**
 * Export to TXT format
 */
function exportToTxt(prompt: string, metadata?: ExportMetadata): string {
  let content = prompt;

  if (metadata?.title) {
    content = `# ${metadata.title}\n\n${content}`;
  }

  if (metadata?.timestamp) {
    const timestamp = new Date().toISOString();
    content += `\n\n---\nGenerated: ${timestamp}`;
  }

  if (metadata?.includeAnalysis && metadata?.qualityScore) {
    content += `\nQuality Score: ${metadata.qualityScore}/100`;
  }

  return content;
}

/**
 * Export to Markdown format
 */
function exportToMarkdown(prompt: string, metadata?: ExportMetadata): string {
  let content = '';

  if (metadata?.title) {
    content += `# ${metadata.title}\n\n`;
  }

  content += `## Enhanced Prompt\n\n${prompt}\n\n`;

  if (metadata?.includeAnalysis) {
    content += `## Analysis\n\n`;

    if (metadata?.qualityScore) {
      content += `**Quality Score:** ${metadata.qualityScore}/100\n\n`;
    }

    if (metadata?.improvements && Array.isArray(metadata.improvements)) {
      content += `### Improvements Made\n\n`;
      metadata.improvements.forEach((imp: string) => {
        content += `- ${imp}\n`;
      });
      content += '\n';
    }

    if (metadata?.suggestions && Array.isArray(metadata.suggestions)) {
      content += `### Suggestions\n\n`;
      metadata.suggestions.forEach((sug: string) => {
        content += `- ${sug}\n`;
      });
      content += '\n';
    }
  }

  if (metadata?.timestamp) {
    const timestamp = new Date().toISOString();
    content += `---\n\n*Generated: ${timestamp}*\n`;
  }

  return content;
}

/**
 * Export to JSON format
 */
function exportToJson(prompt: string, metadata?: ExportMetadata): string {
  const data = {
    prompt,
    metadata: {
      exportedAt: new Date().toISOString(),
      title: metadata?.title || 'Untitled Prompt',
      qualityScore: metadata?.qualityScore || null,
      improvements: metadata?.improvements || [],
      suggestions: metadata?.suggestions || [],
      version: '1.0'
    }
  };

  return JSON.stringify(data, null, 2);
}

export default defineEventHandler(async (event): Promise<ExportResponse> => {
  try {
    // Apply rate limiting (higher limit for export)
    enforceRateLimit(event, { maxRequests: 100 }); // 100 exports per minute

    // Parse request body
    const body = await readBody(event);

    // Validate input
    const validation = validateExportRequest(body);

    if (!validation.valid) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: validation.error
      };
    }

    const { prompt, format, metadata } = body;

    // Generate export content based on format
    let content: string;
    let filename: string;

    switch (format) {
      case 'txt':
        content = exportToTxt(prompt, metadata);
        filename = generateFilename('txt');
        break;

      case 'md':
        content = exportToMarkdown(prompt, metadata);
        filename = generateFilename('md');
        break;

      case 'json':
        content = exportToJson(prompt, metadata);
        filename = generateFilename('json');
        break;

      default:
        setResponseStatus(event, 400);
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid export format. Supported formats: txt, md, json'
          }
        };
    }

    // Set appropriate content-type header
    const contentTypes: Record<string, string> = {
      txt: 'text/plain',
      md: 'text/markdown',
      json: 'application/json'
    };

    setHeader(event, 'Content-Type', contentTypes[format]);
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);

    // Return export response
    setResponseStatus(event, 200);
    return {
      success: true,
      data: {
        content,
        format: format as 'txt' | 'md' | 'json',
        filename
      }
    };

  } catch (error) {
    console.error('Export error:', error);

    setResponseStatus(event, 500);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to export prompt'
      }
    };
  }
});
