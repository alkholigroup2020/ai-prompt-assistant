<template>
  <div class="space-y-6">
    <!-- Filters and Search Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-5">
      <div class="flex flex-col gap-3 sm:gap-4">
        <!-- Search Input -->
        <div class="w-full">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('templates.searchPlaceholder')"
            icon="i-heroicons-magnifying-glass"
            size="lg"
            class="min-h-[44px]"
          >
            <template #trailing>
              <UButton
                v-if="searchQuery"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- Filter Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Category Filter -->
          <USelect
            v-model="selectedCategory"
            :options="categoryOptions"
            option-attribute="label"
            value-attribute="value"
            :placeholder="$t('templates.filters.allCategories')"
            size="lg"
            class="min-h-[44px]"
          />

          <!-- Difficulty Filter -->
          <USelect
            v-model="selectedDifficulty"
            :options="difficultyOptions"
            option-attribute="label"
            value-attribute="value"
            :placeholder="$t('templates.filters.allDifficulties')"
            size="lg"
            class="min-h-[44px]"
          />

          <!-- Sort By -->
          <USelect
            v-model="sortBy"
            :options="sortOptions"
            option-attribute="label"
            value-attribute="value"
            :placeholder="$t('templates.filters.sortBy')"
            size="lg"
            class="min-h-[44px]"
          />

          <!-- Clear Filters Button -->
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-heroicons-x-mark"
            class="min-h-[44px] sm:col-span-2 lg:col-span-1"
            @click="clearFilters"
          >
            {{ $t('templates.filters.clear') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div v-if="!loading && filteredTemplates.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
      {{ $t('templates.grid.showing', {
        start: (currentPage - 1) * pageSize + 1,
        end: Math.min(currentPage * pageSize, filteredTemplates.length),
        total: filteredTemplates.length
      }) }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TemplateCardSkeleton
        v-for="i in pageSize"
        :key="i"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredTemplates.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('templates.grid.noResults') }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('templates.grid.noResultsDescription') }}
      </p>
      <UButton
        v-if="hasActiveFilters"
        color="emerald"
        variant="outline"
        @click="clearFilters"
      >
        {{ $t('templates.filters.clear') }}
      </UButton>
    </div>

    <!-- Template Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <TemplateCard
        v-for="template in paginatedTemplates"
        :key="template.id"
        :template="template"
        @use="handleUseTemplate"
        @view-details="handleViewDetails"
        @click="handleTemplateClick"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && filteredTemplates.length > pageSize"
      class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
    >
      <UButton
        color="neutral"
        variant="outline"
        size="md"
        class="min-h-[44px] w-full sm:w-auto"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
        {{ $t('templates.grid.previous') }}
      </UButton>

      <span class="text-sm sm:text-base text-gray-600 dark:text-gray-400 order-first sm:order-none">
        {{ $t('templates.grid.page', { current: currentPage, total: totalPages }) }}
      </span>

      <UButton
        color="neutral"
        variant="outline"
        size="md"
        class="min-h-[44px] w-full sm:w-auto"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        {{ $t('templates.grid.next') }}
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Nuxt UI USelectMenu slot types are incomplete
/* eslint-enable @typescript-eslint/ban-ts-comment */
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PromptTemplate, TemplateCategory, TemplateDifficulty } from '~/types/template';
import TemplateCard from './TemplateCard.vue';
import TemplateCardSkeleton from './TemplateCardSkeleton.vue';

const { t } = useI18n();

interface Props {
  templates: PromptTemplate[];
  loading?: boolean;
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pageSize: 12,
});

const emit = defineEmits<{
  useTemplate: [template: PromptTemplate];
  viewDetails: [template: PromptTemplate];
  templateClick: [template: PromptTemplate];
}>();

// Filter and search state
const searchQuery = ref('');
const selectedCategory = ref<TemplateCategory | null>(null);
const selectedDifficulty = ref<TemplateDifficulty | null>(null);
const sortBy = ref<'popular' | 'recent' | 'rating' | 'title'>('popular');
const currentPage = ref(1);

// Category options
const categoryOptions = computed(() => [
  { value: null, label: t('templates.filters.allCategories') },
  { value: 'business', label: t('templates.categories.business') },
  { value: 'technical', label: t('templates.categories.technical') },
  { value: 'creative', label: t('templates.categories.creative') },
  { value: 'analysis', label: t('templates.categories.analysis') },
  { value: 'communication', label: t('templates.categories.communication') },
  { value: 'research', label: t('templates.categories.research') },
  { value: 'marketing', label: t('templates.categories.marketing') },
  { value: 'hr', label: t('templates.categories.hr') },
  { value: 'sales', label: t('templates.categories.sales') },
  { value: 'customer_service', label: t('templates.categories.customer_service') },
]);

// Difficulty options
const difficultyOptions = computed(() => [
  { value: null, label: t('templates.filters.allDifficulties') },
  { value: 'beginner', label: t('templates.difficulty.beginner') },
  { value: 'intermediate', label: t('templates.difficulty.intermediate') },
  { value: 'advanced', label: t('templates.difficulty.advanced') },
]);

// Sort options
const sortOptions = computed(() => [
  { value: 'popular', label: t('templates.filters.popular') },
  { value: 'recent', label: t('templates.filters.recent') },
  { value: 'rating', label: t('templates.filters.rating') },
  { value: 'title', label: t('templates.filters.titleAsc') },
]);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
         selectedCategory.value !== null ||
         selectedDifficulty.value !== null ||
         sortBy.value !== 'popular';
});

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = null;
  selectedDifficulty.value = null;
  sortBy.value = 'popular';
  currentPage.value = 1;
};

// Filtered templates
const filteredTemplates = computed(() => {
  let results = [...props.templates];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(template =>
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    results = results.filter(template => template.category === selectedCategory.value);
  }

  // Apply difficulty filter
  if (selectedDifficulty.value) {
    results = results.filter(template => template.difficulty === selectedDifficulty.value);
  }

  // Apply sorting
  results.sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.usageCount - a.usageCount;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return results;
});

// Paginated templates
const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  const end = start + props.pageSize;
  return filteredTemplates.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredTemplates.value.length / props.pageSize);
});

// Reset to first page when filters change
watch([searchQuery, selectedCategory, selectedDifficulty, sortBy], () => {
  currentPage.value = 1;
});

// Event handlers
const handleUseTemplate = (template: PromptTemplate) => {
  emit('useTemplate', template);
};

const handleViewDetails = (template: PromptTemplate) => {
  emit('viewDetails', template);
};

const handleTemplateClick = (template: PromptTemplate) => {
  emit('templateClick', template);
};
</script>
