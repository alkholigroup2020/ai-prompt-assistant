/**
 * Security Testing Suite
 * Tests input validation and sanitization against malicious inputs
 */

import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  validateSecurity,
  escapeHtml,
  removeNullBytes,
  normalizeUnicode,
  removeControlCharacters,
  detectSqlInjection,
  detectNoSqlInjection,
  detectLdapInjection,
  detectPrototypePollution,
  detectPathTraversal,
} from '../security'

describe('Security Utilities', () => {
  describe('XSS Prevention', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("XSS")</script>Hello'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
      expect(result).toBe('Hello')
    })

    it('should remove iframe tags', () => {
      const malicious = '<iframe src="evil.com"></iframe>Content'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('<iframe>')
      expect(result).toBe('Content')
    })

    it('should remove img tags', () => {
      const malicious = '<img src=x onerror="alert(1)">Text'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('<img')
      expect(result).not.toContain('onerror')
      expect(result).toBe('Text')
    })

    it('should remove javascript: URLs', () => {
      const malicious = 'Click <a href="javascript:alert(1)">here</a>'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('javascript:')
    })

    it('should remove data: URLs', () => {
      const malicious = '<a href="data:text/html,<script>alert(1)</script>">Click</a>'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('data:text/html')
    })

    it('should remove event handlers', () => {
      const malicious = '<div onclick="alert(1)">Click me</div>'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('onclick=')
    })

    it('should remove form tags', () => {
      const malicious = '<form action="evil.com"><input type="text"></form>'
      const result = sanitizeInput(malicious)
      expect(result).not.toContain('<form')
      expect(result).not.toContain('<input')
    })

    it('should escape HTML entities when option is enabled', () => {
      const text = '<div>Hello & "World"</div>'
      const result = sanitizeInput(text, { escapeHtml: true })
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
      expect(result).toContain('&amp;')
      expect(result).toContain('&quot;')
    })
  })

  describe('Injection Attack Prevention', () => {
    it('should detect SQL injection patterns', () => {
      const attacks = [
        "'; DROP TABLE users--",
        "admin' --",
        'UNION SELECT * FROM passwords',
        '1; DELETE FROM users',
        'SELECT * FROM users',
        "1' OR '1'='1",
      ]

      attacks.forEach((attack) => {
        const result = detectSqlInjection(attack)
        expect(result).toBe(true)
      })
    })

    it('should not flag safe text with common words', () => {
      // Note: Simple phrases like "1 OR 1=1" might be legitimate content
      // The validation is primarily for obvious SQL keywords in suspicious contexts
      const safe = 'Create a professional email'
      expect(detectSqlInjection(safe)).toBe(false)
    })

    it('should detect NoSQL injection patterns', () => {
      const attacks = [
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"username": {"$ne": null}}',
        '$where: "1==1"',
        '{"$regex": ".*"}',
      ]

      attacks.forEach((attack) => {
        const result = detectNoSqlInjection(attack)
        expect(result).toBe(true)
      })
    })

    it('should detect LDAP injection patterns', () => {
      const attacks = [
        '*)(',
        '(|(uid=*))',
        '*)(uid=*))',
        '(uid=*)',
      ]

      attacks.forEach((attack) => {
        const result = detectLdapInjection(attack)
        expect(result).toBe(true)
      })
    })

    it('should detect prototype pollution attempts', () => {
      const attacks = [
        '__proto__',
        'constructor[prototype]',
        '{"__proto__": {"isAdmin": true}}',
        'prototype[isAdmin]',
      ]

      attacks.forEach((attack) => {
        const result = detectPrototypePollution(attack)
        expect(result).toBe(true)
      })
    })

    it('should detect path traversal attempts', () => {
      const attacks = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32',
        '%2e%2e%2f',
        '..%2f',
      ]

      attacks.forEach((attack) => {
        const result = detectPathTraversal(attack)
        expect(result).toBe(true)
      })
    })
  })

  describe('HTML Entity Escaping', () => {
    it('should escape ampersands', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B')
    })

    it('should escape less than and greater than', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;')
    })

    it('should escape quotes', () => {
      expect(escapeHtml('"Hello"')).toBe('&quot;Hello&quot;')
      expect(escapeHtml("'World'")).toBe('&#x27;World&#x27;')
    })

    it('should escape forward slashes', () => {
      expect(escapeHtml('a/b')).toBe('a&#x2F;b')
    })
  })

  describe('Null Byte Injection Prevention', () => {
    it('should remove null bytes', () => {
      const malicious = 'file.txt\0.jpg'
      const result = removeNullBytes(malicious)
      expect(result).toBe('file.txt.jpg')
      expect(result).not.toContain('\0')
    })
  })

  describe('Control Character Removal', () => {
    it('should remove control characters', () => {
      const text = 'Hello\x00\x01\x02World'
      const result = removeControlCharacters(text)
      expect(result).toBe('HelloWorld')
    })

    it('should preserve newlines and tabs when specified', () => {
      const text = 'Hello\nWorld\tTest'
      const result = removeControlCharacters(text)
      expect(result).toContain('\n')
      expect(result).toContain('\t')
    })
  })

  describe('Unicode Normalization', () => {
    it('should normalize Unicode characters', () => {
      const text = 'café' // Using combining characters
      const result = normalizeUnicode(text)
      expect(result).toBe('café')
    })
  })

  describe('Comprehensive Security Validation', () => {
    it('should pass validation for safe input', () => {
      const safe = 'Write a detailed guide on how to improve customer service'
      const result = validateSecurity(safe)
      expect(result.valid).toBe(true)
      expect(result.threats).toHaveLength(0)
    })

    it('should fail validation for SQL injection', () => {
      const malicious = "'; DROP TABLE users--"
      const result = validateSecurity(malicious)
      expect(result.valid).toBe(false)
      expect(result.threats.length).toBeGreaterThan(0)
      expect(result.threats.some((t) => t.includes('SQL'))).toBe(true)
    })

    it('should fail validation for XSS attempt via prototype pollution', () => {
      const malicious = '__proto__.isAdmin = true'
      const result = validateSecurity(malicious)
      expect(result.valid).toBe(false)
      expect(result.threats.some((t) => t.includes('Prototype'))).toBe(true)
    })

    it('should fail validation for path traversal', () => {
      const malicious = '../../etc/passwd'
      const result = validateSecurity(malicious)
      expect(result.valid).toBe(false)
      expect(result.threats.some((t) => t.includes('Path traversal'))).toBe(true)
    })
  })

  describe('Complete Sanitization', () => {
    it('should sanitize complex malicious input removing XSS vectors', () => {
      const malicious = `
        <script>alert('XSS')</script>
        <img src=x onerror="alert(1)">
        javascript:void(0)
      `
      const result = sanitizeInput(malicious)

      expect(result).not.toContain('<script>')
      expect(result).not.toContain('<img')
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('onerror')
      // Note: Text content like SQL is not removed, only detected by validateSecurity()
    })

    it('should preserve safe content while removing dangerous HTML parts', () => {
      const mixed = 'Hello <script>alert(1)</script> World'
      const result = sanitizeInput(mixed)
      // Whitespace is normalized, so double space becomes single space
      expect(result).toBe('Hello World')
      expect(result).not.toContain('<script>')
    })

    it('should handle empty and non-string inputs', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(123 as unknown as string)).toBe('')
      expect(sanitizeInput(null as unknown as string)).toBe('')
      expect(sanitizeInput(undefined as unknown as string)).toBe('')
    })

    it('should respect maxLength option', () => {
      const long = 'A'.repeat(1000)
      const result = sanitizeInput(long, { maxLength: 100 })
      expect(result.length).toBe(100)
    })

    it('should preserve newlines when allowNewlines is true', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const result = sanitizeInput(text, { allowNewlines: true })
      expect(result).toContain('\n')
      expect(result.split('\n')).toHaveLength(3)
    })

    it('should remove newlines when allowNewlines is false', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const result = sanitizeInput(text, { allowNewlines: false })
      expect(result).not.toContain('\n')
    })
  })
})
