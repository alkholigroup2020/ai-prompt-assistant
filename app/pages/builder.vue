<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('builder.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t('builder.subtitle') }}
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
            {{ t('builder.progress.label') }}
          </span>
          <span class="text-sm md:text-base font-medium text-emerald-600 dark:text-emerald-400">
            {{ completionPercentage }}%
          </span>
        </div>
        <ProgressBar
          :value="completionPercentage"
          color="primary"
          size="md"
          :striped="completionPercentage < 100"
          :animated="completionPercentage < 100"
        />
      </div>

      <!-- Two-Column Layout: Form + Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <!-- Left Column: Form Sections -->
        <div class="space-y-6">
          <!-- Basic Information Section -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-emerald-600" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.sections.basic') }}
                </h2>
              </div>
            </template>

            <div class="space-y-4">
              <RoleSelector />
              <AudienceSelector />
              <TaskInput />
            </div>
          </Card>

          <!-- Style & Format Section -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-paint-brush" class="w-5 h-5 text-emerald-600" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.sections.style') }}
                </h2>
              </div>
            </template>

            <div class="space-y-4">
              <ToneSelector />
              <OutputFormatSelector />
            </div>
          </Card>

          <!-- Constraints Section -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-emerald-600" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.sections.constraints') }}
                </h2>
              </div>
            </template>

            <ConstraintsSelector />
          </Card>

          <!-- Advanced Options Section -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-emerald-600" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.sections.advanced') }}
                </h2>
              </div>
            </template>

            <AdvancedOptions />
          </Card>
        </div>

        <!-- Right Column: Live Preview Panel -->
        <div class="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <!-- Quality Score Display -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-emerald-600" />
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
              <QualityScore
                :score="qualityScore"
                size="lg"
                :show-label="true"
              />

              <div class="w-full">
                <QualityBreakdown :breakdown="scoreBreakdown" />
              </div>
            </div>
          </Card>

          <!-- Real-time Suggestions -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-emerald-600" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ t('builder.preview.suggestions') }}
                </h2>
              </div>
            </template>

            <Suggestions
              :suggestions="suggestions"
              @apply="applySuggestion"
            />
          </Card>

          <!-- Live Preview -->
          <Card padding="lg" shadow="md">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-eye" class="w-5 h-5 text-emerald-600" />
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
          </Card>

          <!-- Enhancement Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <UButton
              color="primary"
              size="lg"
              block
              class="min-h-[44px]"
              :loading="isEnhancing"
              :disabled="!formStore.isValid || isEnhancing"
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
        </div>
      </div>

      <!-- Keyboard Shortcuts Help -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-start gap-3">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {{ t('builder.shortcuts.title') }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div><kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+Enter</kbd> {{ t('builder.shortcuts.quickEnhance') }}</div>
              <div><kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+Shift+Enter</kbd> {{ t('builder.shortcuts.deepEnhance') }}</div>
              <div><kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+S</kbd> {{ t('builder.shortcuts.saveDraft') }}</div>
              <div><kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Ctrl+R</kbd> {{ t('builder.shortcuts.reset') }}</div>
              <div><kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded">Esc</kbd> {{ t('builder.shortcuts.clearFocus') }}</div>
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
      content: computed(() => t('builder.meta.description'))
    },
    {
      name: 'keywords',
      content: computed(() => t('builder.meta.keywords'))
    }
  ]
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
  return previewText.value.trim().split(/\s+/).filter(word => word.length > 0).length
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
      icon: 'i-heroicons-exclamation-triangle'
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
        icon: 'i-heroicons-check-circle'
      })

      // Navigate to results page
      router.push('/results')
    }
  } catch {
    toast.add({
      title: t('builder.enhancement.error'),
      description: t('builder.enhancement.errorDescription'),
      color: 'primary',
      icon: 'i-heroicons-x-circle'
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
      icon: 'i-heroicons-arrow-path'
    })
  }
}

const handleSaveDraft = () => {
  const draftData = {
    draft: formStore.formData,
    lastSaved: new Date(),
    autoSaved: false
  }
  saveDraft(draftData)
  toast.add({
    title: t('builder.actions.draftSaved'),
    description: t('builder.actions.draftSavedDescription'),
    color: 'emerald',
    icon: 'i-heroicons-bookmark'
  })
}

const applySuggestion = (suggestion: { field?: string; value?: string }) => {
  if (suggestion.field && suggestion.value) {
    formStore.updateField(suggestion.field as keyof typeof formStore.formData, suggestion.value)
    toast.add({
      title: t('builder.suggestions.applied'),
      description: t('builder.suggestions.appliedDescription'),
      color: 'emerald',
      icon: 'i-heroicons-check-circle'
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
    autoSaved: true
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
