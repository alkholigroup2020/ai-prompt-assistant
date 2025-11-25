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
            <div class="flex items-center justify-between mb-1.5">
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
            />
          </div>

          <!-- Quality Score Circle (25%) -->
          <div class="flex-shrink-0 flex items-center gap-3 pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-gray-200 dark:border-gray-700">
            <!-- Label (appears before circle in RTL) -->
            <div class="hidden sm:block order-2 rtl:order-1 text-start rtl:text-end">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ t('builder.preview.quality') }}
              </p>
              <p :class="qualityScoreTextColor" class="text-sm font-semibold">
                {{ qualityRatingLabel }}
              </p>
            </div>
            <!-- Circle -->
            <div class="relative w-14 h-14 md:w-16 md:h-16 order-1 rtl:order-2">
              <svg
                class="w-full h-full transform -rotate-90"
                viewBox="0 0 64 64"
              >
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
                <span :class="qualityScoreTextColor" class="text-sm md:text-base font-bold">
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

            <div class="space-y-4">
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

          <!-- Preview and Actions Section -->
          <!-- Quality Score Display -->
          <UiCard padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-emerald-700" />
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ t('builder.preview.quality') }}
                  </h2>
                </div>
                <UBadge v-if="autoSaveStatus === 'saved'" color="emerald" variant="subtle">
                  {{ t('builder.autoSave.saved') }}
                </UBadge>
                <UBadge v-else-if="autoSaveStatus === 'saving'" color="primary" variant="subtle">
                  {{ t('builder.autoSave.saving') }}
                </UBadge>
              </div>
            </template>

            <div class="flex flex-col items-center space-y-4">
              <BuilderQualityScore :score="qualityScore" size="lg" :show-label="true" />

              <div class="w-full">
                <BuilderQualityBreakdown :breakdown="scoreBreakdown" />
              </div>
            </div>
          </UiCard>

          <!-- Real-time Suggestions -->
          <UiCard padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-emerald-700" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.preview.suggestions') }}
                </h2>
              </div>
            </template>

            <BuilderSuggestions :suggestions="suggestions" @apply="applySuggestion" />
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
              <div
                class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ t('builder.preview.words') }}: {{ wordCount }}</span>
                <span>{{ t('builder.preview.chars') }}: {{ charCount }}</span>
              </div>
            </template>
          </UiCard>

          <!-- Enhancement Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <UButton
              color="primary"
              size="lg"
              block
              class="min-h-[44px]"
              :loading="isEnhancing"
              :disabled="!formStore.isValid || isEnhancing"
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

            <UButton
              color="emerald"
              size="lg"
              block
              class="min-h-[44px]"
              :loading="isEnhancing"
              :disabled="!formStore.isValid || isEnhancing"
              :aria-busy="isEnhancing"
              :aria-label="
                isEnhancing ? t('builder.actions.enhancing') : t('builder.actions.deepEnhance')
              "
              @click="handleEnhance('detailed')"
            >
              <template #leading>
                <UIcon name="i-heroicons-bolt" />
              </template>
              {{ t('builder.actions.deepEnhance') }}
            </UButton>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <UButton
              variant="outline"
              size="md"
              block
              class="min-h-[44px]"
              :disabled="isEnhancing"
              @click="handleReset"
            >
              <template #leading>
                <UIcon name="i-heroicons-arrow-path" />
              </template>
              {{ t('builder.actions.reset') }}
            </UButton>

            <UButton
              variant="outline"
              size="md"
              block
              class="min-h-[44px]"
              :disabled="!formStore.formData.task || isEnhancing"
              @click="handleSaveDraft"
            >
              <template #leading>
                <UIcon name="i-heroicons-bookmark" />
              </template>
              {{ t('builder.actions.saveDraft') }}
            </UButton>
          </div>

          <!-- Keyboard Shortcuts Help -->
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
              />
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {{ t('builder.shortcuts.title') }}
                </h3>
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-700 dark:text-blue-300"
                >
                  <div>
                    <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+Enter</kbd>
                    {{ t('builder.shortcuts.quickEnhance') }}
                  </div>
                  <div>
                    <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+Shift+Enter</kbd>
                    {{ t('builder.shortcuts.deepEnhance') }}
                  </div>
                  <div>
                    <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+S</kbd>
                    {{ t('builder.shortcuts.saveDraft') }}
                  </div>
                  <div>
                    <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+R</kbd>
                    {{ t('builder.shortcuts.reset') }}
                  </div>
                  <div>
                    <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Esc</kbd>
                    {{ t('builder.shortcuts.clearFocus') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useEnhancement } from '~/composables/useEnhancement'
import { useQualityScore } from '~/composables/useQualityScore'
import { useLocalStorage } from '~/composables/useLocalStorage'

// Composables
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const formStore = useFormStore()
const { enhance, state: enhancementState, enhancedPrompt } = useEnhancement()
const { calculate: calculateQualityScore } = useQualityScore()
const { saveDraft, loadDraft, startAutoSave, stopAutoSave } = useLocalStorage()

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

// Is enhancing computed property
const isEnhancing = computed(() => enhancementState.loading)

// Quality score calculation
const qualityScoreResult = computed(() => {
  return calculateQualityScore(formStore.formData)
})

const qualityScore = computed(() => qualityScoreResult.value.score)
const scoreBreakdown = computed(() => qualityScoreResult.value.breakdown)
const suggestions = computed(() => qualityScoreResult.value.suggestions)

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
  if (!formStore.isValid) {
    toast.add({
      title: t('builder.validation.error'),
      description: t('builder.validation.fixErrors'),
      color: 'primary',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  // Update the enhancement level in the form store
  formStore.updateField('enhancementLevel', level)

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
      color: 'primary',
      icon: 'i-heroicons-x-circle',
    })
  }
}

const handleReset = () => {
  if (confirm(t('builder.actions.resetConfirm'))) {
    formStore.resetForm()
    toast.add({
      title: t('builder.actions.resetSuccess'),
      description: t('builder.actions.resetSuccessDescription'),
      color: 'primary',
      icon: 'i-heroicons-arrow-path',
    })
  }
}

const handleSaveDraft = () => {
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
}

const applySuggestion = (suggestion: { action?: { field: string; value: string } }) => {
  if (suggestion.action?.field && suggestion.action?.value) {
    formStore.updateField(
      suggestion.action.field as keyof typeof formStore.formData,
      suggestion.action.value
    )
    toast.add({
      title: t('builder.suggestions.applied'),
      description: t('builder.suggestions.appliedDescription'),
      color: 'emerald',
      icon: 'i-heroicons-check-circle',
    })
  }
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl+Enter: Quick Enhance
  if (event.ctrlKey && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (formStore.isValid && !isEnhancing.value) {
      handleEnhance('quick')
    }
  }

  // Ctrl+Shift+Enter: Deep Enhancement
  if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
    event.preventDefault()
    if (formStore.isValid && !isEnhancing.value) {
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
  // Load saved draft
  const draftData = loadDraft()
  if (draftData && draftData.draft) {
    Object.entries(draftData.draft).forEach(([key, value]) => {
      formStore.updateField(key as keyof typeof formStore.formData, value)
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
