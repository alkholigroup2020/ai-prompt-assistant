<template>
  <div class="space-y-2">
    <label
      for="audience-select"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ $t('builder.audience.label') }}
      <span class="text-red-500">*</span>
    </label>

    <USelectMenu
      id="audience-select"
      v-model="selectedAudience"
      :options="audienceOptions"
      :placeholder="$t('builder.audience.placeholder')"
      :ui="{ base: 'w-full' }"
      @update:model-value="handleAudienceChange"
    >
      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #label>
        <div v-if="selectedAudience" class="flex items-center gap-2">
          <UIcon :name="getAudienceIcon(selectedAudience.value)" class="w-5 h-5" />
          <span>{{ selectedAudience.label }}</span>
        </div>
        <span v-else class="text-gray-500">{{ $t('builder.audience.placeholder') }}</span>
      </template>

      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #option="{ option }">
        <div class="flex items-center gap-3 py-1">
          <UIcon :name="getAudienceIcon(option.value)" class="w-5 h-5 text-emerald-500" />
          <div class="flex-1">
            <div class="font-medium">{{ option.label }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ option.description }}
            </div>
          </div>
        </div>
      </template>
    </USelectMenu>

    <!-- Other Audience Input (shown when "Other" is selected) -->
    <div v-if="isOtherSelected" class="mt-3">
      <UInput
        id="audience-other"
        v-model="otherAudienceValue"
        :placeholder="$t('builder.audience.otherPlaceholder')"
        :ui="{ base: 'w-full' }"
        @input="handleOtherAudienceChange"
      />
    </div>

    <!-- Validation Error -->
    <p v-if="validationError" class="text-sm text-red-600 dark:text-red-400 mt-1">
      <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 inline" />
      {{ validationError }}
    </p>

    <!-- Help Text -->
    <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      {{ $t('builder.audience.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const formStore = useFormStore();

// Audience options with icons and descriptions
const audienceOptions = computed(() => [
  {
    value: 'technical-team',
    label: t('builder.audience.options.technicalTeam.label'),
    description: t('builder.audience.options.technicalTeam.description'),
  },
  {
    value: 'executives',
    label: t('builder.audience.options.executives.label'),
    description: t('builder.audience.options.executives.description'),
  },
  {
    value: 'clients',
    label: t('builder.audience.options.clients.label'),
    description: t('builder.audience.options.clients.description'),
  },
  {
    value: 'general-public',
    label: t('builder.audience.options.generalPublic.label'),
    description: t('builder.audience.options.generalPublic.description'),
  },
  {
    value: 'students',
    label: t('builder.audience.options.students.label'),
    description: t('builder.audience.options.students.description'),
  },
  {
    value: 'experts',
    label: t('builder.audience.options.experts.label'),
    description: t('builder.audience.options.experts.description'),
  },
  {
    value: 'beginners',
    label: t('builder.audience.options.beginners.label'),
    description: t('builder.audience.options.beginners.description'),
  },
  {
    value: 'stakeholders',
    label: t('builder.audience.options.stakeholders.label'),
    description: t('builder.audience.options.stakeholders.description'),
  },
  {
    value: 'team-members',
    label: t('builder.audience.options.teamMembers.label'),
    description: t('builder.audience.options.teamMembers.description'),
  },
  {
    value: 'other',
    label: t('builder.audience.options.other.label'),
    description: t('builder.audience.options.other.description'),
  },
]);

// Icon mapping for audiences
const getAudienceIcon = (audienceValue: string): string => {
  const iconMap: Record<string, string> = {
    'technical-team': 'i-heroicons-cpu-chip',
    'executives': 'i-heroicons-building-office',
    'clients': 'i-heroicons-users',
    'general-public': 'i-heroicons-globe-alt',
    'students': 'i-heroicons-academic-cap',
    'experts': 'i-heroicons-star',
    'beginners': 'i-heroicons-light-bulb',
    'stakeholders': 'i-heroicons-briefcase',
    'team-members': 'i-heroicons-user-group',
    'other': 'i-heroicons-ellipsis-horizontal-circle',
  };
  return iconMap[audienceValue] || 'i-heroicons-user';
};

// Selected audience state
const selectedAudience = ref<{ value: string; label: string; description: string } | null>(null);
const otherAudienceValue = ref('');

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedAudience.value?.value === 'other');

// Validation error from store
const validationError = computed(() => formStore.validationErrors.audience);

// Initialize from store
watch(() => formStore.formData.audience, (newAudience) => {
  if (newAudience && !selectedAudience.value) {
    const option = audienceOptions.value.find(opt => opt.value === newAudience);
    if (option) {
      selectedAudience.value = option;
    }
  }
}, { immediate: true });

watch(() => formStore.formData.audienceOther, (newAudienceOther) => {
  if (newAudienceOther && !otherAudienceValue.value) {
    otherAudienceValue.value = newAudienceOther;
  }
}, { immediate: true });

// Handle audience change
const handleAudienceChange = (value: unknown) => {
  const option = value as { value: string; label: string } | null;
  if (option && typeof option === 'object' && 'value' in option) {
    if (option.value === 'other') {
      formStore.updateField('audience', 'other');
      formStore.updateField('audienceOther', otherAudienceValue.value);
    } else {
      formStore.updateField('audience', option.value);
      formStore.updateField('audienceOther', undefined);
      otherAudienceValue.value = '';
    }
    formStore.validateField('audience');
  }
};

// Handle other audience input
const handleOtherAudienceChange = () => {
  formStore.updateField('audienceOther', otherAudienceValue.value);
  formStore.validateField('audience');
};
</script>
