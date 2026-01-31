import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ConsentValidation } from '~/utils/consentValidation'

describe('ConsentValidation', () => {
  describe('validateConsentData', () => {
    it('returns true for valid consent data with analytics boolean and timestamp', () => {
      const validData = {
        analytics: true,
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '1.1',
        consentType: 'explicit'
      }

      const result = ConsentValidation.validateConsentData(validData)

      expect(result).toBe(true)
    })

    it('returns false when analytics property is missing', () => {
      const invalidData = {
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '1.1'
      }

      const result = ConsentValidation.validateConsentData(invalidData)

      expect(result).toBe(false)
    })

    it('returns false when analytics property is not a boolean', () => {
      const invalidData = {
        analytics: 'true',
        timestamp: '2024-01-01T00:00:00.000Z'
      }

      const result = ConsentValidation.validateConsentData(invalidData)

      expect(result).toBe(false)
    })

    it('returns false when timestamp property is missing', () => {
      const invalidData = {
        analytics: true,
        version: '1.1'
      }

      const result = ConsentValidation.validateConsentData(invalidData)

      expect(result).toBeFalsy()
    })

    it('returns false when timestamp is not a string', () => {
      const invalidData = {
        analytics: true,
        timestamp: new Date()
      }

      const result = ConsentValidation.validateConsentData(invalidData)

      expect(result).toBe(false)
    })

    it('returns falsy value for null or undefined data', () => {
      expect(ConsentValidation.validateConsentData(null)).toBeFalsy()
      expect(ConsentValidation.validateConsentData(undefined)).toBeFalsy()
    })
  })

  describe('isConsentExpired', () => {
    it('returns true when timestamp is missing', () => {
      const result = ConsentValidation.isConsentExpired(null, 1000)

      expect(result).toBe(true)
    })

    it('returns true when consent age exceeds duration', () => {
      const oldTimestamp = new Date(Date.now() - 2000).toISOString()
      const duration = 1000

      const result = ConsentValidation.isConsentExpired(oldTimestamp, duration)

      expect(result).toBe(true)
    })

    it('returns false when consent age is within duration', () => {
      const recentTimestamp = new Date(Date.now() - 500).toISOString()
      const duration = 1000 

      const result = ConsentValidation.isConsentExpired(recentTimestamp, duration)

      expect(result).toBe(false)
    })

    it('returns false when consent age equals duration exactly', () => {
      const timestamp = new Date(Date.now() - 1000).toISOString()
      const duration = 1000

      const result = ConsentValidation.isConsentExpired(timestamp, duration)

      expect(result).toBe(false)
    })
  })

  describe('createConsentData', () => {
    it('creates consent data object with analytics boolean from user consent', () => {
      const result = ConsentValidation.createConsentData(
        true,
        'explicit',
        '1.1',
        '26 months'
      )

      expect(result.analytics).toBe(true)
      expect(result.consentType).toBe('explicit')
      expect(result.version).toBe('1.1')
      expect(result.dataRetention).toBe('26 months')
      expect(result.timestamp).toBeTruthy()
      expect(typeof result.timestamp).toBe('string')
    })

    it('creates consent data with analytics false when user rejects', () => {
      const result = ConsentValidation.createConsentData(
        false,
        'explicit',
        '1.1',
        '26 months'
      )

      expect(result.analytics).toBe(false)
    })

    it('includes ISO timestamp string in consent data', () => {
      const before = new Date().toISOString()
      const result = ConsentValidation.createConsentData(
        true,
        'explicit',
        '1.1',
        '26 months'
      )
      const after = new Date().toISOString()

      expect(result.timestamp).toBeTruthy()
      expect(new Date(result.timestamp).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime())
      expect(new Date(result.timestamp).getTime()).toBeLessThanOrEqual(new Date(after).getTime())
    })

    it('preserves all provided parameters in consent data', () => {
      const result = ConsentValidation.createConsentData(
        true,
        'implicit',
        '2.0',
        '12 months'
      )

      expect(result.analytics).toBe(true)
      expect(result.consentType).toBe('implicit')
      expect(result.version).toBe('2.0')
      expect(result.dataRetention).toBe('12 months')
    })
  })

  describe('getConsentAgeInDays', () => {
    it('returns null when timestamp is missing', () => {
      const result = ConsentValidation.getConsentAgeInDays(null)

      expect(result).toBe(null)
    })

    it('returns 0 for timestamp from today', () => {
      const today = new Date().toISOString()

      const result = ConsentValidation.getConsentAgeInDays(today)

      expect(result).toBe(0)
    })

    it('returns 1 for timestamp from yesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      const result = ConsentValidation.getConsentAgeInDays(yesterday)

      expect(result).toBe(1)
    })

    it('returns 7 for timestamp from one week ago', () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const result = ConsentValidation.getConsentAgeInDays(oneWeekAgo)

      expect(result).toBe(7)
    })

    it('returns 365 for timestamp from one year ago', () => {
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()

      const result = ConsentValidation.getConsentAgeInDays(oneYearAgo)

      expect(result).toBe(365)
    })

    it('floors partial days to whole number', () => {
      const partialDay = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago

      const result = ConsentValidation.getConsentAgeInDays(partialDay)

      expect(result).toBe(0)
    })
  })
})

