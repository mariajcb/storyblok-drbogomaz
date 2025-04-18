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
import { ref } from 'vue'

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