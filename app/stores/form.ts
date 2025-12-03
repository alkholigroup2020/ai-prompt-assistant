/**
 * Form Store
 * Manages the prompt builder form state, validation, and actions
 */

import { defineStore } from 'pinia';
import type { FormInput, Language, EnhancementLevel, Constraint } from '~/types/form';

/**
 * Validation error structure
 */
export interface ValidationErrors {
  role?: string;
  audience?: string;
  task?: string;
  tone?: string;
  outputFormat?: string;
  constraints?: string;
  examples?: string;
  context?: string;
}

/**
 * Form state interface
 */
interface FormState {
  formInput: FormInput;
  validationErrors: ValidationErrors;
  isDirty: boolean;
}

/**
 * Generate initial form state
 */
function createInitialFormInput(): FormInput {
  return {
    // Core fields
    role: '',
    audience: '',
    task: '',

    // Enhancement options (start empty for clean reset)
    tone: undefined,
    outputFormat: undefined,

    // Advanced options
    constraints: [],
    examples: undefined,
    context: undefined,

    // Enhancement settings
    enhancementLevel: 'quick' as EnhancementLevel,
    language: 'en' as Language,

    // Metadata
    timestamp: new Date(),
    sessionId: crypto.randomUUID()
  };
}

/**
 * Form store
 */
