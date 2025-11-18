<script setup lang="ts">
import { computed } from 'vue';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'current';
  centered?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  color: 'primary',
  centered: false,
  label: undefined,
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  return sizes[props.size];
});

const colorClasses = computed(() => {
  if (props.color === 'primary') {
    return 'text-emerald-500';
  } else if (props.color === 'secondary') {
    return 'text-navy-900';
  } else if (props.color === 'white') {
    return 'text-white';
  } else if (props.color === 'gray') {
    return 'text-gray-500';
  } else if (props.color === 'current') {
    return 'text-current';
  }
  return 'text-emerald-500';
});

const containerClasses = computed(() => {
  const classes = ['inline-flex flex-col items-center justify-center gap-3'];
  
  if (props.centered) {
    classes.push('w-full min-h-[200px]');
  }
  
  return classes.join(' ');
});
</script>

<template>
  <div :class="containerClasses" role="status">
    <!-- Spinner SVG -->
    <svg
      :class="[sizeClasses, colorClasses, 'animate-spin']"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Optional label -->
    <span
      v-if="label"
      :class="[
        'text-sm font-medium',
        color === 'white' ? 'text-white' : 'text-gray-700'
      ]"
    >
      {{ label }}
    </span>

    <!-- Screen reader text -->
    <span class="sr-only">Loading...</span>
  </div>
</template>
