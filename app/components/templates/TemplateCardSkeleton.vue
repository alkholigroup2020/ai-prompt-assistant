<template>
  <UCard class="animate-pulse">
    <div class="p-5">
      <!-- Header with category badge placeholder -->
      <div class="flex items-start justify-between mb-3">
        <div class="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div class="flex gap-1">
          <div class="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      <!-- Title placeholder -->
      <div class="mb-2 space-y-2">
        <div class="h-5 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-5 w-3/5 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <!-- Description placeholder -->
      <div class="mb-4 space-y-2">
        <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <!-- Metadata row placeholder -->
      <div class="flex items-center justify-between mb-4">
        <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <!-- Rating and usage stats placeholder -->
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-1">
          <div class="flex gap-1">
            <div v-for="i in 5" :key="i" class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
        <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      <!-- Action buttons placeholder -->
      <div class="flex gap-2">
        <div class="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
/**
 * TemplateCardSkeleton Component
 * Loading skeleton for template cards
 */
</script>

<style scoped>
/* Shimmer animation for skeleton */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animate-pulse > div > div {
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
  background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  background-size: 800px 100%;
}
</style>
