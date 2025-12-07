<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ $t('emailChecker.tone.label') }}
      <span class="text-gray-400 dark:text-gray-500 font-normal">
        ({{ $t('common.optional') }})
      </span>
    </label>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <button
        v-for="tone in toneOptions"
        :key="tone.value"
        type="button"
        :class="[
          'px-3 py-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer',
          'flex flex-col items-center gap-1.5 text-center',
          modelValue === tone.value
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
        :disabled="disabled"
        @click="selectTone(tone.value)"
      >
        <UIcon
          :name="tone.icon"
          :class="[
            'w-5 h-5',
            modelValue === tone.value
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-gray-500 dark:text-gray-400'
          ]"
        />
        <span
          :class="[
            'text-sm font-medium',
            modelValue === tone.value
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-gray-700 dark:text-gray-300'
          ]"
        >
          {{ tone.label }}
        </span>
      </button>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ $t('emailChecker.tone.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EmailTone } from '~/types/email'

interface Props {
  modelValue?: EmailTone
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: EmailTone | undefined): void
}

const { t } = useI18n()

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  disabled: false
})

const emit = defineEmits<Emits>()

interface ToneOption {
  value: EmailTone
  label: string
  icon: string
}

const toneOptions = computed<ToneOption[]>(() => [
  {
    value: 'professional',
    label: t('emailChecker.tone.options.professional'),
    icon: 'i-heroicons-briefcase'
  },
  {
    value: 'friendly',
    label: t('emailChecker.tone.options.friendly'),
    icon: 'i-heroicons-face-smile'
  },
  {
    value: 'formal',
    label: t('emailChecker.tone.options.formal'),
    icon: 'i-heroicons-document-text'
  },
  {
    value: 'casual',
    label: t('emailChecker.tone.options.casual'),
    icon: 'i-heroicons-chat-bubble-left-right'
  }
])

const selectTone = (tone: EmailTone) => {
  emit('update:modelValue', tone)
}
</script>
