<template>
  <section class="section">
    <div v-if="error" class="container mx-auto px-4 py-8">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
    </div>
    <div v-else-if="loading" class="container mx-auto px-4 py-8">
      <div class="text-center">Loading blog post...</div>
    </div>
    <Blog v-else-if="story" :blok="story.content" />
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const story = ref(null)
const error = ref(null)
const loading = ref(true)

// Load the JSON from the API
const { slug } = useRoute().params
const version = 'published' // Always use published version

try {
  const config = useRuntimeConfig()
  const response = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/blog/${slug}?version=${version}&token=${config.public.storyblokApiToken}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.story) {
    story.value = data.story
  } else {
    error.value = 'Blog post not found'
  }
} catch (e) {
  error.value = `Failed to load blog post: ${e.message}`
} finally {
  loading.value = false
}

// Track blog post view when story loads
watch(story, (newStory) => {
  if (newStory && newStory.content) {
    // Track blog post view
    if (process.client && window.$ga) {
      window.$ga.event('blog', 'view', {
        blog_title: newStory.content.name,
        blog_slug: slug,
        blog_intro: newStory.content.intro,
        blog_created_at: newStory.created_at,
        blog_updated_at: newStory.updated_at,
        content_type: 'therapy_blog'
      })
    }
  }
}, { immediate: true })

// Track reading engagement
onMounted(() => {
  if (process.client && story.value) {
    // Track scroll depth
    let maxScrollDepth = 0
    let scrollTrackingSent = false
    
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent
        
        // Track at 25%, 50%, 75%, and 100%
        if ([25, 50, 75, 100].includes(scrollPercent) && !scrollTrackingSent) {
          window.$ga?.event('blog', 'scroll_depth', {
            blog_title: story.value.content.name,
            blog_slug: slug,
            scroll_percent: scrollPercent,
            content_type: 'therapy_blog'
          })
          scrollTrackingSent = true
        }
      }
    }
    
    window.addEventListener('scroll', trackScrollDepth)
    
    // Track time spent reading
    let startTime = Date.now()
    let timeTrackingSent = false
    
    const trackReadingTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000) // seconds
      
      // Track at 30 seconds, 1 minute, 2 minutes, and 5 minutes
      if ([30, 60, 120, 300].includes(timeSpent) && !timeTrackingSent) {
        window.$ga?.event('blog', 'reading_time', {
          blog_title: story.value.content.name,
          blog_slug: slug,
          time_spent_seconds: timeSpent,
          content_type: 'therapy_blog'
        })
        timeTrackingSent = true
      }
    }
    
    const timeInterval = setInterval(trackReadingTime, 1000)
    
    // Cleanup on page unload
    onUnmounted(() => {
      window.removeEventListener('scroll', trackScrollDepth)
      clearInterval(timeInterval)
    })
  }
})

// Set up Storyblok bridge for live updates
onMounted(() => {
  const { storybridge } = useStoryblok()
  
  storybridge.on(['input', 'published', 'change'], (event) => {
    if (event.action === 'input') {
      if (event.story.id === story.value?.id) {
        story.value = event.story
      }
    } else {
      // Reload the page
      window.location.reload()
    }
  })
})
</script>

<style lang="scss" scoped>
.blog {
  padding: 0 20px;
  max-width: 800px;
  margin: 40px auto 100px;

  img {
    width: 100%;
    height: auto;
  }
}

.blog__body {
  line-height: 1.6;
}
</style> 