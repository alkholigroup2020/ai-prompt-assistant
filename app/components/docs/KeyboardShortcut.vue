<template>
  <div class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <!-- Keys -->
    <div class="flex items-center gap-1.5">
      <kbd
        v-for="(key, index) in keys"
        :key="index"
        class="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
      >
        {{ key }}
      </kbd>
    </div>

    <!-- Action description -->
    <span class="text-sm text-gray-600 dark:text-gray-400 ms-4">
      {{ action }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  keys: string[]
  action: string
}>()
</script>
