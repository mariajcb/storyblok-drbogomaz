<template>
  <BaseCard
    :variant="variant"
    :size="size"
    :padding="padding"
    :rounded="rounded"
    :shadow="shadow"
    :hover="hover"
    :clickable="clickable"
    :tag="tag"
    class="feature-card h-full flex flex-col"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <!-- Icon or Image -->
    <div v-if="icon || $slots.icon" class="feature-icon mb-4">
      <slot name="icon">
        <component v-if="icon" :is="icon" class="w-12 h-12 text-primary-500" />
      </slot>
    </div>

    <!-- Title -->
    <h3 v-if="title" class="feature-title mb-3">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="feature-description mb-6 flex-grow">
      {{ description }}
    </p>

    <!-- Content Slot -->
    <div v-if="$slots.default" class="feature-content mb-6 flex-grow">
      <slot />
    </div>

    <!-- Action Button -->
    <div v-if="actionText || $slots.action" class="feature-action mt-auto">
      <slot name="action">
        <BaseButton
          :variant="actionVariant"
          :size="actionSize"
          :disabled="actionDisabled"
          @click="handleAction"
        >
          {{ actionText }}
        </BaseButton>
      </slot>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'

defineOptions({
  name: 'FeatureCard'
})

const props = defineProps({
  // BaseCard props
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
    default: 'lg',
    validator: (value) => ['none', 'sm', 'default', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
  },
  shadow: {
    type: String,
    default: 'lg',
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
  tag: {
    type: String,
    default: 'div'
  },
  // FeatureCard specific props
  icon: {
    type: [String, Object],
    default: null
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  actionVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary', 'ghost', 'danger'].includes(value)
  },
  actionSize: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  actionDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'action'])

const handleAction = (event) => {
  emit('action', event)
}
</script>

<style lang="scss" scoped>
.feature-card {
  @apply text-center;
  
  .feature-icon {
    @apply flex justify-center items-center;
  }
  
  .feature-title {
    @apply text-xl font-semibold text-text-primary;
  }
  
  .feature-description {
    @apply text-text-secondary leading-relaxed;
  }
  
  .feature-content {
    @apply text-text-secondary;
  }
  
  .feature-action {
    @apply flex justify-center;
  }
}

// Size variations
.feature-card.card-sm {
  .feature-icon {
    @apply mb-3;
    
    :deep(svg) {
      @apply w-8 h-8;
    }
  }
  
  .feature-title {
    @apply text-lg mb-2;
  }
  
  .feature-description {
    @apply text-sm mb-4;
  }
}

.feature-card.card-lg {
  .feature-icon {
    @apply mb-6;
    
    :deep(svg) {
      @apply w-16 h-16;
    }
  }
  
  .feature-title {
    @apply text-2xl mb-4;
  }
  
  .feature-description {
    @apply text-lg mb-8;
  }
}

.feature-card.card-xl {
  .feature-icon {
    @apply mb-8;
    
    :deep(svg) {
      @apply w-20 h-20;
    }
  }
  
  .feature-title {
    @apply text-3xl mb-6;
  }
  
  .feature-description {
    @apply text-xl mb-10;
  }
}
</style>