export const useFormStore = defineStore('form', {
  /**
   * State
   */
  state: (): FormState => ({
    formInput: createInitialFormInput(),
    validationErrors: {},
    isDirty: false
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Check if form is valid
     */
    isValid(): boolean {
      return Object.keys(this.validationErrors).length === 0;
    },

    /**
     * Check if form is complete (all required fields filled)
     */
    isComplete(): boolean {
      return !!(
        this.formInput.role &&
        this.formInput.audience &&
        this.formInput.task &&
        this.formInput.task.length >= 10
      );
    },

    /**
     * Get current form data (for submission)
     */
    formData(): FormInput {
      return {
        ...this.formInput,
        timestamp: new Date()
      };
    },

    /**
     * Check if specific field has error
     */
    hasError: (state) => (fieldName: keyof ValidationErrors): boolean => {
      return !!state.validationErrors[fieldName];
    },

    /**
     * Get error message for specific field
     */
    getError: (state) => (fieldName: keyof ValidationErrors): string | undefined => {
      return state.validationErrors[fieldName];
    },

    /**
     * Calculate form completion percentage
     */
    completionPercentage(): number {
      const requiredFields = ['role', 'audience', 'task'];
      const optionalFields = ['examples', 'context'];

      let completed = 0;
      let total = requiredFields.length;

      // Check required fields
      requiredFields.forEach((field) => {
        if (this.formInput[field as keyof FormInput]) {
          completed++;
        }
      });

      // Check optional fields (count as 0.5 each)
      optionalFields.forEach((field) => {
        if (this.formInput[field as keyof FormInput]) {
          completed += 0.5;
        }
      });
      total += optionalFields.length * 0.5;

      // Check if constraints selected
      if (this.formInput.constraints.length > 0) {
        completed += 0.5;
      }
      total += 0.5;

      return Math.round((completed / total) * 100);
    }
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Update a single form field
     */
    updateField<K extends keyof FormInput>(field: K, value: FormInput[K]): void {
      this.formInput[field] = value;
      this.isDirty = true;

      // Clear error for this field
      if (field in this.validationErrors) {
        const errors = { ...this.validationErrors };
        const errorKey = field as keyof ValidationErrors;
        if (errorKey in errors) {
          const { [errorKey]: _, ...rest } = errors;
          this.validationErrors = rest as ValidationErrors;
        }
      }
    },

    /**
     * Update multiple fields at once
     */
    updateFields(fields: Partial<FormInput>): void {
      Object.keys(fields).forEach((key) => {
        const field = key as keyof FormInput;
        if (fields[field] !== undefined) {
          this.formInput[field] = fields[field] as never;
        }
      });
      this.isDirty = true;
    },

    /**
     * Set entire form (e.g., from template or saved draft)
     */
    setForm(formInput: Partial<FormInput>): void {
      this.formInput = {
        ...createInitialFormInput(),
        ...formInput,
        timestamp: new Date(),
        sessionId: this.formInput.sessionId // Keep existing session ID
      };
      this.isDirty = true;
      this.validateForm();
    },

    /**
     * Validate entire form
     */
    validateForm(): boolean {
      const errors: ValidationErrors = {};

      // Validate role
      if (!this.formInput.role || this.formInput.role.trim().length === 0) {
        errors.role = 'Role is required';
      } else if (this.formInput.role.length > 100) {
        errors.role = 'Role must be less than 100 characters';
      }

      // Validate audience
      if (!this.formInput.audience || this.formInput.audience.trim().length === 0) {
        errors.audience = 'Audience is required';
      } else if (this.formInput.audience.length > 100) {
        errors.audience = 'Audience must be less than 100 characters';
      }

      // Validate task
      if (!this.formInput.task || this.formInput.task.trim().length === 0) {
        errors.task = 'Task description is required';
      } else if (this.formInput.task.length < 10) {
        errors.task = 'Task must be at least 10 characters';
      } else if (this.formInput.task.length > 1000) {
        errors.task = 'Task must be less than 1000 characters';
      }

      // Validate examples (optional but has limit)
      if (this.formInput.examples && this.formInput.examples.length > 3000) {
        errors.examples = 'Examples must be less than 3000 characters';
      }

      // Validate context (optional but has limit)
      if (this.formInput.context && this.formInput.context.length > 1500) {
        errors.context = 'Context must be less than 1500 characters';
      }

      this.validationErrors = errors;
      return Object.keys(errors).length === 0;
    },

    /**
     * Validate single field
     */
    validateField(field: keyof FormInput): boolean {
      const errors: ValidationErrors = {};

      switch (field) {
        case 'role':
          if (!this.formInput.role || this.formInput.role.trim().length === 0) {
            errors.role = 'Role is required';
          } else if (this.formInput.role.length > 100) {
            errors.role = 'Role must be less than 100 characters';
          }
          break;

        case 'audience':
          if (!this.formInput.audience || this.formInput.audience.trim().length === 0) {
            errors.audience = 'Audience is required';
          } else if (this.formInput.audience.length > 100) {
            errors.audience = 'Audience must be less than 100 characters';
          }
          break;

        case 'task':
          if (!this.formInput.task || this.formInput.task.trim().length === 0) {
            errors.task = 'Task description is required';
          } else if (this.formInput.task.length < 10) {
            errors.task = 'Task must be at least 10 characters';
          } else if (this.formInput.task.length > 1000) {
            errors.task = 'Task must be less than 1000 characters';
          }
          break;

        case 'examples':
          if (this.formInput.examples && this.formInput.examples.length > 3000) {
            errors.examples = 'Examples must be less than 3000 characters';
          }
          break;

        case 'context':
          if (this.formInput.context && this.formInput.context.length > 1500) {
            errors.context = 'Context must be less than 1500 characters';
          }
          break;
      }

      // Update validation errors
      const errorKey = field as keyof ValidationErrors;
      if (errors[errorKey]) {
        this.validationErrors[errorKey] = errors[errorKey];
      } else if (errorKey in this.validationErrors) {
        const newErrors = { ...this.validationErrors };
        const { [errorKey]: _, ...rest } = newErrors;
        this.validationErrors = rest as ValidationErrors;
      }

      return !errors[field as keyof ValidationErrors];
    },

    /**
     * Reset form to initial state
     */
    resetForm(): void {
      this.formInput = createInitialFormInput();
      this.validationErrors = {};
      this.isDirty = false;
    },

    /**
     * Clear validation errors
     */
    clearValidationErrors(): void {
      this.validationErrors = {};
    },

    /**
     * Add a constraint
     */
    addConstraint(constraint: Constraint): void {
      if (!this.formInput.constraints.includes(constraint)) {
        this.formInput.constraints.push(constraint);
        this.isDirty = true;
      }
    },

    /**
     * Remove a constraint
     */
    removeConstraint(constraint: Constraint): void {
      const index = this.formInput.constraints.indexOf(constraint);
      if (index > -1) {
        this.formInput.constraints.splice(index, 1);
        this.isDirty = true;
      }
    },

    /**
     * Toggle a constraint
     */
    toggleConstraint(constraint: Constraint): void {
      if (this.formInput.constraints.includes(constraint)) {
        this.removeConstraint(constraint);
      } else {
        this.addConstraint(constraint);
      }
    },

    /**
     * Mark form as clean (after save)
     */
    markClean(): void {
      this.isDirty = false;
    }
  }
});
