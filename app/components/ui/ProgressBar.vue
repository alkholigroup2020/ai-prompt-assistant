<script setup lang="ts">
import { computed } from 'vue';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  animated?: boolean;
  showPercentage?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<ProgressBarProps>(), {
  max: 100,
  color: 'primary',
  size: 'md',
  striped: false,
  animated: false,
  showPercentage: true,
  label: undefined,
});

const percentage = computed(() => {
  const percent = (props.value / props.max) * 100;
  return Math.min(Math.max(percent, 0), 100);
});

const barClasses = computed(() => {
  const classes = ['h-full rounded-full transition-all duration-500 ease-out'];

  // Color variants
  if (props.color === 'primary') {
    classes.push('bg-emerald-500');
  } else if (props.color === 'secondary') {
    classes.push('bg-navy-900');
  } else if (props.color === 'success') {
    classes.push('bg-green-500');
  } else if (props.color === 'warning') {
    classes.push('bg-yellow-500');
  } else if (props.color === 'error') {
    classes.push('bg-red-500');
  } else if (props.color === 'info') {
    classes.push('bg-blue-500');
  }

  // Striped pattern
  if (props.striped) {
    classes.push('bg-gradient-to-r from-transparent via-white/20 to-transparent');
    classes.push('bg-[length:1rem_1rem]');
    classes.push('[background-image:linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]');
  }

  // Animated stripes
  if (props.animated && props.striped) {
    classes.push('animate-[progress-stripes_1s_linear_infinite]');
  }

  return classes.join(' ');
});

const containerClasses = computed(() => {
  const classes = ['w-full bg-gray-200 rounded-full overflow-hidden'];

  // Size variants
  if (props.size === 'sm') {
    classes.push('h-1.5');
  } else if (props.size === 'md') {
    classes.push('h-3');
  } else if (props.size === 'lg') {
    classes.push('h-4');
  }

  return classes.join(' ');
});
</script>

<template>
  <div class="w-full">
    <!-- Label and percentage -->
    <div
      v-if="label || showPercentage"
      class="flex items-center justify-between mb-2"
    >
      <span v-if="label" class="text-sm font-medium text-gray-700">
        {{ label }}
      </span>
      <span v-if="showPercentage" class="text-sm font-medium text-gray-600">
        {{ Math.round(percentage) }}%
      </span>
    </div>

    <!-- Progress bar container -->
    <div
      :class="containerClasses"
      role="progressbar"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label"
    >
      <!-- Progress bar fill -->
      <div
        :class="barClasses"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes progress-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
