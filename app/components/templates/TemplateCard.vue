<template>
  <UCard
    class="hover:shadow-lg transition-all duration-300 cursor-pointer"
    @click="handleCardClick"
  >
    <div class="p-5">
    <!-- Header with category badge and new/popular tags -->
    <div class="flex items-start justify-between mb-3">
      <UBadge
        :color="categoryColor"
        variant="soft"
        size="sm"
      >
        {{ $t(`templates.categories.${template.category}`) }}
      </UBadge>

      <div class="flex gap-1">
        <UBadge
          v-if="isNew"
          color="emerald"
          variant="solid"
          size="xs"
        >
          {{ $t('templates.card.new') }}
        </UBadge>
        <UBadge
          v-if="isPopular"
          color="emerald"
          variant="soft"
          size="xs"
        >
          {{ $t('templates.card.popular') }}
        </UBadge>
      </div>
    </div>

    <!-- Template title -->
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
      {{ template.title }}
    </h3>

    <!-- Template description -->
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
      {{ template.description }}
    </p>

    <!-- Metadata row -->
    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
      <!-- Difficulty indicator -->
      <div class="flex items-center gap-1">
        <UIcon :name="getDifficultyIcon(template.difficulty)" class="w-4 h-4" />
        <span>{{ $t(`templates.difficulty.${template.difficulty}`) }}</span>
      </div>

      <!-- Estimated time -->
      <div class="flex items-center gap-1">
        <UIcon name="i-heroicons-clock" class="w-4 h-4" />
        <span>{{ $t('templates.card.estimatedTime', { time: template.estimatedTime }) }}</span>
      </div>
    </div>

    <!-- Rating and usage stats -->
    <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <!-- Star rating -->
      <div class="flex items-center gap-1">
        <div class="flex">
          <UIcon
            v-for="star in 5"
            :key="star"
            name="i-heroicons-star-solid"
            :class="[
              'w-4 h-4',
              star <= template.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
            ]"
          />
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-400 ml-1">
          {{ template.rating.toFixed(1) }}
        </span>
      </div>

      <!-- Usage count -->
      <div class="text-xs text-gray-600 dark:text-gray-400">
        {{ $t('templates.card.used', { count: formatUsageCount(template.usageCount) }) }}
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <UButton
        color="emerald"
        variant="solid"
        size="sm"
        block
        @click.stop="handleUseTemplate"
      >
        <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        {{ $t('templates.card.useTemplate') }}
      </UButton>

      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        @click.stop="handleViewDetails"
      >
        <UIcon name="i-heroicons-eye" class="w-4 h-4" />
      </UButton>
    </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PromptTemplate, TemplateCategory, TemplateDifficulty } from '~/types/template';

interface Props {
  template: PromptTemplate;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  use: [template: PromptTemplate];
  viewDetails: [template: PromptTemplate];
  click: [template: PromptTemplate];
}>();

// Check if template is new (created within last 7 days)
const isNew = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(props.template.createdAt) > sevenDaysAgo;
});

// Check if template is popular (usage count > 100)
const isPopular = computed(() => {
  return props.template.usageCount > 100;
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

// Get icon for difficulty level
const getDifficultyIcon = (difficulty: TemplateDifficulty): string => {
  const iconMap: Record<TemplateDifficulty, string> = {
    beginner: 'i-heroicons-academic-cap',
    intermediate: 'i-heroicons-chart-bar',
    advanced: 'i-heroicons-rocket-launch',
  };
  return iconMap[difficulty] || 'i-heroicons-question-mark-circle';
};

// Format usage count (e.g., 1234 => 1.2K)
const formatUsageCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Event handlers
const handleCardClick = () => {
  emit('click', props.template);
};

const handleUseTemplate = () => {
  emit('use', props.template);
};

const handleViewDetails = () => {
  emit('viewDetails', props.template);
};
</script>
