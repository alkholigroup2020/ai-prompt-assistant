<script setup lang="ts">
/**
 * AlternativeVersions Component
 * Displays alternative versions of the enhanced prompt
 */

import { copyToClipboard } from '~/utils/export';
import type { AlternativeVersions } from '~/types';

interface Props {
  versions?: AlternativeVersions;
}

const props = defineProps<Props>();

const { t } = useI18n();
const toast = useToast();

// State
const activeTab = ref<'concise' | 'detailed' | 'technical'>('concise');
const copyingVersion = ref<string | null>(null);

// Tab definitions
interface TabItem {
  key: 'concise' | 'detailed' | 'technical';
  label: string;
  icon: string;
  description: string;
}

const tabs = computed<TabItem[]>(() => [
  {
    key: 'concise',
    label: t('results.versions.concise'),
    icon: 'i-heroicons-bolt',
    description: t('results.versions.conciseDescription'),
  },
  {
    key: 'detailed',
    label: t('results.versions.detailed'),
    icon: 'i-heroicons-document-text',
    description: t('results.versions.detailedDescription'),
  },
  {
    key: 'technical',
    label: t('results.versions.technical'),
    icon: 'i-heroicons-code-bracket',
    description: t('results.versions.technicalDescription'),
  },
]);

// Get active version content
const activeVersionContent = computed(() => {
  if (!props.versions) return '';

  switch (activeTab.value) {
    case 'concise':
      return props.versions.concise;
    case 'detailed':
      return props.versions.detailed;
    case 'technical':
      return props.versions.technical ?? '';
    default:
      return '';
  }
});

// Get active tab info
const activeTabInfo = computed(() => {
  return tabs.value.find(tab => tab.key === activeTab.value);
});

// Check if versions are available
const hasVersions = computed(() => {
  return props.versions && (
    props.versions.concise ||
    props.versions.detailed ||
    props.versions.technical
  );
});

/**
 * Copy specific version to clipboard
 */
const copyVersion = async (version: string): Promise<void> => {
  if (copyingVersion.value) return;

  copyingVersion.value = version;

  try {
    const content = version === 'concise'
      ? props.versions?.concise
      : version === 'detailed'
        ? props.versions?.detailed
        : props.versions?.technical;

    if (!content) {
      throw new Error('Version content not available');
    }

    await copyToClipboard(content);

    toast.add({
      title: t('results.versions.copySuccess'),
      description: t('results.versions.copySuccessDescription', { version }),
      icon: 'i-heroicons-check-circle',
      color: 'emerald',
    });
  } catch {
    toast.add({
      title: t('results.versions.copyError'),
      description: t('results.versions.copyErrorDescription'),
      icon: 'i-heroicons-x-circle',
      color: 'primary',
    });
  } finally {
    setTimeout(() => {
      copyingVersion.value = null;
    }, 1500);
  }
};

/**
 * Get word count for version
 */
const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Version stats
const versionStats = computed(() => {
  if (!activeVersionContent.value) return null;

  return {
    words: getWordCount(activeVersionContent.value),
    chars: activeVersionContent.value.trim().length,
  };
});
</script>

<template>
  <div class="alternative-versions-container">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('results.versions.title') }}
        </h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('results.versions.description') }}
      </p>
    </div>

    <!-- Content -->
    <div v-if="hasVersions" class="versions-content">
      <!-- Tabs -->
      <div class="tabs-container">
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'tab-button',
              activeTab === tab.key ? 'tab-active' : 'tab-inactive'
            ]"
            @click="activeTab = tab.key"
          >
            <UIcon :name="tab.icon" class="w-5 h-5" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Active Version Display -->
      <div class="version-display">
        <!-- Version Info Bar -->
        <div class="info-bar">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <UIcon
                v-if="activeTabInfo"
                :name="activeTabInfo.icon"
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
              />
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ activeTabInfo?.label }}
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {{ activeTabInfo?.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <!-- Stats -->
              <div v-if="versionStats" class="text-sm text-gray-600 dark:text-gray-400">
                <span>{{ versionStats.words }} {{ t('results.versions.words') }}</span>
                <span class="mx-2">•</span>
                <span>{{ versionStats.chars }} {{ t('results.versions.chars') }}</span>
              </div>

              <!-- Copy Button -->
              <UButton
                :icon="copyingVersion === activeTab ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                :label="copyingVersion === activeTab ? t('results.versions.copied') : t('results.versions.copy')"
                color="primary"
                size="sm"
                :disabled="!!copyingVersion"
                @click="copyVersion(activeTab)"
              />
            </div>
          </div>
        </div>

        <!-- Version Content -->
        <div class="version-content">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab" class="content-wrapper">
              <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ activeVersionContent }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Quick Copy All -->
      <div class="mt-4 flex gap-3">
        <UButton
          v-for="tab in tabs"
          :key="`quick-${tab.key}`"
          :icon="copyingVersion === tab.key ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
          :label="t('results.versions.quickCopy', { version: tab.label })"
          color="neutral"
          size="sm"
          variant="outline"
          :disabled="!!copyingVersion"
          class="flex-1"
          @click="copyVersion(tab.key)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <UIcon name="i-heroicons-document-duplicate" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
      <p class="text-gray-600 dark:text-gray-400 text-center">
        {{ t('results.versions.empty') }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
        {{ t('results.versions.emptyDescription') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.alternative-versions-container {
  @apply w-full;
}

.versions-content {
  @apply bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm;
}

/* Tabs */
.tabs-container {
  @apply px-6 pt-6;
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200;
}

.tab-active {
  @apply bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500 ring-opacity-20;
}

.tab-inactive {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700;
}

/* Version Display */
.version-display {
  @apply border-t border-gray-200 dark:border-gray-800;
}

.info-bar {
  @apply px-6 py-4 bg-purple-50 dark:bg-purple-950 border-b border-purple-100 dark:border-purple-900;
}

.version-content {
  @apply px-6 py-5;
}

.content-wrapper {
  @apply min-h-[200px];
}

/* Empty State */
.empty-state {
  @apply text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .tabs-container .flex {
    @apply flex-col;
  }

  .tab-button {
    @apply w-full justify-center;
  }

  .info-bar .flex {
    @apply flex-col items-start;
  }
}

/* RTL Support */
html[dir="rtl"] .alternative-versions-container {
  @apply text-right;
}
</style>
