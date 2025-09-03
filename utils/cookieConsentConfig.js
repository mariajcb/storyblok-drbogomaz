// Cookie consent configuration

export const CookieConsentConfig = {
  CONSENT: {
    VERSION: '1.1',
    DURATION_MS: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    RENEWAL_THRESHOLD_DAYS: 365, // Renew after 1 year
    DATA_RETENTION: '26 months for analytics, 1 year for consent preferences'
  },
  STORAGE: {
    KEY: 'cookie-consent',
    FALLBACK_KEY: 'cookie-consent-fallback'
  },
  ANALYTICS: {
    CONTENT_TYPE: 'therapy_website',
    EVENTS: {
      CONSENT_ERROR: 'cookie_consent_error',
      CONSENT_SAVED: 'cookie_consent_saved',
      CONSENT_CLEARED: 'cookie_consent_cleared'
    }
  }
}
