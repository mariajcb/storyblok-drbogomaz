import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import { CookieStorage } from '~/utils/cookieStorage'
import { ConsentValidation } from '~/utils/consentValidation'
import { CookieConsentConfig } from '~/utils/cookieConsentConfig'
import { Logger } from '~/utils/logger'

// Mock dependencies
vi.mock('~/utils/cookieStorage')
vi.mock('~/utils/consentValidation')
vi.mock('~/utils/cookieConsentConfig')
vi.mock('~/utils/logger')

describe('useCookieConsent', () => {
  let mockGtag
  let originalProcessClient

  beforeEach(() => {
    // Mock process.client bc it's undefined/false in Vitest
    originalProcessClient = process.client
    process.client = true

    mockGtag = vi.fn()
    global.window = {
      ...global.window,
      gtag: mockGtag,
      location: { pathname: '/test' }
    }

    CookieStorage.isAvailable = vi.fn(() => true)
    CookieStorage.get = vi.fn(() => null)
    CookieStorage.set = vi.fn(() => true)
    CookieStorage.remove = vi.fn(() => true)
    CookieStorage.getFallback = vi.fn(() => null)
    CookieStorage.setFallback = vi.fn(() => true)
    CookieStorage.removeFallback = vi.fn(() => true)

    ConsentValidation.validateConsentData = vi.fn((data) => {
      return data && typeof data.analytics === 'boolean' && data.timestamp
    })
    ConsentValidation.isConsentExpired = vi.fn(() => false)
    ConsentValidation.createConsentData = vi.fn((userConsent, consentType, version, retention) => ({
      analytics: userConsent,
      timestamp: new Date().toISOString(),
      version,
      consentType,
      dataRetention: retention
    }))
    ConsentValidation.getConsentAgeInDays = vi.fn(() => 0)

    CookieConsentConfig.CONSENT = {
      VERSION: '1.1',
      DURATION_MS: 365 * 24 * 60 * 60 * 1000,
      RENEWAL_THRESHOLD_DAYS: 365,
      DATA_RETENTION: '26 months'
    }
    CookieConsentConfig.STORAGE = {
      KEY: 'cookie-consent'
    }
    CookieConsentConfig.ANALYTICS = {
      CONTENT_TYPE: 'therapy_website',
      EVENTS: {
        CONSENT_ERROR: 'cookie_consent_error',
        CONSENT_SAVED: 'cookie_consent_saved',
        CONSENT_CLEARED: 'cookie_consent_cleared'
      }
    }

    Logger.error = vi.fn()
    Logger.warn = vi.fn()
    Logger.info = vi.fn()
    Logger.analyticsFailure = vi.fn()
  })

  afterEach(() => {
    process.client = originalProcessClient
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('returns initial state with null consent and not loaded', () => {
      const { consent, isLoaded, error, isInitializing } = useCookieConsent()

      expect(consent.value).toBe(null)
      expect(isLoaded.value).toBe(false)
      expect(error.value).toBe(null)
      expect(isInitializing.value).toBe(false)
    })
  })

  describe('Consent Management', () => {
    it('accepts all cookies and updates consent state', async () => {
      const { acceptAll, consent, hasConsent, hasResponded } = useCookieConsent()

      await acceptAll()

      expect(consent.value).not.toBe(null)
      expect(consent.value.analytics).toBe(true)
      expect(hasConsent()).toBe(true)
      expect(hasResponded()).toBe(true)
      expect(CookieStorage.setFallback).toHaveBeenCalled()
      expect(CookieStorage.set).toHaveBeenCalled()
    })

    it('rejects all cookies and updates consent state', async () => {
      const { rejectAll, consent, hasConsent, hasResponded } = useCookieConsent()

      await rejectAll()

      expect(consent.value).not.toBe(null)
      expect(consent.value.analytics).toBe(false)
      expect(hasConsent()).toBe(false)
      expect(hasResponded()).toBe(true)
    })

    it('clears consent and removes from storage', async () => {
      const { acceptAll, clearConsent, consent, hasResponded } = useCookieConsent()

      await acceptAll()
      expect(hasResponded()).toBe(true)

      clearConsent()

      expect(consent.value).toBe(null)
      expect(hasResponded()).toBe(false)
      expect(CookieStorage.remove).toHaveBeenCalled()
      expect(CookieStorage.removeFallback).toHaveBeenCalled()
    })
  })

  describe('Consent State Queries', () => {
    it('returns correct consent timestamp when consent exists', async () => {
      const { acceptAll, getConsentTimestamp } = useCookieConsent()

      await acceptAll()
      const timestamp = getConsentTimestamp()

      expect(timestamp).toBeTruthy()
      expect(typeof timestamp).toBe('string')
    })

    it('returns undefined timestamp when no consent exists', () => {
      const { getConsentTimestamp } = useCookieConsent()

      expect(getConsentTimestamp()).toBe(undefined)
    })

    it('calculates consent age in days', async () => {
      const { acceptAll, getConsentAge } = useCookieConsent()
      ConsentValidation.getConsentAgeInDays.mockReturnValue(5)

      await acceptAll()
      const age = getConsentAge()

      expect(age).toBe(5)
      expect(ConsentValidation.getConsentAgeInDays).toHaveBeenCalled()
    })

    it('determines if consent needs renewal based on age', async () => {
      const { acceptAll, needsRenewal } = useCookieConsent()
      ConsentValidation.getConsentAgeInDays.mockReturnValue(400) // Older than threshold

      await acceptAll()
      const needsRenewalResult = needsRenewal()

      expect(needsRenewalResult).toBe(true)
    })

    it('returns false for renewal when consent is fresh', async () => {
      const { acceptAll, needsRenewal } = useCookieConsent()
      ConsentValidation.getConsentAgeInDays.mockReturnValue(10) // Fresh

      await acceptAll()
      const needsRenewalResult = needsRenewal()

      expect(needsRenewalResult).toBe(false)
    })

    it('provides complete consent summary when consent exists', async () => {
      const { acceptAll, getConsentSummary } = useCookieConsent()
      ConsentValidation.getConsentAgeInDays.mockReturnValue(5)

      await acceptAll()
      const summary = getConsentSummary()

      expect(summary).toMatchObject({
        hasConsent: true,
        hasResponded: true,
        timestamp: expect.any(String),
        age: 5,
        needsRenewal: false,
        version: '1.1',
        consentType: 'explicit'
      })
    })

    it('returns null summary when no consent exists', () => {
      const { getConsentSummary } = useCookieConsent()

      expect(getConsentSummary()).toBe(null)
    })
  })

  describe('Consent Initialization', () => {
    it('initializes consent from storage when valid data exists', async () => {
      const storedConsent = {
        analytics: true,
        timestamp: new Date().toISOString(),
        version: '1.1',
        consentType: 'explicit'
      }
      CookieStorage.get.mockReturnValue(storedConsent)
      ConsentValidation.validateConsentData.mockReturnValue(true)
      ConsentValidation.isConsentExpired.mockReturnValue(false)

      const { initializeConsent, consent } = useCookieConsent()
      await initializeConsent()
      await nextTick()

      expect(consent.value).toEqual(storedConsent)
    })

    it('clears invalid consent data from storage', async () => {
      const invalidConsent = { invalid: 'data' }
      CookieStorage.get.mockReturnValue(invalidConsent)
      ConsentValidation.validateConsentData.mockReturnValue(false)

      const { initializeConsent, consent } = useCookieConsent()
      await initializeConsent()
      await nextTick()

      expect(consent.value).toBe(null)
      expect(CookieStorage.remove).toHaveBeenCalled()
    })

    it('clears expired consent from storage', async () => {
      const expiredConsent = {
        analytics: true,
        timestamp: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
      }
      CookieStorage.get.mockReturnValue(expiredConsent)
      ConsentValidation.validateConsentData.mockReturnValue(true)
      ConsentValidation.isConsentExpired.mockReturnValue(true)

      const { initializeConsent, consent } = useCookieConsent()
      await initializeConsent()
      await nextTick()

      expect(consent.value).toBe(null)
      expect(CookieStorage.remove).toHaveBeenCalled()
    })

    it('uses fallback storage when localStorage is unavailable', async () => {
      CookieStorage.isAvailable.mockReturnValue(false)
      const fallbackConsent = {
        analytics: true,
        timestamp: new Date().toISOString()
      }
      CookieStorage.getFallback.mockReturnValue(fallbackConsent)

      const { initializeConsent, consent } = useCookieConsent()
      await initializeConsent()
      await nextTick()

      expect(consent.value).toEqual(fallbackConsent)
    })

    it('logs error and loads fallback consent when initialization throws storage error', async () => {
      CookieStorage.get.mockImplementation(() => {
        throw new Error('Storage error')
      })
      const fallbackConsent = {
        analytics: false,
        timestamp: new Date().toISOString()
      }
      CookieStorage.getFallback.mockReturnValue(fallbackConsent)

      const { initializeConsent, consent, error } = useCookieConsent()
      // Wait for auto-initialization to complete first
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Then manually initialize to test error handling
      await initializeConsent()
      await nextTick()

      expect(Logger.error).toHaveBeenCalled()
      expect(consent.value).toEqual(fallbackConsent)
      expect(error.value).toBe(null)
    })

    it('does not initialize on server side', async () => {
      process.client = false

      const { initializeConsent, isLoaded } = useCookieConsent()
      await initializeConsent()

      expect(isLoaded.value).toBe(true)
      expect(CookieStorage.get).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('sets error state but still updates in-memory consent when storage throws error during saving', async () => {
      // Wait for auto-initialization to complete
      const { acceptAll, consent, error } = useCookieConsent()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Now throw errors on storage operations
      CookieStorage.set.mockImplementation(() => {
        throw new Error('Storage full')
      })
      CookieStorage.setFallback.mockImplementation(() => {
        throw new Error('Storage full')
      })

      await acceptAll()
      await nextTick()

      expect(error.value).not.toBe(null)
      expect(error.value.operation).toBe('saving consent')
      expect(consent.value).not.toBe(null)
      expect(consent.value.analytics).toBe(true)
    })

    it('sets error state with operation name when storage throws error during clearing', () => {
      CookieStorage.remove.mockImplementation(() => {
        throw new Error('Remove failed')
      })

      const { clearConsent, error } = useCookieConsent()
      clearConsent()

      expect(error.value).not.toBe(null)
      expect(error.value.operation).toBe('clearing consent')
    })

    it('tracks analytics events for errors', async () => {
      CookieStorage.set.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const { acceptAll } = useCookieConsent()
      await acceptAll()

      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'cookie_consent_error',
        expect.objectContaining({
          error_operation: 'saving consent',
          page_location: '/test',
          content_type: 'therapy_website'
        })
      )
    })
  })

  describe('Analytics Integration', () => {
    it('tracks consent saved events', async () => {
      const { acceptAll } = useCookieConsent()
      await acceptAll()

      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'cookie_consent_saved',
        expect.objectContaining({
          consent_given: true,
          consent_type: 'explicit',
          consent_version: '1.1',
          page_location: '/test',
          content_type: 'therapy_website'
        })
      )
    })

    it('tracks consent cleared events', () => {
      const { clearConsent } = useCookieConsent()
      clearConsent()

      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'cookie_consent_cleared',
        expect.objectContaining({
          page_location: '/test',
          content_type: 'therapy_website'
        })
      )
    })

    it('saves consent successfully when gtag is missing without throwing errors', async () => {
      delete global.window.gtag

      const { acceptAll, consent } = useCookieConsent()
      await acceptAll()

      expect(consent.value).not.toBe(null)
      expect(consent.value.analytics).toBe(true)
    })
  })

  describe('Storage Availability', () => {
    it('returns true when localStorage is available', () => {
      CookieStorage.isAvailable.mockReturnValue(true)
      const { isLocalStorageAvailable } = useCookieConsent()

      expect(isLocalStorageAvailable()).toBe(true)
    })

    it('saves to both localStorage and fallback when available', async () => {
      CookieStorage.isAvailable.mockReturnValue(true)
      const { acceptAll } = useCookieConsent()

      await acceptAll()

      expect(CookieStorage.setFallback).toHaveBeenCalled()
      expect(CookieStorage.set).toHaveBeenCalled()
    })

    it('only saves to fallback when localStorage unavailable', async () => {
      CookieStorage.isAvailable.mockReturnValue(false)
      const { acceptAll } = useCookieConsent()

      await acceptAll()

      expect(CookieStorage.setFallback).toHaveBeenCalled()
      expect(CookieStorage.set).not.toHaveBeenCalled()
    })
  })
})

