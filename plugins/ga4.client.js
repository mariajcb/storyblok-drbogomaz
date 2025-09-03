import { watch } from 'vue'

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
  const { hasConsent, hasResponded, isLoaded, error: consentError } = useCookieConsent()

  // Performance tracking
  let isInitialized = false
  let initializationAttempts = 0
  const MAX_INIT_ATTEMPTS = 3

  // Error handling utility
  const handleAnalyticsError = (operation, err) => {
    const errorMessage = `GA4 ${operation} failed: ${err.message}`
    console.error(errorMessage, err)
    
    // Track error for healthcare compliance
    if (window.gtag) {
      window.gtag('event', 'analytics_error', {
        error_operation: operation,
        error_message: err.message,
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
  }

  // Enhanced privacy configuration
  const getPrivacyConfig = () => ({
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restrict_data_processing: true,
    client_storage: 'none', // Disable client-side storage for enhanced privacy
    send_page_view: true,
    debug_mode: process.env.NODE_ENV === 'development',
    // Custom parameters for analytics
    custom_map: {
      'content_type': 'content_type',
      'privacy_level': 'privacy_level'
    }
  })

  // Initialize GA4 with enhanced error handling
  const initializeGA4 = async () => {
    if (isInitialized || initializationAttempts >= MAX_INIT_ATTEMPTS) {
      return
    }

    initializationAttempts++
    
    try {
      // Load Google Analytics script with error handling
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      
      // Add error handling for script loading
      script.onerror = (err) => {
        handleAnalyticsError('script loading', new Error('Failed to load GA4 script'))
      }
      
      document.head.appendChild(script)

      // Wait for script to load
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('GA4 script loading timeout')), 10000)
      })

      // Initialize gtag with healthcare compliance
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer.push(arguments)
      }

      // Configure GA4 with enhanced privacy settings
      window.gtag('js', new Date())
      window.gtag('config', measurementId, {
        page_title: 'Dr. Misha Bogomaz - Therapy Services',
        page_location: window.location.href,
        ...getPrivacyConfig(),
        // Custom parameters for analytics
        content_type: 'therapy_website',
        privacy_level: 'enhanced'
      })

      // Enhanced page view tracking
      const router = useRouter()
      router.afterEach((to) => {
        if (window.gtag && isInitialized) {
          window.gtag('config', measurementId, {
            page_title: document.title,
            page_location: window.location.href,
            page_path: to.path,
            content_type: 'therapy_website',
            privacy_level: 'enhanced'
          })
        }
      })

      isInitialized = true
      console.log('GA4 initialized with enhanced privacy and user consent')

      // Track successful initialization
      window.gtag('event', 'analytics_initialized', {
        consent_given: true,
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })

    } catch (err) {
      handleAnalyticsError('initialization', err)
      
      // Provide fallback no-op function
      window.gtag = () => {
        console.log('Analytics disabled due to initialization error')
      }
    }
  }

  // Enhanced consent checking with error handling
  const checkConsentAndInitialize = async () => {
    // Wait for consent to be loaded, with timeout
    if (!isLoaded.value) {
      // Wait up to 5 seconds for consent to load
      let attempts = 0
      while (!isLoaded.value && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      if (!isLoaded.value) {
        console.warn('Consent system failed to load within timeout, proceeding with conservative approach')
        // Provide no-op gtag function as fallback
        window.gtag = () => {
          console.log('Analytics disabled due to consent system timeout')
        }
        return
      }
    }

    // Check for consent errors
    if (consentError.value) {
      console.warn('Consent error detected, using conservative approach:', consentError.value)
    }

    if (hasResponded()) {
      if (hasConsent()) {
        // User has given consent, initialize GA4
        await initializeGA4()
      } else {
        // User has rejected consent, provide no-op gtag function
        window.gtag = () => {
          console.log('Analytics disabled due to user consent rejection')
        }
        console.log('GA4 disabled due to user consent rejection')
      }
    } else {
      // User hasn't responded yet, provide no-op gtag function
      window.gtag = () => {
        console.log('Analytics disabled - waiting for user consent')
      }
      console.log('GA4 disabled - waiting for user consent')
    }
  }

  // Enhanced consent watching with error handling
  const { consent } = useCookieConsent()
  watch(consent, async (newConsent) => {
    if (newConsent) {
      if (newConsent.analytics) {
        // User has given consent, initialize GA4
        await initializeGA4()
      } else {
        // User has rejected consent, disable GA4
        window.gtag = () => {
          console.log('Analytics disabled due to user consent rejection')
        }
        console.log('GA4 disabled due to user consent rejection')
      }
    }
  }, { immediate: true })

  // Initial check with error handling
  checkConsentAndInitialize()

  // Enhanced gtag function with error handling
  const enhancedGtag = (...args) => {
    try {
      if (window.gtag && typeof window.gtag === 'function') {
        // Add custom parameters to all events
        if (args[0] === 'event' && args[2]) {
          args[2] = {
            ...args[2],
            content_type: 'therapy_website',
            privacy_level: 'enhanced'
          }
        }
        window.gtag(...args)
      } else {
        console.log('Analytics not yet initialized or disabled')
      }
    } catch (err) {
      handleAnalyticsError('event tracking', err)
    }
  }

  // Provide enhanced gtag function to components
  return {
    provide: {
      gtag: enhancedGtag
    }
  }
}) 