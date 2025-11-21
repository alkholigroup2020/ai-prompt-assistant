<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16">
      <div class="max-w-2xl w-full text-center">
        <!-- Error Icon -->
        <div class="mb-8">
          <div
            class="inline-flex items-center justify-center w-24 h-24 rounded-full"
            :class="errorIconBg"
          >
            <UIcon
              :name="errorIcon"
              class="w-12 h-12"
              :class="errorIconColor"
            />
          </div>
        </div>

        <!-- Error Code -->
        <div class="mb-4">
          <span
            class="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            :class="errorCodeBg"
          >
            {{ errorCode }}
          </span>
        </div>

        <!-- Error Title -->
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ errorTitle }}
        </h1>

        <!-- Error Message -->
        <p class="text-xl text-gray-700 dark:text-gray-300 mb-3">
          {{ errorMessage }}
        </p>

        <!-- Error Description -->
        <p class="text-base text-gray-600 dark:text-gray-400 mb-8">
          {{ errorDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <UButton
            color="emerald"
            size="xl"
            icon="i-heroicons-home"
            @click="handleGoHome"
          >
            {{ $t('error.actions.goHome') }}
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            size="xl"
            icon="i-heroicons-arrow-left"
            @click="handleGoBack"
          >
            {{ $t('error.actions.goBack') }}
          </UButton>

          <UButton
            v-if="error?.statusCode === 500"
            color="neutral"
            variant="outline"
            size="xl"
            icon="i-heroicons-arrow-path"
            @click="handleTryAgain"
          >
            {{ $t('error.actions.tryAgain') }}
          </UButton>
        </div>

        <!-- Suggestions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 text-left">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('error.suggestions.title') }}
          </h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-home" class="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <button
                type="button"
                class="text-left text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                :aria-label="$t('error.suggestions.home')"
                @click="handleGoHome"
              >
                {{ $t('error.suggestions.home') }}
              </button>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <button
                type="button"
                class="text-left text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                :aria-label="$t('error.suggestions.builder')"
                @click="handleStartBuilder"
              >
                {{ $t('error.suggestions.builder') }}
              </button>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <button
                type="button"
                class="text-left text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                :aria-label="$t('error.suggestions.templates')"
                @click="handleViewTemplates"
              >
                {{ $t('error.suggestions.templates') }}
              </button>
            </li>
            <li v-if="error?.statusCode === 500" class="flex items-start gap-3">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <button
                type="button"
                class="text-left text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                :aria-label="$t('error.suggestions.refresh')"
                @click="handleTryAgain"
              >
                {{ $t('error.suggestions.refresh') }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Support Section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('error.support.title') }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ $t('error.support.description') }}
          </p>
          <a
            href="mailto:support@alkholi-group.com"
            class="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            {{ $t('error.support.contact') }}
          </a>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { NuxtError } from '#app';

interface Props {
  error?: NuxtError | null;
}

const props = defineProps<Props>();

const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();

// Determine error type based on status code
const errorType = computed<'404' | '500' | 'default'>(() => {
  const statusCode = props.error?.statusCode;
  if (statusCode === 404) return '404';
  if (statusCode === 500 || statusCode === 503) return '500';
  return 'default';
});

// Error code display
const errorCode = computed(() => {
  return t(`error.${errorType.value}.code`);
});

// Error title
const errorTitle = computed(() => {
  return t(`error.${errorType.value}.title`);
});

// Error message
const errorMessage = computed(() => {
  return t(`error.${errorType.value}.message`);
});

// Error description
const errorDescription = computed(() => {
  return t(`error.${errorType.value}.description`);
});

// Error icon based on type
const errorIcon = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'i-heroicons-magnifying-glass';
    case '500':
      return 'i-heroicons-exclamation-triangle';
    default:
      return 'i-heroicons-exclamation-circle';
  }
});

// Error icon color
const errorIconColor = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'text-blue-600 dark:text-blue-400';
    case '500':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-amber-600 dark:text-amber-400';
  }
});

// Error icon background
const errorIconBg = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case '500':
      return 'bg-red-100 dark:bg-red-900/30';
    default:
      return 'bg-amber-100 dark:bg-amber-900/30';
  }
});

// Error code badge background
const errorCodeBg = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case '500':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  }
});

// SEO Meta Tags
useHead(() => ({
  title: errorTitle.value,
  meta: [
    { name: 'description', content: errorMessage.value },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}));

/**
 * Navigate to home page
 */
const handleGoHome = async (): Promise<void> => {
  await navigateTo(localePath('/'));
};

/**
 * Go back to previous page
 */
const handleGoBack = (): void => {
  if (window.history.length > 1) {
    router.back();
  } else {
    navigateTo(localePath('/'));
  }
};

/**
 * Try again by reloading the page
 */
const handleTryAgain = (): void => {
  window.location.reload();
};

/**
 * Navigate to templates page
 */
const handleViewTemplates = async (): Promise<void> => {
  await navigateTo(localePath('/templates'));
};

/**
 * Navigate to prompt builder
 */
const handleStartBuilder = async (): Promise<void> => {
  await navigateTo(localePath('/builder'));
};

// Clear error on unmount (Nuxt error handling)
onBeforeUnmount(() => {
  clearError();
});
</script>

<style scoped>
/* Additional print styles for error page */
@media print {
  .min-h-screen {
    min-height: auto;
  }
}
</style>
