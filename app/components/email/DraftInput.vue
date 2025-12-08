<template>
  <div class="h-full flex flex-col">
    <!-- Label and character count row -->
    <div class="flex items-center justify-between mb-1.5">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ $t('emailChecker.input.label') }} <span class="text-red-500">*</span>
      </label>
      <span
        :class="{
          'text-red-500 dark:text-red-400': isOverLimit || isUnderLimit,
          'text-emerald-600 dark:text-emerald-400': isWithinLimit,
          'text-gray-500 dark:text-gray-400': !modelValue
        }"
        class="text-xs font-medium"
      >
        {{ characterCount }} / {{ maxLength }}
      </span>
    </div>

    <!-- Textarea container - takes remaining height -->
    <div class="relative flex-1 min-h-0">
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-full min-h-[200px] px-3 py-2 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        :style="{ direction: props.direction, textAlign: props.direction === 'rtl' ? 'right' : 'left' }"
        @input="handleInput(($event.target as HTMLTextAreaElement).value)"
        @blur="handleBlur"
      />

      <!-- Progress indicator bar at bottom of textarea -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
        <div
          class="h-full transition-all duration-300 ease-out"
          :class="{
            'bg-emerald-500': isWithinLimit,
            'bg-amber-500': characterCount > 0 && characterCount < minLength,
            'bg-red-500': isOverLimit
          }"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>

    <!-- Help text -->
    <div v-if="!validationError" class="flex items-center gap-1.5 mt-1.5 text-gray-500 dark:text-gray-400">
      <UIcon name="i-heroicons-information-circle" class="size-4 shrink-0" />
      <span class="text-sm">{{ $t('emailChecker.input.helpText') }}</span>
    </div>
    <div v-else class="mt-1.5 text-sm text-red-500 dark:text-red-400">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  minLength?: number
  maxLength?: number
  disabled?: boolean
  direction?: 'ltr' | 'rtl'
  language?: 'en' | 'ar'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  minLength: 10,
  maxLength: 5000,
  disabled: false,
  direction: 'ltr',
  language: 'en'
})

const { t } = useI18n()

// Computed placeholder based on language
const placeholder = computed(() => {
  return props.language === 'ar'
    ? t('emailChecker.input.placeholderAr')
    : t('emailChecker.input.placeholder')
})

const emit = defineEmits<Emits>()

// Character count
const characterCount = computed(() => props.modelValue.length)

// Progress percentage (capped at 100%)
const progressPercentage = computed(() => {
  const percentage = (characterCount.value / props.maxLength) * 100
  return Math.min(Math.round(percentage), 100)
})

// Validation states
const isUnderLimit = computed(
  () => characterCount.value > 0 && characterCount.value < props.minLength
)
const isOverLimit = computed(() => characterCount.value > props.maxLength)
const isWithinLimit = computed(
  () =>
    characterCount.value >= props.minLength &&
    characterCount.value <= props.maxLength
)

// Validation error message
const validationError = computed(() => {
  if (isOverLimit.value) {
    return `Email must not exceed ${props.maxLength} characters`
  }
  return undefined
})

// Handle input
const handleInput = (value: string | number) => {
  emit('update:modelValue', String(value))
}

// Handle blur event
const handleBlur = () => {
  emit('blur')
}
</script>
