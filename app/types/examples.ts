/**
 * Example Prompts Type Definitions
 * Supports dynamic examples based on role-audience combinations
 */

/**
 * Valid role IDs (excludes 'other' which hides examples)
 * Must match values in RoleSelector.vue
 */
export type RoleId =
  | 'hr-specialist'
  | 'expert-accountant'
  | 'data-analyst'
  | 'marketing-specialist'
  | 'procurement-specialist'
  | 'business-analyst'
  | 'content-writer'
  | 'project-manager'
  | 'business-development-specialist'

/**
 * Valid audience IDs (excludes 'other' which hides examples)
 * Must match values in AudienceSelector.vue
 */
export type AudienceId =
  | 'technical-team'
  | 'executives'
  | 'clients'
  | 'general-public'
  | 'students'
  | 'experts'
  | 'beginners'
  | 'stakeholders'
  | 'team-members'

/**
 * Single example prompt structure
 */
export interface ExamplePrompt {
  /** Unique identifier: role.audience.index (e.g., "software-engineer.technical-team.0") */
  id: string
  /** Translation key for the example text (e.g., "examples.software-engineer.technical-team.0") */
  translationKey: string
  /** Heroicon identifier for visual display */
  icon: string
}

/**
 * Examples organized by role-audience combination
 * Structure: matrix[roleId][audienceId] = ExamplePrompt[]
 */
export type ExamplesMatrix = {
  [role in RoleId]: {
    [audience in AudienceId]: ExamplePrompt[]
  }
}

/**
 * Example item for UI display (with translated label)
 */
export interface ExampleItem {
  /** Unique identifier */
  id: string
  /** Translated label text */
  label: string
  /** Value for selection (same as id) */
  value: string
  /** Heroicon identifier */
  icon: string
}
