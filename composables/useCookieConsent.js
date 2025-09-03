import { ref, readonly, nextTick } from 'vue'
import { CookieStorage } from '~/utils/cookieStorage'
import { ConsentValidation } from '~/utils/consentValidation'
import { CookieConsentConfig } from '~/utils/cookieConsentConfig'

export const useCookieConsent = () => {
  const consent = ref(null)
  const isLoaded = ref(false)
  const error = ref(null)
  const isInitializing = ref(false)

  const trackAnalyticsEvent = (eventName, eventParameters) => {
    if (!process.client || !window.gtag || typeof window.gtag !== 'function') {
      return
    }

    try {
      window.gtag('event', eventName, {
        ...eventParameters,
        page_location: window.location.pathname,
        content_type: CookieConsentConfig.ANALYTICS.CONTENT_TYPE
      })
    } catch (e) {
      // Silently fail to avoid circular dependency issues
      console.warn(`Could not track ${eventName}:`, e.message)
    }
  }

  const handleError = (operation, err, context = {}) => {
    const errorMessage = `Cookie consent ${operation} failed: ${err.message}`
    console.error(errorMessage, err)
    
    error.value = {
      operation,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      context,
      originalError: err.message
    }
    
    trackAnalyticsEvent(CookieConsentConfig.ANALYTICS.EVENTS.CONSENT_ERROR, {
      error_operation: operation,
      error_message: err.message,
      error_context: JSON.stringify(context)
    })
  }

  // Consent initialization helpers
  const handleStorageFailure = (fallback) => {
    if (fallback) {
      consent.value = fallback
    }
  }

  const processStoredConsent = (stored) => {
    if (stored) {
      if (ConsentValidation.validateConsentData(stored)) {
        if (ConsentValidation.isConsentExpired(stored.timestamp, CookieConsentConfig.CONSENT.DURATION_MS)) {
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
  }

  const initializeFromFallback = () => {
    console.warn('localStorage not available, using session storage fallback')
    const fallback = CookieStorage.getFallback()
    if (fallback) {
      consent.value = fallback
    }
    isLoaded.value = true
  }

  // Consent storage helpers
  const saveConsentToStorage = (consentData) => {
    if (CookieStorage.isAvailable()) {
      CookieStorage.set(CookieConsentConfig.STORAGE.KEY, consentData)
      // Also save to fallback storage for redundancy
      CookieStorage.setFallback(consentData)
    } else {
      // Use fallback storage only
      CookieStorage.setFallback(consentData)
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
      if (!CookieStorage.isAvailable()) {
        initializeFromFallback()
        return
      }

      const stored = CookieStorage.get(CookieConsentConfig.STORAGE.KEY)
      processStoredConsent(stored)
    } catch (e) {
      handleError('initialization', e, { 
        localStorageAvailable: CookieStorage.isAvailable(),
        hasStoredData: !!stored 
      })
      const fallback = CookieStorage.getFallback()
      handleStorageFailure(fallback)
    } finally {
      isLoaded.value = true
      isInitializing.value = false
    }
  }

  // Save consent to localStorage with error handling
  const saveConsent = async (userConsent, consentType = 'explicit') => {
    if (!process.client) return

    const consentData = ConsentValidation.createConsentData(userConsent, consentType, CookieConsentConfig.CONSENT.VERSION, CookieConsentConfig.CONSENT.DATA_RETENTION)

    try {
      saveConsentToStorage(consentData)
      
      consent.value = consentData
      error.value = null

      // Track consent for monitoring
      trackAnalyticsEvent(CookieConsentConfig.ANALYTICS.EVENTS.CONSENT_SAVED, {
        consent_given: userConsent,
        consent_type: consentType,
        consent_version: CookieConsentConfig.CONSENT.VERSION
      })
    } catch (e) {
      handleError('saving consent', e, { 
        userConsent,
        consentType,
        localStorageAvailable: CookieStorage.isAvailable()
      })
      // Try fallback storage
      saveConsentToStorage(consentData)
      consent.value = consentData
    }
  }

  const acceptAll = async () => {
    await saveConsent(true, 'explicit')
  }

  const rejectAll = async () => {
    await saveConsent(false, 'explicit')
  }

  const hasConsent = () => {
    return consent.value?.analytics === true
  }

  const hasResponded = () => {
    return consent.value !== null
  }

  const getConsentTimestamp = () => {
    return consent.value?.timestamp
  }

  const getConsentAge = () => {
    return ConsentValidation.getConsentAgeInDays(consent.value?.timestamp)
  }

  const needsRenewal = () => {
    const age = getConsentAge()
    return age !== null && age > CookieConsentConfig.CONSENT.RENEWAL_THRESHOLD_DAYS // Renew after 1 year
  }

  const clearConsent = () => {
    if (!process.client) return

    try {
      if (CookieStorage.isAvailable()) {
        CookieStorage.remove(CookieConsentConfig.STORAGE.KEY)
      }
      CookieStorage.removeFallback()
      consent.value = null
      error.value = null

      // Track consent clearing for monitoring
      trackAnalyticsEvent(CookieConsentConfig.ANALYTICS.EVENTS.CONSENT_CLEARED)
    } catch (e) {
      handleError('clearing consent', e, { 
        localStorageAvailable: CookieStorage.isAvailable(),
        hadConsent: !!consent.value
      })
    }
  }

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