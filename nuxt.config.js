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
    '@nuxtjs/google-analytics',
  ],

  runtimeConfig: {
    public: {
      storyblokApiToken: process.env.STORYBLOK_API_TOKEN,
      gaMeasurementId: process.env.GA_MEASUREMENT_ID
    }
  },

  googleAnalytics: {
    id: process.env.GA_MEASUREMENT_ID,
    debug: {
      enabled: process.env.NODE_ENV === 'development',
      sendHitTask: process.env.NODE_ENV === 'production'
    },
    autoTracking: {
      screenview: true,
      pageviewOnLoad: true,
      exception: true,
      pageviewOnRouteChange: true
    },
    ecommerce: {
      enabled: true,
      enhanced: true
    },
    customVars: [
      { name: 'user_type', value: 'therapy_client' },
      { name: 'content_category', value: 'healthcare' }
    ],
    anonymizeIp: true,
    respectDoNotTrack: true,
    consent: {
      analytics_storage: 'denied',
      ad_storage: 'denied'
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