<template>
  <div class="blog-layout section-spacing-content">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="blog-header text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">Blog</h1>
        <p class="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
          Insights, thoughts, and updates from my practice
        </p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-container">
        <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {{ error }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="loading-container text-center py-16">
        <div class="text-xl text-neutral-600">Loading blog posts...</div>
      </div>

      <!-- Blog Posts Grid -->
      <div v-else class="blog-posts-grid">
        <div 
          v-for="blogPost in blogPosts" 
          :key="blogPost.content._uid" 
          class="blog-post-card"
        >
          <article class="blog-post-content">
            <header class="blog-post-header">
              <h2 class="blog-post-title">
                <NuxtLink 
                  class="blog-post-link" 
                  :to="`/blog/${blogPost.slug}`"
                  @click="trackBlogPostClick(blogPost)"
                >
                  {{ blogPost.content.name }}
                </NuxtLink>
              </h2>
              <time class="blog-post-date">
                {{ timestamp(blogPost.created_at) }}
              </time>
            </header>
            <div class="blog-post-excerpt">
              <p>{{ blogPost.content.intro }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blogPosts = ref([])
const error = ref(null)
const loading = ref(true)

// Get gtag from plugin
const { $gtag } = useNuxtApp()

// Format timestamp
const timestamp = (date) => {
  const timeStamp = date.slice(0, -5).replace(/T/g, ' ')
  return timeStamp
}

// Track blog post click
const trackBlogPostClick = (blogPost) => {
  if ($gtag) {
    $gtag('event', 'blog_click', {
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
  if ($gtag) {
    $gtag('event', 'blog_index_view', {
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
.blog-layout {
  @apply w-full min-h-screen bg-background-primary;
}

.blog-header {
  @apply mb-16;
}

.blog-posts-grid {
  @apply grid gap-8;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    @apply gap-6;
  }
}

.blog-post-card {
  @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300;
}

.blog-post-content {
  @apply p-8;
}

.blog-post-header {
  @apply mb-6;
}

.blog-post-title {
  @apply mb-4;
}

.blog-post-link {
  @apply text-2xl md:text-3xl font-semibold text-primary-500 hover:text-primary-700 transition-colors duration-300;
  line-height: 1.3;
}

.blog-post-date {
  @apply text-sm text-neutral-500 font-medium;
}

.blog-post-excerpt {
  @apply text-neutral-700;
  
  p {
    @apply text-lg leading-relaxed;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .blog-post-content {
    @apply p-6;
  }
  
  .blog-post-link {
    @apply text-xl;
  }
}
</style> 