<template>
  <section :id="id" class="scroll-mt-24">
    <!-- Heading with anchor link -->
    <component :is="headingTag" class="group flex items-center gap-2 pt-8" :class="headingClass">
      <span>{{ title }}</span>
      <a
        :href="`#${id}`"
        class="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        :aria-label="t('userManual.section.copyLink', { title })"
      >
        <UIcon
          name="i-heroicons-link"
          class="w-5 h-5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
        />
      </a>
    </component>

    <!-- Content -->
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    title: string
    level?: 2 | 3
  }>(),
  {
    level: 2,
  }
)

const { t } = useI18n()

const headingTag = computed(() => `h${props.level}`)

const headingClass = computed(() => {
  if (props.level === 2) {
    return 'text-2xl font-bold text-gray-900 dark:text-white mt-16 first:mt-0'
  }
  return 'text-xl font-semibold text-gray-900 dark:text-white mt-10'
})
</script>
