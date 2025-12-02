<template>
  <div class="space-y-3">
    <UFormField
      :label="$t('builder.outputFormat.label')"
      :help="$t('builder.outputFormat.helpText')"
      required
    >
      <USelectMenu
        v-model="selectedFormat"
        :items="formatItems"
        :placeholder="$t('builder.outputFormat.placeholder')"
        :icon="selectedFormat?.icon ?? 'i-heroicons-document-text'"
        size="lg"
        class="w-full"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleFormatChange"
      >
        <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
        <template #option="{ option }">
          <div class="flex items-center gap-3 py-1">
            <UIcon :name="option.icon" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div class="flex-1">
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ option.label }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ option.description }}
              </div>
            </div>
          </div>
        </template>
      </USelectMenu>
    </UFormField>

    <!-- Other Format Input (shown when "Other" is selected) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isOtherSelected" class="pl-1">
        <UFormField
          :label="$t('builder.outputFormat.otherLabel')"
          :help="$t('builder.outputFormat.otherHelp')"
        >
          <UInput
            v-model="otherFormatValue"
            :placeholder="$t('builder.outputFormat.otherPlaceholder')"
            size="lg"
            class="w-full"
            leading-icon="i-heroicons-pencil-square"
            :ui="{ base: 'ps-14', leadingIcon: 'text-emerald-500' }"
            @input="handleOtherFormatChange"
          />
        </UFormField>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Nuxt UI USelectMenu slot types are incomplete
/* eslint-enable @typescript-eslint/ban-ts-comment */
import { computed, ref, watch } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'
import { OutputFormat } from '~/types'

interface FormatItem {
  label: string
  value: OutputFormat
  description: string
  icon: string
}

const { t } = useI18n()
const formStore = useFormStore()

// Output format items with icons and descriptions (for USelectMenu)
const formatItems = computed<FormatItem[]>(() => [
  {
    value: OutputFormat.PARAGRAPH,
    label: t('builder.outputFormat.options.paragraph.label'),
    description: t('builder.outputFormat.options.paragraph.description'),
    icon: 'i-heroicons-document-text',
  },
  {
    value: OutputFormat.BULLET_POINTS,
    label: t('builder.outputFormat.options.bulletPoints.label'),
    description: t('builder.outputFormat.options.bulletPoints.description'),
    icon: 'i-heroicons-list-bullet',
  },
  {
    value: OutputFormat.NUMBERED_LIST,
    label: t('builder.outputFormat.options.numberedList.label'),
    description: t('builder.outputFormat.options.numberedList.description'),
    icon: 'i-heroicons-numbered-list',
  },
  {
    value: OutputFormat.EMAIL,
    label: t('builder.outputFormat.options.email.label'),
    description: t('builder.outputFormat.options.email.description'),
    icon: 'i-heroicons-envelope',
  },
  {
    value: OutputFormat.REPORT,
    label: t('builder.outputFormat.options.report.label'),
    description: t('builder.outputFormat.options.report.description'),
    icon: 'i-heroicons-document-chart-bar',
  },
  {
    value: OutputFormat.PRESENTATION,
    label: t('builder.outputFormat.options.presentation.label'),
    description: t('builder.outputFormat.options.presentation.description'),
    icon: 'i-heroicons-presentation-chart-bar',
  },
  {
    value: OutputFormat.CODE_COMMENTS,
    label: t('builder.outputFormat.options.codeComments.label'),
    description: t('builder.outputFormat.options.codeComments.description'),
    icon: 'i-heroicons-code-bracket',
  },
  {
    value: OutputFormat.SOCIAL_POST,
    label: t('builder.outputFormat.options.socialPost.label'),
    description: t('builder.outputFormat.options.socialPost.description'),
    icon: 'i-heroicons-chat-bubble-left',
  },
  {
    value: OutputFormat.EXECUTIVE_SUMMARY,
    label: t('builder.outputFormat.options.executiveSummary.label'),
    description: t('builder.outputFormat.options.executiveSummary.description'),
    icon: 'i-heroicons-document-magnifying-glass',
  },
  {
    value: OutputFormat.TABLE,
    label: t('builder.outputFormat.options.table.label'),
    description: t('builder.outputFormat.options.table.description'),
    icon: 'i-heroicons-table-cells',
  },
  {
    value: OutputFormat.DIALOGUE,
    label: t('builder.outputFormat.options.dialogue.label'),
    description: t('builder.outputFormat.options.dialogue.description'),
    icon: 'i-heroicons-chat-bubble-left-right',
  },
  {
    value: OutputFormat.STEP_BY_STEP,
    label: t('builder.outputFormat.options.stepByStep.label'),
    description: t('builder.outputFormat.options.stepByStep.description'),
    icon: 'i-heroicons-bars-3-bottom-left',
  },
  {
    value: OutputFormat.FAQ,
    label: t('builder.outputFormat.options.faq.label'),
    description: t('builder.outputFormat.options.faq.description'),
    icon: 'i-heroicons-question-mark-circle',
  },
  {
    value: OutputFormat.OTHER,
    label: t('builder.outputFormat.options.other.label'),
    description: t('builder.outputFormat.options.other.description'),
    icon: 'i-heroicons-ellipsis-horizontal-circle',
  },
])

// Selected format (full object for USelectMenu)
const selectedFormat = ref<FormatItem | undefined>(undefined)
const otherFormatValue = ref('')

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedFormat.value?.value === OutputFormat.OTHER)

// Initialize from store and handle reset
watch(
  () => formStore.formData.outputFormat,
  (newFormat) => {
    if (!newFormat) {
      // Handle reset: clear the selection
      selectedFormat.value = undefined
      otherFormatValue.value = ''
    } else if (!selectedFormat.value || selectedFormat.value.value !== newFormat) {
      const item = formatItems.value.find((opt) => opt.value === newFormat)
      if (item) {
        selectedFormat.value = item
      }
    }
  },
  { immediate: true }
)

watch(
  () => formStore.formData.outputFormatOther,
  (newFormatOther) => {
    if (newFormatOther && !otherFormatValue.value) {
      otherFormatValue.value = newFormatOther
    }
  },
  { immediate: true }
)

// Handle format change
const handleFormatChange = (value: FormatItem | undefined) => {
  if (value) {
    if (value.value === OutputFormat.OTHER) {
      formStore.updateField('outputFormat', OutputFormat.OTHER)
      formStore.updateField('outputFormatOther', otherFormatValue.value)
    } else {
      formStore.updateField('outputFormat', value.value)
      formStore.updateField('outputFormatOther', undefined)
      otherFormatValue.value = ''
    }
  }
}

// Handle other format input
const handleOtherFormatChange = () => {
  formStore.updateField('outputFormatOther', otherFormatValue.value)
}
</script>
