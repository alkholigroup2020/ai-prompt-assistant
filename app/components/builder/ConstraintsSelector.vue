<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ $t('builder.constraints.label') }}
      <span class="text-gray-500 text-xs ml-1">({{ $t('builder.constraints.optional') }})</span>
    </label>

    <!-- Constraints Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="option in constraintOptions"
        :key="option.value"
        class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <UCheckbox
          :id="`constraint-${option.value}`"
          :model-value="isSelected(option.value)"
          :name="option.value"
          @update:model-value="(value: unknown) => toggleConstraint(option.value, value === true)"
        />
        <div class="flex-1 min-w-0">
          <label
            :for="`constraint-${option.value}`"
            class="flex items-center gap-2 cursor-pointer"
          >
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ option.label }}
            </span>
            <UTooltip :text="option.description" :popper="{ placement: 'top' }">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              />
            </UTooltip>
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ option.example }}
          </p>
        </div>
      </div>
    </div>

    <!-- Other Constraints Input -->
    <div class="mt-4">
      <label
        for="constraints-other"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ $t('builder.constraints.otherLabel') }}
      </label>
      <UTextarea
        id="constraints-other"
        v-model="otherConstraintsValue"
        :placeholder="$t('builder.constraints.otherPlaceholder')"
        :rows="2"
        :ui="{ base: 'w-full' }"
        @input="handleOtherConstraintsChange"
      />
    </div>

    <!-- Selected Count -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline" />
      {{ selectedCount === 0
        ? $t('builder.constraints.noneSelected')
        : $t('builder.constraints.selectedCount', { count: selectedCount })
      }}
    </p>

    <!-- Help Text -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
      {{ $t('builder.constraints.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { Constraint } from '~/types';

const { t } = useI18n();
const formStore = useFormStore();

// Constraint options with descriptions and examples
const constraintOptions = computed(() => [
  {
    value: Constraint.WORD_LIMIT_100,
    label: t('builder.constraints.options.wordLimit100.label'),
    description: t('builder.constraints.options.wordLimit100.description'),
    example: t('builder.constraints.options.wordLimit100.example'),
  },
  {
    value: Constraint.WORD_LIMIT_300,
    label: t('builder.constraints.options.wordLimit300.label'),
    description: t('builder.constraints.options.wordLimit300.description'),
    example: t('builder.constraints.options.wordLimit300.example'),
  },
  {
    value: Constraint.WORD_LIMIT_500,
    label: t('builder.constraints.options.wordLimit500.label'),
    description: t('builder.constraints.options.wordLimit500.description'),
    example: t('builder.constraints.options.wordLimit500.example'),
  },
  {
    value: Constraint.INCLUDE_CITATIONS,
    label: t('builder.constraints.options.includeCitations.label'),
    description: t('builder.constraints.options.includeCitations.description'),
    example: t('builder.constraints.options.includeCitations.example'),
  },
  {
    value: Constraint.USE_PROVIDED_DATA,
    label: t('builder.constraints.options.useProvidedData.label'),
    description: t('builder.constraints.options.useProvidedData.description'),
    example: t('builder.constraints.options.useProvidedData.example'),
  },
  {
    value: Constraint.NO_JARGON,
    label: t('builder.constraints.options.noJargon.label'),
    description: t('builder.constraints.options.noJargon.description'),
    example: t('builder.constraints.options.noJargon.example'),
  },
  {
    value: Constraint.TECHNICAL_DETAIL,
    label: t('builder.constraints.options.technicalDetail.label'),
    description: t('builder.constraints.options.technicalDetail.description'),
    example: t('builder.constraints.options.technicalDetail.example'),
  },
  {
    value: Constraint.BEGINNER_FRIENDLY,
    label: t('builder.constraints.options.beginnerFriendly.label'),
    description: t('builder.constraints.options.beginnerFriendly.description'),
    example: t('builder.constraints.options.beginnerFriendly.example'),
  },
  {
    value: Constraint.ACTION_ORIENTED,
    label: t('builder.constraints.options.actionOriented.label'),
    description: t('builder.constraints.options.actionOriented.description'),
    example: t('builder.constraints.options.actionOriented.example'),
  },
  {
    value: Constraint.DATA_DRIVEN,
    label: t('builder.constraints.options.dataDriven.label'),
    description: t('builder.constraints.options.dataDriven.description'),
    example: t('builder.constraints.options.dataDriven.example'),
  },
]);

// Other constraints value
const otherConstraintsValue = ref('');

// Selected constraints
const selectedConstraints = computed(() => formStore.formData.constraints || []);

// Selected count
const selectedCount = computed(() => selectedConstraints.value.length);

// Check if constraint is selected
const isSelected = (constraint: Constraint): boolean => {
  return selectedConstraints.value.includes(constraint);
};

// Initialize from store
watch(() => formStore.formData.constraintsOther, (newConstraintsOther) => {
  if (newConstraintsOther && newConstraintsOther !== otherConstraintsValue.value) {
    otherConstraintsValue.value = newConstraintsOther;
  }
}, { immediate: true });

// Toggle constraint
const toggleConstraint = (constraint: Constraint, checked: boolean) => {
  if (checked) {
    formStore.addConstraint(constraint);
  } else {
    formStore.removeConstraint(constraint);
  }
};

// Handle other constraints input
const handleOtherConstraintsChange = () => {
  formStore.updateField('constraintsOther', otherConstraintsValue.value);
};
</script>
