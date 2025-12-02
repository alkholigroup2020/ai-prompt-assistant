<template>
  <div
    :dir="direction"
    :lang="currentLocale"
    class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900"
  >
    <!-- Header -->
    <LayoutHeader />

    <!-- Main Content -->
    <main id="main-content" class="flex-1" role="main">
      <!-- Page Content Slot -->
      <slot />
    </main>

    <!-- Footer -->
    <LayoutFooter />

    <!-- Skip to main content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
    >
      {{ t('a11y.skipToMain') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '~/stores/preferences'

// i18n
const { t, locale } = useI18n()

// Store
const preferencesStore = usePreferencesStore()

// Initialize preferences on mount
onMounted(() => {
  preferencesStore.initialize()
})

// Computed properties
const currentLocale = computed(() => locale.value)
const direction = computed(() => (preferencesStore.isRTL ? 'rtl' : 'ltr'))

// Watch for language changes and update HTML attributes
watch(
  currentLocale,
  (newLocale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    }
  },
  { immediate: true }
)

// Update HTML attributes on mount for SSR compatibility
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLocale.value
    document.documentElement.dir = direction.value
  }
})

// Provide layout context for child components (optional)
provide('layout', {
  locale: currentLocale,
  direction,
  isRTL: computed(() => preferencesStore.isRTL),
})
</script>

<style>
/* Global layout styles */
html {
  scroll-behavior: smooth;
}

/* RTL-specific styles */
[dir='rtl'] {
  text-align: right;
}

[dir='rtl'] * {
  direction: rtl;
}

/* Ensure proper text direction for input elements */
[dir='rtl'] input,
[dir='rtl'] textarea,
[dir='rtl'] select {
  text-align: right;
}

/* Fix flex direction for RTL */
[dir='rtl'] .flex-row {
  flex-direction: row-reverse;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus,
.sr-only:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Focus visible styles for better accessibility */
*:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}

/* Smooth transitions for theme changes */
* {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent transition on page load */
.no-transitions * {
  transition: none !important;
}
</style>
