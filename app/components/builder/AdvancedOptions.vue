<template>
  <div class="space-y-6">
    <!-- Enhancement Level Cards -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ $t('builder.advanced.enhancementLevel.label') }}
      </label>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Quick Polish Card -->
        <button
          type="button"
          :class="[
            'relative p-4 rounded-lg border-2 transition-all cursor-pointer text-left',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
            enhancementLevel === 'quick'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
          ]"
          @click="setEnhancementLevel('quick')"
        >
          <!-- Checkmark for selected -->
          <div
            v-if="enhancementLevel === 'quick'"
            class="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
          </div>

          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                {{ $t('builder.advanced.enhancementLevel.quick') }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ $t('builder.advanced.enhancementLevel.quickDescription') }}
              </p>
            </div>
          </div>
        </button>

        <!-- Deep Enhancement Card -->
        <button
          type="button"
          :class="[
            'relative p-4 rounded-lg border-2 transition-all cursor-pointer text-left',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
            enhancementLevel === 'detailed'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
          ]"
          @click="setEnhancementLevel('detailed')"
        >
          <!-- Checkmark for selected -->
          <div
            v-if="enhancementLevel === 'detailed'"
            class="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
          </div>

          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                {{ $t('builder.advanced.enhancementLevel.detailed') }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ $t('builder.advanced.enhancementLevel.detailedDescription') }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Examples and Context - Side by Side -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <!-- Examples Textarea -->
      <div class="flex flex-col space-y-2">
        <label
          for="examples-input"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ $t('builder.advanced.examples.label') }}
        </label>
        <UTextarea
          id="examples-input"
          v-model="examplesValue"
          :placeholder="$t('builder.advanced.examples.placeholder')"
          :rows="3"
          :ui="{ base: 'w-full max-h-[84px] overflow-y-auto resize-none' }"
          @blur="handleExamplesBlur"
        />
        <!-- Character Counter -->
        <div class="text-xs">
          <span
            :class="{
              'text-red-600 dark:text-red-400': examplesCount > CHAR_LIMITS.EXAMPLES_MAX,
              'text-gray-500 dark:text-gray-400': examplesCount <= CHAR_LIMITS.EXAMPLES_MAX
            }"
          >
            {{ examplesCount }} / {{ CHAR_LIMITS.EXAMPLES_MAX }} {{ $t('builder.advanced.characters') }}
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
          {{ $t('builder.advanced.examples.helpText') }}
        </p>
        <!-- Validation Error -->
        <p v-if="examplesError" class="text-sm text-red-600 dark:text-red-400">
          <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 inline" />
          {{ examplesError }}
        </p>
      </div>

      <!-- Context Textarea -->
      <div class="flex flex-col space-y-2">
        <label
          for="context-input"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ $t('builder.advanced.context.label') }}
        </label>
        <UTextarea
          id="context-input"
          v-model="contextValue"
          :placeholder="$t('builder.advanced.context.placeholder')"
          :rows="3"
          :ui="{ base: 'w-full max-h-[84px] overflow-y-auto resize-none' }"
          @blur="handleContextBlur"
        />
        <!-- Character Counter -->
        <div class="text-xs">
          <span
            :class="{
              'text-red-600 dark:text-red-400': contextCount > CHAR_LIMITS.CONTEXT_MAX,
              'text-gray-500 dark:text-gray-400': contextCount <= CHAR_LIMITS.CONTEXT_MAX
            }"
          >
            {{ contextCount }} / {{ CHAR_LIMITS.CONTEXT_MAX }} {{ $t('builder.advanced.characters') }}
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
          {{ $t('builder.advanced.context.helpText') }}
        </p>
        <!-- Validation Error -->
        <p v-if="contextError" class="text-sm text-red-600 dark:text-red-400">
          <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 inline" />
          {{ contextError }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { CHAR_LIMITS } from '~/utils/validators';
import type { EnhancementLevel } from '~/types';

const { t } = useI18n();
const formStore = useFormStore();

// Enhancement level
const enhancementLevel = ref<EnhancementLevel>('quick');

// Examples and context values
const examplesValue = ref('');
const contextValue = ref('');

// Character counts
const examplesCount = computed(() => examplesValue.value.length);
const contextCount = computed(() => contextValue.value.length);

// Validation errors (translated)
const examplesError = computed(() => {
  const error = formStore.validationErrors.examples;
  if (!error) return undefined;
  return t(error.key, error.params || {});
});
const contextError = computed(() => {
  const error = formStore.validationErrors.context;
  if (!error) return undefined;
  return t(error.key, error.params || {});
});

// Initialize from store
watch(() => formStore.formData.enhancementLevel, (newLevel) => {
  if (newLevel && newLevel !== enhancementLevel.value) {
    enhancementLevel.value = newLevel;
  }
}, { immediate: true });

watch(() => formStore.formData.examples, (newExamples) => {
  if (newExamples !== undefined && newExamples !== examplesValue.value) {
    examplesValue.value = newExamples || '';
  }
}, { immediate: true });

watch(() => formStore.formData.context, (newContext) => {
  if (newContext !== undefined && newContext !== contextValue.value) {
    contextValue.value = newContext || '';
  }
}, { immediate: true });

// Sync local values to store when they change (replaces @input handlers)
// Using watch ensures the sync happens AFTER v-model updates the ref
watch(examplesValue, (newValue) => {
  formStore.updateField('examples', newValue || undefined);
});

watch(contextValue, (newValue) => {
  formStore.updateField('context', newValue || undefined);
});

// Set enhancement level
const setEnhancementLevel = (level: EnhancementLevel) => {
  enhancementLevel.value = level;
  formStore.updateField('enhancementLevel', level);
};

// Handle examples blur
const handleExamplesBlur = () => {
  if (examplesValue.value) {
    formStore.validateField('examples');
  }
};

// Handle context blur
const handleContextBlur = () => {
  if (contextValue.value) {
    formStore.validateField('context');
  }
};
</script>
