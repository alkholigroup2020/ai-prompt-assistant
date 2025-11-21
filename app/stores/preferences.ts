/**
 * Preferences Store
 * Manages user preferences with localStorage persistence
 */

import { defineStore } from 'pinia';
import type { UserPreferences, Theme } from '~/types/storage';
import type { Language, ToneOption, OutputFormat } from '~/types/form';
import { StorageKey, DEFAULT_PREFERENCES } from '~/types/storage';

/**
 * Preferences state interface
 */
interface PreferencesState {
  preferences: UserPreferences;
  isLoaded: boolean;
}

/**
 * Check if we're running in the browser (client-side)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Preferences store
 */
export const usePreferencesStore = defineStore('preferences', {
  /**
   * State
   */
  state: (): PreferencesState => ({
    preferences: { ...DEFAULT_PREFERENCES },
    isLoaded: false
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get current language
     */
    currentLanguage(): Language {
      return this.preferences.language;
    },

    /**
     * Get current theme
     */
    currentTheme(): Theme {
      return this.preferences.theme;
    },

    /**
     * Get default tone
     */
    defaultTone(): ToneOption {
      return this.preferences.defaultTone;
    },

    /**
     * Get default output format
     */
    defaultFormat(): OutputFormat {
      return this.preferences.defaultFormat;
    },

    /**
     * Check if tooltips are enabled
     */
    tooltipsEnabled(): boolean {
      return this.preferences.tooltipsEnabled;
    },

    /**
     * Check if auto-save is enabled
     */
    autoSaveEnabled(): boolean {
      return this.preferences.autoSaveEnabled;
    },

    /**
     * Get auto-save interval in seconds
     */
    autoSaveInterval(): number {
      return this.preferences.autoSaveInterval;
    },

    /**
     * Check if dark mode is active
     */
    isDarkMode(): boolean {
      if (this.preferences.theme === 'dark') {
        return true;
      }
      if (this.preferences.theme === 'auto' && isBrowser()) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    },

    /**
     * Check if RTL (Right-to-Left) mode should be active
     */
    isRTL(): boolean {
      return this.preferences.language === 'ar';
    }
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Load preferences from localStorage
     */
    loadPreferences(): void {
      if (!isBrowser()) {
        return;
      }

      try {
        const stored = localStorage.getItem(StorageKey.PREFERENCES);
        if (stored) {
          const parsed = JSON.parse(stored) as UserPreferences;
          this.preferences = {
            ...DEFAULT_PREFERENCES,
            ...parsed
          };
        }
        this.isLoaded = true;
      } catch (error) {
        console.error('Failed to load preferences from localStorage:', error);
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.isLoaded = true;
      }
    },

    /**
     * Save preferences to localStorage
     */
    savePreferences(): void {
      if (!isBrowser()) {
        return;
      }

      try {
        localStorage.setItem(
          StorageKey.PREFERENCES,
          JSON.stringify(this.preferences)
        );
      } catch (error) {
        console.error('Failed to save preferences to localStorage:', error);
      }
    },

    /**
     * Update a single preference
     */
    updatePreference<K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K]
    ): void {
      this.preferences[key] = value;
      this.savePreferences();
    },

    /**
     * Update multiple preferences at once
     */
    updatePreferences(updates: Partial<UserPreferences>): void {
      this.preferences = {
        ...this.preferences,
        ...updates
      };
      this.savePreferences();
    },

    /**
     * Set language preference
     */
    setLanguage(language: Language): void {
      this.preferences.language = language;
      this.savePreferences();

      // Update HTML lang attribute
      if (isBrowser()) {
        document.documentElement.lang = language;
        // Update HTML dir attribute for RTL
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      }
    },

    /**
     * Toggle language between English and Arabic
     */
    toggleLanguage(): void {
      const newLanguage: Language = this.preferences.language === 'en' ? 'ar' : 'en';
      this.setLanguage(newLanguage);
    },

    /**
     * Set theme preference
     */
    setTheme(theme: Theme): void {
      this.preferences.theme = theme;
      this.savePreferences();

      // Apply theme to document
      this.applyTheme();
    },

    /**
     * Toggle theme between light and dark
     */
    toggleTheme(): void {
      // Simple toggle between light and dark only
      const newTheme: Theme = this.isDarkMode ? 'light' : 'dark';
      this.setTheme(newTheme);
    },

    /**
     * Apply theme to document
     */
    applyTheme(): void {
      if (!isBrowser()) {
        return;
      }

      const isDark = this.isDarkMode;

      // Add or remove dark class from HTML element
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    /**
     * Set default tone
     */
    setDefaultTone(tone: ToneOption): void {
      this.preferences.defaultTone = tone;
      this.savePreferences();
    },

    /**
     * Set default output format
     */
    setDefaultFormat(format: OutputFormat): void {
      this.preferences.defaultFormat = format;
      this.savePreferences();
    },

    /**
     * Toggle tooltips
     */
    toggleTooltips(): void {
      this.preferences.tooltipsEnabled = !this.preferences.tooltipsEnabled;
      this.savePreferences();
    },

    /**
     * Enable tooltips
     */
    enableTooltips(): void {
      this.preferences.tooltipsEnabled = true;
      this.savePreferences();
    },

    /**
     * Disable tooltips
     */
    disableTooltips(): void {
      this.preferences.tooltipsEnabled = false;
      this.savePreferences();
    },

    /**
     * Toggle auto-save
     */
    toggleAutoSave(): void {
      this.preferences.autoSaveEnabled = !this.preferences.autoSaveEnabled;
      this.savePreferences();
    },

    /**
     * Set auto-save interval
     */
    setAutoSaveInterval(seconds: number): void {
      if (seconds < 5 || seconds > 300) {
        console.warn('Auto-save interval must be between 5 and 300 seconds');
        return;
      }
      this.preferences.autoSaveInterval = seconds;
      this.savePreferences();
    },

    /**
     * Reset preferences to defaults
     */
    resetPreferences(): void {
      this.preferences = { ...DEFAULT_PREFERENCES };
      this.savePreferences();

      // Reapply theme and language
      this.applyTheme();
      this.setLanguage(DEFAULT_PREFERENCES.language);
    },

    /**
     * Initialize preferences (load and apply)
     */
    initialize(): void {
      this.loadPreferences();
      this.applyTheme();

      // Set HTML attributes
      if (isBrowser()) {
        document.documentElement.lang = this.preferences.language;
        document.documentElement.dir = this.preferences.language === 'ar' ? 'rtl' : 'ltr';

        // Listen for system theme changes if theme is 'auto'
        if (this.preferences.theme === 'auto') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          mediaQuery.addEventListener('change', () => {
            this.applyTheme();
          });
        }
      }
    }
  }
});
