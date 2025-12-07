<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto max-w-7xl px-4">
      <!-- Page Header (always visible) -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-8"
        >
          <UIcon
            name="i-heroicons-envelope"
            class="w-12 h-12 text-emerald-700 dark:text-emerald-400"
          />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('emailChecker.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-stone-300 max-w-2xl mx-auto">
          {{ $t('emailChecker.subtitle') }}
        </p>
      </div>

      <!-- Input Form Section (hidden when results are shown) -->
      <div v-if="!hasResult" class="space-y-6">
        <UiCard padding="lg" shadow="md">
          <form @submit.prevent="handleEnhance">
            <div class="space-y-6">
              <!-- Email Input -->
              <EmailDraftInput
                v-model="emailDraft"
                :disabled="isLoading"
                @blur="validateDraft"
              />

              <!-- Output Language Toggle -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('emailChecker.language.label') }}
                </label>
                <div class="flex">
                  <button
                    type="button"
                    :class="[
                      'flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',
                      'border border-gray-300 dark:border-gray-600',
                      'first:rounded-l-lg last:rounded-r-lg',
                      '-ml-px first:ml-0',
                      outputLanguage === 'en'
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:border-emerald-500 z-10'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                    :disabled="isLoading"
                    @click="outputLanguage = 'en'"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    :class="[
                      'flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',
                      'border border-gray-300 dark:border-gray-600',
                      'first:rounded-l-lg last:rounded-r-lg',
                      '-ml-px first:ml-0',
                      outputLanguage === 'ar'
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:border-emerald-500 z-10'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                    :disabled="isLoading"
                    @click="outputLanguage = 'ar'"
                  >
                    العربية
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('emailChecker.language.helpText') }}
                </p>
              </div>

              <!-- Tone Toggle -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('emailChecker.tone.label') }}
                  <span class="text-gray-400 dark:text-gray-500 font-normal">
                    ({{ $t('common.optional') }})
                  </span>
                </label>
                <div class="flex flex-wrap">
                  <button
                    v-for="(tone, index) in toneOptions"
                    :key="tone.value"
                    type="button"
                    :class="[
                      'flex-1 min-w-[100px] px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
                      'border border-gray-300 dark:border-gray-600',
                      index === 0 ? 'rounded-l-lg' : '',
                      index === toneOptions.length - 1 ? 'rounded-r-lg' : '',
                      index > 0 ? '-ml-px' : '',
                      selectedTone === tone.value
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:border-emerald-500 z-10'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                    :disabled="isLoading"
                    @click="selectedTone = selectedTone === tone.value ? undefined : tone.value"
                  >
                    {{ tone.label }}
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('emailChecker.tone.helpText') }}
                </p>
              </div>

              <!-- Error Display -->
              <div
                v-if="error"
                class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-heroicons-exclamation-circle"
                    class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p class="text-sm font-medium text-red-800 dark:text-red-200">
                      {{ $t('emailChecker.error.title') }}
                    </p>
                    <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                      {{ error.message }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <!-- Reset Button -->
                <UButton
                  type="button"
                  color="neutral"
                  variant="soft"
                  size="lg"
                  class="min-h-[44px] sm:flex-1 cursor-pointer !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-950/20 !border-red-300 dark:!border-red-800"
                  :disabled="isLoading || !emailDraft"
                  @click="handleReset"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-arrow-path" />
                  </template>
                  {{ $t('builder.actions.reset') }}
                </UButton>

                <!-- Enhance Button -->
                <UButton
                  type="submit"
                  color="primary"
                  size="lg"
                  :loading="isLoading"
                  :disabled="!isFormValid || isLoading"
                  class="min-h-[44px] sm:flex-[2] cursor-pointer"
                >
                  <template #leading>
                    <UIcon
                      v-if="!isLoading"
                      name="i-heroicons-sparkles"
                      class="w-5 h-5"
                    />
                  </template>
                  {{ isLoading ? $t('emailChecker.actions.enhancing') : $t('emailChecker.actions.enhance') }}
                </UButton>
              </div>
            </div>
          </form>
        </UiCard>
      </div>

      <!-- Results Section (shown after enhancement) -->
      <div v-else class="space-y-6">
        <!-- Enhanced Email Display -->
        <UiCard padding="lg" shadow="md">
          <!-- Suggested Subject Line -->
          <div
            v-if="suggestedSubject"
            class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
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

          <!-- Enhanced Email Content -->
          <div class="relative">
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

            <div class="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-6 pr-14 rtl:pr-6 rtl:pl-14">
              <div class="flex items-center gap-3 mb-4">
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                />
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ $t('emailChecker.results.enhanced') }}
                </h3>
              </div>
              <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ enhancedEmail }}
              </p>
            </div>
          </div>
        </UiCard>

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
                  {{ $t('results.nextSteps.title') }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('emailChecker.results.nextStepsDescription', 'Enhance another email or copy this one') }}
                </p>
              </div>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-heroicons-clipboard-document"
                class="flex-1 sm:flex-none cursor-pointer"
                @click="copyEnhanced"
              >
                {{ enhancedCopied ? $t('emailChecker.actions.copied') : $t('emailChecker.actions.copy') }}
              </UButton>
              <UButton
                color="primary"
                size="lg"
                icon="i-heroicons-plus-circle"
                class="flex-1 sm:flex-none cursor-pointer"
                @click="handleNewEmail"
              >
                {{ $t('emailChecker.actions.newEmail') }}
              </UButton>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmailLanguage, EmailTone } from '~/types/email'
