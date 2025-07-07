export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId

  if (!measurementId) {
    console.warn('GA4 Measurement ID not found. Analytics will not be loaded.')
    return
  }

  // Only run on client side
  if (process.server) return

  // Get cookie consent composable
  const { hasConsent, hasResponded, isLoaded } = useCookieConsent()

  // Initialize GA4 only after consent is given
  const initializeGA4 = () => {
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

    console.log('GA4 initialized with user consent')
  }

  // Check consent status and initialize accordingly
  const checkConsentAndInitialize = () => {
    if (!isLoaded.value) {
      // Wait for consent to be loaded
      return
    }

    if (hasResponded()) {
      if (hasConsent()) {
        // User has given consent, initialize GA4
        initializeGA4()
      } else {
        // User has rejected consent, provide no-op gtag function
        window.gtag = () => {
          // No-op function when consent is rejected
          console.log('Analytics disabled due to user consent rejection')
        }
        console.log('GA4 disabled due to user consent rejection')
      }
    } else {
      // User hasn't responded yet, provide no-op gtag function
      window.gtag = () => {
        // No-op function until consent is given
        console.log('Analytics disabled - waiting for user consent')
      }
      console.log('GA4 disabled - waiting for user consent')
    }
  }

  // Watch for consent changes
  const { consent } = useCookieConsent()
  watch(consent, (newConsent) => {
    if (newConsent) {
      if (newConsent.analytics) {
        // User has given consent, initialize GA4
        initializeGA4()
      } else {
        // User has rejected consent, disable GA4
        window.gtag = () => {
          console.log('Analytics disabled due to user consent rejection')
        }
        console.log('GA4 disabled due to user consent rejection')
      }
    }
  }, { immediate: true })

  // Initial check
  checkConsentAndInitialize()

  // Provide gtag function to components (will be no-op until consent is given)
  return {
    provide: {
      gtag: window.gtag || (() => {
        console.log('Analytics not yet initialized - waiting for consent')
      })
    }
  }
}) 