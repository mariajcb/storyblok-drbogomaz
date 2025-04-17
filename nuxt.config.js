export default defineNuxtConfig({
  css: ['@/assets/css/roboto.css'],
  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: 'TxjwDdrurDCNvQwkIyREVwtt',
        apiOptions: {
          region: "us"
        }
      },
    ],
    '@nuxtjs/tailwindcss',
  ],
})