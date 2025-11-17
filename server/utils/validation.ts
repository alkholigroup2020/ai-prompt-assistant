/**
 * Input Validation and Sanitization Utilities
 * Validates and sanitizes user input to prevent XSS and ensure data integrity
 */

import type { FormInput } from '~/types/form';
import type { ValidationError } from '~/types/api';

/**
 * Validation rules
 */
const VALIDATION_RULES = {
  role: { min: 2, max: 100 },
  roleOther: { min: 2, max: 100 },
  audience: { min: 2, max: 100 },
  audienceOther: { min: 2, max: 100 },
  task: { min: 10, max: 1000 },
  examples: { min: 0, max: 3000 },
  context: { min: 0, max: 1500 },
  constraintsOther: { min: 0, max: 200 },
  outputFormatOther: { min: 0, max: 100 },
  constraints: { maxItems: 10 }
};

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove any HTML tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove javascript: and data: URLs
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Normalize whitespace but preserve newlines
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

/**
 * Validate string field length
 */
function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  const length = value.trim().length;

  if (length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  if (length > max) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${max} characters`
    };
  }

  return { valid: true };
}

/**
 * Validate required field
 */
function validateRequired(
  value: unknown,
  fieldName: string
): { valid: boolean; error?: string } {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      valid: false,
      error: `${fieldName} is required`
    };
  }

  return { valid: true };
}

/**
 * Validate array field
 */
function validateArray(
  value: unknown,
  fieldName: string,
  maxItems: number
): { valid: boolean; error?: string } {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      error: `${fieldName} must be an array`
    };
  }

  if (value.length > maxItems) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${maxItems} items`
    };
  }

  return { valid: true };
}

/**
 * Validate enum value
 */
function validateEnum(
  value: string,
  fieldName: string,
  allowedValues: string[]
): { valid: boolean; error?: string } {
  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Validate form input data
 */
export function validateFormInput(data: unknown): {
  valid: boolean;
  sanitized?: FormInput;
  error?: ValidationError;
} {
  const errors: { field: string; message: string }[] = [];

  // Type guard for data object
  const input = data as Record<string, unknown>;

  // Validate required fields
  const requiredChecks = [
    validateRequired(input.role, 'role'),
    validateRequired(input.audience, 'audience'),
    validateRequired(input.task, 'task'),
    validateRequired(input.tone, 'tone'),
    validateRequired(input.outputFormat, 'outputFormat'),
    validateRequired(input.enhancementLevel, 'enhancementLevel'),
    validateRequired(input.language, 'language')
  ];

  requiredChecks.forEach((check, index) => {
    if (!check.valid) {
      const fields = ['role', 'audience', 'task', 'tone', 'outputFormat', 'enhancementLevel', 'language'];
      const fieldName = fields[index];
      if (fieldName) {
        errors.push({ field: fieldName, message: check.error! });
      }
    }
  });

  // If required fields are missing, return early
  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Required fields are missing',
        fields: errors
      }
    };
  }

  // Validate and sanitize string fields
  const sanitized: Record<string, unknown> = {};

  // Role
  const roleValidation = validateLength(
    input.role as string,
    'role',
    VALIDATION_RULES.role.min,
    VALIDATION_RULES.role.max
  );
  if (!roleValidation.valid) {
    errors.push({ field: 'role', message: roleValidation.error! });
  } else {
    sanitized.role = sanitizeString(input.role as string);
  }

  // Role Other (if provided)
  if (input.roleOther) {
    const roleOtherValidation = validateLength(
      input.roleOther as string,
      'roleOther',
      VALIDATION_RULES.roleOther.min,
      VALIDATION_RULES.roleOther.max
    );
    if (!roleOtherValidation.valid) {
      errors.push({ field: 'roleOther', message: roleOtherValidation.error! });
    } else {
      sanitized.roleOther = sanitizeString(input.roleOther as string);
    }
  }

  // Audience
  const audienceValidation = validateLength(
    input.audience as string,
    'audience',
    VALIDATION_RULES.audience.min,
    VALIDATION_RULES.audience.max
  );
  if (!audienceValidation.valid) {
    errors.push({ field: 'audience', message: audienceValidation.error! });
  } else {
    sanitized.audience = sanitizeString(input.audience as string);
  }

  // Audience Other (if provided)
  if (input.audienceOther) {
    const audienceOtherValidation = validateLength(
      input.audienceOther as string,
      'audienceOther',
      VALIDATION_RULES.audienceOther.min,
      VALIDATION_RULES.audienceOther.max
    );
    if (!audienceOtherValidation.valid) {
      errors.push({ field: 'audienceOther', message: audienceOtherValidation.error! });
    } else {
      sanitized.audienceOther = sanitizeString(input.audienceOther as string);
    }
  }

  // Task
  const taskValidation = validateLength(
    input.task as string,
    'task',
    VALIDATION_RULES.task.min,
    VALIDATION_RULES.task.max
  );
  if (!taskValidation.valid) {
    errors.push({ field: 'task', message: taskValidation.error! });
  } else {
    sanitized.task = sanitizeString(input.task as string);
  }

  // Tone
  sanitized.tone = sanitizeString(input.tone as string);

  // Output Format
  sanitized.outputFormat = sanitizeString(input.outputFormat as string);

  // Output Format Other (if provided)
  if (input.outputFormatOther) {
    const outputFormatOtherValidation = validateLength(
      input.outputFormatOther as string,
      'outputFormatOther',
      VALIDATION_RULES.outputFormatOther.min,
      VALIDATION_RULES.outputFormatOther.max
    );
    if (!outputFormatOtherValidation.valid) {
      errors.push({ field: 'outputFormatOther', message: outputFormatOtherValidation.error! });
    } else {
      sanitized.outputFormatOther = sanitizeString(input.outputFormatOther as string);
    }
  }

  // Constraints
  const constraintsValidation = validateArray(
    input.constraints || [],
    'constraints',
    VALIDATION_RULES.constraints.maxItems
  );
  if (!constraintsValidation.valid) {
    errors.push({ field: 'constraints', message: constraintsValidation.error! });
  } else {
    sanitized.constraints = (input.constraints as string[] || []).map((c: string) => sanitizeString(c));
  }

  // Constraints Other (if provided)
  if (input.constraintsOther) {
    const constraintsOtherValidation = validateLength(
      input.constraintsOther as string,
      'constraintsOther',
      VALIDATION_RULES.constraintsOther.min,
      VALIDATION_RULES.constraintsOther.max
    );
    if (!constraintsOtherValidation.valid) {
      errors.push({ field: 'constraintsOther', message: constraintsOtherValidation.error! });
    } else {
      sanitized.constraintsOther = sanitizeString(input.constraintsOther as string);
    }
  }

  // Examples (optional)
  if (input.examples) {
    const examplesValidation = validateLength(
      input.examples as string,
      'examples',
      VALIDATION_RULES.examples.min,
      VALIDATION_RULES.examples.max
    );
    if (!examplesValidation.valid) {
      errors.push({ field: 'examples', message: examplesValidation.error! });
    } else {
      sanitized.examples = sanitizeString(input.examples as string);
    }
  }

  // Context (optional)
  if (input.context) {
    const contextValidation = validateLength(
      input.context as string,
      'context',
      VALIDATION_RULES.context.min,
      VALIDATION_RULES.context.max
    );
    if (!contextValidation.valid) {
      errors.push({ field: 'context', message: contextValidation.error! });
    } else {
      sanitized.context = sanitizeString(input.context as string);
    }
  }

  // Enhancement Level
  const enhancementLevelValidation = validateEnum(
    input.enhancementLevel as string,
    'enhancementLevel',
    ['quick', 'detailed']
  );
  if (!enhancementLevelValidation.valid) {
    errors.push({ field: 'enhancementLevel', message: enhancementLevelValidation.error! });
  } else {
    sanitized.enhancementLevel = input.enhancementLevel;
  }

  // Language
  const languageValidation = validateEnum(
    input.language as string,
    'language',
    ['en', 'ar']
  );
  if (!languageValidation.valid) {
    errors.push({ field: 'language', message: languageValidation.error! });
  } else {
    sanitized.language = input.language;
  }

  // Add metadata
  sanitized.timestamp = new Date();
  sanitized.sessionId = input.sessionId || 'anonymous';

  // Return validation result
  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields: errors
      }
    };
  }

  return {
    valid: true,
    sanitized: sanitized as unknown as FormInput
  };
}

