<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Sitemap</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Pages</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="page in pages" :key="page.id">
          <NuxtLink :to="page.full_slug === 'home' ? '/' : `/${page.full_slug}`" class="text-blue-600 hover:underline">
            {{ page.name }}
          </NuxtLink>
        </li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-8 mb-4">Blog Posts</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="post in blogPosts" :key="post.id">
          <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-600 hover:underline">
            {{ post.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { getStories } = useStoryblok()

// Get all pages
const { data: pages } = await useAsyncData(
  'sitemap-pages',
  () => getStories({
    version: 'published',
    excluding_slugs: 'blog/*'
  })
)

// Get all blog posts
const { data: blogPosts } = await useAsyncData(
  'sitemap-blog-posts',
  () => getStories({
    version: 'published',
    starts_with: 'blog/',
    sort_by: 'published_at:desc'
  })
)
</script> 