import { copyToClipboard } from '~/utils/export'

// SEO
const { t, locale } = useI18n()
const toast = useToast()

useHead({
  title: () => t('emailChecker.meta.title'),
  meta: [
    { name: 'description', content: () => t('emailChecker.meta.description') }
  ]
})

useSeoMeta({
  title: () => t('emailChecker.meta.title'),
  description: () => t('emailChecker.meta.description'),
  ogTitle: () => t('emailChecker.meta.title'),
  ogDescription: () => t('emailChecker.meta.description')
})

// Form state
const emailDraft = ref('')
const outputLanguage = ref<EmailLanguage>(locale.value === 'ar' ? 'ar' : 'en')
const selectedTone = ref<EmailTone | undefined>(undefined)

// Copy states
const enhancedCopied = ref(false)
const subjectCopied = ref(false)

// Tone options
const toneOptions = computed(() => [
  { value: 'professional' as EmailTone, label: t('emailChecker.tone.options.professional') },
  { value: 'friendly' as EmailTone, label: t('emailChecker.tone.options.friendly') },
  { value: 'formal' as EmailTone, label: t('emailChecker.tone.options.formal') },
  { value: 'casual' as EmailTone, label: t('emailChecker.tone.options.casual') }
])

// Email enhancement composable
const {
  enhance,
  clear,
  hasResult,
  enhancedEmail,
  suggestedSubject,
  isLoading,
  error
} = useEmailEnhancement()

// Form validation
const isFormValid = computed(() => {
  const trimmedDraft = emailDraft.value.trim()
  return trimmedDraft.length >= 10 && trimmedDraft.length <= 5000
})

// Validate draft on blur
const validateDraft = () => {
  // Validation is handled by the EmailDraftInput component
}

// Handle form submission
const handleEnhance = async () => {
  if (!isFormValid.value || isLoading.value) return

  try {
    await enhance({
      emailDraft: emailDraft.value.trim(),
      outputLanguage: outputLanguage.value,
      tone: selectedTone.value
    })
  }
  catch {
    // Error is handled by the composable and displayed in UI
  }
}

// Handle reset
const handleReset = () => {
  emailDraft.value = ''
  selectedTone.value = undefined
  clear()
}

// Handle new email action
const handleNewEmail = () => {
  emailDraft.value = ''
  selectedTone.value = undefined
  clear()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Copy enhanced email
const copyEnhanced = async () => {
  if (enhancedCopied.value || !enhancedEmail.value) return

  try {
    await copyToClipboard(enhancedEmail.value)
    enhancedCopied.value = true

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
  catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Copy subject line
const copySubject = async () => {
  if (subjectCopied.value || !suggestedSubject.value) return

  try {
    await copyToClipboard(suggestedSubject.value)
    subjectCopied.value = true

    setTimeout(() => {
      subjectCopied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy subject:', err)
  }
}

// Watch locale changes to update default language
watch(locale, (newLocale) => {
  // Only update if user hasn't manually changed the language
  if (!hasResult.value) {
    outputLanguage.value = newLocale === 'ar' ? 'ar' : 'en'
  }
})
</script>
