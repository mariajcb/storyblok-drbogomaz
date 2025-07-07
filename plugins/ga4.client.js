export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId

  if (!measurementId) {
    console.warn('GA4 Measurement ID not found. Analytics will not be loaded.')
    return
  }

  // Only run on client side
  if (process.server) return

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }

  // Configure GA4 with privacy settings
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    page_title: 'Dr. Misha Bogomaz',
    page_location: window.location.href,
    send_page_view: true,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    debug_mode: process.env.NODE_ENV === 'development'
  })

  // Track page views on route changes
  const router = useRouter()
  router.afterEach((to) => {
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: to.path
      })
    }
  })

  // Provide gtag function to components
  return {
    provide: {
      gtag: window.gtag
    }
  }
}) 