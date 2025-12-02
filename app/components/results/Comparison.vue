<script setup lang="ts">
/**
 * Comparison Component
 * Displays original vs enhanced prompt side-by-side
 */
import { copyToClipboard } from '~/utils/export'

interface Props {
  originalPrompt: string
  enhancedPrompt: string
  showDifferences?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDifferences: true,
})

const emit = defineEmits<{
  copy: []
}>()

const { t } = useI18n()

// Copy state
const isCopying = ref(false)

/**
 * Copy enhanced prompt to clipboard
 */
const handleCopy = async (): Promise<void> => {
  if (isCopying.value) return

  isCopying.value = true

  try {
    await copyToClipboard(props.enhancedPrompt)
    emit('copy')
  } catch (error) {
    console.error('Failed to copy:', error)
  } finally {
    // Reset after a short delay to show the checkmark
    setTimeout(() => {
      isCopying.value = false
    }, 1500)
  }
}

/**
 * Calculate word count for a given text
 */
const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

/**
 * Calculate character count
 */
const getCharCount = (text: string): number => {
  return text.trim().length
}

// Computed stats
const originalStats = computed(() => ({
  words: getWordCount(props.originalPrompt),
  chars: getCharCount(props.originalPrompt),
}))

const enhancedStats = computed(() => ({
  words: getWordCount(props.enhancedPrompt),
  chars: getCharCount(props.enhancedPrompt),
}))

const improvementPercentage = computed(() => {
  if (originalStats.value.chars === 0) return 0
  const improvement =
    ((enhancedStats.value.chars - originalStats.value.chars) / originalStats.value.chars) * 100
  return Math.round(improvement)
})
</script>

<template>
  <div class="comparison-container">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('results.comparison.title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('results.comparison.description') }}
      </p>
    </div>

    <!-- Comparison Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Original Prompt -->
      <div class="comparison-card">
        <div class="card-header bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center gap-3 mb-2">
            <UIcon
              name="i-heroicons-document-text"
              class="w-6 h-6 text-gray-600 dark:text-gray-400"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('results.comparison.original') }}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ originalStats.words }} {{ t('results.comparison.words') }}</span>
            <span>•</span>
            <span>{{ originalStats.chars }} {{ t('results.comparison.chars') }}</span>
          </div>
        </div>
        <div class="card-body">
          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ originalPrompt }}
          </p>
        </div>
      </div>

      <!-- Enhanced Prompt -->
      <div class="comparison-card enhanced relative">
        <!-- Copy Button - Absolute positioned -->
        <button
          :aria-label="t('results.actions.copy')"
          :title="t('results.actions.copy')"
          class="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
          :disabled="isCopying"
          @click="handleCopy"
        >
          <UIcon
            :name="isCopying ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            class="w-5 h-5"
          />
        </button>
        <div class="card-header bg-emerald-50 dark:bg-emerald-950">
          <div class="flex items-center gap-3 mb-2">
            <UIcon
              name="i-heroicons-sparkles"
              class="w-6 h-6 text-emerald-700 dark:text-emerald-400"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('results.comparison.enhanced') }}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-400">
            <span>{{ enhancedStats.words }} {{ t('results.comparison.words') }}</span>
            <span>•</span>
            <span>{{ enhancedStats.chars }} {{ t('results.comparison.chars') }}</span>
            <span v-if="improvementPercentage > 0" class="font-medium">
              (+{{ improvementPercentage }}%)
            </span>
          </div>
        </div>
        <div class="card-body">
          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ enhancedPrompt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Improvement Indicator -->
    <div
      v-if="improvementPercentage > 0"
      class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800"
    >
      <div class="flex items-center gap-3">
        <UIcon
          name="i-heroicons-arrow-trending-up"
          class="w-6 h-6 text-emerald-700 dark:text-emerald-400"
        />
        <div>
          <p class="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            {{ t('results.comparison.improved', { percentage: improvementPercentage }) }}
          </p>
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            {{ t('results.comparison.improvedDescription') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.comparison-container {
  @apply w-full;
}

.comparison-card {
  @apply bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-all duration-200;
}

.comparison-card:hover {
  @apply shadow-md border-gray-300 dark:border-gray-700;
}

.comparison-card.enhanced {
  @apply ring-2 ring-emerald-500/20;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200 dark:border-gray-800;
}

.card-body {
  @apply px-6 py-5;
}

/* Mobile responsive: stack cards vertically */
@media (max-width: 1023px) {
  .comparison-card {
    @apply mb-4;
  }
}

/* RTL Support */
html[dir='rtl'] .comparison-card {
  @apply text-right;
}
</style>
