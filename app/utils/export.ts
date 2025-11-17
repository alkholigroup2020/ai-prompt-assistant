/**
 * Export utilities for downloading and copying prompts
 * Supports TXT, MD (Markdown), and JSON formats
 */

import type { FormInput, EnhancementResponse } from '~/types'
import { formatAbsoluteDate } from './formatters'

/**
 * Export metadata interface
 */
export interface ExportMetadata {
  title?: string
  includeTimestamp?: boolean
  includeQualityScore?: boolean
  includeOriginal?: boolean
  includeImprovements?: boolean
}

/**
 * Generate plain text file content
 * @param enhancedPrompt - The enhanced prompt text
 * @param metadata - Export metadata options
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @returns Plain text content
 */
export function generateTxtFile(
  enhancedPrompt: string,
  metadata: ExportMetadata = {},
  originalInput?: FormInput,
  response?: EnhancementResponse
): string {
  const lines: string[] = []

  // Title
  if (metadata.title) {
    lines.push(metadata.title)
    lines.push('='.repeat(metadata.title.length))
    lines.push('')
  }

  // Timestamp
  if (metadata.includeTimestamp) {
    const timestamp = formatAbsoluteDate(new Date(), 'en', true)
    lines.push(`Generated: ${timestamp}`)
    lines.push('')
  }

  // Quality Score
  if (metadata.includeQualityScore && response?.data?.qualityScore !== undefined) {
    lines.push(`Quality Score: ${response.data.qualityScore}/100`)
    lines.push('')
  }

  // Original Prompt (if requested)
  if (metadata.includeOriginal && originalInput) {
    lines.push('ORIGINAL PROMPT')
    lines.push('-'.repeat(50))
    lines.push(`Role: ${originalInput.role}`)
    lines.push(`Audience: ${originalInput.audience}`)
    lines.push(`Task: ${originalInput.task}`)
    if (originalInput.tone) lines.push(`Tone: ${originalInput.tone}`)
    if (originalInput.outputFormat) lines.push(`Format: ${originalInput.outputFormat}`)
    lines.push('')
  }

  // Enhanced Prompt
  lines.push('ENHANCED PROMPT')
  lines.push('-'.repeat(50))
  lines.push(enhancedPrompt)
  lines.push('')

  // Improvements (if requested)
  if (metadata.includeImprovements && response?.data?.improvements && response.data.improvements.length > 0) {
    lines.push('IMPROVEMENTS MADE')
    lines.push('-'.repeat(50))
    response.data.improvements.forEach((improvement, index) => {
      lines.push(`${index + 1}. ${improvement}`)
    })
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generate Markdown file content
 * @param enhancedPrompt - The enhanced prompt text
 * @param metadata - Export metadata options
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @returns Markdown content
 */
export function generateMdFile(
  enhancedPrompt: string,
  metadata: ExportMetadata = {},
  originalInput?: FormInput,
  response?: EnhancementResponse
): string {
  const lines: string[] = []

  // Title
  const title = metadata.title || 'AI Prompt'
  lines.push(`# ${title}`)
  lines.push('')

  // Timestamp
  if (metadata.includeTimestamp) {
    const timestamp = formatAbsoluteDate(new Date(), 'en', true)
    lines.push(`**Generated:** ${timestamp}`)
    lines.push('')
  }

  // Quality Score with badge
  if (metadata.includeQualityScore && response?.data?.qualityScore !== undefined) {
    const score = response.data.qualityScore
    const badgeColor = score >= 75 ? 'brightgreen' : score >= 60 ? 'yellow' : 'red'
    lines.push(`![Quality Score](https://img.shields.io/badge/Quality-${score}%2F100-${badgeColor})`)
    lines.push('')
  }

  // Original Prompt (if requested)
  if (metadata.includeOriginal && originalInput) {
    lines.push('## Original Prompt')
    lines.push('')
    lines.push('| Field | Value |')
    lines.push('|-------|-------|')
    lines.push(`| **Role** | ${originalInput.role} |`)
    lines.push(`| **Audience** | ${originalInput.audience} |`)
    lines.push(`| **Task** | ${originalInput.task} |`)
    if (originalInput.tone) lines.push(`| **Tone** | ${originalInput.tone} |`)
    if (originalInput.outputFormat) lines.push(`| **Format** | ${originalInput.outputFormat} |`)
    if (originalInput.constraints && originalInput.constraints.length > 0) {
      lines.push(`| **Constraints** | ${originalInput.constraints.join(', ')} |`)
    }
    lines.push('')
  }

  // Enhanced Prompt
  lines.push('## Enhanced Prompt')
  lines.push('')
  lines.push('```')
  lines.push(enhancedPrompt)
  lines.push('```')
  lines.push('')

  // Improvements (if requested)
  if (metadata.includeImprovements && response?.data?.improvements && response.data.improvements.length > 0) {
    lines.push('## Improvements Made')
    lines.push('')
    response.data.improvements.forEach((improvement) => {
      lines.push(`- ✅ ${improvement}`)
    })
    lines.push('')
  }

  // Suggestions
  if (response?.data?.suggestions && response.data.suggestions.length > 0) {
    lines.push('## Suggestions')
    lines.push('')
    response.data.suggestions.forEach((suggestion) => {
      lines.push(`- 💡 ${suggestion}`)
    })
    lines.push('')
  }

  // Alternative Versions
  if (response?.data?.alternativeVersions) {
    const { concise, detailed, technical } = response.data.alternativeVersions

    if (concise) {
      lines.push('### Concise Version')
      lines.push('')
      lines.push('```')
      lines.push(concise)
      lines.push('```')
      lines.push('')
    }

    if (detailed) {
      lines.push('### Detailed Version')
      lines.push('')
      lines.push('```')
      lines.push(detailed)
      lines.push('```')
      lines.push('')
    }

    if (technical) {
      lines.push('### Technical Version')
      lines.push('')
      lines.push('```')
      lines.push(technical)
      lines.push('```')
      lines.push('')
    }
  }

  // Footer
  lines.push('---')
  lines.push('*Generated with AI Prompt Assistant*')

  return lines.join('\n')
}

/**
 * Generate JSON file content
 * @param enhancedPrompt - The enhanced prompt text
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @returns JSON string
 */
export function generateJsonFile(
  enhancedPrompt: string,
  originalInput?: FormInput,
  response?: EnhancementResponse
): string {
  const data = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    enhancedPrompt,
    qualityScore: response?.data?.qualityScore,
    originalInput: originalInput
      ? {
          role: originalInput.role,
          audience: originalInput.audience,
          task: originalInput.task,
          tone: originalInput.tone,
          outputFormat: originalInput.outputFormat,
          constraints: originalInput.constraints,
          examples: originalInput.examples,
          context: originalInput.context,
        }
      : undefined,
    improvements: response?.data?.improvements,
    suggestions: response?.data?.suggestions,
    alternativeVersions: response?.data?.alternativeVersions,
    metadata: response?.metadata,
  }

  return JSON.stringify(data, null, 2)
}

/**
 * Trigger file download in browser
 * @param content - File content
 * @param filename - Filename for download
 * @param mimeType - MIME type of the file
 */
export function triggerDownload(content: string, filename: string, mimeType: string): void {
  // Create blob
  const blob = new Blob([content], { type: mimeType })

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename

  // Trigger download
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download prompt as TXT file
 * @param enhancedPrompt - The enhanced prompt text
 * @param metadata - Export metadata options
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @param customFilename - Custom filename (optional)
 */
export function downloadAsTxt(
  enhancedPrompt: string,
  metadata: ExportMetadata = {},
  originalInput?: FormInput,
  response?: EnhancementResponse,
  customFilename?: string
): void {
  const content = generateTxtFile(enhancedPrompt, metadata, originalInput, response)
  const filename = customFilename || `prompt-${Date.now()}.txt`
  triggerDownload(content, filename, 'text/plain')
}

/**
 * Download prompt as Markdown file
 * @param enhancedPrompt - The enhanced prompt text
 * @param metadata - Export metadata options
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @param customFilename - Custom filename (optional)
 */
export function downloadAsMd(
  enhancedPrompt: string,
  metadata: ExportMetadata = {},
  originalInput?: FormInput,
  response?: EnhancementResponse,
  customFilename?: string
): void {
  const content = generateMdFile(enhancedPrompt, metadata, originalInput, response)
  const filename = customFilename || `prompt-${Date.now()}.md`
  triggerDownload(content, filename, 'text/markdown')
}

/**
 * Download prompt as JSON file
 * @param enhancedPrompt - The enhanced prompt text
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 * @param customFilename - Custom filename (optional)
 */
export function downloadAsJson(
  enhancedPrompt: string,
  originalInput?: FormInput,
  response?: EnhancementResponse,
  customFilename?: string
): void {
  const content = generateJsonFile(enhancedPrompt, originalInput, response)
  const filename = customFilename || `prompt-${Date.now()}.json`
  triggerDownload(content, filename, 'application/json')
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    return successful
  }
  catch {
    return false
  }
}

/**
 * Copy enhanced prompt to clipboard
 * @param enhancedPrompt - The enhanced prompt text
 * @returns Promise that resolves when copy is successful
 */
export async function copyPromptToClipboard(enhancedPrompt: string): Promise<boolean> {
  return copyToClipboard(enhancedPrompt)
}

/**
 * Get suggested filename based on prompt content
 * @param originalInput - Original form input
 * @param extension - File extension (e.g., 'txt', 'md', 'json')
 * @returns Suggested filename
 */
export function getSuggestedFilename(originalInput?: FormInput, extension = 'txt'): string {
  if (!originalInput || !originalInput.task) {
    return `prompt-${Date.now()}.${extension}`
  }

  // Extract first few words from task for filename
  const taskWords = originalInput.task
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .slice(0, 5)
    .join('-')

  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  return `${taskWords}-${timestamp}.${extension}`
}

/**
 * Export prompt in specified format
 * @param format - Export format ('txt', 'md', or 'json')
 * @param enhancedPrompt - The enhanced prompt text
 * @param metadata - Export metadata options
 * @param originalInput - Original form input (optional)
 * @param response - Full enhancement response (optional)
 */
export function exportPrompt(
  format: 'txt' | 'md' | 'json',
  enhancedPrompt: string,
  metadata: ExportMetadata = {},
  originalInput?: FormInput,
  response?: EnhancementResponse
): void {
  const filename = getSuggestedFilename(originalInput, format)

  switch (format) {
    case 'txt':
      downloadAsTxt(enhancedPrompt, metadata, originalInput, response, filename)
      break
    case 'md':
      downloadAsMd(enhancedPrompt, metadata, originalInput, response, filename)
      break
    case 'json':
      downloadAsJson(enhancedPrompt, originalInput, response, filename)
      break
  }
}
