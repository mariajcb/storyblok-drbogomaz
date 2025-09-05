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
    class="blog-card h-full flex flex-col overflow-hidden"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <!-- Featured Image -->
    <div v-if="image || $slots.image" class="blog-image">
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt || title"
          class="w-full h-48 object-cover"
        />
      </slot>
    </div>

    <!-- Content -->
    <div class="blog-content flex-grow flex flex-col p-6">
      <!-- Category/Tag -->
      <div v-if="category || $slots.category" class="blog-category mb-3">
        <slot name="category">
          <span class="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full">
            {{ category }}
          </span>
        </slot>
      </div>

      <!-- Title -->
      <h3 v-if="title" class="blog-title mb-3">
        {{ title }}
      </h3>

      <!-- Excerpt -->
      <p v-if="excerpt" class="blog-excerpt mb-4 flex-grow">
        {{ excerpt }}
      </p>

      <!-- Content Slot -->
      <div v-if="$slots.default" class="blog-body mb-4 flex-grow">
        <slot />
      </div>

      <!-- Meta Information -->
      <div v-if="author || date || $slots.meta" class="blog-meta mb-4">
        <slot name="meta">
          <div class="flex items-center justify-between text-sm text-text-tertiary">
            <span v-if="author" class="blog-author">
              By {{ author }}
            </span>
            <span v-if="date" class="blog-date">
              {{ formatDate(date) }}
            </span>
          </div>
        </slot>
      </div>

      <!-- Action -->
      <div v-if="actionText || $slots.action" class="blog-action mt-auto">
        <slot name="action">
          <BaseButton
            :variant="actionVariant"
            :size="actionSize"
            :disabled="actionDisabled"
            class="w-full"
            @click="handleAction"
          >
            {{ actionText }}
          </BaseButton>
        </slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'

defineOptions({
  name: 'BlogCard'
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
    default: 'none',
    validator: (value) => ['none', 'sm', 'default', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
  },
  shadow: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  hover: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  tag: {
    type: String,
    default: 'article'
  },
  // BlogCard specific props
  image: {
    type: String,
    default: null
  },
  imageAlt: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  excerpt: {
    type: String,
    default: null
  },
  author: {
    type: String,
    default: null
  },
  date: {
    type: [String, Date],
    default: null
  },
  actionText: {
    type: String,
    default: 'Read More'
  },
  actionVariant: {
    type: String,
    default: 'tertiary',
    validator: (value) => ['primary', 'secondary', 'tertiary', 'ghost', 'danger'].includes(value)
  },
  actionSize: {
    type: String,
    default: 'sm',
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

const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
.blog-card {
  @apply transition-all duration-300;
  
  &:hover {
    @apply transform scale-[1.02] -translate-y-1;
  }
  
  .blog-image {
    @apply overflow-hidden;
    
    img {
      @apply transition-transform duration-300;
    }
  }
  
  &:hover .blog-image img {
    @apply scale-105;
  }
  
  .blog-title {
    @apply text-lg font-semibold text-text-primary leading-tight;
    
    &:hover {
      @apply text-primary-600;
    }
  }
  
  .blog-excerpt {
    @apply text-text-secondary leading-relaxed;
  }
  
  .blog-meta {
    @apply border-t border-neutral-200 pt-3;
  }
}

// Size variations
.blog-card.card-sm {
  .blog-image img {
    @apply h-32;
  }
  
  .blog-content {
    @apply p-4;
  }
  
  .blog-title {
    @apply text-base mb-2;
  }
  
  .blog-excerpt {
    @apply text-sm mb-3;
  }
}

.blog-card.card-lg {
  .blog-image img {
    @apply h-64;
  }
  
  .blog-content {
    @apply p-8;
  }
  
  .blog-title {
    @apply text-xl mb-4;
  }
  
  .blog-excerpt {
    @apply text-base mb-6;
  }
}

.blog-card.card-xl {
  .blog-image img {
    @apply h-80;
  }
  
  .blog-content {
    @apply p-10;
  }
  
  .blog-title {
    @apply text-2xl mb-6;
  }
  
  .blog-excerpt {
    @apply text-lg mb-8;
  }
}
</style>
