import { ref, readonly, nextTick } from 'vue'
import { CookieStorage } from '~/utils/cookieStorage'
import { ConsentValidation } from '~/utils/consentValidation'

export const useCookieConsent = () => {
  const consent = ref(null)
  const isLoaded = ref(false)
  const error = ref(null)
  const isInitializing = ref(false)

  // Constants for cookie consent management
  const CONSENT_VERSION = '1.1'
  const CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
  const CONSENT_RENEWAL_THRESHOLD_DAYS = 365 // Renew consent after 1 year
  const STORAGE_KEY = 'cookie-consent'
  const FALLBACK_KEY = 'cookie-consent-fallback'

  // Analytics tracking helper
  const trackAnalyticsEvent = (eventName, eventParameters) => {
    if (!process.client || !window.gtag || typeof window.gtag !== 'function') {
      return
    }

    try {
      window.gtag('event', eventName, {
        ...eventParameters,
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    } catch (e) {
      // Silently fail to avoid circular dependency issues
      console.warn(`Could not track ${eventName}:`, e.message)
    }
  }

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
    trackAnalyticsEvent('cookie_consent_error', {
      error_operation: operation,
      error_message: err.message
    })
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
      if (!CookieStorage.isAvailable()) {
        console.warn('localStorage not available, using session storage fallback')
        const fallback = CookieStorage.getFallback()
        if (fallback) {
          consent.value = fallback
        }
        isLoaded.value = true
        return
      }

      const stored = CookieStorage.get(STORAGE_KEY)
      if (stored) {
        if (ConsentValidation.validateConsentData(stored)) {
          if (ConsentValidation.isConsentExpired(stored.timestamp, CONSENT_DURATION)) {
            console.log('Cookie consent expired, clearing old consent')
            clearConsent()
          } else {
            consent.value = stored
          }
        } else {
          console.warn('Invalid cookie consent data structure, resetting')
          clearConsent()
        }
      }
    } catch (e) {
      handleError('initialization', e)
      // Try fallback storage
      const fallback = CookieStorage.getFallback()
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

    const consentData = ConsentValidation.createConsentData(userConsent, consentType, CONSENT_VERSION)

    try {
      if (CookieStorage.isAvailable()) {
        CookieStorage.set(STORAGE_KEY, consentData)
        // Also save to fallback storage for redundancy
        CookieStorage.setFallback(consentData)
      } else {
        // Use fallback storage only
        CookieStorage.setFallback(consentData)
      }
      
      consent.value = consentData
      error.value = null

      // Track consent for monitoring
      trackAnalyticsEvent('cookie_consent_saved', {
        consent_given: userConsent,
        consent_type: consentType,
        consent_version: CONSENT_VERSION
      })
    } catch (e) {
      handleError('saving consent', e)
      // Try fallback storage
      CookieStorage.setFallback(consentData)
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
    return ConsentValidation.getConsentAgeInDays(consent.value?.timestamp)
  }

  // Check if consent needs renewal
  const needsRenewal = () => {
    const age = getConsentAge()
    return age !== null && age > CONSENT_RENEWAL_THRESHOLD_DAYS // Renew after 1 year
  }

  // Clear consent (for testing or user request)
  const clearConsent = () => {
    if (!process.client) return

    try {
      if (CookieStorage.isAvailable()) {
        CookieStorage.remove(STORAGE_KEY)
      }
      CookieStorage.removeFallback()
      consent.value = null
      error.value = null

      // Track consent clearing for monitoring
      trackAnalyticsEvent('cookie_consent_cleared')
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
    isLocalStorageAvailable: CookieStorage.isAvailable
  }
} 