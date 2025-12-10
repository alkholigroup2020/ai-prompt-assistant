<script setup lang="ts">
/**
 * RateLimitIndicator Component
 * Displays remaining API requests and cooldown timer
 */

interface Props {
  /** Whether to show the full indicator or just a compact badge */
  compact?: boolean
  /** Whether to show tooltip with details */
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showTooltip: true
})

const { t } = useI18n()
const rateLimitStore = useRateLimitStore()

// Start countdown timer on mount
let stopCountdown: (() => void) | null = null

onMounted(() => {
  rateLimitStore.initialize()
  stopCountdown = rateLimitStore.startCountdownTimer()
})

onUnmounted(() => {
  if (stopCountdown) {
    stopCountdown()
  }
})

// Computed classes for status indicator
const statusClasses = computed(() => {
  const color = rateLimitStore.statusColor
  return {
    dot: {
      success: 'bg-emerald-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    }[color],
    text: {
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400'
    }[color],
    bg: {
      success: 'bg-emerald-50 dark:bg-emerald-900/20',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20',
      error: 'bg-red-50 dark:bg-red-900/20'
    }[color],
    border: {
      success: 'border-emerald-200 dark:border-emerald-800',
      warning: 'border-yellow-200 dark:border-yellow-800',
      error: 'border-red-200 dark:border-red-800'
    }[color]
  }
})

// Tooltip content
const tooltipText = computed(() => {
  if (rateLimitStore.isLimitExceeded) {
    return t('rateLimit.waitMessage', { time: rateLimitStore.formattedCountdown })
  }
  return t('rateLimit.remainingTooltip', {
    remaining: rateLimitStore.remaining,
    limit: rateLimitStore.limit
  })
})
</script>

<template>
  <div
    v-if="rateLimitStore.isLoaded"
    class="rate-limit-indicator"
    :class="{ 'rate-limit-indicator--compact': compact }"
  >
    <!-- Compact Badge View -->
    <UTooltip
      v-if="compact"
      :text="tooltipText"
      :popper="{ placement: 'bottom' }"
    >
      <div
        class="flex items-center gap-1.5 px-2 py-1 rounded-full border cursor-pointer"
        :class="[statusClasses.bg, statusClasses.border]"
      >
        <span
          class="w-2 h-2 rounded-full animate-pulse"
          :class="statusClasses.dot"
        />
        <span class="text-xs font-medium" :class="statusClasses.text">
          {{ rateLimitStore.remaining }}/{{ rateLimitStore.limit }}
        </span>
      </div>
    </UTooltip>

    <!-- Full View -->
    <div
      v-else
      class="flex items-center gap-3 px-3 py-2 rounded-lg border"
      :class="[statusClasses.bg, statusClasses.border]"
    >
      <!-- Status Dot -->
      <span
        class="w-2.5 h-2.5 rounded-full flex-shrink-0"
        :class="[statusClasses.dot, { 'animate-pulse': rateLimitStore.isLimitLow || rateLimitStore.isLimitExceeded }]"
      />

      <!-- Content -->
      <div class="flex flex-col min-w-0">
        <!-- Remaining Requests -->
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-medium" :class="statusClasses.text">
            {{ t('rateLimit.remaining', { count: rateLimitStore.remaining }) }}
          </span>
          <UTooltip
            v-if="showTooltip"
            :text="t('rateLimit.tooltip')"
            :popper="{ placement: 'top' }"
          >
            <UIcon
              name="i-heroicons-information-circle"
              class="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            />
          </UTooltip>
        </div>

        <!-- Countdown Timer (when limit exceeded) -->
        <div
          v-if="rateLimitStore.shouldShowCountdown"
          class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-heroicons-clock" class="w-3 h-3" />
          <span>{{ t('rateLimit.resetIn', { time: rateLimitStore.formattedCountdown }) }}</span>
        </div>

        <!-- Progress Bar -->
        <div
          v-else
          class="w-full mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        >
          <div
            class="h-full transition-all duration-300 rounded-full"
            :class="statusClasses.dot"
            :style="{ width: `${rateLimitStore.remainingPercentage}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Rate Limit Exceeded Alert -->
    <UAlert
      v-if="rateLimitStore.isLimitExceeded && !compact"
      :title="t('rateLimit.exceeded')"
      :description="t('rateLimit.waitMessage', { time: rateLimitStore.formattedCountdown })"
      icon="i-heroicons-exclamation-triangle"
      color="neutral"
      variant="soft"
      class="mt-2 !border-red-200 dark:!border-red-800 !bg-red-50 dark:!bg-red-900/20"
    />
  </div>
</template>

<style scoped>
.rate-limit-indicator {
  @apply w-full;
}

.rate-limit-indicator--compact {
  @apply w-auto inline-flex;
}
</style>
