require('dotenv').config()
import axios from 'axios'

export default {
  target: 'static',
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'DrBogomaz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Professional Blog of Dr. Misha Bogomaz, licensed psychologist in Jacksonville, FL, specializing in interpersonal and psychodynamic therapy' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Zilla+Slab:400,500,700&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Mrs+Saint+Delafield&display=swap' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [{ src: '~/assets/main.scss', lang: 'scss' }],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/components',
    '~/plugins/filters/marked',
    '~/plugins/filters/cdn',
    '~/plugins/vee-validate'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
  ** Form Validation
  */
  build: {
  // Add exception
    transpile: [
      "vee-validate/dist/rules"
    ]
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    ['storyblok-nuxt', {accessToken: process.env.PREVIEW_TOKEN, cacheProvider: 'memory'}]
  ],
  router: {
    middleware: 'languageDetection'
  },
  /*
  ** Generate with Links API
  */
  generate: {
    routes: function (callback) {
      const token = process.env.PREVIEW_TOKEN
      const version = 'published'
      let cache_version = 0

      let toIgnore = ['home', 'en/settings', 'en']

       // other routes that are not in Storyblok with their slug.
      let routes = ['/', '/contact'] // adds / directly

       // Load space and receive latest cache version key to improve performance
      axios.get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${token}`).then((space_res) => {

         // timestamp of latest publish
        cache_version = space_res.data.space.version

         // Call for all Links using the Links API: https://www.storyblok.com/docs/Delivery-Api/Links
        axios.get(`https://api.storyblok.com/v1/cdn/links?token=${token}&version=${version}&cv=${cache_version}&per_page=100`).then((res) => {
          Object.keys(res.data.links).forEach((key) => {
            if (!toIgnore.includes(res.data.links[key].slug)) {
              routes.push('/' + res.data.links[key].slug)
            }
          })

          callback(null, routes)
        })
      })
    }
  }
}
