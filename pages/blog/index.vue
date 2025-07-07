<template>
  <div class="section">
    <div v-if="error" class="container mx-auto px-4 py-8">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
    </div>
    <div v-else-if="loading" class="container mx-auto px-4 py-8">
      <div class="text-center">Loading blog posts...</div>
    </div>
    <div v-else>
      <div :key="blogPost.content._uid" v-for="blogPost in blogPosts" class="container blog__overview">
        <h2>
          <NuxtLink 
            class="blog__detail-link" 
            :to="`/blog/${blogPost.slug}`"
            @click="trackBlogPostClick(blogPost)"
          >
            {{ blogPost.content.name }}
          </NuxtLink>
        </h2>
        <small>
          {{ timestamp(blogPost.created_at) }}
        </small>
        <p>
          {{ blogPost.content.intro }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blogPosts = ref([])
const error = ref(null)
const loading = ref(true)

// Format timestamp
const timestamp = (date) => {
  const timeStamp = date.slice(0, -5).replace(/T/g, ' ')
  return timeStamp
}

// Track blog post click
const trackBlogPostClick = (blogPost) => {
  if (process.client && window.gtag) {
    window.gtag('event', 'blog_click', {
      blog_title: blogPost.content.name,
      blog_slug: blogPost.slug,
      blog_intro: blogPost.content.intro,
      blog_created_at: blogPost.created_at,
      content_type: 'therapy_blog',
      page_location: 'blog_index'
    })
  }
}

// Track blog index page view
onMounted(() => {
  if (process.client && window.gtag) {
    window.gtag('event', 'blog_index_view', {
      total_posts: blogPosts.value.length,
      content_type: 'therapy_blog_listing',
      page_location: 'blog_index'
    })
  }
})

// Load blog posts
const config = useRuntimeConfig()
const version = 'published' // Always use published version

try {
  // Use the Storyblok API directly
  const response = await fetch(
    `https://api.storyblok.com/v2/cdn/stories?version=${version}&starts_with=blog/&sort_by=published_at:desc&token=${config.public.storyblokApiToken}`,
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
  
  if (data.stories && data.stories.length > 0) {
    blogPosts.value = data.stories
  } else {
    error.value = 'No blog posts found'
  }
} catch (e) {
  error.value = 'Failed to load blog posts. Please try again later.'
} finally {
  loading.value = false
}
</script>

<style lang="scss" scoped>
.blog__overview {
  padding: 0 20px;
  max-width: 600px;
  margin: 40px auto;

  p {
    line-height: 1.6;
  }
}

.blog__detail-link {
  color: #718FCB;
  font-size: 24px;
  font-weight: 500;
  &:hover {
    color: #363636!important;
  }
}
</style> 