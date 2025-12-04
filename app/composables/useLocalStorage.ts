import type {
  FormInput,
  LocalData,
  UserPreferences,
  PromptHistory,
  UserStats,
  DraftData,
} from '~/types'
import { DEFAULT_PREFERENCES, DEFAULT_STATS } from '~/types'

// Constants for auto-save
const AUTO_SAVE_INTERVAL = 10000 // 10 seconds
const MAX_HISTORY_ITEMS = 10

/**
 * Composable for managing local storage operations
 */
export function useLocalStorage() {
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null

  /**
   * Safely get item from localStorage
   */
  function getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  }

  /**
   * Safely set item in localStorage
   */
  function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  /**
   * Remove item from localStorage
   */
  function removeItem(key: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }

  /**
   * Load user preferences
   */
  function loadPreferences(): UserPreferences {
    return getItem<UserPreferences>('user_preferences', DEFAULT_PREFERENCES)
  }

  /**
   * Save user preferences
   */
  function savePreferences(preferences: UserPreferences): void {
    setItem('user_preferences', preferences)
  }

  /**
   * Load form draft
   */
  function loadDraft(): DraftData | null {
    return getItem<DraftData | null>('form_draft', null)
  }

  /**
   * Save form draft
   */
  function saveDraft(draft: DraftData): void {
    setItem('form_draft', draft)
  }

  /**
   * Clear form draft
   */
  function clearDraft(): void {
    removeItem('form_draft')
  }

  /**
   * Load prompt history
   */
  function loadHistory(): PromptHistory[] {
    return getItem<PromptHistory[]>('prompt_history', [])
  }

  /**
   * Save prompt to history (keeps last 10)
   */
  function saveToHistory(
    input: FormInput,
    output: import('~/types').EnhancementResponse
  ): void {
    const history = loadHistory()

    const newEntry: PromptHistory = {
      id: `prompt_${Date.now()}`,
      timestamp: new Date(),
      input,
      output,
      starred: false,
    }

    // Add new entry at the beginning
    history.unshift(newEntry)

    // Keep only last 10 items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)

    setItem('prompt_history', trimmedHistory)
  }

  /**
   * Clear all history
   */
  function clearHistory(): void {
    setItem('prompt_history', [])
  }

  /**
   * Load user statistics
   */
  function loadStats(): UserStats {
    return getItem<UserStats>('user_stats', DEFAULT_STATS)
  }

  /**
   * Update user statistics
   */
  function updateStats(updates: Partial<UserStats>): void {
    const stats = loadStats()
    const updatedStats = { ...stats, ...updates, lastUsed: new Date() }
    setItem('user_stats', updatedStats)
  }

  /**
   * Increment total prompts enhanced
   */
  function incrementPromptsEnhanced(): void {
    const stats = loadStats()
    updateStats({ totalPrompts: stats.totalPrompts + 1 })
  }

  /**
   * Increment total saved prompts
   */
  function incrementSavedPrompts(): void {
    const stats = loadStats()
    updateStats({ totalSaved: stats.totalSaved + 1 })
  }

  /**
   * Increment total exports
   */
  function incrementExports(): void {
    const stats = loadStats()
    updateStats({ totalExports: stats.totalExports + 1 })
  }

  /**
   * Update average quality score
   */
  function updateAverageQualityScore(newScore: number): void {
    const stats = loadStats()
    const total = stats.totalPrompts
    const currentAverage = stats.averageQualityScore

    // Calculate new average
    const newAverage = total === 0
      ? newScore
      : (currentAverage * total + newScore) / (total + 1)

    updateStats({ averageQualityScore: Math.round(newAverage) })
  }

  /**
   * Load complete local data
   */
  function loadAllData(): LocalData {
    return {
      preferences: loadPreferences(),
      currentDraft: loadDraft() || undefined,
      recentPrompts: loadHistory(),
      stats: loadStats(),
      version: '1.0.0',
      lastSync: new Date(),
    }
  }

  /**
   * Clear all local data
   */
  function clearAllData(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }

  /**
   * Start auto-save timer for form drafts
   */
  function startAutoSave(getDraftData: () => DraftData): void {
    if (autoSaveTimer !== null) {
      return // Already running
    }

    autoSaveTimer = setInterval(() => {
      const draft = getDraftData()
      if (draft.draft) {
        saveDraft(draft)
      }
    }, AUTO_SAVE_INTERVAL)
  }

  /**
   * Stop auto-save timer
   */
  function stopAutoSave(): void {
    if (autoSaveTimer !== null) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
    }
  }

  return {
    // Preferences
    loadPreferences,
    savePreferences,

    // Drafts
    loadDraft,
    saveDraft,
    clearDraft,

    // History
    loadHistory,
    saveToHistory,
    clearHistory,

    // Stats
    loadStats,
    updateStats,
    incrementPromptsEnhanced,
    incrementSavedPrompts,
    incrementExports,
    updateAverageQualityScore,

    // All data
    loadAllData,
    clearAllData,

    // Auto-save
    startAutoSave,
    stopAutoSave,

    // Generic helpers
    getItem,
    setItem,
    removeItem,
  }
}
