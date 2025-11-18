<script setup lang="ts">
import { computed } from 'vue';

interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
  shadow: 'md',
  hover: false,
  border: true,
  rounded: 'lg',
});

const cardClasses = computed(() => {
  const classes = ['bg-white transition-all duration-200'];

  // Padding variants
  if (props.padding === 'sm') {
    classes.push('p-3');
  } else if (props.padding === 'md') {
    classes.push('p-4');
  } else if (props.padding === 'lg') {
    classes.push('p-6');
  }

  // Shadow variants
  if (props.shadow === 'sm') {
    classes.push('shadow-sm');
  } else if (props.shadow === 'md') {
    classes.push('shadow-md');
  } else if (props.shadow === 'lg') {
    classes.push('shadow-lg');
  } else if (props.shadow === 'xl') {
    classes.push('shadow-xl');
  }

  // Hover effect
  if (props.hover) {
    classes.push('hover:shadow-xl hover:-translate-y-0.5 cursor-pointer');
  }

  // Border
  if (props.border) {
    classes.push('border border-gray-200');
  }

  // Rounded corners
  if (props.rounded === 'sm') {
    classes.push('rounded-sm');
  } else if (props.rounded === 'md') {
    classes.push('rounded-md');
  } else if (props.rounded === 'lg') {
    classes.push('rounded-lg');
  } else if (props.rounded === 'xl') {
    classes.push('rounded-xl');
  }

  return classes.join(' ');
});

const headerClasses = computed(() => {
  const classes = [];
  
  if (props.padding === 'sm') {
    classes.push('-m-3 mb-3 p-3');
  } else if (props.padding === 'md') {
    classes.push('-m-4 mb-4 p-4');
  } else if (props.padding === 'lg') {
    classes.push('-m-6 mb-6 p-6');
  }
  
  classes.push('border-b border-gray-200');
  
  return classes.join(' ');
});

const footerClasses = computed(() => {
  const classes = [];
  
  if (props.padding === 'sm') {
    classes.push('-m-3 mt-3 p-3');
  } else if (props.padding === 'md') {
    classes.push('-m-4 mt-4 p-4');
  } else if (props.padding === 'lg') {
    classes.push('-m-6 mt-6 p-6');
  }
  
  classes.push('border-t border-gray-200');
  
  return classes.join(' ');
});
</script>

<template>
  <div :class="cardClasses">
    <!-- Header slot -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Body/default slot -->
    <div>
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>
