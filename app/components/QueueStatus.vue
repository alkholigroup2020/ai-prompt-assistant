<script setup lang="ts">
/**
 * QueueStatus Component
 * Displays the current queue status (position, processing, etc.)
 */

import { useQueueStore } from '~/stores/queue'

const { t } = useI18n()
const queueStore = useQueueStore()

/**
 * Props
 */
interface Props {
  /** Show compact mode (inline) */
  compact?: boolean
  /** Show cancel button */
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showCancel: true,
})

/**
 * Cancel handler
 */
function handleCancel(): void {
  queueStore.cancel()
}

/**
 * Status icon based on current state
 */
const statusIcon = computed(() => {
  switch (queueStore.status) {
    case 'submitting':
      return 'i-heroicons-arrow-up-tray'
    case 'queued':
      return 'i-heroicons-queue-list'
    case 'processing':
      return 'i-heroicons-cog-6-tooth'
    default:
      return 'i-heroicons-queue-list'
  }
})

/**
 * Status color
 */
const statusColor = computed(() => {
  switch (queueStore.status) {
    case 'submitting':
      return 'text-blue-600 dark:text-blue-400'
    case 'queued':
      return 'text-amber-600 dark:text-amber-400'
    case 'processing':
      return 'text-emerald-600 dark:text-emerald-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})
</script>

<template>
  <div
    v-if="queueStore.hasActiveJob"
    :class="[
      'queue-status',
      compact ? 'queue-status--compact' : 'queue-status--full',
    ]"
  >
    <!-- Compact Mode -->
    <template v-if="compact">
      <div class="flex items-center gap-2 text-sm">
        <UIcon
          :name="statusIcon"
          :class="['w-4 h-4', statusColor, queueStore.status === 'processing' ? 'animate-spin' : '']"
        />
        <span class="text-gray-700 dark:text-gray-300">
          <template v-if="queueStore.status === 'submitting'">
            {{ t('queue.submitting') }}
          </template>
          <template v-else-if="queueStore.status === 'queued'">
            {{ t('queue.position', { position: queueStore.position }) }}
            <span class="text-gray-500 dark:text-gray-400 ms-1">
              {{ queueStore.formattedWait }}
            </span>
          </template>
          <template v-else-if="queueStore.status === 'processing'">
            {{ t('queue.processing') }}
          </template>
        </span>
        <UButton
          v-if="showCancel && queueStore.status !== 'submitting'"
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-x-mark"
          class="cursor-pointer"
          :aria-label="t('queue.cancel')"
          @click="handleCancel"
        />
      </div>
    </template>

    <!-- Full Mode -->
    <template v-else>
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div :class="['p-2 rounded-full', queueStore.status === 'processing' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30']">
            <UIcon
              :name="statusIcon"
              :class="['w-5 h-5', statusColor, queueStore.status === 'processing' ? 'animate-spin' : '']"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Title -->
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              <template v-if="queueStore.status === 'submitting'">
                {{ t('queue.submitting') }}
              </template>
              <template v-else-if="queueStore.status === 'queued'">
                {{ t('queue.positionTitle', { position: queueStore.position }) }}
              </template>
              <template v-else-if="queueStore.status === 'processing'">
                {{ t('queue.processingTitle') }}
              </template>
            </p>

            <!-- Description -->
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <template v-if="queueStore.status === 'submitting'">
                {{ t('queue.submittingDesc') }}
              </template>
              <template v-else-if="queueStore.status === 'queued'">
                {{ t('queue.queuedDesc', { wait: queueStore.formattedWait }) }}
              </template>
              <template v-else-if="queueStore.status === 'processing'">
                {{ t('queue.processingDesc') }}
              </template>
            </p>

            <!-- Queue Stats -->
            <p
              v-if="queueStore.queueStats.pending > 0"
              class="mt-2 text-xs text-gray-500 dark:text-gray-500"
            >
              {{ t('queue.stats', { pending: queueStore.queueStats.pending, processing: queueStore.queueStats.processing }) }}
            </p>
          </div>

          <!-- Cancel Button -->
          <UButton
            v-if="showCancel && queueStore.status !== 'submitting'"
            size="sm"
            variant="ghost"
            color="neutral"
            class="cursor-pointer"
            @click="handleCancel"
          >
            {{ t('queue.cancel') }}
          </UButton>
        </div>

        <!-- Progress indicator -->
        <div
          v-if="queueStore.status !== 'submitting'"
          class="mt-3"
        >
          <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full transition-all duration-500',
                queueStore.status === 'processing'
                  ? 'bg-emerald-500 animate-pulse w-full'
                  : 'bg-amber-500',
              ]"
              :style="queueStore.status === 'queued' ? { width: `${Math.max(10, 100 - queueStore.position * 10)}%` } : {}"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.queue-status--compact {
  @apply inline-flex;
}

.queue-status--full {
  @apply w-full;
}
</style>
