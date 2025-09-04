import { ref, readonly, nextTick } from 'vue'
import { CookieStorage } from '~/utils/cookieStorage'
import { ConsentValidation } from '~/utils/consentValidation'
import { CookieConsentConfig } from '~/utils/cookieConsentConfig'
import { Logger } from '~/utils/logger'

export const useCookieConsent = () => {
  const consent = ref(null)
  const isLoaded = ref(false)
  const error = ref(null)
  const isInitializing = ref(false)

  // Utility functions
  const isClient = () => process.client
  const isLocalStorageAvailable = () => CookieStorage.isAvailable()
  
  const updateConsentState = (newConsent, clearError = true) => {
    consent.value = newConsent
    if (clearError) error.value = null
  }

  const trackAnalyticsEvent = (eventName, eventParameters) => {
    if (!isClient() || !window.gtag || typeof window.gtag !== 'function') {
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
      Logger.analyticsFailure(eventName, e)
    }
  }

  const handleError = (operation, err, context = {}) => {
    const errorMessage = `Cookie consent ${operation} failed: ${err.message}`
    Logger.error(errorMessage, err)
    
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

  const processStoredConsent = (stored) => {
    if (!stored) return
    
    if (!ConsentValidation.validateConsentData(stored)) {
      Logger.warn('Invalid cookie consent data structure, resetting')
      clearConsent()
      return
    }
    
    if (ConsentValidation.isConsentExpired(stored.timestamp, CookieConsentConfig.CONSENT.DURATION_MS)) {
      Logger.info('Cookie consent expired, clearing old consent')
      clearConsent()
      return
    }
    
    updateConsentState(stored)
  }

  const initializeFromFallback = () => {
    Logger.warn('localStorage not available, using session storage fallback')
    const fallback = CookieStorage.getFallback()
    if (fallback) {
      updateConsentState(fallback)
    }
    isLoaded.value = true
  }

  // Storage operations
  const saveConsentToStorage = (consentData) => {
    // Always save to fallback storage first as reliable backup
    CookieStorage.setFallback(consentData)
    
    // Then attempt to save to localStorage if available
    if (isLocalStorageAvailable()) {
      CookieStorage.set(CookieConsentConfig.STORAGE.KEY, consentData)
    }
  }

  // Initialize consent state from storage with fallback handling
  const initializeConsent = async () => {
    if (isInitializing.value) return
    isInitializing.value = true
    error.value = null

    if (!isClient()) {
      isLoaded.value = true
      isInitializing.value = false
      return
    }

    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        initializeFromFallback()
        return
      }

      const stored = CookieStorage.get(CookieConsentConfig.STORAGE.KEY)
      processStoredConsent(stored)
    } catch (e) {
      handleError('initialization', e, { 
        localStorageAvailable: isLocalStorageAvailable(),
        hasStoredData: false 
      })
      const fallback = CookieStorage.getFallback()
      if (fallback) {
        updateConsentState(fallback)
      }
    } finally {
      isLoaded.value = true
      isInitializing.value = false
    }
  }

  // Save user consent with storage fallback
  const saveConsent = async (userConsent, consentType = 'explicit') => {
    if (!isClient()) return

    const consentData = ConsentValidation.createConsentData(
      userConsent, 
      consentType, 
      CookieConsentConfig.CONSENT.VERSION, 
      CookieConsentConfig.CONSENT.DATA_RETENTION
    )

    try {
      saveConsentToStorage(consentData)
      updateConsentState(consentData)

      trackAnalyticsEvent(CookieConsentConfig.ANALYTICS.EVENTS.CONSENT_SAVED, {
        consent_given: userConsent,
        consent_type: consentType,
        consent_version: CookieConsentConfig.CONSENT.VERSION
      })
    } catch (e) {
      handleError('saving consent', e, { 
        userConsent,
        consentType,
        localStorageAvailable: isLocalStorageAvailable()
      })
      // Even if storage fails, update the in-memory state
      updateConsentState(consentData, false)
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
    return age !== null && age > CookieConsentConfig.CONSENT.RENEWAL_THRESHOLD_DAYS
  }

  const clearConsent = () => {
    if (!isClient()) return

    try {
      if (isLocalStorageAvailable()) {
        CookieStorage.remove(CookieConsentConfig.STORAGE.KEY)
      }
      CookieStorage.removeFallback()
      updateConsentState(null)

      // Track consent clearing for monitoring
      trackAnalyticsEvent(CookieConsentConfig.ANALYTICS.EVENTS.CONSENT_CLEARED)
    } catch (e) {
      handleError('clearing consent', e, { 
        localStorageAvailable: isLocalStorageAvailable(),
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
  if (isClient()) {
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