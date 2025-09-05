<template>
  <div v-editable="blok" class="page-layout">
    <StoryblokComponent 
      v-for="(blok, index) in blok.body" 
      :key="blok._uid" 
      :blok="blok"
      :class="getSectionClasses(blok, index)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  blok: Object 
})

// Determine section spacing based on component type
const getSectionClasses = (blok, index) => {
  const baseClasses = ['w-full']
  
  // Add section spacing based on component type
  if (blok.component === 'teaser') {
    // Hero sections get major spacing
    baseClasses.push('section-spacing-major')
  } else if (blok.component === 'grid') {
    // Grid sections get content spacing
    baseClasses.push('section-spacing-content')
  } else if (blok.component === 'blog') {
    // Blog sections get content spacing
    baseClasses.push('section-spacing-content')
  } else {
    // Default content spacing
    baseClasses.push('section-spacing-content')
  }
  
  // Add top margin for non-first sections
  if (index > 0) {
    baseClasses.push('mt-8') // 64px top margin
  }
  
  return baseClasses.join(' ')
}
</script>

<style scoped>
.page-layout {
  @apply w-full min-h-screen;
}

/* Section spacing utilities */
.section-spacing-hero {
  @apply py-36; /* 144px - Hero sections */
}

.section-spacing-major {
  @apply py-24; /* 96px - Major sections */
}

.section-spacing-content {
  @apply py-8; /* 32px - Content sections */
}

.section-spacing-component {
  @apply py-8; /* 32px - Component spacing */
}

.section-spacing-card {
  @apply py-6; /* 24px - Card spacing */
}

.section-spacing-tight {
  @apply py-4; /* 16px - Tight spacing */
}

/* Responsive section spacing */
@media (max-width: 768px) {
  .section-spacing-hero {
    @apply py-24; /* 96px on mobile */
  }
  
  .section-spacing-major {
    @apply py-16; /* 64px on mobile */
  }
  
  .section-spacing-content {
    @apply py-6; /* 24px on mobile */
  }
}
</style>