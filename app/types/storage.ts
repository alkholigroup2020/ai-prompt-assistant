/**
 * Local Storage Types
 * Type definitions for browser local storage data
 */

import type { FormInput, Language } from './form';
import { ToneOption, OutputFormat } from './form';
import type { EnhancementResponse } from './api';

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * User preferences
 */
export interface UserPreferences {
  language: Language;               // Preferred language
  theme: Theme;                     // Theme preference
  defaultTone: ToneOption;          // Default tone selection
  defaultFormat: OutputFormat;      // Default output format
  tooltipsEnabled: boolean;         // Show/hide tooltips
  autoSaveEnabled: boolean;         // Enable auto-save
  autoSaveInterval: number;         // Auto-save interval in seconds
}

/**
 * Prompt history item
 */
export interface PromptHistory {
  id: string;                       // Unique ID
  timestamp: Date;                  // When it was created
  input: FormInput;                 // Original form input
  output: EnhancementResponse;      // Enhancement result
  starred: boolean;                 // User marked as favorite
  title?: string;                   // Optional custom title
  tags?: string[];                  // Optional tags
}

/**
 * User statistics
 */
export interface UserStats {
  totalPrompts: number;             // Total prompts enhanced
  totalSaved: number;               // Total prompts saved
  averageQualityScore: number;      // Average quality score
  totalExports: number;             // Total exports
  totalCopies: number;              // Total clipboard copies
  firstUsed: Date;                  // First time app was used
  lastUsed: Date;                   // Last time app was used
  streakDays: number;               // Consecutive days of use
}

/**
 * Draft management
 */
export interface DraftData {
  draft: FormInput;                 // Current draft
  lastSaved: Date;                  // When it was last saved
  autoSaved: boolean;               // Was it auto-saved or manual?
}

/**
 * Main local storage data structure
 */
export interface LocalData {
  // User Preferences
  preferences: UserPreferences;

  // Draft Management
  currentDraft?: DraftData;

  // History (Last 10)
  recentPrompts: PromptHistory[];

  // Statistics
  stats: UserStats;

  // App Metadata
  version: string;                  // App version when data was saved
  lastSync: Date;                   // Last time data was synced
}

/**
 * Local storage keys
 */
export enum StorageKey {
  PREFERENCES = 'aipa_preferences',
  DRAFT = 'aipa_draft',
  HISTORY = 'aipa_history',
  STATS = 'aipa_stats',
  FULL_DATA = 'aipa_data'
}

/**
 * Default preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'light',
  defaultTone: ToneOption.PROFESSIONAL,
  defaultFormat: OutputFormat.PARAGRAPH,
  tooltipsEnabled: true,
  autoSaveEnabled: true,
  autoSaveInterval: 10
};

/**
 * Default statistics
 */
export const DEFAULT_STATS: UserStats = {
  totalPrompts: 0,
  totalSaved: 0,
  averageQualityScore: 0,
  totalExports: 0,
  totalCopies: 0,
  firstUsed: new Date(),
  lastUsed: new Date(),
  streakDays: 0
};

/**
 * Export format options
 */
export type ExportFormat = 'txt' | 'md' | 'json';

/**
 * Export data structure
 */
export interface ExportData {
  prompt: string;
  metadata: {
    title?: string;
    createdAt: Date;
    qualityScore?: number;
    improvements?: string[];
  };
  format: ExportFormat;
}
