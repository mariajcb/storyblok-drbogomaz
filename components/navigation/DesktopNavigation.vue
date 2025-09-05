<template>
  <nav class="hidden lg:block">
    <ul class="flex space-x-8 text-lg font-bold">
      <li>
        <NuxtLink to="/" class="text-white hover:text-secondary-500">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/blog" class="text-white hover:text-secondary-500">Blog</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/contact" class="text-white hover:text-secondary-500">Contact</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'DesktopNavigation'
}
</script>

<style scoped>
.nuxt-link-exact-active {
  color: #50b0ae !important;
}
</style> 