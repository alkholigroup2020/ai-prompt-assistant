<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      @click="handleBack"
    >
      {{ $t('templates.detail.backToGallery') }}
    </UButton>

    <!-- Template Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <UBadge
              :color="categoryColor"
              variant="soft"
              size="md"
            >
              {{ $t(`templates.categories.${template.category}`) }}
            </UBadge>
            <UBadge
              :color="difficultyColor"
              variant="outline"
              size="md"
            >
              {{ $t(`templates.difficulty.${template.difficulty}`) }}
            </UBadge>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {{ template.title }}
          </h1>

          <p class="text-base text-gray-600 dark:text-gray-400 mb-4">
            {{ template.description }}
          </p>

          <!-- Metadata -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-amber-400" />
              <span>{{ template.rating.toFixed(1) }} {{ $t('templates.detail.rating') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
              <span>{{ template.estimatedTime }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
              <span>{{ template.usageCount }} {{ $t('templates.detail.usageCount') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
              <span>{{ $t('templates.detail.lastUpdated') }}: {{ formatDate(template.lastUpdated) }}</span>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <div class="lg:w-48">
          <UButton
            color="emerald"
            variant="solid"
            size="xl"
            block
            :disabled="!isFormValid"
            @click="handleApply"
          >
            <UIcon name="i-heroicons-check" class="w-5 h-5" />
            {{ $t('templates.detail.applyTemplate') }}
          </UButton>
          <p v-if="!isFormValid" class="text-xs text-red-500 dark:text-red-400 mt-2 text-center">
            {{ $t('templates.detail.fillRequired') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Variables Section -->
    <div v-if="template.variables.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('templates.detail.variables') }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('templates.detail.variablesDescription') }}
      </p>

      <div class="space-y-4">
        <div
          v-for="variable in template.variables"
          :key="variable.key"
          class="space-y-2"
        >
          <label
            :for="`var-${variable.key}`"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ variable.label }}
            <span v-if="variable.required" class="text-red-500">*</span>
          </label>

          <!-- Text Input -->
          <UInput
            v-if="variable.type === 'text'"
            :id="`var-${variable.key}`"
            v-model="variableValues[variable.key]"
            :placeholder="variable.placeholder"
            :maxlength="variable.maxLength"
            size="lg"
          />

          <!-- Select Input -->
          <!-- @ts-expect-error - variable.options type mismatch with USelectMenu -->
          <USelectMenu
            v-else-if="variable.type === 'select'"
            :id="`var-${variable.key}`"
            v-model="variableValues[variable.key]"
            :options="variable.options || []"
            :placeholder="variable.placeholder"
            size="lg"
          />

          <!-- Multi-Select Input -->
          <template v-else-if="variable.type === 'multiselect'">
            <!-- @ts-expect-error - Nuxt UI SelectMenu options type mismatch -->
            <USelectMenu
              :id="`var-${variable.key}`"
              v-model="variableValues[variable.key]"
              :options="variable.options || []"
              :placeholder="variable.placeholder"
              multiple
              size="lg"
            />
          </template>

          <!-- Help Text -->
          <p v-if="variable.description" class="text-xs text-gray-500 dark:text-gray-400">
            {{ variable.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('templates.detail.preview') }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('templates.detail.previewDescription') }}
      </p>

      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
        {{ previewPrompt }}
      </div>
    </div>

    <!-- Examples Section -->
    <div v-if="template.examples.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('templates.detail.examples') }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('templates.detail.examplesDescription') }}
      </p>

      <div class="space-y-6">
        <div
          v-for="(example, index) in template.examples"
          :key="index"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('templates.detail.exampleTitle', { title: example.title }) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {{ example.description }}
          </p>

          <!-- Example Input Variables -->
          <div class="mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('templates.detail.exampleInput') }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900 rounded p-3 space-y-1 text-sm">
              <div
                v-for="(value, key) in example.input"
                :key="key"
                class="text-gray-700 dark:text-gray-300"
              >
                <span class="font-medium">{{ key }}:</span> {{ value }}
              </div>
            </div>
          </div>

          <!-- Example Output -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('templates.detail.exampleOutput') }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ example.output }}
            </div>
          </div>

          <!-- Use This Example Button -->
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            class="mt-3"
            @click="applyExample(example)"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            Use This Example
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Nuxt UI USelectMenu slot and option types are incomplete
/* eslint-enable @typescript-eslint/ban-ts-comment */
import { ref, computed, watch } from 'vue';
import type { PromptTemplate, TemplateCategory, TemplateDifficulty, TemplateExample } from '~/types/template';

interface Props {
  template: PromptTemplate;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [template: PromptTemplate, variables: Record<string, string>];
  back: [];
}>();

// Variable values
const variableValues = ref<Record<string, string>>({});

// Initialize variable values
watch(() => props.template, (newTemplate) => {
  const values: Record<string, string> = {};
  newTemplate.variables.forEach(variable => {
    values[variable.key] = '';
  });
  variableValues.value = values;
}, { immediate: true });

// Check if form is valid (all required fields filled)
const isFormValid = computed(() => {
  return props.template.variables.every(variable => {
    if (variable.required) {
      const value = variableValues.value[variable.key];
      return value !== null && value !== undefined && value !== '';
    }
    return true;
  });
});

// Generate preview prompt with current variable values
const previewPrompt = computed(() => {
  let prompt = props.template.basePrompt;

  // Replace variables with values or placeholders
  props.template.variables.forEach(variable => {
    const value = variableValues.value[variable.key];
    const replacement = value || `[${variable.label}]`;
    prompt = prompt.replace(new RegExp(`{{${variable.key}}}`, 'g'), replacement);
  });

  return prompt;
});

// Get color for category badge
const categoryColor = computed<'primary' | 'emerald' | 'navy' | 'neutral'>(() => {
  const category = props.template.category;
  const colorMap: Record<TemplateCategory, 'primary' | 'emerald' | 'navy' | 'neutral'> = {
    business: 'primary',
    technical: 'navy',
    creative: 'emerald',
    analysis: 'primary',
    communication: 'emerald',
    research: 'navy',
    marketing: 'emerald',
    hr: 'primary',
    sales: 'emerald',
    customer_service: 'emerald',
  };
  return colorMap[category] || 'neutral';
});

const difficultyColor = computed<'primary' | 'emerald' | 'navy' | 'neutral'>(() => {
  const difficulty = props.template.difficulty;
  const colorMap: Record<TemplateDifficulty, 'primary' | 'emerald' | 'navy' | 'neutral'> = {
    beginner: 'emerald',
    intermediate: 'primary',
    advanced: 'navy',
  };
  return colorMap[difficulty] || 'neutral';
});

// Format date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

// Apply example values to form
const applyExample = (example: TemplateExample) => {
  const values: Record<string, string> = {};
  props.template.variables.forEach(variable => {
    values[variable.key] = example.input[variable.key] || '';
  });
  variableValues.value = values;
};

// Event handlers
const handleApply = () => {
  if (isFormValid.value) {
    emit('apply', props.template, variableValues.value);
  }
};

const handleBack = () => {
  emit('back');
};
</script>
