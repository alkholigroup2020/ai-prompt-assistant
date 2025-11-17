/**
 * Central export file for all TypeScript types and interfaces
 * Import types from this file throughout the application
 *
 * @example
 * import type { FormInput, ToneOption, EnhancementResponse } from '~/types';
 */

// Form Types
export * from './form';
export type {
  FormInput,
  EnhancementLevel,
  Language
} from './form';
export {
  ToneOption,
  OutputFormat,
  Constraint
} from './form';

// API Types
export * from './api';
export type {
  QualityScore,
  QualityScoreBreakdown,
  AlternativeVersions,
  APIMetadata,
  APIError,
  EnhancementData,
  EnhancementResponse,
  TemplateListResponse,
  TemplateDetailResponse,
  AnalysisResponse,
  ExportResponse,
  HealthResponse,
  RateLimitError,
  ValidationError
} from './api';

// Template Types
export * from './template';
export type {
  TemplateDifficulty,
  TemplateVariableType,
  TemplateVariable,
  TemplateExample,
  PromptTemplate,
  TemplateFilters,
  TemplatePagination,
  TemplateListResult,
  TemplateStats
} from './template';
export {
  TemplateCategory
} from './template';

// Storage Types
export * from './storage';
export type {
  Theme,
  UserPreferences,
  PromptHistory,
  UserStats,
  DraftData,
  LocalData,
  ExportFormat,
  ExportData
} from './storage';
export {
  StorageKey,
  DEFAULT_PREFERENCES,
  DEFAULT_STATS
} from './storage';
