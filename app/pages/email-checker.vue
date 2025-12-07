<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Page Header -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('emailChecker.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t('emailChecker.subtitle') }}
        </p>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <!-- Input Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <form @submit.prevent="handleEnhance">
            <div class="space-y-6">
              <!-- Email Input -->
              <EmailEmailInput
                v-model="emailDraft"
                :disabled="isLoading"
                @blur="validateDraft"
              />

              <!-- Settings Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Output Language -->
                <EmailOutputLanguageSelector
                  v-model="outputLanguage"
                  :disabled="isLoading"
                />

                <!-- Tone Selector -->
                <EmailToneSelector
                  v-model="selectedTone"
                  :disabled="isLoading"
                />
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

              <!-- Submit Button -->
              <div class="flex justify-center pt-2">
                <UButton
                  type="submit"
                  size="xl"
                  :loading="isLoading"
                  :disabled="!isFormValid || isLoading"
                  class="px-8 cursor-pointer"
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
        </div>

        <!-- Results Section -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-if="hasResult"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8"
          >
            <EmailEmailComparison
              :original-email="originalEmail"
              :enhanced-email="enhancedEmail"
              :suggested-subject="suggestedSubject"
              :improvements="improvements"
              @new-email="handleNewEmail"
              @copy="handleCopy"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmailLanguage, EmailTone } from '~/types/email'

// SEO
const { t } = useI18n()

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

// Get current locale for default language
const { locale } = useI18n()

// Form state
const emailDraft = ref('')
const outputLanguage = ref<EmailLanguage>(locale.value === 'ar' ? 'ar' : 'en')
const selectedTone = ref<EmailTone | undefined>(undefined)

// Email enhancement composable
const {
  enhance,
  clear,
  hasResult,
  enhancedEmail,
  suggestedSubject,
  improvements,
  isLoading,
  error,
  originalEmail
} = useEmailEnhancement()

// Form validation
const isFormValid = computed(() => {
  const trimmedDraft = emailDraft.value.trim()
  return trimmedDraft.length >= 10 && trimmedDraft.length <= 5000
})

// Validate draft on blur
const validateDraft = () => {
  // Validation is handled by the EmailInput component
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

    // Scroll to results
    await nextTick()
    const resultsSection = document.querySelector('[data-results]')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  catch {
    // Error is handled by the composable and displayed in UI
  }
}

// Handle new email action
const handleNewEmail = () => {
  emailDraft.value = ''
  selectedTone.value = undefined
  clear()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle copy action
const handleCopy = () => {
  // Copy handled by EmailComparison component
}

// Watch locale changes to update default language
watch(locale, (newLocale) => {
  // Only update if user hasn't manually changed the language
  if (!hasResult.value) {
    outputLanguage.value = newLocale === 'ar' ? 'ar' : 'en'
  }
})
</script>
