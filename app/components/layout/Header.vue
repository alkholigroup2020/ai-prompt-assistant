<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo and Branding -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xl font-bold text-navy-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
          :aria-label="t('header.logoAria')"
        >
          <svg
            class="h-8 w-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span class="hidden sm:inline">{{ t('header.title') }}</span>
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ t(item.label) }}
        </NuxtLink>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Language Switcher -->
        <UButton
          :icon="currentLocale === 'en' ? 'i-heroicons-language' : 'i-heroicons-language'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="min-h-[44px] min-w-[44px] touch-manipulation"
          :aria-label="t('header.switchLanguage')"
          @click="toggleLanguage"
        >
          <span class="hidden sm:inline">{{ currentLocale.toUpperCase() }}</span>
        </UButton>

        <!-- Theme Toggle (optional) -->
        <UButton
          :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="min-h-[44px] min-w-[44px] touch-manipulation"
          :aria-label="t('header.toggleTheme')"
          @click="toggleTheme"
        />

        <!-- Mobile Menu Button -->
        <UButton
          :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="md:hidden min-h-[44px] min-w-[44px] touch-manipulation"
          :aria-label="mobileMenuOpen ? t('header.closeMenu') : t('header.openMenu')"
          :aria-expanded="mobileMenuOpen"
          @click="toggleMobileMenu"
        />
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden"
      >
        <nav class="flex flex-col gap-2" role="navigation" aria-label="Mobile navigation">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="rounded-md px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-emerald-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-emerald-400 min-h-[44px] flex items-center touch-manipulation"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            @click="closeMobileMenu"
          >
            {{ t(item.label) }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '~/stores/preferences'

// i18n
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

// Store
const preferencesStore = usePreferencesStore()

// Router
const route = useRoute()

// State
const mobileMenuOpen = ref(false)

// Computed
const currentLocale = computed(() => locale.value)
const isDark = computed(() => preferencesStore.isDarkMode)

// Navigation items
const navigationItems = [
  { to: '/', label: 'nav.home' },
  { to: '/builder', label: 'nav.builder' },
  { to: '/templates', label: 'nav.templates' }
]

// Methods
const toggleLanguage = async () => {
  const newLocale = currentLocale.value === 'en' ? 'ar' : 'en'

  // Update preference in store (saves to localStorage)
  preferencesStore.setLanguage(newLocale)

  // Get the localized path for the new locale
  const localizedPath = switchLocalePath(newLocale)

  // Navigate to the localized path
  // This will update the URL with locale prefix and reload content
  await router.push(localizedPath)

  closeMobileMenu()
}

const toggleTheme = () => {
  preferencesStore.toggleTheme()
  closeMobileMenu()
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const isActive = (path: string): boolean => {
  return route.path === path
}

// Close mobile menu on route change
watch(() => route.path, () => {
  closeMobileMenu()
})

// Close mobile menu on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Ensure smooth transitions */
header {
  transition: all 0.2s ease-in-out;
}

/* Active link styling */
a[aria-current="page"] {
  color: #16a34a;
}

:deep(.dark) a[aria-current="page"] {
  color: #4ade80;
}

/* Focus visible styles for accessibility */
a:focus-visible,
button:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}
</style>
