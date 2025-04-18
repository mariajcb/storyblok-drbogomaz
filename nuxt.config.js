import { resolve } from 'path'

export default defineNuxtConfig({
  css: ['@/assets/css/roboto.css'],

  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.STORYBLOK_API_TOKEN,
        apiOptions: {
          region: 'eu'
        }
      },
    ],
    '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      storyblokApiToken: process.env.STORYBLOK_API_TOKEN
    }
  },

  compatibilityDate: '2025-04-17',

  storyblok: {
    accessToken: process.env.STORYBLOK_API_TOKEN,
    apiOptions: {
      region: 'us'
    },
    components: {
      teaser: resolve(__dirname, './storyblok/Teaser.vue'),
      bio: resolve(__dirname, './storyblok/Bio.vue'),
      blog: resolve(__dirname, './storyblok/Blog.vue')
    }
  },
})