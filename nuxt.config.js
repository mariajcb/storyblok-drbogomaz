export default defineNuxtConfig({
  css: ['@/assets/css/roboto.css'],

  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.STORYBLOK_API_TOKEN,
      },
    ],
    '@nuxtjs/tailwindcss',
  ],

  compatibilityDate: '2025-04-17',
})