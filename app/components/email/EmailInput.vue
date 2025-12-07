<template>
  <div class="space-y-3">
    <UFormField
      :label="$t('emailChecker.input.label')"
      :error="validationError"
      required
    >
      <template #hint>
        <div class="flex items-center gap-2">
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
      </template>

      <div class="relative">
        <UTextarea
          :model-value="modelValue"
          :placeholder="$t('emailChecker.input.placeholder')"
          :rows="8"
          autoresize
          :maxrows="16"
          size="lg"
          class="w-full"
          :disabled="disabled"
          @update:model-value="handleInput"
          @blur="handleBlur"
        />

        <!-- Progress indicator bar at bottom of textarea -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-md overflow-hidden">
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

      <template #help>
        <div v-if="!validationError" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-information-circle" class="size-4 shrink-0" />
          <span>{{ $t('emailChecker.input.helpText') }}</span>
        </div>
      </template>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  minLength?: number
  maxLength?: number
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  minLength: 10,
  maxLength: 5000,
  disabled: false
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
