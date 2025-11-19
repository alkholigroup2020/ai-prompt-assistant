/**
 * Client-side Security Utilities
 * Provides input sanitization for the frontend
 */

/**
 * HTML entities map for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  return text.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char)
}

/**
 * Basic client-side input sanitization
 * Removes dangerous HTML and scripts
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')

  // Remove dangerous HTML tags
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/vbscript:/gi, '')

  return sanitized.trim()
}

/**
 * Detect potentially dangerous patterns in input
 */
export function hasDangerousContent(input: string): boolean {
  if (typeof input !== 'string') {
    return false
  }

  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /__proto__/i,
    /constructor\[/i,
    /\.\.\//,
    /data:text\/html/i,
  ]

  return dangerousPatterns.some((pattern) => pattern.test(input))
}

/**
 * Validate that a string is safe for display
 * Returns sanitized version and warning if dangerous content was detected
 */
export function validateAndSanitize(input: string): {
  safe: string
  hadDangerousContent: boolean
} {
  const hadDangerousContent = hasDangerousContent(input)
  const safe = sanitizeInput(input)

  return {
    safe,
    hadDangerousContent,
  }
}

/**
 * Truncate text to maximum length safely
 */
export function truncateSafely(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength)
}
