<script setup lang="ts">
import { ref, computed } from 'vue';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // in milliseconds
  maxWidth?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'top',
  delay: 200,
  maxWidth: '200px',
  disabled: false,
});

const isVisible = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const showTooltip = () => {
  if (props.disabled) return;
  
  timeoutId = setTimeout(() => {
    isVisible.value = true;
  }, props.delay);
};

const hideTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  isVisible.value = false;
};

const tooltipClasses = computed(() => {
  const classes = [
    'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
    'transition-opacity duration-200 pointer-events-none',
  ];

  if (isVisible.value) {
    classes.push('opacity-100');
  } else {
    classes.push('opacity-0');
  }

  // Position classes
  if (props.position === 'top') {
    classes.push('bottom-full left-1/2 -translate-x-1/2 mb-2');
  } else if (props.position === 'bottom') {
    classes.push('top-full left-1/2 -translate-x-1/2 mt-2');
  } else if (props.position === 'left') {
    classes.push('right-full top-1/2 -translate-y-1/2 mr-2');
  } else if (props.position === 'right') {
    classes.push('left-full top-1/2 -translate-y-1/2 ml-2');
  }

  return classes.join(' ');
});

const arrowClasses = computed(() => {
  const classes = [
    'absolute w-2 h-2 bg-gray-900 transform rotate-45',
  ];

  if (props.position === 'top') {
    classes.push('bottom-[-4px] left-1/2 -translate-x-1/2');
  } else if (props.position === 'bottom') {
    classes.push('top-[-4px] left-1/2 -translate-x-1/2');
  } else if (props.position === 'left') {
    classes.push('right-[-4px] top-1/2 -translate-y-1/2');
  } else if (props.position === 'right') {
    classes.push('left-[-4px] top-1/2 -translate-y-1/2');
  }

  return classes.join(' ');
});
</script>

<template>
  <div
    class="relative inline-block"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
    @touchstart.passive="showTooltip"
    @touchend.passive="hideTooltip"
  >
    <!-- Trigger element -->
    <slot />

    <!-- Tooltip -->
    <div
      v-if="!disabled"
      :class="tooltipClasses"
      :style="{ maxWidth }"
      role="tooltip"
      aria-hidden="true"
    >
      {{ text }}
      
      <!-- Arrow indicator -->
      <div :class="arrowClasses" />
    </div>
  </div>
</template>
