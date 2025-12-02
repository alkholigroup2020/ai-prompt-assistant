<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto max-w-7xl px-4">
      <!-- Check if we have results -->
      <div v-if="!hasResult" class="max-w-2xl mx-auto">
        <!-- No Results State -->
        <UiCard padding="lg" shadow="lg">
          <div class="text-center py-12">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-6"
            />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {{ t('results.noResults.title', 'No Results Available') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{
                t(
                  'results.noResults.description',
                  'You need to enhance a prompt first before viewing results.'
                )
              }}
            </p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-sparkles"
              class="min-h-[44px] cursor-pointer"
              @click="navigateToBuilder"
            >
              {{ t('results.noResults.goToBuilder', 'Go to Prompt Builder') }}
            </UButton>
          </div>
        </UiCard>
      </div>

      <!-- Results Content -->
      <div v-else class="space-y-6">
        <!-- Page Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-8"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-18 h-18 text-emerald-700 dark:text-emerald-400"
            />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ t('results.success.title', 'Your Prompt is Ready!') }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-stone-300">
            {{
              t(
                'results.success.description',
                'Your prompt has been enhanced and is ready to use with any AI tool.'
              )
            }}
          </p>
        </div>

        <!-- Comparison View -->
        <ResultsComparison
          :original-prompt="originalPrompt"
          :enhanced-prompt="enhancedPrompt"
          :show-differences="true"
          @copy="handleCopyEnhanced"
        />

        <!-- Alternative Versions - Lazy Loaded -->
        <div v-if="alternativeVersions">
          <ClientOnly>
            <LazyResultsAlternativeVersions :versions="alternativeVersions" />
            <template #fallback>
              <div class="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </template>
          </ClientOnly>
        </div>

        <!-- What's Next Section -->
        <UiCard padding="lg" shadow="md">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-6 h-6 text-gray-600 dark:text-gray-400"
              />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ t('results.nextSteps.title', "What's Next?") }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{
                    t('results.nextSteps.description', 'Create another prompt or browse templates')
                  }}
                </p>
              </div>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <!-- Download Button with Dropdown -->
              <div class="relative flex-1 sm:flex-none">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  :label="t('results.actions.download')"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  :loading="isExporting"
                  :aria-busy="isExporting"
                  :aria-expanded="showExportMenu"
                  class="w-full cursor-pointer"
                  @click="showExportMenu = !showExportMenu"
                />

                <!-- Export Format Menu -->
                <Transition name="dropdown">
                  <div
                    v-if="showExportMenu"
                    v-click-outside="() => (showExportMenu = false)"
                    class="absolute bottom-full mb-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10 overflow-hidden"
                  >
                    <div
                      v-for="option in exportOptions"
                      :key="option.format"
                      class="export-option border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                      @click="handleDownload(option.format)"
                    >
                      <div
                        class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <UIcon
                          :name="option.icon"
                          class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5"
                        />
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ option.label }}
                          </p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {{ option.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-heroicons-plus-circle"
                class="flex-1 sm:flex-none cursor-pointer"
                @click="createNewPrompt"
              >
                {{ t('results.actions.newPrompt') }}
              </UButton>
              <UButton
                color="neutral"
                size="lg"
                variant="outline"
                icon="i-heroicons-document-duplicate"
                class="flex-1 sm:flex-none cursor-pointer"
                @click="navigateToTemplates"
              >
                {{ t('nav.templates') }}
              </UButton>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useEnhancement } from '~/composables/useEnhancement'
import { useLocalStorage } from '~/composables/useLocalStorage'
import { useFormStore } from '~/stores/form'
import { exportPrompt } from '~/utils/export'
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
      content: computed(() =>
        t(
          'results.meta.description',
          'View your enhanced AI prompt with quality score, improvements, and alternative versions'
        )
      ),
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // Don't index results pages
    },
  ],
})

// Get original input from form store
const originalInput = computed<FormInput>(() => formStore.formData)

// Get enhancement response (cast to remove readonly constraint)
const enhancementResponse = computed(
  () =>
    enhancementState.value.result as unknown as import('~/types').EnhancementResponse | undefined
)

// Export state
const isExporting = ref(false)
const showExportMenu = ref(false)

// Export menu options
const exportOptions = computed(() => [
  {
    label: t('results.actions.downloadTxt'),
    icon: 'i-heroicons-document-text',
    format: 'txt' as const,
    description: t('results.actions.downloadTxtDescription'),
  },
  {
    label: t('results.actions.downloadMd'),
    icon: 'i-heroicons-document',
    format: 'md' as const,
    description: t('results.actions.downloadMdDescription'),
  },
  {
    label: t('results.actions.downloadJson'),
    icon: 'i-heroicons-code-bracket',
    format: 'json' as const,
    description: t('results.actions.downloadJsonDescription'),
  },
])

/**
 * Handle copy from Comparison component
 */
const handleCopyEnhanced = (): void => {
  toast.add({
    title: t('results.actions.copySuccess'),
    description: t('results.actions.copySuccessDescription'),
    icon: 'i-heroicons-check-circle',
    color: 'emerald',
  })
}

/**
 * Download prompt in specified format
 */
const handleDownload = async (format: 'txt' | 'md' | 'json'): Promise<void> => {
  if (isExporting.value) return

  isExporting.value = true
  showExportMenu.value = false

  try {
    // Prepare metadata
    const metadata = {
      title: enhancementResponse.value?.data?.shortTitle,
      timestamp: true,
      qualityScore: enhancementResponse.value?.data?.qualityScore,
      improvements: enhancementResponse.value?.data?.improvements,
    }

    // Export the prompt
    exportPrompt(
      format,
      enhancedPrompt.value,
      metadata,
      originalInput.value,
      enhancementResponse.value
    )

    // Show success feedback
    toast.add({
      title: t('results.actions.downloadSuccess'),
      description: t('results.actions.downloadSuccessDescription', {
        format: format.toUpperCase(),
      }),
      icon: 'i-heroicons-arrow-down-tray',
      color: 'emerald',
    })
  } catch {
    // Show error feedback
    toast.add({
      title: t('results.actions.downloadError'),
      description: t('results.actions.downloadErrorDescription'),
      icon: 'i-heroicons-x-circle',
      color: 'primary',
    })
  } finally {
    setTimeout(() => {
      isExporting.value = false
    }, 1000)
  }
}

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
    description: t(
      'results.newPrompt.description',
      'Form has been reset. Start creating your new prompt.'
    ),
    color: 'primary',
    icon: 'i-heroicons-sparkles',
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
      const response = enhancementState.value
        .result as unknown as import('~/types').EnhancementResponse
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
          description: t(
            'results.noResults.redirectDescription',
            'Redirecting to prompt builder...'
          ),
          color: 'primary',
          icon: 'i-heroicons-information-circle',
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
/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Print styles for when users want to print results */
@media print {
  .action-buttons-container,
  .next-steps {
    display: none;
  }
}
</style>
