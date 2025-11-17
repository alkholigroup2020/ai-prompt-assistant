/**
 * Template Types
 * Type definitions for prompt templates
 */

/**
 * Template categories
 */
export enum TemplateCategory {
  BUSINESS = 'business',
  TECHNICAL = 'technical',
  CREATIVE = 'creative',
  ANALYSIS = 'analysis',
  COMMUNICATION = 'communication',
  RESEARCH = 'research',
  MARKETING = 'marketing',
  HR = 'hr',
  SALES = 'sales',
  CUSTOMER_SERVICE = 'customer_service'
}

/**
 * Template difficulty levels
 */
export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Template variable types
 */
export type TemplateVariableType = 'text' | 'select' | 'multiselect';

/**
 * Template variable definition
 */
export interface TemplateVariable {
  key: string;                  // e.g., "{{product_name}}"
  label: string;                // Display label
  type: TemplateVariableType;   // Input type
  required: boolean;            // Is this variable required?
  placeholder?: string;         // Placeholder text
  options?: string[];           // Options for select/multiselect
  maxLength?: number;           // Maximum character length
  description?: string;         // Help text for the variable
}

/**
 * Template example
 */
export interface TemplateExample {
  title: string;                // Example title
  description: string;          // What this example demonstrates
  input: Record<string, string>; // Variable values used
  output: string;               // Expected result
}

/**
 * Main prompt template interface
 */
export interface PromptTemplate {
  id: string;                           // Unique template ID
  category: TemplateCategory;           // Template category
  title: string;                        // Template title
  description: string;                  // Template description
  tags: string[];                       // Searchable tags
  difficulty: TemplateDifficulty;       // Difficulty level
  estimatedTime: string;                // e.g., "2 minutes"

  // Template Structure
  basePrompt: string;                   // Template with {{variables}}
  variables: TemplateVariable[];        // Variable definitions
  examples: TemplateExample[];          // Usage examples

  // Metadata
  usageCount: number;                   // How many times used
  rating: number;                       // 0-5 rating
  lastUpdated: Date;                    // Last update timestamp
  createdAt: Date;                      // Creation timestamp
  author?: string;                      // Template author
  version?: string;                     // Template version
}

/**
 * Template filter options
 */
export interface TemplateFilters {
  category?: TemplateCategory;
  difficulty?: TemplateDifficulty;
  tags?: string[];
  search?: string;
  sortBy?: 'popular' | 'recent' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Template pagination
 */
export interface TemplatePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Template list result
 */
export interface TemplateListResult {
  templates: PromptTemplate[];
  pagination: TemplatePagination;
  filters: TemplateFilters;
}

/**
 * Template usage statistics
 */
export interface TemplateStats {
  totalTemplates: number;
  byCategory: Record<TemplateCategory, number>;
  mostPopular: PromptTemplate[];
  recentlyAdded: PromptTemplate[];
}
