export default defineNuxtConfig({
  css: ['@/assets/css/roboto.css'],
  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.STORYBLOK_API_TOKEN,
        apiOptions: {
          region: "us"
        }
      },
    ],
    '@nuxtjs/tailwindcss',
  ],
})