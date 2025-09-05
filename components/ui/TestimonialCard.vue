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
    class="testimonial-card relative"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <!-- Quote Icon -->
    <div v-if="showQuoteIcon" class="quote-icon absolute top-4 left-4 text-primary-200">
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
      </svg>
    </div>

    <!-- Content -->
    <div class="testimonial-content">
      <!-- Quote Text -->
      <blockquote v-if="quote || $slots.default" class="testimonial-quote mb-6">
        <slot>
          <p class="text-lg leading-relaxed text-text-primary italic">
            "{{ quote }}"
          </p>
        </slot>
      </blockquote>

      <!-- Author Information -->
      <div v-if="author || $slots.author" class="testimonial-author">
        <slot name="author">
          <div class="flex items-center">
            <!-- Avatar -->
            <div v-if="avatar" class="avatar mr-4">
              <img
                :src="avatar"
                :alt="author"
                class="w-12 h-12 rounded-full object-cover"
              />
            </div>
            
            <!-- Author Details -->
            <div class="author-details">
              <div v-if="author" class="author-name font-semibold text-text-primary">
                {{ author }}
              </div>
              <div v-if="title" class="author-title text-sm text-text-secondary">
                {{ title }}
              </div>
              <div v-if="company" class="author-company text-sm text-text-tertiary">
                {{ company }}
              </div>
            </div>
          </div>
        </slot>
      </div>

      <!-- Rating -->
      <div v-if="rating || $slots.rating" class="testimonial-rating mt-4">
        <slot name="rating">
          <div class="flex items-center">
            <div class="flex space-x-1">
              <svg
                v-for="star in 5"
                :key="star"
                class="w-4 h-4"
                :class="star <= rating ? 'text-accent-gold-500' : 'text-neutral-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span v-if="showRatingNumber" class="ml-2 text-sm text-text-secondary">
              {{ rating }}/5
            </span>
          </div>
        </slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'

defineOptions({
  name: 'TestimonialCard'
})

const props = defineProps({
  // BaseCard props
  variant: {
    type: String,
    default: 'filled',
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
    default: 'md',
    validator: (value) => ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  tag: {
    type: String,
    default: 'blockquote'
  },
  // TestimonialCard specific props
  quote: {
    type: String,
    default: null
  },
  author: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  company: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 1 && value <= 5)
  },
  showRatingNumber: {
    type: Boolean,
    default: true
  },
  showQuoteIcon: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.testimonial-card {
  @apply relative;
  
  .quote-icon {
    @apply opacity-30;
  }
  
  .testimonial-quote {
    @apply relative;
    
    p {
      @apply text-lg leading-relaxed;
    }
  }
  
  .testimonial-author {
    @apply border-t border-neutral-200 pt-4;
  }
  
  .author-details {
    @apply flex flex-col;
  }
  
  .author-name {
    @apply text-base;
  }
  
  .author-title {
    @apply font-medium;
  }
  
  .author-company {
    @apply font-normal;
  }
  
  .testimonial-rating {
    @apply border-t border-neutral-200 pt-4;
  }
}

// Size variations
.testimonial-card.card-sm {
  .testimonial-quote p {
    @apply text-base;
  }
  
  .quote-icon svg {
    @apply w-6 h-6;
  }
  
  .avatar img {
    @apply w-10 h-10;
  }
  
  .author-name {
    @apply text-sm;
  }
}

.testimonial-card.card-lg {
  .testimonial-quote p {
    @apply text-xl;
  }
  
  .quote-icon svg {
    @apply w-10 h-10;
  }
  
  .avatar img {
    @apply w-16 h-16;
  }
  
  .author-name {
    @apply text-lg;
  }
}

.testimonial-card.card-xl {
  .testimonial-quote p {
    @apply text-2xl;
  }
  
  .quote-icon svg {
    @apply w-12 h-12;
  }
  
  .avatar img {
    @apply w-20 h-20;
  }
  
  .author-name {
    @apply text-xl;
  }
}

// Luxury styling for premium feel
.testimonial-card.luxury {
  @apply bg-gradient-to-br from-white to-neutral-50;
  
  &::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-br from-primary-50/20 to-transparent pointer-events-none;
  }
}
</style>
