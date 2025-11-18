/**
 * Preferences Plugin
 * Initializes user preferences and syncs with i18n locale
 * Runs only on client-side (.client.ts suffix)
 */

export default defineNuxtPlugin((nuxtApp) => {
  const preferencesStore = usePreferencesStore()

  // Access i18n through nuxtApp.$i18n instead of useI18n()
  const i18n = nuxtApp.$i18n

  if (!i18n) {
    console.warn('i18n is not available in preferences plugin')
    return
  }

  // Initialize preferences from localStorage
  preferencesStore.initialize()

  // Sync i18n locale with stored preference
  // This ensures the locale matches what's saved in localStorage
  if (preferencesStore.currentLanguage !== i18n.locale.value) {
    i18n.setLocale(preferencesStore.currentLanguage)
  }

  // Watch for locale changes from i18n and sync to store
  // This handles cases where the URL locale is different from stored preference
  watch(() => i18n.locale.value, (newLocale) => {
    if (newLocale !== preferencesStore.currentLanguage) {
      preferencesStore.setLanguage(newLocale as 'en' | 'ar')
    }
  })
})
