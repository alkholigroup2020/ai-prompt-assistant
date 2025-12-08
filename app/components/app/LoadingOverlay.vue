<script setup lang="ts">
/**
 * Global loading overlay component
 * Shows a full-screen spinner when long-running tasks are in progress
 * Automatically tracks loading states from enhancement composables
 */

// Get loading states from both enhancement composables
const { isLoading: isPromptLoading } = useEnhancement()
const { isLoading: isEmailLoading } = useEmailEnhancement()

// i18n
const { t } = useI18n()

// Combined loading state
const isLoading = computed(() => isPromptLoading.value || isEmailLoading.value)

// Determine which loading message to show
const loadingMessage = computed(() => {
  if (isPromptLoading.value) {
    return t('loading.enhancingPrompt')
  }
  if (isEmailLoading.value) {
    return t('loading.enhancingEmail')
  }
  return t('common.loading')
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50"
        role="dialog"
        aria-modal="true"
        :aria-label="loadingMessage"
      >
        <!-- Loading card -->
        <div
          class="mx-4 flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-800"
        >
          <!-- Spinner -->
          <div class="relative">
            <!-- Outer ring -->
            <div
              class="h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500 dark:border-emerald-800 dark:border-t-emerald-400"
            />
            <!-- Inner pulse -->
            <div
              class="absolute inset-0 flex items-center justify-center"
            >
              <div
                class="h-8 w-8 animate-pulse rounded-full bg-emerald-100 dark:bg-emerald-900/50"
              />
            </div>
          </div>

          <!-- Loading message -->
          <p
            class="text-center text-base font-medium text-gray-700 dark:text-gray-200"
          >
            {{ loadingMessage }}
          </p>

          <!-- Subtle hint -->
          <p
            class="text-center text-sm text-gray-500 dark:text-gray-400"
          >
            {{ t('loading.pleaseWait') }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
