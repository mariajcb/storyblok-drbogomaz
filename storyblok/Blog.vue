<template>
  <div class="blog">
    <h2 class="title">{{ blok.name }}</h2>
    <p class="subtitle">{{ blok.intro }}</p>
    <div class="blog__body" v-html="renderedBody" @click="trackContentInteraction"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMarkdown } from '~/composables/useMarkdown'

const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

// Get gtag from plugin
const { $gtag } = useNuxtApp()

const { renderMarkdown } = useMarkdown()

const renderedBody = computed(() => {
  return props.blok.body ? renderMarkdown(props.blok.body) : ''
})

// Track content interaction (link clicks, etc.)
const trackContentInteraction = (event) => {
  if ($gtag) {
    // Track link clicks
    if (event.target.tagName === 'A') {
      const linkText = event.target.textContent
      const linkHref = event.target.href
      
      $gtag('event', 'blog_link_click', {
        blog_title: props.blok.name,
        link_text: linkText,
        link_url: linkHref,
        content_type: 'therapy_blog',
        link_type: linkHref.startsWith('http') ? 'external' : 'internal'
      })
    }
  }
}

// Track blog content load
onMounted(() => {
  if ($gtag) {
    // Calculate estimated reading time
    const wordCount = props.blok.body ? props.blok.body.split(' ').length : 0
    const estimatedReadingTime = Math.ceil(wordCount / 200) // Average reading speed
    
    $gtag('event', 'blog_content_loaded', {
      blog_title: props.blok.name,
      word_count: wordCount,
      estimated_reading_time_minutes: estimatedReadingTime,
      content_type: 'therapy_blog',
      has_intro: !!props.blok.intro
    })
  }
})
</script>

<style lang="scss" scoped>
.blog {
  padding: 0 20px;
  max-width: 800px;
  margin: 40px auto 100px;

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
  }

  img {
    width: 100%;
    height: auto;
    margin: 2rem 0;
  }
}

.blog__body {
  line-height: 1.6;
  font-size: 1.1rem;

  :deep(p) {
    margin-bottom: 1.5rem;
  }

  :deep(h2) {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 2rem 0 1rem;
  }

  :deep(h3) {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1.5rem 0 1rem;
  }

  :deep(ul), :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
  }

  :deep(blockquote) {
    border-left: 4px solid #50b0ae;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
  }

  :deep(code) {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  :deep(pre) {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  :deep(a) {
    color: #50b0ae;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 