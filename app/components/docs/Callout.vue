<template>
  <div
    class="rounded-lg p-4 my-4"
    :class="variantClasses"
    role="note"
    :aria-label="ariaLabel"
  >
    <div class="flex gap-3">
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <UIcon :name="icon" class="w-5 h-5" :class="iconClass" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <p v-if="title" class="font-semibold mb-1" :class="titleClass">
          {{ title }}
        </p>

        <!-- Body -->
        <div class="text-sm" :class="bodyClass">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type CalloutType = 'info' | 'tip' | 'warning' | 'danger'

const props = withDefaults(defineProps<{
  type?: CalloutType
  title?: string
}>(), {
  type: 'info',
  title: ''
})

const { t } = useI18n()

// Icons per type
const iconMap: Record<CalloutType, string> = {
  info: 'i-heroicons-information-circle',
  tip: 'i-heroicons-light-bulb',
  warning: 'i-heroicons-exclamation-triangle',
  danger: 'i-heroicons-x-circle'
}

const icon = computed(() => iconMap[props.type])

// Variant classes
const variantClasses = computed(() => {
  const classes: Record<CalloutType, string> = {
    info: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800',
    tip: 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes: Record<CalloutType, string> = {
    info: 'text-blue-600 dark:text-blue-400',
    tip: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400'
  }
  return classes[props.type]
})

const titleClass = computed(() => {
  const classes: Record<CalloutType, string> = {
    info: 'text-blue-900 dark:text-blue-100',
    tip: 'text-emerald-900 dark:text-emerald-100',
    warning: 'text-amber-900 dark:text-amber-100',
    danger: 'text-red-900 dark:text-red-100'
  }
  return classes[props.type]
})

const bodyClass = computed(() => {
  const classes: Record<CalloutType, string> = {
    info: 'text-blue-800 dark:text-blue-200',
    tip: 'text-emerald-800 dark:text-emerald-200',
    warning: 'text-amber-800 dark:text-amber-200',
    danger: 'text-red-800 dark:text-red-200'
  }
  return classes[props.type]
})

// Accessibility
const ariaLabel = computed(() => {
  const labels: Record<CalloutType, string> = {
    info: t('userManual.callouts.info'),
    tip: t('userManual.callouts.tip'),
    warning: t('userManual.callouts.warning'),
    danger: t('userManual.callouts.danger')
  }
  return props.title || labels[props.type]
})
</script>
