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
    '@nuxtjs/google-gtag',
  ],

  runtimeConfig: {
    public: {
      storyblokApiToken: process.env.STORYBLOK_API_TOKEN,
      gaMeasurementId: process.env.GA_MEASUREMENT_ID
    }
  },

  googleGtag: {
    id: process.env.GA_MEASUREMENT_ID,
    config: {
      page_title: 'Dr. Misha Bogomaz',
      page_location: 'https://drbogomaz.com',
      send_page_view: true,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    },
    debug: process.env.NODE_ENV === 'development',
    loadScript: true,
    enableRouterView: true,
    devtools: process.env.NODE_ENV === 'development'
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