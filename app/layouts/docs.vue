<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900"
  >
    <!-- Header -->
    <LayoutHeader />

    <!-- Main Layout Container -->
    <div class="flex flex-1">
      <!-- Mobile Navigation Toggle -->
      <button
        type="button"
        class="fixed bottom-6 start-6 z-50 lg:hidden flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg cursor-pointer transition-colors"
        :aria-label="t('userManual.nav.toggleMenu')"
        @click="mobileNavOpen = true"
      >
        <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
      </button>

      <!-- Main Content Area (includes sidebar via page) -->
      <main id="main-content" class="flex-1 min-w-0" role="main">
        <slot />
      </main>
    </div>

    <!-- Mobile Navigation Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div
          v-if="mobileNavOpen"
          class="fixed inset-0 z-50 lg:hidden"
          @keydown.escape="mobileNavOpen = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            @click="mobileNavOpen = false"
          />

          <!-- Drawer Panel -->
          <div
            class="absolute inset-y-0 start-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
          >
            <!-- Drawer Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('userManual.nav.title') }}
              </span>
              <button
                type="button"
                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg cursor-pointer"
                :aria-label="t('userManual.nav.closeMenu')"
                @click="mobileNavOpen = false"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <!-- Mobile Sidebar Content - injected by page -->
            <div id="mobile-sidebar-portal" class="p-4" />
          </div>
        </div>
      </Transition>
    </Teleport>

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

// Mobile navigation state
const mobileNavOpen = ref(false)

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

// Close mobile nav on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileNavOpen.value = false
})

// Provide layout context for child components
provide('layout', {
  locale: currentLocale,
  direction,
  isRTL: computed(() => preferencesStore.isRTL),
})

// Provide mobile nav control to children
provide('docsLayout', {
  closeMobileNav: () => { mobileNavOpen.value = false }
})
</script>

<style scoped>
/* Drawer transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(-100%);
}

[dir='rtl'] .drawer-enter-from > div:last-child,
[dir='rtl'] .drawer-leave-to > div:last-child {
  transform: translateX(100%);
}

/* Scrollbar styling for sidebars */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
