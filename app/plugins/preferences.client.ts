/**
 * Preferences Plugin
 * Initializes user preferences and syncs with i18n locale
 * Runs only on client-side (.client.ts suffix)
 */

export default defineNuxtPlugin(() => {
  const preferencesStore = usePreferencesStore()
  const { locale } = useI18n()

  // Initialize preferences from localStorage
  preferencesStore.initialize()

  // Sync i18n locale with stored preference
  // This ensures the locale matches what's saved in localStorage
  if (preferencesStore.currentLanguage !== locale.value) {
    locale.value = preferencesStore.currentLanguage
  }

  // Watch for locale changes from i18n and sync to store
  // This handles cases where the URL locale is different from stored preference
  watch(locale, (newLocale) => {
    if (newLocale !== preferencesStore.currentLanguage) {
      preferencesStore.setLanguage(newLocale as 'en' | 'ar')
    }
  })
})
