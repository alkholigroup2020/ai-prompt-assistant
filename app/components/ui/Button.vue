<script setup lang="ts">
import { computed } from 'vue';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconPosition: 'left',
  type: 'button',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  // Variant styles
  if (props.variant === 'primary') {
    classes.push(
      'bg-emerald-500 text-white hover:bg-emerald-600',
      'focus:ring-emerald-500',
      'active:bg-emerald-700'
    );
  } else if (props.variant === 'secondary') {
    classes.push(
      'bg-navy-900 text-white hover:bg-navy-800',
      'focus:ring-navy-700',
      'active:bg-navy-950'
    );
  } else if (props.variant === 'outline') {
    classes.push(
      'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50',
      'focus:ring-emerald-500',
      'active:bg-emerald-100'
    );
  } else if (props.variant === 'ghost') {
    classes.push(
      'text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-300',
      'active:bg-gray-200'
    );
  }

  // Size styles
  if (props.size === 'sm') {
    classes.push('px-3 py-1.5 text-sm rounded-md gap-1.5');
  } else if (props.size === 'md') {
    classes.push('px-4 py-2 text-base rounded-lg gap-2');
  } else if (props.size === 'lg') {
    classes.push('px-6 py-3 text-lg rounded-xl gap-2.5');
  }

  // Full width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  return classes.join(' ');
});

const iconSize = computed(() => {
  if (props.size === 'sm') return 'w-4 h-4';
  if (props.size === 'md') return 'w-5 h-5';
  return 'w-6 h-6';
});
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      :class="[iconSize, 'animate-spin']"
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

    <!-- Icon left -->
    <span
      v-if="$slots.icon && iconPosition === 'left' && !loading"
      :class="iconSize"
    >
      <slot name="icon" />
    </span>

    <!-- Default slot for text -->
    <slot />

    <!-- Icon right -->
    <span
      v-if="$slots.icon && iconPosition === 'right' && !loading"
      :class="iconSize"
    >
      <slot name="icon" />
    </span>
  </button>
</template>
