<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ $t('emailChecker.results.title') }}
      </h2>
      <button
        type="button"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        @click="emit('newEmail')"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" />
        {{ $t('emailChecker.actions.newEmail') }}
      </button>
    </div>

    <!-- Suggested Subject Line -->
    <div
      v-if="suggestedSubject"
      class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-envelope"
          class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
            {{ $t('emailChecker.results.suggestedSubject') }}
          </p>
          <p class="mt-1 text-amber-900 dark:text-amber-100 font-medium">
            {{ suggestedSubject }}
          </p>
        </div>
        <button
          type="button"
          class="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer"
          :title="$t('emailChecker.actions.copy')"
          @click="copySubject"
        >
          <UIcon
            :name="subjectCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            class="w-5 h-5"
          />
        </button>
      </div>
    </div>

    <!-- Comparison Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Original Email -->
      <div class="comparison-card">
        <div class="card-header bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center gap-3 mb-2">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-gray-600 dark:text-gray-400"
            />
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ $t('emailChecker.results.original') }}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ originalStats.words }} {{ $t('emailChecker.results.words') }}</span>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span>{{ originalStats.chars }} {{ $t('emailChecker.results.chars') }}</span>
          </div>
        </div>
        <div class="card-body">
          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {{ originalEmail }}
          </p>
        </div>
      </div>

      <!-- Enhanced Email -->
      <div class="comparison-card enhanced relative">
        <!-- Copy Button -->
        <button
          type="button"
          class="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
          :title="$t('emailChecker.actions.copy')"
          @click="copyEnhanced"
        >
          <UIcon
            :name="enhancedCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            class="w-5 h-5"
          />
        </button>

        <div class="card-header bg-emerald-50 dark:bg-emerald-950">
          <div class="flex items-center gap-3 mb-2">
            <UIcon
              name="i-heroicons-sparkles"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ $t('emailChecker.results.enhanced') }}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-400">
            <span>{{ enhancedStats.words }} {{ $t('emailChecker.results.words') }}</span>
            <span class="text-emerald-300 dark:text-emerald-700">|</span>
            <span>{{ enhancedStats.chars }} {{ $t('emailChecker.results.chars') }}</span>
            <span
              v-if="improvementPercentage !== 0"
              class="font-medium"
            >
              ({{ improvementPercentage > 0 ? '+' : '' }}{{ improvementPercentage }}%)
            </span>
          </div>
        </div>
        <div class="card-body">
          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {{ enhancedEmail }}
          </p>
        </div>
      </div>
    </div>

    <!-- Improvements List -->
    <div
      v-if="improvements.length > 0"
      class="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800"
    >
      <div class="flex items-center gap-2 mb-3">
        <UIcon
          name="i-heroicons-check-badge"
          class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
        />
        <h4 class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          {{ $t('emailChecker.results.improvements') }}
        </h4>
      </div>
      <ul class="space-y-2">
        <li
          v-for="(improvement, index) in improvements"
          :key="index"
          class="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300"
        >
          <UIcon
            name="i-heroicons-check"
            class="w-4 h-4 mt-0.5 shrink-0 text-emerald-500"
          />
          <span>{{ improvement }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { copyToClipboard } from '~/utils/export'

interface Props {
  originalEmail: string
  enhancedEmail: string
  suggestedSubject?: string
  improvements: string[]
}

interface Emits {
  (e: 'newEmail' | 'copy'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const toast = useToast()

// Copy states
const enhancedCopied = ref(false)
const subjectCopied = ref(false)

// Calculate word count
const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

// Calculate character count
const getCharCount = (text: string): number => {
  return text.trim().length
}

// Stats computations
const originalStats = computed(() => ({
  words: getWordCount(props.originalEmail),
  chars: getCharCount(props.originalEmail)
}))

const enhancedStats = computed(() => ({
  words: getWordCount(props.enhancedEmail),
  chars: getCharCount(props.enhancedEmail)
}))

const improvementPercentage = computed(() => {
  if (originalStats.value.chars === 0) return 0
  const percentage =
    ((enhancedStats.value.chars - originalStats.value.chars) / originalStats.value.chars) * 100
  return Math.round(percentage)
})

// Copy enhanced email
const copyEnhanced = async () => {
  if (enhancedCopied.value) return

  try {
    await copyToClipboard(props.enhancedEmail)
    enhancedCopied.value = true
    emit('copy')

    toast.add({
      title: t('emailChecker.results.copySuccess'),
      description: t('emailChecker.results.copySuccessDescription'),
      icon: 'i-heroicons-check-circle',
      color: 'emerald'
    })

    setTimeout(() => {
      enhancedCopied.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy:', error)
  }
}

// Copy subject line
const copySubject = async () => {
  if (subjectCopied.value || !props.suggestedSubject) return

  try {
    await copyToClipboard(props.suggestedSubject)
    subjectCopied.value = true

    setTimeout(() => {
      subjectCopied.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy subject:', error)
  }
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

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
  @apply px-5 py-4 border-b border-gray-200 dark:border-gray-800;
}

.card-body {
  @apply px-5 py-4 max-h-80 overflow-y-auto;
}

/* RTL Support */
html[dir='rtl'] .comparison-card {
  @apply text-right;
}
</style>
