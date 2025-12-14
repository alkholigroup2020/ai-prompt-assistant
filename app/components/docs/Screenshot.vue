<template>
  <figure class="my-6 w-full">
    <!-- Image Container -->
    <div
      class="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800"
      :class="containerClass"
    >
      <img
        :src="src"
        :alt="alt"
        class="w-full h-auto rounded-lg"
        loading="lazy"
      >
    </div>

    <!-- Caption -->
    <figcaption
      v-if="caption"
      class="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  caption?: string
  size?: 'small' | 'medium' | 'full'
}>(), {
  size: 'full',
  caption: ''
})

const containerClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'max-w-sm mx-auto'
    case 'medium':
      return 'max-w-xl mx-auto'
    default:
      return ''
  }
})
</script>
