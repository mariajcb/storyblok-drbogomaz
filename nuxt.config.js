// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
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
      teaser: './storyblok/Teaser.vue',
      bio: './storyblok/Bio.vue',
      blog: './storyblok/Blog.vue'
    }
  },
}