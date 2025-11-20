<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ $t('builder.tone.label') }}
      <span class="text-red-500">*</span>
    </label>

    <!-- Tone Options Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      role="radiogroup"
      :aria-label="$t('builder.tone.label')"
    >
      <button
        v-for="(option, index) in toneOptions"
        :key="option.value"
        type="button"
        role="radio"
        :data-tone-option="index"
        :class="[
          'relative p-4 rounded-lg border-2 transition-all duration-200 text-left min-h-[88px]',
          'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
          'touch-manipulation cursor-pointer',
          selectedTone === option.value
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
        ]"
        :aria-label="`${option.label}: ${option.description}`"
        :aria-checked="selectedTone === option.value"
        :tabindex="selectedTone === option.value ? 0 : -1"
        @click="selectTone(option.value)"
        @keydown="handleKeyDown($event, index)"
      >
        <!-- Selected Indicator -->
        <div
          v-if="selectedTone === option.value"
          class="absolute top-2 right-2"
        >
          <UIcon
            name="i-heroicons-check-circle-solid"
            class="w-6 h-6 text-emerald-500"
          />
        </div>

        <!-- Tone Icon -->
        <div class="flex items-start gap-3">
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              selectedTone === option.value
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            ]"
          >
            <UIcon :name="option.icon" class="w-5 h-5" />
          </div>

          <div class="flex-1 min-w-0">
            <div
              :class="[
                'font-medium text-sm',
                selectedTone === option.value
                  ? 'text-emerald-900 dark:text-emerald-100'
                  : 'text-gray-900 dark:text-gray-100'
              ]"
            >
              {{ option.label }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {{ option.description }}
            </div>
          </div>
        </div>

        <!-- Example Badge -->
        <div class="mt-2">
          <span
            :class="[
              'inline-block text-xs px-2 py-1 rounded-full',
              selectedTone === option.value
                ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ option.example }}
          </span>
        </div>
      </button>
    </div>

    <!-- Help Text -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
      {{ $t('builder.tone.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { ToneOption } from '~/types';

const { t } = useI18n();
const formStore = useFormStore();

// Tone options with icons, descriptions, and examples
const toneOptions = computed(() => [
  {
    value: ToneOption.PROFESSIONAL,
    label: t('builder.tone.options.professional.label'),
    description: t('builder.tone.options.professional.description'),
    example: t('builder.tone.options.professional.example'),
    icon: 'i-heroicons-briefcase',
  },
  {
    value: ToneOption.FRIENDLY,
    label: t('builder.tone.options.friendly.label'),
    description: t('builder.tone.options.friendly.description'),
    example: t('builder.tone.options.friendly.example'),
    icon: 'i-heroicons-face-smile',
  },
  {
    value: ToneOption.FORMAL,
    label: t('builder.tone.options.formal.label'),
    description: t('builder.tone.options.formal.description'),
    example: t('builder.tone.options.formal.example'),
    icon: 'i-heroicons-document-text',
  },
  {
    value: ToneOption.CASUAL,
    label: t('builder.tone.options.casual.label'),
    description: t('builder.tone.options.casual.description'),
    example: t('builder.tone.options.casual.example'),
    icon: 'i-heroicons-chat-bubble-left-right',
  },
  {
    value: ToneOption.PERSUASIVE,
    label: t('builder.tone.options.persuasive.label'),
    description: t('builder.tone.options.persuasive.description'),
    example: t('builder.tone.options.persuasive.example'),
    icon: 'i-heroicons-megaphone',
  },
  {
    value: ToneOption.INFORMATIVE,
    label: t('builder.tone.options.informative.label'),
    description: t('builder.tone.options.informative.description'),
    example: t('builder.tone.options.informative.example'),
    icon: 'i-heroicons-information-circle',
  },
  {
    value: ToneOption.CREATIVE,
    label: t('builder.tone.options.creative.label'),
    description: t('builder.tone.options.creative.description'),
    example: t('builder.tone.options.creative.example'),
    icon: 'i-heroicons-sparkles',
  },
  {
    value: ToneOption.TECHNICAL,
    label: t('builder.tone.options.technical.label'),
    description: t('builder.tone.options.technical.description'),
    example: t('builder.tone.options.technical.example'),
    icon: 'i-heroicons-cpu-chip',
  },
  {
    value: ToneOption.EMPATHETIC,
    label: t('builder.tone.options.empathetic.label'),
    description: t('builder.tone.options.empathetic.description'),
    example: t('builder.tone.options.empathetic.example'),
    icon: 'i-heroicons-heart',
  },
]);

// Selected tone
const selectedTone = ref<ToneOption>(ToneOption.PROFESSIONAL);

// Initialize from store
watch(() => formStore.formData.tone, (newTone) => {
  if (newTone && newTone !== selectedTone.value) {
    selectedTone.value = newTone;
  }
}, { immediate: true });

// Select tone
const selectTone = (tone: ToneOption) => {
  selectedTone.value = tone;
  formStore.updateField('tone', tone);
};

// Keyboard navigation for tone grid
const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
  const totalOptions = toneOptions.value.length;
  const cols = 3; // Grid has 3 columns on large screens
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      newIndex = (currentIndex + 1) % totalOptions;
      break;
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = (currentIndex - 1 + totalOptions) % totalOptions;
      break;
    case 'ArrowDown':
      event.preventDefault();
      newIndex = Math.min(currentIndex + cols, totalOptions - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = Math.max(currentIndex - cols, 0);
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = totalOptions - 1;
      break;
    default:
      return;
  }

  // Focus the new button
  const buttons = document.querySelectorAll('[data-tone-option]');
  if (buttons[newIndex]) {
    (buttons[newIndex] as HTMLElement).focus();
  }
};
</script>
