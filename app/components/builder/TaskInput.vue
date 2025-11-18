<template>
  <div class="space-y-2">
    <label
      for="task-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ $t('builder.task.label') }}
      <span class="text-red-500">*</span>
    </label>

    <UTextarea
      id="task-input"
      v-model="taskValue"
      :placeholder="$t('builder.task.placeholder')"
      :rows="6"
      autoresize
      :maxrows="15"
      :ui="{ base: 'w-full' }"
      :class="isError ? 'ring-2 ring-red-500 dark:ring-red-400 rounded-md' : ''"
      :aria-describedby="validationError ? 'task-error' : 'task-help'"
      :aria-invalid="isError"
      @input="handleTaskChange"
      @blur="handleBlur"
    />

    <!-- Character Counter -->
    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-2">
        <span
          :class="{
            'text-red-600 dark:text-red-400': isOverLimit || isUnderLimit,
            'text-emerald-700 dark:text-emerald-400': isWithinLimit,
            'text-gray-500 dark:text-gray-400': !taskValue
          }"
        >
          {{ characterCount }} / {{ CHAR_LIMITS.TASK_MAX }}
        </span>
        <span class="text-gray-400">{{ $t('builder.task.characters') }}</span>
      </div>

      <!-- Progress Bar -->
      <div class="flex items-center gap-2">
        <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-300"
            :class="{
              'bg-emerald-500': isWithinLimit,
              'bg-yellow-500': characterCount < CHAR_LIMITS.TASK_MIN,
              'bg-red-500': isOverLimit
            }"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ progressPercentage }}%
        </span>
      </div>
    </div>

    <!-- Validation Error -->
    <p v-if="validationError" id="task-error" class="text-sm text-red-600 dark:text-red-400 mt-1" role="alert" aria-live="polite">
      <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 inline" />
      {{ validationError }}
    </p>

    <!-- Help Text -->
    <p v-else id="task-help" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
      {{ $t('builder.task.helpText') }}
    </p>

    <!-- Example Prompts -->
    <div class="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
      <p class="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
        <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 inline" />
        {{ $t('builder.task.examplesTitle') }}
      </p>
      <ul class="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
        <li
          v-for="(example, index) in examples"
          :key="index"
          class="cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          @click="applyExample(example)"
        >
          • {{ example }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { CHAR_LIMITS } from '~/utils/validators';

const { t } = useI18n();
const formStore = useFormStore();

// Task value
const taskValue = ref('');

// Character count
const characterCount = computed(() => taskValue.value.length);

// Progress percentage (capped at 100%)
const progressPercentage = computed(() => {
  const percentage = (characterCount.value / CHAR_LIMITS.TASK_MAX) * 100;
  return Math.min(Math.round(percentage), 100);
});

// Validation states
const isUnderLimit = computed(() => characterCount.value > 0 && characterCount.value < CHAR_LIMITS.TASK_MIN);
const isOverLimit = computed(() => characterCount.value > CHAR_LIMITS.TASK_MAX);
const isWithinLimit = computed(() =>
  characterCount.value >= CHAR_LIMITS.TASK_MIN &&
  characterCount.value <= CHAR_LIMITS.TASK_MAX
);
const isError = computed(() => !!validationError.value);

// Validation error from store
const validationError = computed(() => formStore.validationErrors.task);

// Example prompts
const examples = computed(() => [
  t('builder.task.examples.0'),
  t('builder.task.examples.1'),
  t('builder.task.examples.2'),
]);

// Initialize from store
watch(() => formStore.formData.task, (newTask) => {
  if (newTask && newTask !== taskValue.value) {
    taskValue.value = newTask;
  }
}, { immediate: true });

// Handle task change
const handleTaskChange = () => {
  formStore.updateField('task', taskValue.value);
};

// Handle blur event (validate on blur)
const handleBlur = () => {
  formStore.validateField('task');
};

// Apply example
const applyExample = (example: string) => {
  taskValue.value = example;
  formStore.updateField('task', example);
  formStore.validateField('task');
};
</script>
