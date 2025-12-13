<template>
  <div class="space-y-4">
    <UFormField
      :label="$t('builder.task.label')"
      :error="validationError"
      required
      :ui="{
        label: isFieldEmpty && formStore.isDirty ? 'text-red-500 dark:text-red-400' : ''
      }"
    >
      <template #hint>
        <div class="flex items-center gap-2">
          <span
            :class="{
              'text-error': isOverLimit || isUnderLimit,
              'text-success': isWithinLimit,
              'text-muted': !taskValue
            }"
            class="text-xs font-medium"
          >
            {{ characterCount }} / {{ CHAR_LIMITS.TASK_MAX }}
          </span>
        </div>
      </template>

      <div class="relative">
        <UTextarea
          v-model="taskValue"
          :placeholder="$t('builder.task.placeholder')"
          :rows="5"
          autoresize
          :maxrows="12"
          size="lg"
          class="w-full"
          :highlight="isError"
          @input="handleTaskChange"
          @blur="handleBlur"
        />

        <!-- Progress indicator bar at bottom of textarea -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-md overflow-hidden">
          <div
            class="h-full transition-all duration-300 ease-out"
            :class="{
              'bg-emerald-500': isWithinLimit,
              'bg-amber-500': characterCount > 0 && characterCount < CHAR_LIMITS.TASK_MIN,
              'bg-red-500': isOverLimit
            }"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <template #help>
        <div v-if="!validationError" class="flex items-center gap-1.5 text-muted">
          <UIcon name="i-heroicons-information-circle" class="size-4 shrink-0" />
          <span>{{ $t('builder.task.helpText') }}</span>
        </div>
      </template>
    </UFormField>

    <!-- Dynamic Example Prompts Selector -->
    <BuilderExamplePromptsSelector @select="handleExampleSelect" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'
import { CHAR_LIMITS } from '~/utils/validators'

const { t } = useI18n()
const formStore = useFormStore()

// Task value
const taskValue = ref('')

// Character count
const characterCount = computed(() => taskValue.value.length)

// Progress percentage (capped at 100%)
const progressPercentage = computed(() => {
  const percentage = (characterCount.value / CHAR_LIMITS.TASK_MAX) * 100
  return Math.min(Math.round(percentage), 100)
})

// Validation states
const isUnderLimit = computed(
  () => characterCount.value > 0 && characterCount.value < CHAR_LIMITS.TASK_MIN
)
const isOverLimit = computed(() => characterCount.value > CHAR_LIMITS.TASK_MAX)
const isWithinLimit = computed(
  () =>
    characterCount.value >= CHAR_LIMITS.TASK_MIN &&
    characterCount.value <= CHAR_LIMITS.TASK_MAX
)
const isError = computed(() => !!validationError.value)

// Validation error from store (translated)
const validationError = computed(() => {
  const error = formStore.validationErrors.task
  if (!error) return undefined
  return t(error.key, error.params || {})
})

// Check if field is required but empty (for label styling)
const isFieldEmpty = computed(() => !formStore.formData.task || formStore.formData.task.trim().length === 0 || formStore.formData.task.length < CHAR_LIMITS.TASK_MIN)

// Initialize from store and handle reset
watch(
  () => formStore.formData.task,
  (newTask) => {
    if (!newTask) {
      // Handle reset: clear the task value
      taskValue.value = ''
    } else if (newTask !== taskValue.value) {
      taskValue.value = newTask
    }
  },
  { immediate: true }
)

// Sync local taskValue to store whenever it changes
// This ensures the store is updated regardless of how the value changed
// (user typing, programmatic change, Playwright fill, etc.)
watch(taskValue, (newValue) => {
  if (newValue !== formStore.formData.task) {
    formStore.updateField('task', newValue)
  }
})

// Handle task change
const handleTaskChange = () => {
  formStore.updateField('task', taskValue.value)
}

// Handle blur event (validate on blur)
const handleBlur = () => {
  formStore.validateField('task')
}

// Handle example selection from the new component
const handleExampleSelect = (exampleText: string) => {
  taskValue.value = exampleText
  formStore.updateField('task', exampleText)
  formStore.validateField('task')
}
</script>
