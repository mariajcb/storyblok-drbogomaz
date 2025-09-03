// Consent validation utility for managing consent data validation and creation

export const ConsentValidation = {
  validateConsentData(data) {
    return data && 
           typeof data.analytics === 'boolean' && 
           data.timestamp &&
           typeof data.timestamp === 'string'
  },

  isConsentExpired(timestamp, consentDuration) {
    if (!timestamp) return true
    const consentAge = Date.now() - new Date(timestamp).getTime()
    return consentAge > consentDuration
  },

  createConsentData(userConsent, consentType, consentVersion) {
    return {
      analytics: userConsent,
      timestamp: new Date().toISOString(),
      version: consentVersion,
      consentType,
      dataRetention: '26 months for analytics, 1 year for consent preferences'
    }
  },

  getConsentAgeInDays(timestamp) {
    if (!timestamp) return null
    const age = Date.now() - new Date(timestamp).getTime()
    return Math.floor(age / (1000 * 60 * 60 * 24))
  }
}
