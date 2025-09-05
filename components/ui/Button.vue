<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span v-if="icon && !loading" class="mr-2">
      <component :is="icon" class="h-4 w-4" />
    </span>
    <slot />
    <span v-if="iconRight && !loading" class="ml-2">
      <component :is="iconRight" class="h-4 w-4" />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object],
    default: null
  },
  iconRight: {
    type: [String, Object],
    default: null
  },
  tag: {
    type: String,
    default: 'button'
  },
  type: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['text-sm', 'px-3', 'py-1.5', 'min-h-[32px]'],
    md: ['text-base', 'px-4', 'py-2', 'min-h-[40px]'],
    lg: ['text-lg', 'px-6', 'py-3', 'min-h-[48px]'],
    xl: ['text-xl', 'px-8', 'py-4', 'min-h-[56px]']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-primary-500',
      'text-white',
      'border',
      'border-primary-500',
      'hover:bg-primary-600',
      'hover:border-primary-600',
      'active:bg-primary-700',
      'focus:ring-primary-500',
      'shadow-sm',
      'hover:shadow-md'
    ],
    secondary: [
      'bg-secondary-500',
      'text-white',
      'border',
      'border-secondary-500',
      'hover:bg-secondary-600',
      'hover:border-secondary-600',
      'active:bg-secondary-700',
      'focus:ring-secondary-500',
      'shadow-sm',
      'hover:shadow-md'
    ],
    tertiary: [
      'bg-white',
      'text-primary-500',
      'border',
      'border-primary-500',
      'hover:bg-primary-50',
      'hover:text-primary-600',
      'active:bg-primary-100',
      'focus:ring-primary-500',
      'shadow-sm',
      'hover:shadow-md'
    ],
    ghost: [
      'bg-transparent',
      'text-primary-500',
      'border',
      'border-transparent',
      'hover:bg-primary-50',
      'hover:text-primary-600',
      'active:bg-primary-100',
      'focus:ring-primary-500'
    ],
    danger: [
      'bg-error-500',
      'text-white',
      'border',
      'border-error-500',
      'hover:bg-error-600',
      'hover:border-error-600',
      'active:bg-error-700',
      'focus:ring-error-500',
      'shadow-sm',
      'hover:shadow-md'
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]
})
</script>
