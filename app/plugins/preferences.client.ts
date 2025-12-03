/**
 * Preferences Plugin
 * Initializes user preferences and syncs with i18n locale
 * Runs only on client-side (.client.ts suffix)
 */

export default defineNuxtPlugin((nuxtApp) => {
  const preferencesStore = usePreferencesStore()

  // Access i18n through nuxtApp.$i18n instead of useI18n()
  const i18n = nuxtApp.$i18n as unknown as {
    locale: { value: string }
    setLocale: (locale: string) => void
  }

  if (!i18n) {
    console.warn('i18n is not available in preferences plugin')
    return
  }

  // Initialize preferences from localStorage
  preferencesStore.initialize()

  // Helper to validate and normalize locale
  const normalizeLocale = (locale: string): 'en' | 'ar' => {
    if (locale === 'ar' || locale.startsWith('ar')) return 'ar'
    return 'en' // Default to English for any other value
  }

  // IMPORTANT: URL locale takes priority over stored preference
  // If the user navigates to /ar/builder, respect that even if their preference is 'en'
  // The URL represents explicit user intent for the current session
  const urlLocale = normalizeLocale(i18n.locale.value)

  // Sync the stored preference TO the URL locale (not the other way around)
  // This ensures the language the user is viewing matches what gets sent to the API
  if (preferencesStore.currentLanguage !== urlLocale) {
    preferencesStore.setLanguage(urlLocale)
  }

  // Watch for locale changes from i18n and sync to store
  // This handles cases where the user switches language via the language toggle
  watch(() => i18n.locale.value, (newLocale) => {
    const normalized = normalizeLocale(newLocale)
    if (normalized !== preferencesStore.currentLanguage) {
      preferencesStore.setLanguage(normalized)
    }
  })
})
