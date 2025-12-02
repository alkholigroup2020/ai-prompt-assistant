<template>
  <div class="space-y-3">
    <UFormField
      :label="$t('builder.tone.label')"
      :help="$t('builder.tone.helpText')"
      required
    >
      <USelectMenu
        v-model="selectedTone"
        :items="toneItems"
        :placeholder="$t('builder.tone.placeholder')"
        :icon="selectedTone?.icon ?? 'i-heroicons-chat-bubble-left-right'"
        size="lg"
        class="w-full"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleToneChange"
      >
        <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
        <template #option="{ option }">
          <div class="flex items-center gap-3 py-1">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20"
            >
              <UIcon :name="option.icon" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
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
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Nuxt UI USelectMenu slot types are incomplete
/* eslint-enable @typescript-eslint/ban-ts-comment */
import { computed, ref, watch } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'
import { ToneOption } from '~/types'

interface ToneItem {
  label: string
  value: ToneOption
  description: string
  icon: string
}

const { t } = useI18n()
const formStore = useFormStore()

// Tone items with icons and descriptions (for USelectMenu)
const toneItems = computed<ToneItem[]>(() => [
  {
    value: ToneOption.PROFESSIONAL,
    label: t('builder.tone.options.professional.label'),
    description: t('builder.tone.options.professional.description'),
    icon: 'i-heroicons-briefcase',
  },
  {
    value: ToneOption.FRIENDLY,
    label: t('builder.tone.options.friendly.label'),
    description: t('builder.tone.options.friendly.description'),
    icon: 'i-heroicons-face-smile',
  },
  {
    value: ToneOption.FORMAL,
    label: t('builder.tone.options.formal.label'),
    description: t('builder.tone.options.formal.description'),
    icon: 'i-heroicons-document-text',
  },
  {
    value: ToneOption.CASUAL,
    label: t('builder.tone.options.casual.label'),
    description: t('builder.tone.options.casual.description'),
    icon: 'i-heroicons-chat-bubble-left-right',
  },
  {
    value: ToneOption.PERSUASIVE,
    label: t('builder.tone.options.persuasive.label'),
    description: t('builder.tone.options.persuasive.description'),
    icon: 'i-heroicons-megaphone',
  },
  {
    value: ToneOption.INFORMATIVE,
    label: t('builder.tone.options.informative.label'),
    description: t('builder.tone.options.informative.description'),
    icon: 'i-heroicons-information-circle',
  },
  {
    value: ToneOption.CREATIVE,
    label: t('builder.tone.options.creative.label'),
    description: t('builder.tone.options.creative.description'),
    icon: 'i-heroicons-sparkles',
  },
  {
    value: ToneOption.TECHNICAL,
    label: t('builder.tone.options.technical.label'),
    description: t('builder.tone.options.technical.description'),
    icon: 'i-heroicons-cpu-chip',
  },
  {
    value: ToneOption.EMPATHETIC,
    label: t('builder.tone.options.empathetic.label'),
    description: t('builder.tone.options.empathetic.description'),
    icon: 'i-heroicons-heart',
  },
])

// Selected tone (full object for USelectMenu)
const selectedTone = ref<ToneItem | undefined>(undefined)

// Initialize from store and handle reset
watch(
  () => formStore.formData.tone,
  (newTone) => {
    if (!newTone) {
      // Handle reset: clear the selection
      selectedTone.value = undefined
    } else if (!selectedTone.value || selectedTone.value.value !== newTone) {
      const item = toneItems.value.find((opt) => opt.value === newTone)
      if (item) {
        selectedTone.value = item
      }
    }
  },
  { immediate: true }
)

// Handle tone change
const handleToneChange = (value: ToneItem | undefined) => {
  if (value) {
    formStore.updateField('tone', value.value)
  }
}
</script>
