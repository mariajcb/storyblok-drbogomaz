export const useCookieConsent = () => {
  const consent = ref(null)
  const isLoaded = ref(false)
  const error = ref(null)
  const isInitializing = ref(false)

  // Constants for cookie consent management
  const CONSENT_VERSION = '1.1'
  const CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
  const STORAGE_KEY = 'cookie-consent'
  const FALLBACK_KEY = 'cookie-consent-fallback'

  // Error handling utility
  const handleError = (operation, err) => {
    const errorMessage = `Cookie consent ${operation} failed: ${err.message}`
    console.error(errorMessage, err)
    error.value = {
      operation,
      message: errorMessage,
      timestamp: new Date().toISOString()
    }
    
    // Track error for monitoring
    if (process.client && window.gtag) {
      window.gtag('event', 'cookie_consent_error', {
        error_operation: operation,
        error_message: err.message,
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
  }

  // Check if localStorage is available and working
  const isLocalStorageAvailable = () => {
    if (!process.client) return false
    
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }

  // Fallback storage using sessionStorage
  const getFallbackStorage = () => {
    if (!process.client) return null
    
    try {
      const fallback = sessionStorage.getItem(FALLBACK_KEY)
      return fallback ? JSON.parse(fallback) : null
    } catch (e) {
      return null
    }
  }

  const setFallbackStorage = (data) => {
    if (!process.client) return
    
    try {
      sessionStorage.setItem(FALLBACK_KEY, JSON.stringify(data))
    } catch (e) {
      handleError('fallback storage', e)
    }
  }

  // Initialize consent state from localStorage with error handling
  const initializeConsent = async () => {
    if (isInitializing.value) return
    isInitializing.value = true
    error.value = null

    if (!process.client) {
      isLoaded.value = true
      isInitializing.value = false
      return
    }

    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        console.warn('localStorage not available, using session storage fallback')
        const fallback = getFallbackStorage()
        if (fallback) {
          consent.value = fallback
        }
        isLoaded.value = true
        return
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Validate consent data structure
        if (parsed && typeof parsed.analytics === 'boolean' && parsed.timestamp) {
                  // Check if consent has expired
        const consentAge = Date.now() - new Date(parsed.timestamp).getTime()
        if (consentAge > CONSENT_DURATION) {
          console.log('Cookie consent expired, clearing old consent')
          clearConsent()
        } else {
          consent.value = parsed
        }
        } else {
          console.warn('Invalid cookie consent data structure, resetting')
          clearConsent()
        }
      }
    } catch (e) {
      handleError('initialization', e)
      // Try fallback storage
      const fallback = getFallbackStorage()
      if (fallback) {
        consent.value = fallback
      }
    } finally {
      isLoaded.value = true
      isInitializing.value = false
    }
  }

  // Save consent to localStorage with error handling
  const saveConsent = async (userConsent, consentType = 'explicit') => {
    if (!process.client) return

    const consentData = {
      analytics: userConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      consentType, // 'explicit' or 'implicit'
      dataRetention: '26 months for analytics, 1 year for consent preferences'
    }

    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData))
        // Also save to fallback storage for redundancy
        setFallbackStorage(consentData)
      } else {
        // Use fallback storage only
        setFallbackStorage(consentData)
      }
      
      consent.value = consentData
      error.value = null

      // Track consent for monitoring
      if (window.gtag) {
        window.gtag('event', 'cookie_consent_saved', {
          consent_given: userConsent,
          consent_type: consentType,
          consent_version: CONSENT_VERSION,
          page_location: window.location.pathname,
          content_type: 'therapy_website'
        })
      }
    } catch (e) {
      handleError('saving consent', e)
      // Try fallback storage
      setFallbackStorage(consentData)
      consent.value = consentData
    }
  }

  // Accept all cookies
  const acceptAll = async () => {
    await saveConsent(true, 'explicit')
  }

  // Reject all cookies
  const rejectAll = async () => {
    await saveConsent(false, 'explicit')
  }

  // Check if user has given consent
  const hasConsent = () => {
    return consent.value?.analytics === true
  }

  // Check if consent has been given (either accept or reject)
  const hasResponded = () => {
    return consent.value !== null
  }

  // Get consent timestamp
  const getConsentTimestamp = () => {
    return consent.value?.timestamp
  }

  // Get consent age in days
  const getConsentAge = () => {
    if (!consent.value?.timestamp) return null
    const age = Date.now() - new Date(consent.value.timestamp).getTime()
    return Math.floor(age / (1000 * 60 * 60 * 24))
  }

  // Check if consent needs renewal
  const needsRenewal = () => {
    const age = getConsentAge()
    return age !== null && age > 365 // Renew after 1 year
  }

  // Clear consent (for testing or user request)
  const clearConsent = () => {
    if (!process.client) return

    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEY)
      }
      sessionStorage.removeItem(FALLBACK_KEY)
      consent.value = null
      error.value = null

      // Track consent clearing for monitoring
      if (window.gtag) {
        window.gtag('event', 'cookie_consent_cleared', {
          page_location: window.location.pathname,
          content_type: 'therapy_website'
        })
      }
    } catch (e) {
      handleError('clearing consent', e)
    }
  }

  // Get consent summary for monitoring
  const getConsentSummary = () => {
    if (!consent.value) return null

    return {
      hasConsent: hasConsent(),
      hasResponded: hasResponded(),
      timestamp: getConsentTimestamp(),
      age: getConsentAge(),
      needsRenewal: needsRenewal(),
      version: consent.value.version,
      consentType: consent.value.consentType
    }
  }

  // Initialize on client side with performance optimization
  if (process.client) {
    // Use nextTick to avoid blocking initial render
    nextTick(() => {
      initializeConsent()
    })
  }

  return {
    consent: readonly(consent),
    isLoaded: readonly(isLoaded),
    error: readonly(error),
    isInitializing: readonly(isInitializing),
    acceptAll,
    rejectAll,
    hasConsent,
    hasResponded,
    getConsentTimestamp,
    getConsentAge,
    needsRenewal,
    clearConsent,
    initializeConsent,
    getConsentSummary,
    isLocalStorageAvailable
  }
} 