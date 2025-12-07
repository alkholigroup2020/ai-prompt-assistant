<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ $t('emailChecker.language.label') }}
    </label>

    <div class="flex gap-2">
      <button
        type="button"
        :class="[
          'flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer',
          'flex items-center justify-center gap-2',
          modelValue === 'en'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
        :disabled="disabled"
        @click="selectLanguage('en')"
      >
        <UIcon name="i-heroicons-language" class="w-5 h-5" />
        <span class="font-medium">English</span>
        <UIcon
          v-if="modelValue === 'en'"
          name="i-heroicons-check-circle-solid"
          class="w-5 h-5 text-emerald-500"
        />
      </button>

      <button
        type="button"
        :class="[
          'flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer',
          'flex items-center justify-center gap-2',
          modelValue === 'ar'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
        :disabled="disabled"
        @click="selectLanguage('ar')"
      >
        <UIcon name="i-heroicons-language" class="w-5 h-5" />
        <span class="font-medium">العربية</span>
        <UIcon
          v-if="modelValue === 'ar'"
          name="i-heroicons-check-circle-solid"
          class="w-5 h-5 text-emerald-500"
        />
      </button>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ $t('emailChecker.language.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EmailLanguage } from '~/types/email'

interface Props {
  modelValue: EmailLanguage
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: EmailLanguage): void
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

const selectLanguage = (lang: EmailLanguage) => {
  emit('update:modelValue', lang)
}
</script>