/**
 * Validate prompt for analysis
 */
export function validatePromptAnalysis(data: unknown): {
  valid: boolean;
  sanitized?: string;
  error?: ValidationError;
} {
  const errors: { field: string; message: string }[] = [];
  const input = data as Record<string, unknown>;

  // Check if prompt exists
  const promptCheck = validateRequired(input.prompt, 'prompt');
  if (!promptCheck.valid) {
    errors.push({ field: 'prompt', message: promptCheck.error! });
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Prompt is required',
        fields: errors
      }
    };
  }

  // Validate length
  const lengthCheck = validateLength(input.prompt as string, 'prompt', 5, 5000);
  if (!lengthCheck.valid) {
    errors.push({ field: 'prompt', message: lengthCheck.error! });
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: lengthCheck.error!,
        fields: errors
      }
    };
  }

  return {
    valid: true,
    sanitized: sanitizeString(input.prompt as string)
  };
}

/**
 * Validate export request
 */
export function validateExportRequest(data: unknown): {
  valid: boolean;
  error?: ValidationError;
} {
  const errors: { field: string; message: string }[] = [];
  const input = data as Record<string, unknown>;

  // Check required fields
  const promptCheck = validateRequired(input.prompt, 'prompt');
  if (!promptCheck.valid) {
    errors.push({ field: 'prompt', message: promptCheck.error! });
  }

  const formatCheck = validateRequired(input.format, 'format');
  if (!formatCheck.valid) {
    errors.push({ field: 'format', message: formatCheck.error! });
  } else {
    const formatEnumCheck = validateEnum(
      input.format as string,
      'format',
      ['txt', 'md', 'json']
    );
    if (!formatEnumCheck.valid) {
      errors.push({ field: 'format', message: formatEnumCheck.error! });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid export request',
        fields: errors
      }
    };
  }

  return { valid: true };
}

/**
 * Create validation error response
 */
export function createValidationError(
  fields: { field: string; message: string }[]
): ValidationError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    fields
  };
}
