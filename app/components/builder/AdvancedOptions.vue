<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <!-- Collapsible Header -->
    <button
      type="button"
      class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      :aria-expanded="isExpanded"
      :aria-label="$t('builder.advanced.title')"
      @click="toggleCollapse"
      @keydown.enter.prevent="toggleCollapse"
      @keydown.space.prevent="toggleCollapse"
    >
      <div class="flex items-center gap-3">
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform"
        />
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ $t('builder.advanced.title') }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ $t('builder.advanced.optional') }})
        </span>
      </div>
      <UBadge
        v-if="hasContent"
        color="emerald"
        variant="subtle"
        size="xs"
      >
        {{ $t('builder.advanced.hasContent') }}
      </UBadge>
    </button>

    <!-- Collapsible Content -->
    <div
      v-if="isExpanded"
      class="p-4 space-y-6 bg-white dark:bg-gray-900"
    >
      <!-- Enhancement Level Toggle -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('builder.advanced.enhancementLevel.label') }}
        </label>
        <div
          class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          role="radiogroup"
          :aria-label="$t('builder.advanced.enhancementLevel.label')"
        >
          <button
            type="button"
            role="radio"
            :aria-checked="enhancementLevel === 'quick'"
            :tabindex="enhancementLevel === 'quick' ? 0 : -1"
            :class="[
              'flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
              enhancementLevel === 'quick'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
            @click="setEnhancementLevel('quick')"
            @keydown.enter.prevent="setEnhancementLevel('quick')"
            @keydown.space.prevent="setEnhancementLevel('quick')"
          >
            <UIcon name="i-heroicons-bolt" class="w-4 h-4 inline mr-1" />
            {{ $t('builder.advanced.enhancementLevel.quick') }}
          </button>
          <button
            type="button"
            role="radio"
            :aria-checked="enhancementLevel === 'detailed'"
            :tabindex="enhancementLevel === 'detailed' ? 0 : -1"
            :class="[
              'flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
              enhancementLevel === 'detailed'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
            @click="setEnhancementLevel('detailed')"
            @keydown.enter.prevent="setEnhancementLevel('detailed')"
            @keydown.space.prevent="setEnhancementLevel('detailed')"
          >
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 inline mr-1" />
            {{ $t('builder.advanced.enhancementLevel.detailed') }}
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ enhancementLevel === 'quick'
            ? $t('builder.advanced.enhancementLevel.quickDescription')
            : $t('builder.advanced.enhancementLevel.detailedDescription')
          }}
        </p>
      </div>

      <!-- Examples Textarea -->
      <div class="space-y-2">
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
          :rows="4"
          autoresize
          :maxrows="10"
          :ui="{ base: 'w-full' }"
          @input="handleExamplesChange"
          @blur="handleExamplesBlur"
        />
        <!-- Character Counter -->
        <div class="flex items-center justify-between text-xs">
          <span
            :class="{
              'text-red-600 dark:text-red-400': examplesCount > CHAR_LIMITS.EXAMPLES_MAX,
              'text-gray-500 dark:text-gray-400': examplesCount <= CHAR_LIMITS.EXAMPLES_MAX
            }"
          >
            {{ examplesCount }} / {{ CHAR_LIMITS.EXAMPLES_MAX }}
          </span>
          <span class="text-gray-400">{{ $t('builder.advanced.characters') }}</span>
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
      <div class="space-y-2">
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
          :rows="4"
          autoresize
          :maxrows="10"
          :ui="{ base: 'w-full' }"
          @input="handleContextChange"
          @blur="handleContextBlur"
        />
        <!-- Character Counter -->
        <div class="flex items-center justify-between text-xs">
          <span
            :class="{
              'text-red-600 dark:text-red-400': contextCount > CHAR_LIMITS.CONTEXT_MAX,
              'text-gray-500 dark:text-gray-400': contextCount <= CHAR_LIMITS.CONTEXT_MAX
            }"
          >
            {{ contextCount }} / {{ CHAR_LIMITS.CONTEXT_MAX }}
          </span>
          <span class="text-gray-400">{{ $t('builder.advanced.characters') }}</span>
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
import { CHAR_LIMITS } from '~/utils/validators';
import type { EnhancementLevel } from '~/types';

const formStore = useFormStore();

// Collapsed state
const isExpanded = ref(false);

// Enhancement level
const enhancementLevel = ref<EnhancementLevel>('quick');

// Examples and context values
const examplesValue = ref('');
const contextValue = ref('');

// Character counts
const examplesCount = computed(() => examplesValue.value.length);
const contextCount = computed(() => contextValue.value.length);

// Check if has content
const hasContent = computed(() =>
  examplesValue.value.length > 0 ||
  contextValue.value.length > 0 ||
  enhancementLevel.value === 'detailed'
);

// Validation errors
const examplesError = computed(() => formStore.validationErrors.examples);
const contextError = computed(() => formStore.validationErrors.context);

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

// Toggle collapse
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value;
};

// Set enhancement level
const setEnhancementLevel = (level: EnhancementLevel) => {
  enhancementLevel.value = level;
  formStore.updateField('enhancementLevel', level);
};

// Handle examples change
const handleExamplesChange = () => {
  formStore.updateField('examples', examplesValue.value || undefined);
};

// Handle examples blur
const handleExamplesBlur = () => {
  if (examplesValue.value) {
    formStore.validateField('examples');
  }
};

// Handle context change
const handleContextChange = () => {
  formStore.updateField('context', contextValue.value || undefined);
};

// Handle context blur
const handleContextBlur = () => {
  if (contextValue.value) {
    formStore.validateField('context');
  }
};
</script>
