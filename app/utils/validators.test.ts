/**
 * Unit tests for validation utilities
 */

import { describe, it, expect } from 'vitest'
import {
  validateRole,
  validateAudience,
  validateTask,
  validateExamples,
  validateContext,
  validateOtherField,
  validateCharLimit,
  validateFormInput,
  isWithinLimit,
  getRemainingChars,
  getCharPercentage,
  CHAR_LIMITS,
} from './validators'

describe('validators', () => {
  describe('validateRole', () => {
    it('should return error for empty role', () => {
      const result = validateRole('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Role is required')
    })

    it('should return error for whitespace-only role', () => {
      const result = validateRole('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Role is required')
    })

    it('should return error for role too short', () => {
      const result = validateRole('A')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
    })

    it('should return error for role too long', () => {
      const longRole = 'A'.repeat(CHAR_LIMITS.ROLE_MAX + 1)
      const result = validateRole(longRole)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must not exceed')
    })

    it('should validate correct role', () => {
      const result = validateRole('Software Engineer')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate "other" role with roleOther', () => {
      const result = validateRole('other', 'Custom Role Name')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error for "other" role with short roleOther', () => {
      const result = validateRole('other', 'A')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
    })
  })

  describe('validateAudience', () => {
    it('should return error for empty audience', () => {
      const result = validateAudience('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Audience is required')
    })

    it('should return error for audience too short', () => {
      const result = validateAudience('A')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
    })

    it('should return error for audience too long', () => {
      const longAudience = 'A'.repeat(CHAR_LIMITS.AUDIENCE_MAX + 1)
      const result = validateAudience(longAudience)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must not exceed')
    })

    it('should validate correct audience', () => {
      const result = validateAudience('Business executives')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate "other" audience with audienceOther', () => {
      const result = validateAudience('other', 'Custom Audience')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateTask', () => {
    it('should return error for empty task', () => {
      const result = validateTask('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Task description is required')
    })

    it('should return error for task too short', () => {
      const result = validateTask('Short')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
      expect(result.error).toContain('Current:')
    })

    it('should return error for task too long', () => {
      const longTask = 'A'.repeat(CHAR_LIMITS.TASK_MAX + 1)
      const result = validateTask(longTask)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must not exceed')
      expect(result.error).toContain('Current:')
    })

    it('should validate correct task', () => {
      const result = validateTask('Write a comprehensive project proposal with budget and timeline')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should trim whitespace when counting characters', () => {
      const task = '   Short   '
      const result = validateTask(task)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
    })
  })

  describe('validateExamples', () => {
    it('should accept empty examples (optional field)', () => {
      const result = validateExamples('')
      expect(result.valid).toBe(true)
    })

    it('should accept undefined examples', () => {
      const result = validateExamples(undefined)
      expect(result.valid).toBe(true)
    })

    it('should return error for examples too long', () => {
      const longExamples = 'A'.repeat(CHAR_LIMITS.EXAMPLES_MAX + 1)
      const result = validateExamples(longExamples)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must not exceed')
      expect(result.error).toContain('Current:')
    })

    it('should validate correct examples', () => {
      const result = validateExamples('Example 1: ...\nExample 2: ...')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateContext', () => {
    it('should accept empty context (optional field)', () => {
      const result = validateContext('')
      expect(result.valid).toBe(true)
    })

    it('should accept undefined context', () => {
      const result = validateContext(undefined)
      expect(result.valid).toBe(true)
    })

    it('should return error for context too long', () => {
      const longContext = 'A'.repeat(CHAR_LIMITS.CONTEXT_MAX + 1)
      const result = validateContext(longContext)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must not exceed')
      expect(result.error).toContain('Current:')
    })

    it('should validate correct context', () => {
      const result = validateContext('This is for internal team communication')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('validateOtherField', () => {
    it('should accept empty other field (optional)', () => {
      const result = validateOtherField('')
      expect(result.valid).toBe(true)
    })

    it('should accept undefined other field', () => {
      const result = validateOtherField(undefined)
      expect(result.valid).toBe(true)
    })

    it('should return error for other field too long', () => {
      const longValue = 'A'.repeat(CHAR_LIMITS.OTHER_FIELD_MAX + 1)
      const result = validateOtherField(longValue, 'Custom Field')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Custom Field')
      expect(result.error).toContain('must not exceed')
    })

    it('should validate correct other field', () => {
      const result = validateOtherField('Custom format specification')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should use default field name when not provided', () => {
      const longValue = 'A'.repeat(CHAR_LIMITS.OTHER_FIELD_MAX + 1)
      const result = validateOtherField(longValue)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Field')
    })
  })

  describe('validateCharLimit', () => {
    it('should return error for value too short', () => {
      const result = validateCharLimit('Hi', 5, 100, 'Message')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Message')
      expect(result.error).toContain('at least 5')
    })

    it('should return error for value too long', () => {
      const result = validateCharLimit('Hello World', 1, 5, 'Message')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Message')
      expect(result.error).toContain('must not exceed 5')
    })

    it('should validate value within limits', () => {
      const result = validateCharLimit('Hello', 3, 10, 'Message')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should trim whitespace when counting', () => {
      const result = validateCharLimit('  Hi  ', 5, 100, 'Message')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least 5')
    })

    it('should use default field name when not provided', () => {
      const result = validateCharLimit('Hi', 5, 100)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Field')
    })
  })

  describe('validateFormInput', () => {
    it('should return errors for empty form', () => {
      const result = validateFormInput({})
      expect(result.valid).toBe(false)
      expect(result.errors.role).toBeDefined()
      expect(result.errors.audience).toBeDefined()
      expect(result.errors.task).toBeDefined()
    })

    it('should validate complete valid form', () => {
      const result = validateFormInput({
        role: 'Software Engineer',
        audience: 'Technical team',
        task: 'Write a detailed technical specification for the new API endpoints',
      })
      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should return specific field errors', () => {
      const result = validateFormInput({
        role: 'Engineer',
        audience: 'Team',
        task: 'Short',
      })
      expect(result.valid).toBe(false)
      expect(result.errors.task).toBeDefined()
      expect(result.errors.task).toContain('at least')
    })

    it('should validate examples and context', () => {
      const result = validateFormInput({
        role: 'Developer',
        audience: 'Engineers',
        task: 'Create a new feature specification with requirements',
        examples: 'Example 1: User login flow\nExample 2: Password reset',
        context: 'This is for the mobile app redesign project',
      })
      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should return errors for invalid examples and context', () => {
      const longExamples = 'A'.repeat(CHAR_LIMITS.EXAMPLES_MAX + 1)
      const longContext = 'A'.repeat(CHAR_LIMITS.CONTEXT_MAX + 1)

      const result = validateFormInput({
        role: 'Developer',
        audience: 'Engineers',
        task: 'Create a specification document with detailed requirements',
        examples: longExamples,
        context: longContext,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.examples).toBeDefined()
      expect(result.errors.context).toBeDefined()
    })

    it('should validate other fields', () => {
      const result = validateFormInput({
        role: 'Developer',
        audience: 'Engineers',
        task: 'Create a new feature specification with requirements',
        outputFormatOther: 'Custom XML format with nested elements',
        constraintsOther: 'Must be under 500 words and use simple language',
      })
      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should return errors for invalid other fields', () => {
      const longOther = 'A'.repeat(CHAR_LIMITS.OTHER_FIELD_MAX + 1)

      const result = validateFormInput({
        role: 'Developer',
        audience: 'Engineers',
        task: 'Create a new feature specification with requirements',
        outputFormatOther: longOther,
        constraintsOther: longOther,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.outputFormatOther).toBeDefined()
      expect(result.errors.constraintsOther).toBeDefined()
    })
  })

  describe('isWithinLimit', () => {
    it('should return true for value within limit', () => {
      expect(isWithinLimit('Hello', 10)).toBe(true)
    })

    it('should return true for value at limit', () => {
      expect(isWithinLimit('Hello', 5)).toBe(true)
    })

    it('should return false for value over limit', () => {
      expect(isWithinLimit('Hello World', 10)).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isWithinLimit('', 10)).toBe(true)
    })
  })

  describe('getRemainingChars', () => {
    it('should return correct remaining characters', () => {
      expect(getRemainingChars('Hello', 10)).toBe(5)
    })

    it('should return 0 for value at limit', () => {
      expect(getRemainingChars('Hello', 5)).toBe(0)
    })

    it('should return 0 for value over limit', () => {
      expect(getRemainingChars('Hello World', 10)).toBe(0)
    })

    it('should return max for empty string', () => {
      expect(getRemainingChars('', 100)).toBe(100)
    })
  })

  describe('getCharPercentage', () => {
    it('should return correct percentage', () => {
      expect(getCharPercentage('Hello', 10)).toBe(50)
    })

    it('should return 0 for empty string', () => {
      expect(getCharPercentage('', 10)).toBe(0)
    })

    it('should return 100 for value at limit', () => {
      expect(getCharPercentage('Hello', 5)).toBe(100)
    })

    it('should cap at 100 for value over limit', () => {
      expect(getCharPercentage('Hello World', 10)).toBe(100)
    })

    it('should round percentage', () => {
      expect(getCharPercentage('Hi', 7)).toBe(29) // 28.57 rounds to 29
    })
  })

  describe('CHAR_LIMITS', () => {
    it('should have all required limits defined', () => {
      expect(CHAR_LIMITS.ROLE_MIN).toBe(2)
      expect(CHAR_LIMITS.ROLE_MAX).toBe(100)
      expect(CHAR_LIMITS.AUDIENCE_MIN).toBe(2)
      expect(CHAR_LIMITS.AUDIENCE_MAX).toBe(100)
      expect(CHAR_LIMITS.TASK_MIN).toBe(10)
      expect(CHAR_LIMITS.TASK_MAX).toBe(1000)
      expect(CHAR_LIMITS.EXAMPLES_MAX).toBe(3000)
      expect(CHAR_LIMITS.CONTEXT_MAX).toBe(1500)
      expect(CHAR_LIMITS.OTHER_FIELD_MAX).toBe(200)
    })

    it('should be readonly at TypeScript level', () => {
      // TypeScript enforces readonly at compile time
      // We just verify the values are correct
      expect(typeof CHAR_LIMITS.ROLE_MAX).toBe('number')
      expect(CHAR_LIMITS.ROLE_MAX).toBeGreaterThan(0)
    })
  })
})
