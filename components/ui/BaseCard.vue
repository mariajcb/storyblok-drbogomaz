<template>
  <component
    :is="tag"
    :class="cardClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Card Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Card Image -->
    <div v-if="$slots.image" class="card-image">
      <slot name="image" />
    </div>

    <!-- Card Content -->
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'BaseCard'
})

const props = defineProps({
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['elevated', 'outlined', 'filled', 'flat'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
  },
  shadow: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  hover: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  tag: {
    type: String,
    default: 'div'
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const cardClasses = computed(() => {
  const baseClasses = [
    'relative',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'ease-in-out'
  ]

  // Rounded corners
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  // Shadow classes
  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow-md',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  }

  // Variant classes
  const variantClasses = {
    elevated: [
      'bg-background-primary',
      'border',
      'border-neutral-200',
      'shadow-md',
      'hover:shadow-lg'
    ],
    outlined: [
      'bg-transparent',
      'border-2',
      'border-neutral-300',
      'hover:border-primary-300',
      'hover:bg-primary-50/30'
    ],
    filled: [
      'bg-neutral-50',
      'border',
      'border-neutral-200',
      'hover:bg-neutral-100'
    ],
    flat: [
      'bg-background-primary',
      'border',
      'border-transparent',
      'hover:border-neutral-200'
    ]
  }

  // Hover effects
  const hoverClasses = props.hover ? [
    'hover:scale-[1.02]',
    'hover:-translate-y-1'
  ] : []

  // Clickable cursor
  const clickableClasses = props.clickable ? [
    'cursor-pointer',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2'
  ] : []

  return [
    ...baseClasses,
    roundedClasses[props.rounded],
    paddingClasses[props.padding],
    shadowClasses[props.shadow],
    ...variantClasses[props.variant],
    ...hoverClasses,
    ...clickableClasses
  ]
})
</script>

<style lang="scss" scoped>
.card-header {
  @apply mb-4;
  
  &:last-child {
    @apply mb-0;
  }
}

.card-title {
  @apply text-xl font-semibold text-text-primary mb-2;
  
  &:last-child {
    @apply mb-0;
  }
}

.card-subtitle {
  @apply text-sm text-text-secondary;
}

.card-image {
  @apply -mx-6 -mt-6 mb-6;
  
  &:first-child {
    @apply -mt-6;
  }
  
  &:last-child {
    @apply -mb-6;
  }
  
  img {
    @apply w-full h-auto object-cover;
  }
}

.card-content {
  @apply flex-1;
  
  &:last-child {
    @apply mb-0;
  }
}

.card-footer {
  @apply mt-6 pt-4 border-t border-neutral-200;
  
  &:first-child {
    @apply mt-0 pt-0 border-t-0;
  }
}

// Size-specific adjustments
.card-sm {
  .card-title {
    @apply text-lg;
  }
  
  .card-subtitle {
    @apply text-xs;
  }
}

.card-lg {
  .card-title {
    @apply text-2xl;
  }
  
  .card-subtitle {
    @apply text-base;
  }
}

.card-xl {
  .card-title {
    @apply text-3xl;
  }
  
  .card-subtitle {
    @apply text-lg;
  }
}

// Luxury-specific enhancements
.luxury-card {
  @apply backdrop-blur-sm;
  
  &::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 pointer-events-none;
  }
}

// Premium shadow effects
.premium-shadow {
  box-shadow: 
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(255 255 255 / 0.05);
}

.premium-shadow-lg {
  box-shadow: 
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(255 255 255 / 0.05);
}
</style>
