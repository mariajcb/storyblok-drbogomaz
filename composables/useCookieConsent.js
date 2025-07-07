export const useCookieConsent = () => {
  const consent = ref(null)
  const isLoaded = ref(false)

  // Initialize consent state from localStorage
  const initializeConsent = () => {
    if (process.client) {
      const stored = localStorage.getItem('cookie-consent')
      if (stored) {
        try {
          consent.value = JSON.parse(stored)
        } catch (e) {
          console.warn('Invalid cookie consent data, resetting')
          consent.value = null
        }
      }
      isLoaded.value = true
    }
  }

  // Save consent to localStorage
  const saveConsent = (userConsent) => {
    if (process.client) {
      const consentData = {
        analytics: userConsent,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      localStorage.setItem('cookie-consent', JSON.stringify(consentData))
      consent.value = consentData
    }
  }

  // Accept all cookies
  const acceptAll = () => {
    saveConsent(true)
  }

  // Reject all cookies
  const rejectAll = () => {
    saveConsent(false)
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

  // Clear consent (for testing or user request)
  const clearConsent = () => {
    if (process.client) {
      localStorage.removeItem('cookie-consent')
      consent.value = null
    }
  }

  // Initialize on client side
  if (process.client) {
    initializeConsent()
  }

  return {
    consent: readonly(consent),
    isLoaded: readonly(isLoaded),
    acceptAll,
    rejectAll,
    hasConsent,
    hasResponded,
    getConsentTimestamp,
    clearConsent,
    initializeConsent
  }
} 