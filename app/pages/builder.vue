<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto max-w-7xl px-4">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('builder.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-stone-300">
          {{ t('builder.subtitle') }}
        </p>
      </div>

      <!-- Sticky Progress Indicator -->
      <div
        class="sticky top-16 z-40 -mx-4 px-4 py-3 mb-6 md:mb-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300"
      >
        <div class="flex items-center gap-4 md:gap-6">
          <!-- Progress Bar Section (75%) -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('builder.progress.label') }}
              </span>
              <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {{ completionPercentage }}%
              </span>
            </div>
            <UiProgressBar
              :value="completionPercentage"
              color="primary"
              size="md"
              :striped="completionPercentage < 100"
              :animated="completionPercentage < 100"
              :show-percentage="false"
            />
          </div>

          <!-- Queue Status / Rate Limit Indicator -->
          <div class="flex-shrink-0 pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-gray-200 dark:border-gray-700">
            <QueueStatus v-if="isQueued" compact />
            <RateLimitIndicator v-else compact />
          </div>

          <!-- Quality Score Circle (25%) -->
          <div
            class="flex-shrink-0 flex items-center gap-3 pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-gray-200 dark:border-gray-700"
            role="status"
            aria-live="polite"
            :aria-label="t('builder.preview.qualityAriaLabel', { score: qualityScore, rating: qualityRatingLabel })"
          >
            <!-- Label (appears before circle in RTL) -->
            <div class="hidden sm:block order-2 rtl:order-1 text-start rtl:text-end">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ t('builder.preview.quality') }}
              </p>
              <p :class="qualityScoreTextColor" class="text-sm font-semibold">
                {{ qualityRatingLabel }}
              </p>
              <button
                type="button"
                class="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline cursor-pointer mt-0.5"
                :aria-label="t('builder.preview.moreDetailsAriaLabel', 'View quality score breakdown')"
                @click="showQualityModal = true"
              >
                {{ t('builder.preview.moreDetails') }}
              </button>
            </div>
            <!-- Circle -->
            <div
              class="relative w-14 h-14 md:w-16 md:h-16 order-1 rtl:order-2"
              role="img"
              :aria-label="t('builder.preview.qualityScoreAriaLabel', { score: qualityScore })"
            >
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                <!-- Background circle -->
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke-width="6"
                  class="stroke-gray-200 dark:stroke-gray-700"
                  fill="none"
                />
                <!-- Progress circle -->
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke-width="6"
                  :stroke-dasharray="175.93"
                  :stroke-dashoffset="175.93 * (1 - qualityScore / 100)"
                  :class="qualityScoreStrokeColor"
                  class="transition-all duration-700 ease-out"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
              <!-- Score text -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span :class="qualityScoreTextColor" class="text-sm md:text-base font-bold" aria-hidden="true">
                  {{ qualityScore }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Sections -->
      <div class="space-y-6">
        <!-- Basic Information Section -->
        <UiCard padding="lg" shadow="md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-emerald-700" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('builder.sections.basic') }}
              </h2>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Two Column Grid for Role and Audience -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <BuilderRoleSelector />
              <BuilderAudienceSelector />
            </div>

            <!-- Task Input spans full width -->
            <BuilderTaskInput />
          </div>
        </UiCard>

        <!-- Style & Format Section -->
        <UiCard padding="lg" shadow="md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-paint-brush" class="w-5 h-5 text-emerald-700" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('builder.sections.style') }}
              </h2>
            </div>
          </template>

          <!-- Two Column Grid for Tone and Output Format -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <BuilderToneSelector />
            <BuilderOutputFormatSelector />
          </div>
        </UiCard>

        <!-- Constraints Section -->
        <UiCard padding="lg" shadow="md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-emerald-700" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('builder.sections.constraints') }}
              </h2>
            </div>
          </template>

          <BuilderConstraintsSelector />
        </UiCard>

        <!-- Advanced Options Section -->
        <UiCard padding="lg" shadow="md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-emerald-700" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('builder.sections.advanced') }}
              </h2>
            </div>
          </template>

          <BuilderAdvancedOptions />
        </UiCard>

        <!-- Live Preview -->
        <UiCard padding="lg" shadow="md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-eye" class="w-5 h-5 text-emerald-700" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('builder.preview.title') }}
              </h2>
            </div>
          </template>

          <div class="prose prose-sm dark:prose-invert max-w-none">
            <p v-if="!previewText" class="text-gray-500 dark:text-gray-400 italic">
              {{ t('builder.preview.empty') }}
            </p>
            <div v-else class="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
              {{ previewText }}
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{{ t('builder.preview.words') }}: {{ wordCount }}</span>
              <span>{{ t('builder.preview.chars') }}: {{ charCount }}</span>
            </div>
          </template>
        </UiCard>

        <!-- Action Buttons - One row on lg+, column on mobile -->
        <div class="flex flex-col md:flex-row gap-3 md:gap-4">
          <!-- Reset Form -->
          <UButton
            color="neutral"
            variant="soft"
            size="lg"
            block
            class="min-h-[44px] lg:flex-1 cursor-pointer !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-950/20 !border-red-300 dark:!border-red-800"
            :disabled="isEnhancing"
            @click="handleReset"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" />
            </template>
            {{ t('builder.actions.reset') }}
          </UButton>

          <!-- Save Draft -->
          <UButton
            variant="outline"
            size="lg"
            block
            class="min-h-[44px] lg:flex-1 cursor-pointer"
            :disabled="!formStore.formData.task || isEnhancing || isSavingDraft"
            :loading="isSavingDraft"
            :aria-busy="isSavingDraft"
            @click="handleSaveDraft"
          >
            <template #leading>
              <UIcon name="i-heroicons-bookmark" />
            </template>
            {{ t('builder.actions.saveDraft') }}
          </UButton>

          <!-- Quick Polish -->
          <UButton
            color="primary"
            size="lg"
            block
            class="min-h-[44px] lg:flex-1 cursor-pointer"
            :loading="isEnhancing"
            :disabled="!formStore.isComplete || !formStore.isValid || isEnhancing || isQueued || rateLimitStore.isLimitExceeded"
            :aria-busy="isEnhancing"
            :aria-label="
              isEnhancing ? t('builder.actions.enhancing') : t('builder.actions.quickEnhance')
            "
            @click="handleEnhance('quick')"
          >
            <template #leading>
              <UIcon name="i-heroicons-sparkles" />
            </template>
            {{ t('builder.actions.quickEnhance') }}
          </UButton>
        </div>

        <!-- Keyboard Shortcuts Help - Collapsible -->
        <div class="rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
          <button
            type="button"
            class="w-full p-4 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            :aria-expanded="showKeyboardShortcuts"
            aria-controls="keyboard-shortcuts-content"
            @click="showKeyboardShortcuts = !showKeyboardShortcuts"
          >
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-command-line"
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
              />
              <span class="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {{ t('builder.shortcuts.title') }}
              </span>
            </div>
            <UIcon
              :name="showKeyboardShortcuts ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200"
            />
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-show="showKeyboardShortcuts"
              id="keyboard-shortcuts-content"
              class="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-200 dark:border-blue-800"
            >
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-700 dark:text-blue-300"
              >
                <div class="flex items-center gap-2">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">Ctrl+Enter</kbd>
                  <span>{{ t('builder.shortcuts.quickEnhance') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">Ctrl+Shift+Enter</kbd>
                  <span>{{ t('builder.shortcuts.deepEnhance') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">Ctrl+S</kbd>
                  <span>{{ t('builder.shortcuts.saveDraft') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">Ctrl+R</kbd>
                  <span>{{ t('builder.shortcuts.reset') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">Esc</kbd>
                  <span>{{ t('builder.shortcuts.clearFocus') }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Quality Score Details Modal -->
    <UModal
      v-model:open="showQualityModal"
      :title="t('builder.preview.quality')"
      :description="t('builder.preview.qualityModalDescription', 'Detailed breakdown of your prompt quality score')"
    >
      <template #header>
        <div class="flex items-center justify-between w-full p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('builder.preview.quality') }}
          </h2>
          <button
            type="button"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            :aria-label="t('common.close', 'Close')"
            @click="showQualityModal = false"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col items-center space-y-6 p-4">
          <!-- Large Quality Score Display -->
          <BuilderQualityScore :score="qualityScore" size="lg" :show-label="true" />

          <!-- Quality Breakdown -->
          <div class="w-full">
            <BuilderQualityBreakdown :breakdown="scoreBreakdown" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Reset Confirmation Modal -->
    <BuilderResetConfirmModal v-model="showResetModal" @confirm="confirmReset" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useRateLimitStore } from '~/stores/rateLimit'
import { useEnhancement } from '~/composables/useEnhancement'
import { useQualityScore } from '~/composables/useQualityScore'
import { useLocalStorage } from '~/composables/useLocalStorage'

// Composables
const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const formStore = useFormStore()
const rateLimitStore = useRateLimitStore()
const { enhance, isLoading: isEnhancing, enhancedPrompt, isQueued } = useEnhancement()
const { calculate: calculateQualityScore } = useQualityScore()
const { saveDraft, loadDraft, clearDraft, startAutoSave, stopAutoSave } = useLocalStorage()

// SEO Meta Tags
useHead({
  title: computed(() => t('builder.meta.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('builder.meta.description')),
    },
    {
      name: 'keywords',
      content: computed(() => t('builder.meta.keywords')),
    },
  ],
})

// Auto-save status
const autoSaveStatus = ref<'idle' | 'saving' | 'saved'>('idle')

// Save draft loading state
const isSavingDraft = ref(false)

// Quality Score Modal
const showQualityModal = ref(false)

// Reset Confirmation Modal
const showResetModal = ref(false)

// Keyboard shortcuts section expanded state (open by default)
const showKeyboardShortcuts = ref(true)

// Quality score calculation
const qualityScoreResult = computed(() => {
  return calculateQualityScore(formStore.formData)
})

const qualityScore = computed(() => qualityScoreResult.value.score)
const scoreBreakdown = computed(() => qualityScoreResult.value.breakdown)

// Quality score color classes for sticky bar
const qualityScoreTextColor = computed(() => {
  if (qualityScore.value >= 80) return 'text-emerald-500'
  if (qualityScore.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
})

const qualityScoreStrokeColor = computed(() => {
  if (qualityScore.value >= 80) return 'stroke-emerald-500'
  if (qualityScore.value >= 60) return 'stroke-yellow-500'
  return 'stroke-red-500'
})

const qualityRatingLabel = computed(() => {
  if (qualityScore.value >= 90) return t('quality.rating.excellent')
  if (qualityScore.value >= 80) return t('quality.rating.veryGood')
  if (qualityScore.value >= 70) return t('quality.rating.good')
  if (qualityScore.value >= 60) return t('quality.rating.fair')
  if (qualityScore.value >= 40) return t('quality.rating.needsImprovement')
  return t('quality.rating.poor')
})

// Completion percentage from form store
const completionPercentage = computed(() => formStore.completionPercentage)

// Live preview text
const previewText = computed(() => {
  const data = formStore.formData
  if (!data.task) return ''

  const parts: string[] = []

  if (data.role) {
    parts.push(`${t('builder.preview.roleLabel')}: ${data.role}`)
  }

  if (data.audience) {
    parts.push(`${t('builder.preview.audienceLabel')}: ${data.audience}`)
  }

  parts.push(`\n${t('builder.preview.taskLabel')}:\n${data.task}`)

  if (data.tone) {
    parts.push(`\n${t('builder.preview.toneLabel')}: ${data.tone}`)
  }

  if (data.outputFormat) {
    parts.push(`${t('builder.preview.formatLabel')}: ${data.outputFormat}`)
  }

  if (data.constraints.length > 0) {
    parts.push(`\n${t('builder.preview.constraintsLabel')}:\n- ${data.constraints.join('\n- ')}`)
  }

  if (data.examples) {
    parts.push(`\n${t('builder.preview.examplesLabel')}:\n${data.examples}`)
  }

  if (data.context) {
    parts.push(`\n${t('builder.preview.contextLabel')}:\n${data.context}`)
  }

  return parts.join('\n')
})

// Word and character count
const wordCount = computed(() => {
  if (!previewText.value) return 0
  return previewText.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
})

const charCount = computed(() => {
  return previewText.value.length
})

// Handlers
const handleEnhance = async (level: 'quick' | 'detailed') => {
  if (!formStore.isComplete || !formStore.isValid) {
    toast.add({
      title: t('builder.validation.error'),
      description: t('builder.validation.fixErrors'),
      color: 'neutral',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  // Update the enhancement level in the form store
  formStore.updateField('enhancementLevel', level)

  // CRITICAL: Sync the current locale with form language for proper API response language
  const currentLocale = locale.value as 'en' | 'ar'
  formStore.updateField('language', currentLocale)

  try {
    await enhance(formStore.formData)

    // Check if we got a result
    if (enhancedPrompt.value) {
      toast.add({
        title: t('builder.enhancement.success'),
        description: t('builder.enhancement.successDescription'),
        color: 'emerald',
        icon: 'i-heroicons-check-circle',
      })

      // Navigate to results page
      router.push(localePath('/results'))
    }
  } catch {
    toast.add({
      title: t('builder.enhancement.error'),
      description: t('builder.enhancement.errorDescription'),
      color: 'neutral',
      icon: 'i-heroicons-x-circle',
    })
  }
}

const handleReset = () => {
  showResetModal.value = true
}

const confirmReset = () => {
  formStore.resetForm()
  clearDraft() // Clear saved draft from localStorage to prevent restoration on refresh
  toast.add({
    title: t('builder.actions.resetSuccess'),
    description: t('builder.actions.resetSuccessDescription'),
    color: 'primary',
    icon: 'i-heroicons-arrow-path',
  })
}

const handleSaveDraft = async () => {
  if (isSavingDraft.value) return

  isSavingDraft.value = true

  try {
    const draftData = {
      draft: formStore.formData,
      lastSaved: new Date(),
      autoSaved: false,
    }
    saveDraft(draftData)
    toast.add({
      title: t('builder.actions.draftSaved'),
      description: t('builder.actions.draftSavedDescription'),
      color: 'emerald',
      icon: 'i-heroicons-bookmark',
    })
  } finally {
    // Brief delay to show loading state
    setTimeout(() => {
      isSavingDraft.value = false
    }, 300)
  }
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl+Enter: Quick Enhance
  if (event.ctrlKey && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (formStore.isComplete && formStore.isValid && !isEnhancing.value) {
      handleEnhance('quick')
    }
  }

  // Ctrl+Shift+Enter: Deep Enhancement
  if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
    event.preventDefault()
    if (formStore.isComplete && formStore.isValid && !isEnhancing.value) {
      handleEnhance('detailed')
    }
  }

  // Ctrl+S: Save Draft
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    if (formStore.formData.task) {
      handleSaveDraft()
    }
  }

  // Ctrl+R: Reset (override browser refresh)
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault()
    handleReset()
  }

  // Esc: Clear focus
  if (event.key === 'Escape') {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      activeElement.blur()
    }
  }
}

// Auto-save watcher
watch(
  () => formStore.formData,
  () => {
    autoSaveStatus.value = 'saving'
    setTimeout(() => {
      autoSaveStatus.value = 'saved'
      setTimeout(() => {
        autoSaveStatus.value = 'idle'
      }, 2000)
    }, 500)
  },
  { deep: true }
)

// Lifecycle hooks
onMounted(() => {
  // Load saved draft (skip undefined/null values to avoid restoring old defaults)
  const draftData = loadDraft()
  if (draftData && draftData.draft) {
    Object.entries(draftData.draft).forEach(([key, value]) => {
      // Skip undefined, null, or empty string values
      if (value !== undefined && value !== null && value !== '') {
        // Skip old default values for tone and outputFormat to start fresh
        if (key === 'tone' && value === 'professional') return
        if (key === 'outputFormat' && value === 'paragraph') return

        formStore.updateField(key as keyof typeof formStore.formData, value)
      }
    })
  }

  // Start auto-save
  startAutoSave(() => ({
    draft: formStore.formData,
    lastSaved: new Date(),
    autoSaved: true,
  }))

  // Add keyboard shortcut listener
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // Stop auto-save
  stopAutoSave()

  // Remove keyboard shortcut listener
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
kbd {
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 600;
}

.prose {
  max-width: none;
}
</style>
