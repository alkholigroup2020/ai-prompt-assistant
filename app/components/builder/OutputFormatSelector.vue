<template>
  <div class="space-y-2">
    <label
      for="output-format-select"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ $t('builder.outputFormat.label') }}
      <span class="text-red-500">*</span>
    </label>

    <USelectMenu
      id="output-format-select"
      v-model="selectedFormat"
      :options="formatOptions"
      :placeholder="$t('builder.outputFormat.placeholder')"
      :ui="{ base: 'w-full' }"
      @update:model-value="handleFormatChange"
    >
      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #label>
        <div v-if="selectedFormat" class="flex items-center gap-2">
          <UIcon :name="getFormatIcon(selectedFormat.value)" class="w-5 h-5" />
          <span>{{ selectedFormat.label }}</span>
        </div>
        <span v-else class="text-gray-500">{{ $t('builder.outputFormat.placeholder') }}</span>
      </template>

      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #option="{ option }">
        <div class="flex items-center gap-3 py-1">
          <UIcon :name="getFormatIcon(option.value)" class="w-5 h-5 text-emerald-500" />
          <div class="flex-1">
            <div class="font-medium">{{ option.label }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ option.description }}
            </div>
          </div>
        </div>
      </template>
    </USelectMenu>

    <!-- Other Format Input (shown when "Other" is selected) -->
    <div v-if="isOtherSelected" class="mt-3">
      <UInput
        id="output-format-other"
        v-model="otherFormatValue"
        :placeholder="$t('builder.outputFormat.otherPlaceholder')"
        :ui="{ base: 'w-full' }"
        @input="handleOtherFormatChange"
      />
    </div>

    <!-- Help Text -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
      {{ $t('builder.outputFormat.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Nuxt UI USelectMenu slot types are incomplete
/* eslint-enable @typescript-eslint/ban-ts-comment */
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { OutputFormat } from '~/types';

const { t } = useI18n();
const formStore = useFormStore();

// Output format options with icons and descriptions
const formatOptions = computed(() => [
  {
    value: OutputFormat.PARAGRAPH,
    label: t('builder.outputFormat.options.paragraph.label'),
    description: t('builder.outputFormat.options.paragraph.description'),
  },
  {
    value: OutputFormat.BULLET_POINTS,
    label: t('builder.outputFormat.options.bulletPoints.label'),
    description: t('builder.outputFormat.options.bulletPoints.description'),
  },
  {
    value: OutputFormat.NUMBERED_LIST,
    label: t('builder.outputFormat.options.numberedList.label'),
    description: t('builder.outputFormat.options.numberedList.description'),
  },
  {
    value: OutputFormat.EMAIL,
    label: t('builder.outputFormat.options.email.label'),
    description: t('builder.outputFormat.options.email.description'),
  },
  {
    value: OutputFormat.REPORT,
    label: t('builder.outputFormat.options.report.label'),
    description: t('builder.outputFormat.options.report.description'),
  },
  {
    value: OutputFormat.PRESENTATION,
    label: t('builder.outputFormat.options.presentation.label'),
    description: t('builder.outputFormat.options.presentation.description'),
  },
  {
    value: OutputFormat.CODE_COMMENTS,
    label: t('builder.outputFormat.options.codeComments.label'),
    description: t('builder.outputFormat.options.codeComments.description'),
  },
  {
    value: OutputFormat.SOCIAL_POST,
    label: t('builder.outputFormat.options.socialPost.label'),
    description: t('builder.outputFormat.options.socialPost.description'),
  },
  {
    value: OutputFormat.EXECUTIVE_SUMMARY,
    label: t('builder.outputFormat.options.executiveSummary.label'),
    description: t('builder.outputFormat.options.executiveSummary.description'),
  },
  {
    value: OutputFormat.TABLE,
    label: t('builder.outputFormat.options.table.label'),
    description: t('builder.outputFormat.options.table.description'),
  },
  {
    value: OutputFormat.DIALOGUE,
    label: t('builder.outputFormat.options.dialogue.label'),
    description: t('builder.outputFormat.options.dialogue.description'),
  },
  {
    value: OutputFormat.STEP_BY_STEP,
    label: t('builder.outputFormat.options.stepByStep.label'),
    description: t('builder.outputFormat.options.stepByStep.description'),
  },
  {
    value: OutputFormat.FAQ,
    label: t('builder.outputFormat.options.faq.label'),
    description: t('builder.outputFormat.options.faq.description'),
  },
  {
    value: OutputFormat.OTHER,
    label: t('builder.outputFormat.options.other.label'),
    description: t('builder.outputFormat.options.other.description'),
  },
]);

// Icon mapping for output formats
const getFormatIcon = (formatValue: string): string => {
  const iconMap: Record<string, string> = {
    [OutputFormat.PARAGRAPH]: 'i-heroicons-document-text',
    [OutputFormat.BULLET_POINTS]: 'i-heroicons-list-bullet',
    [OutputFormat.NUMBERED_LIST]: 'i-heroicons-numbered-list',
    [OutputFormat.EMAIL]: 'i-heroicons-envelope',
    [OutputFormat.REPORT]: 'i-heroicons-document-chart-bar',
    [OutputFormat.PRESENTATION]: 'i-heroicons-presentation-chart-bar',
    [OutputFormat.CODE_COMMENTS]: 'i-heroicons-code-bracket',
    [OutputFormat.SOCIAL_POST]: 'i-heroicons-chat-bubble-left',
    [OutputFormat.EXECUTIVE_SUMMARY]: 'i-heroicons-document-magnifying-glass',
    [OutputFormat.TABLE]: 'i-heroicons-table-cells',
    [OutputFormat.DIALOGUE]: 'i-heroicons-chat-bubble-left-right',
    [OutputFormat.STEP_BY_STEP]: 'i-heroicons-bars-3-bottom-left',
    [OutputFormat.FAQ]: 'i-heroicons-question-mark-circle',
    [OutputFormat.OTHER]: 'i-heroicons-ellipsis-horizontal-circle',
  };
  return iconMap[formatValue] || 'i-heroicons-document';
};

// Selected format state
const selectedFormat = ref<{ value: string; label: string; description: string } | null>(null);
const otherFormatValue = ref('');

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedFormat.value?.value === OutputFormat.OTHER);

// Initialize from store
watch(() => formStore.formData.outputFormat, (newFormat) => {
  if (newFormat && !selectedFormat.value) {
    const option = formatOptions.value.find(opt => opt.value === newFormat);
    if (option) {
      selectedFormat.value = option;
    }
  }
}, { immediate: true });

watch(() => formStore.formData.outputFormatOther, (newFormatOther) => {
  if (newFormatOther && !otherFormatValue.value) {
    otherFormatValue.value = newFormatOther;
  }
}, { immediate: true });

// Handle format change
const handleFormatChange = (value: unknown) => {
  const option = value as { value: string; label: string } | null;
  if (option && typeof option === 'object' && 'value' in option) {
    if (option.value === OutputFormat.OTHER) {
      formStore.updateField('outputFormat', OutputFormat.OTHER);
      formStore.updateField('outputFormatOther', otherFormatValue.value);
    } else {
      formStore.updateField('outputFormat', option.value as OutputFormat);
      formStore.updateField('outputFormatOther', undefined);
      otherFormatValue.value = '';
    }
  }
};

// Handle other format input
const handleOtherFormatChange = () => {
  formStore.updateField('outputFormatOther', otherFormatValue.value);
};
</script>
