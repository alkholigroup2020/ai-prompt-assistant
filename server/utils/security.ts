/**
 * Security Utilities
 * Comprehensive input sanitization and attack prevention
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
 * Remove null bytes to prevent null byte injection
 */
export function removeNullBytes(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  return text.replace(/\0/g, '')
}

/**
 * Normalize Unicode characters to prevent Unicode-based attacks
 */
export function normalizeUnicode(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  try {
    // Normalize to NFC (Canonical Decomposition, followed by Canonical Composition)
    return text.normalize('NFC')
  } catch {
    return text
  }
}

/**
 * Remove control characters except common whitespace
 */
export function removeControlCharacters(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  // Allow: tab (0x09), newline (0x0A), carriage return (0x0D), space and above (0x20+)
  // Remove: all other control characters
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
}

/**
 * Detect and prevent SQL injection patterns
 * Note: This app doesn't use SQL, but this is a security best practice
 */
export function detectSqlInjection(text: string): boolean {
  if (typeof text !== 'string') {
    return false
  }

  const sqlPatterns = [
    // SQL keywords in suspicious combinations
    /\b(SELECT|INSERT|UPDATE|DELETE)\b.*\b(FROM|INTO|WHERE|SET)\b/i,
    /\b(DROP|CREATE|ALTER)\b.*\b(TABLE|DATABASE|INDEX)\b/i,
    /\bUNION\b.*\bSELECT\b/i,
    /\b(EXEC|EXECUTE)\b.*\(/i,
    // SQL comment patterns
    /(--|\*\/|\/\*)/,
    // Quote-based injection patterns
    /('|")(\s)*(OR|AND)(\s)*('|")/i,
    /('|")(\s)*(OR|AND)(\s)*\d+\s*=\s*\d+/i,
    // Semicolon followed by SQL keywords
    /(;|\||&)(\s)*(DROP|DELETE|UPDATE|INSERT|SELECT)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(text))
}

/**
 * Detect and prevent NoSQL injection patterns
 */
export function detectNoSqlInjection(text: string): boolean {
  if (typeof text !== 'string') {
    return false
  }

  const noSqlPatterns = [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$regex/i,
    /\{\s*\$ne\s*:/i,
    /\{\s*\$gt\s*:/i,
  ]

  return noSqlPatterns.some((pattern) => pattern.test(text))
}

/**
 * Detect and prevent LDAP injection patterns
 */
export function detectLdapInjection(text: string): boolean {
  if (typeof text !== 'string') {
    return false
  }

  const ldapPatterns = [
    /\(\s*\|\s*\(/,
    /\)\s*\(\s*\|/,
    /\*\s*\)/,
    /\(\s*\*/,
  ]

  return ldapPatterns.some((pattern) => pattern.test(text))
}

/**
 * Detect prototype pollution attempts
 */
export function detectPrototypePollution(text: string): boolean {
  if (typeof text !== 'string') {
    return false
  }

  const prototypePollutionPatterns = [
    /__proto__/i,
    /constructor\s*\[/i,
    /prototype\s*\[/i,
  ]

  return prototypePollutionPatterns.some((pattern) => pattern.test(text))
}

/**
 * Detect path traversal attempts
 */
export function detectPathTraversal(text: string): boolean {
  if (typeof text !== 'string') {
    return false
  }

  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
  ]

  return pathTraversalPatterns.some((pattern) => pattern.test(text))
}

/**
 * Comprehensive sanitization that combines multiple security measures
 */
export function sanitizeInput(input: string, options: {
  escapeHtml?: boolean
  maxLength?: number
  allowNewlines?: boolean
} = {}): string {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove null bytes
  sanitized = removeNullBytes(sanitized)

  // Normalize Unicode
  sanitized = normalizeUnicode(sanitized)

  // Remove control characters (except allowed whitespace)
  sanitized = removeControlCharacters(sanitized)

  // Remove dangerous HTML tags and attributes
  sanitized = sanitized
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove img tags
    .replace(/<img\b[^>]*>/gi, '')
    // Remove link tags
    .replace(/<link\b[^>]*>/gi, '')
    // Remove style tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove form tags
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    // Remove input tags
    .replace(/<input\b[^>]*>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    .replace(/data:text\/javascript/gi, '')
    .replace(/data:application\/javascript/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove vbscript: URLs
    .replace(/vbscript:/gi, '')

  // Optionally escape HTML entities
  if (options.escapeHtml) {
    sanitized = escapeHtml(sanitized)
  }

  // Normalize whitespace
  if (!options.allowNewlines) {
    // Convert all whitespace to single spaces
    sanitized = sanitized.replace(/\s+/g, ' ')
  } else {
    // Preserve newlines but normalize other whitespace
    sanitized = sanitized
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ')
  }

  // Trim
  sanitized = sanitized.trim()

  // Apply length limit if specified
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength)
  }

  return sanitized
}

/**
 * Validate that input doesn't contain malicious patterns
 */
export function validateSecurity(input: string): {
  valid: boolean
  threats: string[]
} {
  const threats: string[] = []

  if (detectSqlInjection(input)) {
    threats.push('SQL injection pattern detected')
  }

  if (detectNoSqlInjection(input)) {
    threats.push('NoSQL injection pattern detected')
  }

  if (detectLdapInjection(input)) {
    threats.push('LDAP injection pattern detected')
  }

  if (detectPrototypePollution(input)) {
    threats.push('Prototype pollution attempt detected')
  }

  if (detectPathTraversal(input)) {
    threats.push('Path traversal attempt detected')
  }

  return {
    valid: threats.length === 0,
    threats,
  }
}

/**
 * Validate request payload size to prevent DoS attacks
 */
export function validatePayloadSize(payload: string | Record<string, unknown>, maxSizeBytes = 1048576): boolean {
  const size = typeof payload === 'string'
    ? new Blob([payload]).size
    : new Blob([JSON.stringify(payload)]).size

  return size <= maxSizeBytes
}
