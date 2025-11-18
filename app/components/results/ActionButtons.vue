<script setup lang="ts">
/**
 * ActionButtons Component
 * Action buttons for results page (copy, download, share, new prompt)
 */

import { copyToClipboard, exportPrompt } from '~/utils/export';
import type { FormInput, EnhancementResponse } from '~/types';

interface Props {
  enhancedPrompt: string;
  originalInput?: FormInput;
  response?: EnhancementResponse;
  showShare?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showShare: true,
  originalInput: undefined,
  response: undefined,
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// State
const isCopying = ref(false);
const isExporting = ref(false);
const showExportMenu = ref(false);

/**
 * Copy enhanced prompt to clipboard
 */
const handleCopy = async (): Promise<void> => {
  if (isCopying.value) return;

  isCopying.value = true;

  try {
    await copyToClipboard(props.enhancedPrompt);

    // Show success feedback
    toast.add({
      title: t('results.actions.copySuccess'),
      description: t('results.actions.copySuccessDescription'),
      icon: 'i-heroicons-check-circle',
      color: 'emerald',
    });
  } catch {
    // Show error feedback
    toast.add({
      title: t('results.actions.copyError'),
      description: t('results.actions.copyErrorDescription'),
      icon: 'i-heroicons-x-circle',
      color: 'primary',
    });
  } finally {
    // Reset after a short delay to show the checkmark
    setTimeout(() => {
      isCopying.value = false;
    }, 1500);
  }
};

/**
 * Download prompt in specified format
 */
const handleDownload = async (format: 'txt' | 'md' | 'json'): Promise<void> => {
  if (isExporting.value) return;

  isExporting.value = true;
  showExportMenu.value = false;

  try {
    // Prepare metadata
    const metadata = {
      title: props.response?.data?.shortTitle,
      timestamp: true,
      qualityScore: props.response?.data?.qualityScore,
      improvements: props.response?.data?.improvements,
    };

    // Export the prompt
    exportPrompt(format, props.enhancedPrompt, metadata, props.originalInput, props.response);

    // Show success feedback
    toast.add({
      title: t('results.actions.downloadSuccess'),
      description: t('results.actions.downloadSuccessDescription', { format: format.toUpperCase() }),
      icon: 'i-heroicons-arrow-down-tray',
      color: 'emerald',
    });
  } catch {
    // Show error feedback
    toast.add({
      title: t('results.actions.downloadError'),
      description: t('results.actions.downloadErrorDescription'),
      icon: 'i-heroicons-x-circle',
      color: 'primary',
    });
  } finally {
    setTimeout(() => {
      isExporting.value = false;
    }, 1000);
  }
};

/**
 * Share prompt via URL (copies URL to clipboard)
 */
const handleShare = async (): Promise<void> => {
  try {
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);

    toast.add({
      title: t('results.actions.shareSuccess'),
      description: t('results.actions.shareSuccessDescription'),
      icon: 'i-heroicons-link',
      color: 'emerald',
    });
  } catch {
    toast.add({
      title: t('results.actions.shareError'),
      description: t('results.actions.shareErrorDescription'),
      icon: 'i-heroicons-x-circle',
      color: 'primary',
    });
  }
};

/**
 * Navigate to create a new prompt
 */
const handleNewPrompt = (): void => {
  router.push('/builder');
};

// Export menu options
const exportOptions = [
  {
    label: t('results.actions.downloadTxt'),
    icon: 'i-heroicons-document-text',
    format: 'txt' as const,
    description: t('results.actions.downloadTxtDescription'),
  },
  {
    label: t('results.actions.downloadMd'),
    icon: 'i-heroicons-document',
    format: 'md' as const,
    description: t('results.actions.downloadMdDescription'),
  },
  {
    label: t('results.actions.downloadJson'),
    icon: 'i-heroicons-code-bracket',
    format: 'json' as const,
    description: t('results.actions.downloadJsonDescription'),
  },
];
</script>

<template>
  <div class="action-buttons-container">
    <div class="flex flex-wrap gap-3">
      <!-- Copy Button -->
      <UButton
        :icon="isCopying ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
        :label="isCopying ? t('results.actions.copied') : t('results.actions.copy')"
        color="emerald"
        size="lg"
        :loading="false"
        :disabled="isCopying"
        class="flex-1 sm:flex-none"
        @click="handleCopy"
      />

      <!-- Download Button with Dropdown -->
      <div class="relative flex-1 sm:flex-none">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          :label="t('results.actions.download')"
          color="primary"
          size="lg"
          :loading="isExporting"
          class="w-full"
          @click="showExportMenu = !showExportMenu"
        />

        <!-- Export Format Menu -->
        <Transition name="dropdown">
          <div
            v-if="showExportMenu"
            v-click-outside="() => showExportMenu = false"
            class="absolute top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10 overflow-hidden"
          >
            <div
              v-for="option in exportOptions"
              :key="option.format"
              class="export-option"
              @click="handleDownload(option.format)"
            >
              <div class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <UIcon :name="option.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ option.label }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ option.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Share Button -->
      <UButton
        v-if="showShare"
        icon="i-heroicons-share"
        :label="t('results.actions.share')"
        color="neutral"
        size="lg"
        variant="outline"
        class="flex-1 sm:flex-none"
        @click="handleShare"
      />

      <!-- New Prompt Button -->
      <UButton
        icon="i-heroicons-plus-circle"
        :label="t('results.actions.newPrompt')"
        color="neutral"
        size="lg"
        variant="outline"
        class="flex-1 sm:flex-none"
        @click="handleNewPrompt"
      />
    </div>

    <!-- Help Text -->
    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-blue-900 dark:text-blue-100">
          {{ t('results.actions.helpText') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-buttons-container {
  @apply w-full;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.export-option {
  @apply border-b border-gray-200 dark:border-gray-800 last:border-b-0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .action-buttons-container .flex {
    @apply flex-col;
  }

  .action-buttons-container .flex > * {
    @apply w-full;
  }
}

/* RTL Support */
html[dir="rtl"] .action-buttons-container {
  @apply text-right;
}
</style>
