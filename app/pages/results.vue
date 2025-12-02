<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Check if we have results -->
      <div v-if="!hasResult" class="max-w-2xl mx-auto">
        <!-- No Results State -->
        <UiCard padding="lg" shadow="lg">
          <div class="text-center py-12">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-6" />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {{ t('results.noResults.title', 'No Results Available') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ t('results.noResults.description', 'You need to enhance a prompt first before viewing results.') }}
            </p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-sparkles"
              class="min-h-[44px]"
              @click="navigateToBuilder"
            >
              {{ t('results.noResults.goToBuilder', 'Go to Prompt Builder') }}
            </UButton>
          </div>
        </UiCard>
      </div>

      <!-- Results Content -->
      <div v-else class="space-y-8">
        <!-- Success Message & Header -->
        <div class="text-center max-w-3xl mx-auto px-4">
          <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-4">
            <UIcon name="i-heroicons-check-circle" class="w-8 h-8 sm:w-10 sm:h-10 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('results.success.title', 'Your Prompt is Ready!') }}
          </h1>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {{ t('results.success.description', 'Your prompt has been enhanced and is ready to use with any AI tool.') }}
          </p>
        </div>

        <!-- Quality Score Section -->
        <div class="max-w-4xl mx-auto">
          <UiCard padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ t('results.qualityScore.title', 'Quality Score') }}
                  </h2>
                </div>
                <UBadge v-if="qualityScore >= 80" color="emerald" variant="subtle" size="lg">
                  {{ t('quality.rating.excellent') }}
                </UBadge>
                <UBadge v-else-if="qualityScore >= 60" color="primary" variant="subtle" size="lg">
                  {{ t('quality.rating.good') }}
                </UBadge>
              </div>
            </template>

            <div class="flex flex-col items-center py-6">
              <BuilderQualityScore
                :score="qualityScore"
                size="lg"
                :show-label="true"
              />
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center max-w-md">
                {{ t('results.qualityScore.description', 'This score reflects the overall quality and effectiveness of your enhanced prompt.') }}
              </p>
            </div>
          </UiCard>
        </div>

        <!-- Action Buttons Section -->
        <div class="max-w-4xl mx-auto">
          <ResultsActionButtons
            :enhanced-prompt="enhancedPrompt"
            :original-input="originalInput"
            :response="enhancementResponse"
            :show-share="true"
          />
        </div>

        <!-- Comparison View - Lazy Loaded -->
        <div class="max-w-6xl mx-auto">
          <ClientOnly>
            <LazyResultsComparison
              :original-prompt="originalPrompt"
              :enhanced-prompt="enhancedPrompt"
              :show-differences="true"
            />
            <template #fallback>
              <div class="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </template>
          </ClientOnly>
        </div>

        <!-- Improvements List - Lazy Loaded -->
        <div class="max-w-4xl mx-auto">
          <ClientOnly>
            <LazyResultsImprovementsList
              :improvements="improvements"
              :show-categories="true"
              :expandable="true"
            />
            <template #fallback>
              <div class="animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </template>
          </ClientOnly>
        </div>

        <!-- Alternative Versions - Lazy Loaded -->
        <div v-if="alternativeVersions" class="max-w-4xl mx-auto">
          <ClientOnly>
            <LazyResultsAlternativeVersions
              :versions="alternativeVersions"
            />
            <template #fallback>
              <div class="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </template>
          </ClientOnly>
        </div>

        <!-- Additional Actions -->
        <div class="max-w-4xl mx-auto">
          <UiCard padding="lg" shadow="md">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ t('results.nextSteps.title', 'What\'s Next?') }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('results.nextSteps.description', 'Create another prompt or browse templates') }}
                  </p>
                </div>
              </div>
              <div class="flex gap-3 w-full sm:w-auto">
                <UButton
                  color="primary"
                  size="lg"
                  icon="i-heroicons-plus-circle"
                  class="flex-1 sm:flex-none"
                  @click="createNewPrompt"
                >
                  {{ t('results.actions.newPrompt') }}
                </UButton>
                <UButton
                  color="neutral"
                  size="lg"
                  variant="outline"
                  icon="i-heroicons-document-duplicate"
                  class="flex-1 sm:flex-none"
                  @click="navigateToTemplates"
                >
                  {{ t('nav.templates') }}
                </UButton>
              </div>
            </div>
          </UiCard>
        </div>

        <!-- Helpful Tips -->
        <div class="max-w-4xl mx-auto">
          <div class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div class="flex items-start gap-4">
              <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {{ t('results.tips.title', 'Pro Tips') }}
                </h3>
                <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>{{ t('results.tips.tip1', 'Copy the enhanced prompt and paste it directly into ChatGPT, Claude, or Gemini') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>{{ t('results.tips.tip2', 'Download different formats for sharing or documentation purposes') }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>{{ t('results.tips.tip3', 'Try alternative versions to find the best fit for your specific use case') }}</span>
                  </li>
                  <li v-if="enhancementLevel === 'quick'" class="flex items-start gap-2">
                    <span class="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>{{ t('results.tips.tip4', 'For more comprehensive results, try Deep Enhancement mode next time') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useEnhancement } from '~/composables/useEnhancement'
import { useLocalStorage } from '~/composables/useLocalStorage'
import { useFormStore } from '~/stores/form'
import type { FormInput } from '~/types'

// Composables
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const formStore = useFormStore()
const {
  state: enhancementState,
  hasResult,
  qualityScore,
  enhancedPrompt,
  improvements,
  alternativeVersions,
  originalPrompt,
} = useEnhancement()
const { saveToHistory } = useLocalStorage()

// SEO Meta Tags
useHead({
  title: computed(() => t('results.meta.title', 'Enhancement Results - AI Prompt Assistant')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('results.meta.description', 'View your enhanced AI prompt with quality score, improvements, and alternative versions'))
    },
    {
      name: 'robots',
      content: 'noindex, nofollow' // Don't index results pages
    }
  ]
})

// Get original input from form store
const originalInput = computed<FormInput>(() => formStore.formData)

// Get enhancement response (cast to remove readonly constraint)
const enhancementResponse = computed(() =>
  enhancementState.value.result as unknown as import('~/types').EnhancementResponse | undefined
)

// Get enhancement level
const enhancementLevel = computed(() => originalInput.value.enhancementLevel || 'quick')

// Navigation handlers
const navigateToBuilder = (): void => {
  router.push(localePath('/builder'))
}

const createNewPrompt = (): void => {
  // Reset form and navigate to builder
  formStore.resetForm()
  router.push(localePath('/builder'))

  toast.add({
    title: t('results.newPrompt.title', 'Ready for New Prompt'),
    description: t('results.newPrompt.description', 'Form has been reset. Start creating your new prompt.'),
    color: 'primary',
    icon: 'i-heroicons-sparkles'
  })
}

const navigateToTemplates = (): void => {
  router.push(localePath('/templates'))
}

// Save to history on mount
onMounted(() => {
  if (hasResult.value && enhancedPrompt.value && enhancementState.value.result) {
    try {
      // Save to history using the correct signature
      // Cast to remove readonly constraint
      const response = enhancementState.value.result as unknown as import('~/types').EnhancementResponse
      saveToHistory(originalInput.value, response)

      // Update stats
      const { incrementPromptsEnhanced, updateAverageQualityScore } = useLocalStorage()
      incrementPromptsEnhanced()
      if (qualityScore.value > 0) {
        updateAverageQualityScore(qualityScore.value)
      }
    } catch (error) {
      // Silently fail if history save fails - not critical
      console.error('Failed to save to history:', error)
    }
  }
})

// Redirect if no results (e.g., direct navigation)
onMounted(() => {
  if (!hasResult.value) {
    // Give a moment for the state to potentially load
    setTimeout(() => {
      if (!hasResult.value) {
        toast.add({
          title: t('results.noResults.redirectTitle', 'No Results Found'),
          description: t('results.noResults.redirectDescription', 'Redirecting to prompt builder...'),
          color: 'primary',
          icon: 'i-heroicons-information-circle'
        })

        // Redirect after a short delay
        setTimeout(() => {
          navigateToBuilder()
        }, 2000)
      }
    }, 500)
  }
})
</script>

<style scoped>
/* Add any page-specific styles here */
.container {
  max-width: 1280px;
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Print styles for when users want to print results */
@media print {
  .action-buttons-container,
  .next-steps,
  .pro-tips {
    display: none;
  }
}
</style>
