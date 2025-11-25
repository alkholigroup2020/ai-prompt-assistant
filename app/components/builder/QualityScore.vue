<script setup lang="ts">
interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: true,
  animate: true,
})

const { t } = useI18n()

// Animated score value for smooth transitions
const animatedScore = ref(0)
const targetScore = computed(() => Math.max(0, Math.min(100, props.score)))

// Animate score on mount and when it changes
watch(
  targetScore,
  (newScore) => {
    // Skip animation during SSR (requestAnimationFrame not available)
    if (!import.meta.client) {
      animatedScore.value = newScore
      return
    }

    if (props.animate) {
      const _duration = 1000 // 1 second animation (for reference)
      const steps = 60 // 60 fps
      const increment = (newScore - animatedScore.value) / steps
      let currentStep = 0

      const animate = () => {
        if (currentStep < steps) {
          animatedScore.value += increment
          currentStep++
          requestAnimationFrame(animate)
        } else {
          animatedScore.value = newScore
        }
      }

      requestAnimationFrame(animate)
    } else {
      animatedScore.value = newScore
    }
  },
  { immediate: true }
)

// Size configurations
const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm':
      return { circle: 80, stroke: 8, fontSize: 'text-xl' }
    case 'lg':
      return { circle: 160, stroke: 16, fontSize: 'text-5xl' }
    default: // md
      return { circle: 120, stroke: 12, fontSize: 'text-3xl' }
  }
})

const radius = computed(() => {
  const { circle, stroke } = sizeConfig.value
  return (circle - stroke) / 2
})

const circumference = computed(() => 2 * Math.PI * radius.value)

const strokeDashoffset = computed(() => {
  const progress = animatedScore.value / 100
  return circumference.value * (1 - progress)
})

// Color coding based on score
const scoreColor = computed(() => {
  if (animatedScore.value >= 80) return 'text-emerald-500'
  if (animatedScore.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
})

const strokeColor = computed(() => {
  if (animatedScore.value >= 80) return 'stroke-emerald-500'
  if (animatedScore.value >= 60) return 'stroke-yellow-500'
  return 'stroke-red-500'
})

// Quality rating label
const qualityRating = computed(() => {
  if (animatedScore.value >= 90) return t('quality.rating.excellent')
  if (animatedScore.value >= 80) return t('quality.rating.veryGood')
  if (animatedScore.value >= 70) return t('quality.rating.good')
  if (animatedScore.value >= 60) return t('quality.rating.fair')
  if (animatedScore.value >= 40) return t('quality.rating.needsImprovement')
  return t('quality.rating.poor')
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Circular Progress SVG -->
    <div class="relative" :style="{ width: `${sizeConfig.circle}px`, height: `${sizeConfig.circle}px` }">
      <svg
        :width="sizeConfig.circle"
        :height="sizeConfig.circle"
        class="transform -rotate-90"
      >
        <!-- Background circle -->
        <circle
          :cx="sizeConfig.circle / 2"
          :cy="sizeConfig.circle / 2"
          :r="radius"
          :stroke-width="sizeConfig.stroke"
          class="stroke-gray-200 dark:stroke-gray-700"
          fill="none"
        />

        <!-- Progress circle -->
        <circle
          :cx="sizeConfig.circle / 2"
          :cy="sizeConfig.circle / 2"
          :r="radius"
          :stroke-width="sizeConfig.stroke"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          :class="strokeColor"
          class="transition-all duration-1000 ease-out"
          fill="none"
          stroke-linecap="round"
        />
      </svg>

      <!-- Score text in center -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span :class="[scoreColor, sizeConfig.fontSize]" class="font-bold transition-colors duration-500">
          {{ Math.round(animatedScore) }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          / 100
        </span>
      </div>
    </div>

    <!-- Quality rating label -->
    <div v-if="showLabel" class="mt-3 text-center">
      <p :class="scoreColor" class="text-sm font-semibold transition-colors duration-500">
        {{ qualityRating }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ t('quality.scoreLabel') }}
      </p>
    </div>
  </div>
</template>
