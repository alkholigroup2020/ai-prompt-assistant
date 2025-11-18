<script setup lang="ts">
/**
 * ImprovementsList Component
 * Displays list of improvements made to the prompt
 */

interface Improvement {
  text: string;
  category?: 'clarity' | 'specificity' | 'context' | 'structure' | 'completeness';
  details?: string;
}

interface Props {
  improvements: string[] | Improvement[];
  showCategories?: boolean;
  expandable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCategories: true,
  expandable: true,
});

const { t } = useI18n();

// State for expandable details
const expandedItems = ref<Set<number>>(new Set());

/**
 * Toggle expansion of an improvement item
 */
const toggleExpansion = (index: number): void => {
  if (expandedItems.value.has(index)) {
    expandedItems.value.delete(index);
  } else {
    expandedItems.value.add(index);
  }
};

/**
 * Check if an item is expanded
 */
const isExpanded = (index: number): boolean => {
  return expandedItems.value.has(index);
};

/**
 * Normalize improvements to structured format
 */
const normalizedImprovements = computed(() => {
  return props.improvements.map((improvement): Improvement => {
    if (typeof improvement === 'string') {
      return { text: improvement };
    }
    return improvement;
  });
});

/**
 * Get category icon based on category type
 */
const getCategoryIcon = (category?: string): string => {
  const icons: Record<string, string> = {
    clarity: 'i-heroicons-light-bulb',
    specificity: 'i-heroicons-magnifying-glass',
    context: 'i-heroicons-information-circle',
    structure: 'i-heroicons-squares-2x2',
    completeness: 'i-heroicons-check-circle',
  };
  return icons[category ?? ''] ?? 'i-heroicons-sparkles';
};

/**
 * Get category color (only accepted Nuxt UI colors)
 */
const getCategoryColor = (category?: string): 'primary' | 'emerald' | 'navy' | 'neutral' => {
  const colors: Record<string, 'primary' | 'emerald' | 'navy' | 'neutral'> = {
    clarity: 'primary',
    specificity: 'navy',
    context: 'primary',
    structure: 'navy',
    completeness: 'emerald',
  };
  return colors[category ?? ''] ?? 'emerald';
};

/**
 * Group improvements by category
 */
const groupedImprovements = computed(() => {
  if (!props.showCategories) {
    return { uncategorized: normalizedImprovements.value };
  }

  const groups: Record<string, Improvement[]> = {};

  normalizedImprovements.value.forEach((improvement) => {
    const category = improvement.category ?? 'uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(improvement);
  });

  return groups;
});

/**
 * Get category label translation key
 */
const getCategoryLabel = (category: string): string => {
  return t(`results.improvements.categories.${category}`, category);
};
</script>

<template>
  <div class="improvements-list-container">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('results.improvements.title') }}
        </h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('results.improvements.description', { count: improvements.length }) }}
      </p>
    </div>

    <!-- Improvements List -->
    <div class="space-y-6">
      <div
        v-for="(items, category) in groupedImprovements"
        :key="category"
        class="category-group"
      >
        <!-- Category Header (if showing categories) -->
        <div v-if="showCategories && category !== 'uncategorized'" class="mb-3">
          <div class="flex items-center gap-2">
            <UIcon
              :name="getCategoryIcon(category)"
              class="w-5 h-5"
              :class="`text-${getCategoryColor(category)}-600 dark:text-${getCategoryColor(category)}-400`"
            />
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {{ getCategoryLabel(category) }}
            </h3>
            <UBadge :color="getCategoryColor(category)" variant="subtle" size="xs">
              {{ items.length }}
            </UBadge>
          </div>
        </div>

        <!-- Improvement Items -->
        <div class="space-y-3">
          <div
            v-for="(improvement, index) in items"
            :key="`${category}-${index}`"
            class="improvement-item"
          >
            <div class="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors duration-200">
              <!-- Checkmark Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <UIcon name="i-heroicons-check" class="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ improvement.text }}
                </p>

                <!-- Expandable Details -->
                <div v-if="expandable && improvement.details" class="mt-2">
                  <button
                    class="text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    @click="toggleExpansion(index)"
                  >
                    <span>{{ isExpanded(index) ? t('results.improvements.showLess') : t('results.improvements.showMore') }}</span>
                    <UIcon
                      :name="isExpanded(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                      class="w-4 h-4"
                    />
                  </button>

                  <Transition name="expand">
                    <div v-if="isExpanded(index)" class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ improvement.details }}
                      </p>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="improvements.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-check-circle" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('results.improvements.empty') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.improvements-list-container {
  @apply w-full;
}

.category-group {
  @apply pb-4;
}

.improvement-item {
  @apply relative;
}

/* Expand/Collapse Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* RTL Support */
html[dir="rtl"] .improvement-item {
  @apply text-right;
}

html[dir="rtl"] .flex {
  @apply flex-row-reverse;
}
</style>
