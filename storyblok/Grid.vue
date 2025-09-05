<template>
  <div 
    v-editable="blok" 
    :class="gridClasses"
  >
    <StoryblokComponent 
      v-for="blok in blok.columns" 
      :key="blok._uid" 
      :blok="blok" 
      :class="columnClasses"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  blok: Object 
})

// Grid classes with luxury spacing and responsive behavior
const gridClasses = computed(() => {
  const columns = props.blok.columns?.length || 1
  
  const baseClasses = [
    'container',
    'mx-auto',
    'grid',
    'gap-6', // 24px gap
    'py-8', // 32px vertical padding for content sections
    'px-4'   // 16px horizontal padding
  ]
  
  // Add responsive grid columns based on number of columns
  let responsiveClasses = []
  
  if (columns === 1) {
    responsiveClasses = ['grid-cols-1']
  } else if (columns === 2) {
    responsiveClasses = ['grid-cols-1', 'md:grid-cols-2']
  } else if (columns === 3) {
    responsiveClasses = ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3']
  } else if (columns === 4) {
    responsiveClasses = ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4']
  } else {
    // For more than 4 columns, use a responsive grid
    responsiveClasses = ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', '2xl:grid-cols-6']
  }
  
  // Add alignment classes
  const alignmentClasses = [
    'items-start', // Default to start alignment
    'justify-items-stretch' // Stretch items to fill grid cells
  ]
  
  return [...baseClasses, ...responsiveClasses, ...alignmentClasses].join(' ')
})

// Column classes for individual grid items
const columnClasses = computed(() => {
  return [
    'w-full',
    'h-full',
    'flex',
    'flex-col'
  ].join(' ')
})
</script>