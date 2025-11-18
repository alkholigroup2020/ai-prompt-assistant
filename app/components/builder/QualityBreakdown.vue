<script setup lang="ts">
import type { QualityScoreBreakdown } from '~/types'

interface Props {
  breakdown: QualityScoreBreakdown
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
})

const { t } = useI18n()

// Animated values for smooth transitions
const animatedValues = ref({
  clarity: 0,
  specificity: 0,
  context: 0,
  structure: 0,
  completeness: 0,
})

// Watch for changes in breakdown and animate
watch(
  () => props.breakdown,
  (newBreakdown) => {
    if (props.animate) {
      const _duration = 800 // Animation duration in ms (for reference)
      const steps = 60 // 60 fps
      const keys: Array<keyof QualityScoreBreakdown> = [
        'clarity',
        'specificity',
        'context',
        'structure',
        'completeness',
      ]

      keys.forEach((key) => {
        const targetValue = newBreakdown[key]
        const currentValue = animatedValues.value[key]
        const increment = (targetValue - currentValue) / steps
        let currentStep = 0

        const animate = () => {
          if (currentStep < steps) {
            animatedValues.value[key] += increment
            currentStep++
            requestAnimationFrame(animate)
          } else {
            animatedValues.value[key] = targetValue
          }
        }

        requestAnimationFrame(animate)
      })
    } else {
      animatedValues.value = { ...props.breakdown }
    }
  },
  { immediate: true, deep: true }
)

// Get color based on score value
const getBarColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getBarColorDark = (score: number): string => {
  if (score >= 80) return 'dark:bg-emerald-400'
  if (score >= 60) return 'dark:bg-yellow-400'
  return 'dark:bg-red-400'
}

// Quality metrics configuration
const metrics = computed(() => [
  {
    key: 'clarity',
    label: t('quality.breakdown.clarity'),
    description: t('quality.breakdown.clarityDesc'),
    icon: 'i-heroicons-light-bulb',
    value: animatedValues.value.clarity,
  },
  {
    key: 'specificity',
    label: t('quality.breakdown.specificity'),
    description: t('quality.breakdown.specificityDesc'),
    icon: 'i-heroicons-magnifying-glass',
    value: animatedValues.value.specificity,
  },
  {
    key: 'context',
    label: t('quality.breakdown.context'),
    description: t('quality.breakdown.contextDesc'),
    icon: 'i-heroicons-document-text',
    value: animatedValues.value.context,
  },
  {
    key: 'structure',
    label: t('quality.breakdown.structure'),
    description: t('quality.breakdown.structureDesc'),
    icon: 'i-heroicons-squares-2x2',
    value: animatedValues.value.structure,
  },
  {
    key: 'completeness',
    label: t('quality.breakdown.completeness'),
    description: t('quality.breakdown.completenessDesc'),
    icon: 'i-heroicons-check-circle',
    value: animatedValues.value.completeness,
  },
])
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <UIcon name="i-heroicons-chart-bar" class="h-5 w-5 text-emerald-500" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('quality.breakdown.title') }}
      </h3>
    </div>

    <!-- Metrics List -->
    <div class="space-y-3">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Metric Header -->
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon :name="metric.icon" class="h-5 w-5 text-emerald-500" />
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ metric.label }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ metric.description }}
              </p>
            </div>
          </div>
          <span class="text-sm font-bold text-gray-900 dark:text-white">
            {{ Math.round(metric.value) }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            :class="[getBarColor(metric.value), getBarColorDark(metric.value)]"
            :style="{ width: `${metric.value}%` }"
            class="h-full rounded-full transition-all duration-800 ease-out"
          >
            <!-- Shine effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Overall Summary -->
    <div
      class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950"
    >
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            {{ t('quality.breakdown.summaryTitle') }}
          </h4>
          <p class="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
            {{ t('quality.breakdown.summaryDesc') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
