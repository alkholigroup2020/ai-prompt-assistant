<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ $t('builder.constraints.label') }}
      <span class="text-gray-500 text-xs ml-1">({{ $t('builder.constraints.optional') }})</span>
    </label>

    <!-- Word Limit Section (Radio Group - Mutually Exclusive) -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {{ $t('builder.constraints.wordLimitLabel') }}
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- No Limit Option -->
        <div
          class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          :class="{ 'ring-2 ring-primary-500 border-primary-500': !selectedWordLimit }"
          @click="selectWordLimit(null)"
        >
          <input
            id="word-limit-none"
            type="radio"
            name="word-limit"
            :checked="!selectedWordLimit"
            class="w-4 h-4 text-primary-600 cursor-pointer"
            @change="selectWordLimit(null)"
          >
          <label
            for="word-limit-none"
            class="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
          >
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ $t('builder.constraints.noLimit') }}
            </span>
          </label>
        </div>

        <!-- Word Limit Options -->
        <div
          v-for="option in wordLimitOptions"
          :key="option.value"
          class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          :class="{ 'ring-2 ring-primary-500 border-primary-500': selectedWordLimit === option.value }"
          @click="selectWordLimit(option.value)"
        >
          <input
            :id="`word-limit-${option.value}`"
            type="radio"
            name="word-limit"
            :value="option.value"
            :checked="selectedWordLimit === option.value"
            class="w-4 h-4 text-primary-600 cursor-pointer"
            @change="selectWordLimit(option.value)"
          >
          <label
            :for="`word-limit-${option.value}`"
            class="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
          >
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ option.label }}
            </span>
            <UTooltip :text="option.description" :popper="{ placement: 'top' }">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              />
            </UTooltip>
          </label>
        </div>
      </div>
    </div>

    <!-- Other Constraints Section (Checkboxes - Multiple Selection) -->
    <div class="space-y-2 mt-4">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {{ $t('builder.constraints.otherConstraintsLabel') }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div
          v-for="option in otherConstraintOptions"
          :key="option.value"
          class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          @click="toggleConstraint(option.value, !isSelected(option.value))"
        >
          <UCheckbox
            :id="`constraint-${option.value}`"
            :model-value="isSelected(option.value)"
            :name="option.value"
            class="cursor-pointer"
            @update:model-value="(value: unknown) => toggleConstraint(option.value, value === true)"
            @click.stop
          />
          <span
            class="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
          >
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ option.label }}
            </span>
            <UTooltip :text="option.description" :popper="{ placement: 'top' }">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              />
            </UTooltip>
          </span>
        </div>
      </div>
    </div>

    <!-- Selected Count -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline align-text-bottom" />
      {{ selectedCount === 0
        ? $t('builder.constraints.noneSelected')
        : $t('builder.constraints.selectedCount', { count: selectedCount })
      }}
    </p>

    <!-- Divider -->
    <div class="border-t border-gray-200 dark:border-gray-700 my-6" />

    <!-- Additional Constraints Input -->
    <div class="w-full md:w-1/2">
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
        :rows="3"
        class="w-full"
        @input="handleOtherConstraintsChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';
import { Constraint } from '~/types';

const { t } = useI18n();
const formStore = useFormStore();

// Word limit constraints (mutually exclusive)
const wordLimitConstraints = [
  Constraint.WORD_LIMIT_100,
  Constraint.WORD_LIMIT_300,
  Constraint.WORD_LIMIT_500,
];

// Word limit options
const wordLimitOptions = computed(() => [
  {
    value: Constraint.WORD_LIMIT_100,
    label: t('builder.constraints.options.wordLimit100.label'),
    description: t('builder.constraints.options.wordLimit100.description'),
  },
  {
    value: Constraint.WORD_LIMIT_300,
    label: t('builder.constraints.options.wordLimit300.label'),
    description: t('builder.constraints.options.wordLimit300.description'),
  },
  {
    value: Constraint.WORD_LIMIT_500,
    label: t('builder.constraints.options.wordLimit500.label'),
    description: t('builder.constraints.options.wordLimit500.description'),
  },
]);

// Other constraint options (can select multiple)
const otherConstraintOptions = computed(() => [
  {
    value: Constraint.INCLUDE_CITATIONS,
    label: t('builder.constraints.options.includeCitations.label'),
    description: t('builder.constraints.options.includeCitations.description'),
  },
  {
    value: Constraint.USE_PROVIDED_DATA,
    label: t('builder.constraints.options.useProvidedData.label'),
    description: t('builder.constraints.options.useProvidedData.description'),
  },
  {
    value: Constraint.NO_JARGON,
    label: t('builder.constraints.options.noJargon.label'),
    description: t('builder.constraints.options.noJargon.description'),
  },
  {
    value: Constraint.TECHNICAL_DETAIL,
    label: t('builder.constraints.options.technicalDetail.label'),
    description: t('builder.constraints.options.technicalDetail.description'),
  },
  {
    value: Constraint.BEGINNER_FRIENDLY,
    label: t('builder.constraints.options.beginnerFriendly.label'),
    description: t('builder.constraints.options.beginnerFriendly.description'),
  },
  {
    value: Constraint.ACTION_ORIENTED,
    label: t('builder.constraints.options.actionOriented.label'),
    description: t('builder.constraints.options.actionOriented.description'),
  },
  {
    value: Constraint.DATA_DRIVEN,
    label: t('builder.constraints.options.dataDriven.label'),
    description: t('builder.constraints.options.dataDriven.description'),
  },
]);

// Other constraints value
const otherConstraintsValue = ref('');

// Selected constraints
const selectedConstraints = computed(() => formStore.formData.constraints || []);

// Get currently selected word limit
const selectedWordLimit = computed(() => {
  return selectedConstraints.value.find(c => wordLimitConstraints.includes(c)) || null;
});

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

// Select word limit (radio behavior - only one can be selected)
const selectWordLimit = (constraint: Constraint | null) => {
  // Remove all existing word limit constraints
  wordLimitConstraints.forEach(wl => {
    if (selectedConstraints.value.includes(wl)) {
      formStore.removeConstraint(wl);
    }
  });

  // Add the new word limit if not null
  if (constraint) {
    formStore.addConstraint(constraint);
  }
};

// Toggle constraint (checkbox behavior)
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
