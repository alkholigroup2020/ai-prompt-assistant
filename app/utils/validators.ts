/**
 * Validation utilities for form inputs
 * Provides field-level validation with character limits and required checks
 */

import type { FormInput } from '~/types'

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Character limits for form fields
 */
export const CHAR_LIMITS = {
  ROLE_MIN: 2,
  ROLE_MAX: 100,
  AUDIENCE_MIN: 2,
  AUDIENCE_MAX: 100,
  TASK_MIN: 10,
  TASK_MAX: 1000,
  EXAMPLES_MAX: 3000,
  CONTEXT_MAX: 1500,
  OTHER_FIELD_MAX: 200,
} as const

/**
 * Validate role field
 * @param role - Role value to validate
 * @param roleOther - Custom role value if "other" selected
 * @returns Validation result
 */
export function validateRole(role: string, roleOther?: string): ValidationResult {
  if (!role || role.trim().length === 0) {
    return {
      valid: false,
      error: 'Role is required',
    }
  }

  const value = role === 'other' && roleOther ? roleOther : role

  if (value.length < CHAR_LIMITS.ROLE_MIN) {
    return {
      valid: false,
      error: `Role must be at least ${CHAR_LIMITS.ROLE_MIN} characters`,
    }
  }

  if (value.length > CHAR_LIMITS.ROLE_MAX) {
    return {
      valid: false,
      error: `Role must not exceed ${CHAR_LIMITS.ROLE_MAX} characters`,
    }
  }

  return { valid: true }
}

/**
 * Validate audience field
 * @param audience - Audience value to validate
 * @param audienceOther - Custom audience value if "other" selected
 * @returns Validation result
 */
export function validateAudience(audience: string, audienceOther?: string): ValidationResult {
  if (!audience || audience.trim().length === 0) {
    return {
      valid: false,
      error: 'Audience is required',
    }
  }

  const value = audience === 'other' && audienceOther ? audienceOther : audience

  if (value.length < CHAR_LIMITS.AUDIENCE_MIN) {
    return {
      valid: false,
      error: `Audience must be at least ${CHAR_LIMITS.AUDIENCE_MIN} characters`,
    }
  }

  if (value.length > CHAR_LIMITS.AUDIENCE_MAX) {
    return {
      valid: false,
      error: `Audience must not exceed ${CHAR_LIMITS.AUDIENCE_MAX} characters`,
    }
  }

  return { valid: true }
}

/**
 * Validate task field
 * @param task - Task description to validate
 * @returns Validation result
 */
export function validateTask(task: string): ValidationResult {
  if (!task || task.trim().length === 0) {
    return {
      valid: false,
      error: 'Task description is required',
    }
  }

  const trimmedLength = task.trim().length

  if (trimmedLength < CHAR_LIMITS.TASK_MIN) {
    return {
      valid: false,
      error: `Task must be at least ${CHAR_LIMITS.TASK_MIN} characters. Current: ${trimmedLength}`,
    }
  }

  if (trimmedLength > CHAR_LIMITS.TASK_MAX) {
    return {
      valid: false,
      error: `Task must not exceed ${CHAR_LIMITS.TASK_MAX} characters. Current: ${trimmedLength}`,
    }
  }

  return { valid: true }
}

/**
 * Validate examples field (optional)
 * @param examples - Examples text to validate
 * @returns Validation result
 */
export function validateExamples(examples?: string): ValidationResult {
  if (!examples || examples.trim().length === 0) {
    return { valid: true } // Optional field
  }

  if (examples.length > CHAR_LIMITS.EXAMPLES_MAX) {
    return {
      valid: false,
      error: `Examples must not exceed ${CHAR_LIMITS.EXAMPLES_MAX} characters. Current: ${examples.length}`,
    }
  }

  return { valid: true }
}

/**
 * Validate context field (optional)
 * @param context - Context text to validate
 * @returns Validation result
 */
export function validateContext(context?: string): ValidationResult {
  if (!context || context.trim().length === 0) {
    return { valid: true } // Optional field
  }

  if (context.length > CHAR_LIMITS.CONTEXT_MAX) {
    return {
      valid: false,
      error: `Context must not exceed ${CHAR_LIMITS.CONTEXT_MAX} characters. Current: ${context.length}`,
    }
  }

  return { valid: true }
}

/**
 * Validate other/custom field (for output format, constraints, etc.)
 * @param value - Custom value to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 */
export function validateOtherField(value?: string, fieldName = 'Field'): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: true } // Optional field
  }

  if (value.length > CHAR_LIMITS.OTHER_FIELD_MAX) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${CHAR_LIMITS.OTHER_FIELD_MAX} characters. Current: ${value.length}`,
    }
  }

  return { valid: true }
}

/**
 * Validate character limit for any field
 * @param value - Value to validate
 * @param min - Minimum character limit
 * @param max - Maximum character limit
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 */
export function validateCharLimit(
  value: string,
  min: number,
  max: number,
  fieldName = 'Field'
): ValidationResult {
  const length = value.trim().length

  if (length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters. Current: ${length}`,
    }
  }

  if (length > max) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${max} characters. Current: ${length}`,
    }
  }

  return { valid: true }
}

/**
 * Validate entire form input
 * @param formData - Form data to validate
 * @returns Object with validation result and errors by field
 */
export function validateFormInput(formData: Partial<FormInput>): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validate role
  const roleResult = validateRole(formData.role || '', formData.roleOther)
  if (!roleResult.valid && roleResult.error) {
    errors.role = roleResult.error
  }

  // Validate audience
  const audienceResult = validateAudience(formData.audience || '', formData.audienceOther)
  if (!audienceResult.valid && audienceResult.error) {
    errors.audience = audienceResult.error
  }

  // Validate task
  const taskResult = validateTask(formData.task || '')
  if (!taskResult.valid && taskResult.error) {
    errors.task = taskResult.error
  }

  // Validate examples (optional)
  const examplesResult = validateExamples(formData.examples)
  if (!examplesResult.valid && examplesResult.error) {
    errors.examples = examplesResult.error
  }

  // Validate context (optional)
  const contextResult = validateContext(formData.context)
  if (!contextResult.valid && contextResult.error) {
    errors.context = contextResult.error
  }

  // Validate other fields
  if (formData.outputFormatOther) {
    const otherFormatResult = validateOtherField(formData.outputFormatOther, 'Output format')
    if (!otherFormatResult.valid && otherFormatResult.error) {
      errors.outputFormatOther = otherFormatResult.error
    }
  }

  if (formData.constraintsOther) {
    const otherConstraintsResult = validateOtherField(formData.constraintsOther, 'Constraints')
    if (!otherConstraintsResult.valid && otherConstraintsResult.error) {
      errors.constraintsOther = otherConstraintsResult.error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Check if a value is within character limit
 * @param value - Value to check
 * @param max - Maximum character limit
 * @returns True if within limit
 */
export function isWithinLimit(value: string, max: number): boolean {
  return value.length <= max
}

/**
 * Get remaining characters for a field
 * @param value - Current value
 * @param max - Maximum character limit
 * @returns Number of remaining characters
 */
export function getRemainingChars(value: string, max: number): number {
  return Math.max(0, max - value.length)
}

/**
 * Get character count percentage
 * @param value - Current value
 * @param max - Maximum character limit
 * @returns Percentage (0-100)
 */
export function getCharPercentage(value: string, max: number): number {
  return Math.min(100, Math.round((value.length / max) * 100))
}
