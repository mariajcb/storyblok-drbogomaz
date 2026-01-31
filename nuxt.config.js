// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/roboto.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@storyblok/nuxt'
  ],
  storyblok: {
    accessToken: process.env.STORYBLOK_API_TOKEN,
  // Vitest configuration for testing
  vite: {
    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
},
})