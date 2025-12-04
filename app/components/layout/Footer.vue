<template>
  <footer class="w-full border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- Company Information -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <img
              src="https://ik.imagekit.io/vrjsolbznpr/Group_Logos/AKG_29UglKTPUw.png?updatedAt=1749017913788"
              alt="AKG Logo"
              class="h-6 w-auto"
              aria-hidden="true"
            />
            <span class="text-lg font-bold text-navy-900 dark:text-white">
              {{ t('footer.appName') }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('footer.description') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ t('footer.quickLinks') }}
          </h3>
          <nav class="flex flex-col gap-2" aria-label="Footer navigation">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="localePath(link.to)"
              class="text-sm text-gray-600 transition-colors hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              {{ t(link.label) }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Company & Legal -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ t('footer.company') }}
          </h3>
          <nav class="flex flex-col gap-2" aria-label="Company links">
            <a
              :href="companyWebsite"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              {{ t('footer.companyWebsite') }}
              <svg
                :class="['h-3 w-3', iconFlipClass]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <NuxtLink
              :to="localePath('/privacy')"
              class="text-sm text-gray-600 transition-colors hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              {{ t('footer.privacyPolicy') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/terms')"
              class="text-sm text-gray-600 transition-colors hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              {{ t('footer.termsOfUse') }}
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('footer.copyright', { year: currentYear, company: companyName }) }}
          </p>
          <div class="flex items-center gap-4">
            <!-- Version Info -->
            <span class="text-xs text-gray-500 dark:text-gray-500">
              {{ t('footer.version', { version: appVersion }) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// RTL support
const { iconFlipClass } = useRTL()

// Computed
const currentYear = computed(() => new Date().getFullYear())
const appVersion = computed(() => '1.0.0')
const companyName = computed(() => 'Alkholi Group')
const companyWebsite = computed(() => 'https://www.alkholi.com')

// Footer navigation links
const footerLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/builder', label: 'nav.builder' },
]
</script>

<style scoped>
/* Focus visible styles for accessibility */
a:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
  border-radius: 4px;
}

/* External link icon animation */
a[target='_blank']:hover svg {
  transform: translate(2px, -2px);
  transition: transform 0.2s ease-in-out;
}
</style>
