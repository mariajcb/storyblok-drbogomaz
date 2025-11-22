import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CookieStorage } from '~/utils/cookieStorage'

describe('CookieStorage', () => {
  let originalProcessClient
  let mockLocalStorage
  let mockSessionStorage

  beforeEach(() => {
    originalProcessClient = process.client
    process.client = true

    mockLocalStorage = {}
    global.localStorage = {
      getItem: vi.fn((key) => mockLocalStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockLocalStorage[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete mockLocalStorage[key]
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {}
      })
    }

    // Mock sessionStorage
    mockSessionStorage = {}
    global.sessionStorage = {
      getItem: vi.fn((key) => mockSessionStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockSessionStorage[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete mockSessionStorage[key]
      }),
      clear: vi.fn(() => {
        mockSessionStorage = {}
      })
    }
  })

  afterEach(() => {
    process.client = originalProcessClient
    vi.clearAllMocks()
  })

  describe('isAvailable', () => {
    it('returns false when not on client side', () => {
      process.client = false

      const result = CookieStorage.isAvailable()

      expect(result).toBe(false)
    })

    it('returns true when localStorage operations succeed', () => {
      const result = CookieStorage.isAvailable()

      expect(result).toBe(true)
      expect(global.localStorage.setItem).toHaveBeenCalledWith('__localStorage_test__', 'test')
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('__localStorage_test__')
    })

    it('returns false when localStorage setItem throws error', () => {
      global.localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const result = CookieStorage.isAvailable()

      expect(result).toBe(false)
    })

    it('returns false when localStorage removeItem throws error', () => {
      global.localStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const result = CookieStorage.isAvailable()

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    it('returns null when not on client side', () => {
      process.client = false

      const result = CookieStorage.get('test-key')

      expect(result).toBe(null)
      expect(global.localStorage.getItem).not.toHaveBeenCalled()
    })

    it('returns parsed JSON data when key exists in localStorage', () => {
      const testData = { analytics: true, timestamp: '2024-01-01T00:00:00.000Z' }
      mockLocalStorage['test-key'] = JSON.stringify(testData)

      const result = CookieStorage.get('test-key')

      expect(result).toEqual(testData)
      expect(global.localStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('returns null when key does not exist in localStorage', () => {
      const result = CookieStorage.get('non-existent-key')

      expect(result).toBe(null)
    })

    it('returns null when JSON parsing fails', () => {
      mockLocalStorage['invalid-json'] = 'invalid json{'

      const result = CookieStorage.get('invalid-json')

      expect(result).toBe(null)
    })
  })

  describe('set', () => {
    it('returns false when not on client side', () => {
      process.client = false

      const result = CookieStorage.set('test-key', { data: 'test' })

      expect(result).toBe(false)
      expect(global.localStorage.setItem).not.toHaveBeenCalled()
    })

    it('stores JSON stringified data in localStorage and returns true', () => {
      const testData = { analytics: true, timestamp: '2024-01-01T00:00:00.000Z' }

      const result = CookieStorage.set('test-key', testData)

      expect(result).toBe(true)
      expect(global.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
      expect(mockLocalStorage['test-key']).toBe(JSON.stringify(testData))
    })

    it('returns false when localStorage setItem throws error', () => {
      global.localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const result = CookieStorage.set('test-key', { data: 'test' })

      expect(result).toBe(false)
    })
  })

  describe('remove', () => {
    it('returns false when not on client side', () => {
      process.client = false

      const result = CookieStorage.remove('test-key')

      expect(result).toBe(false)
      expect(global.localStorage.removeItem).not.toHaveBeenCalled()
    })

    it('removes key from localStorage and returns true', () => {
      mockLocalStorage['test-key'] = 'test-value'

      const result = CookieStorage.remove('test-key')

      expect(result).toBe(true)
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('test-key')
      expect(mockLocalStorage['test-key']).toBeUndefined()
    })

    it('returns false when localStorage removeItem throws error', () => {
      global.localStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const result = CookieStorage.remove('test-key')

      expect(result).toBe(false)
    })
  })

  describe('getFallback', () => {
    it('returns null when not on client side', () => {
      process.client = false

      const result = CookieStorage.getFallback()

      expect(result).toBe(null)
      expect(global.sessionStorage.getItem).not.toHaveBeenCalled()
    })

    it('returns parsed JSON data when fallback key exists in sessionStorage', () => {
      const testData = { analytics: false, timestamp: '2024-01-01T00:00:00.000Z' }
      mockSessionStorage['cookie-consent-fallback'] = JSON.stringify(testData)

      const result = CookieStorage.getFallback()

      expect(result).toEqual(testData)
    })

    it('returns null when fallback key does not exist in sessionStorage', () => {
      const result = CookieStorage.getFallback()

      expect(result).toBe(null)
    })

    it('returns null when JSON parsing fails', () => {
      mockSessionStorage['cookie-consent-fallback'] = 'invalid json{'

      const result = CookieStorage.getFallback()

      expect(result).toBe(null)
    })
  })

  describe('setFallback', () => {
    it('returns false when not on client side', () => {
      process.client = false

      const result = CookieStorage.setFallback({ data: 'test' })

      expect(result).toBe(false)
      expect(global.sessionStorage.setItem).not.toHaveBeenCalled()
    })

    it('stores JSON stringified data in sessionStorage and returns true', () => {
      const testData = { analytics: true, timestamp: '2024-01-01T00:00:00.000Z' }

      const result = CookieStorage.setFallback(testData)

      expect(result).toBe(true)
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
        'cookie-consent-fallback',
        JSON.stringify(testData)
      )
      expect(mockSessionStorage['cookie-consent-fallback']).toBe(JSON.stringify(testData))
    })

    it('returns false when sessionStorage setItem throws error', () => {
      global.sessionStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const result = CookieStorage.setFallback({ data: 'test' })

      expect(result).toBe(false)
    })
  })

  describe('removeFallback', () => {
    it('returns false when not on client side', () => {
      process.client = false

      const result = CookieStorage.removeFallback()

      expect(result).toBe(false)
      expect(global.sessionStorage.removeItem).not.toHaveBeenCalled()
    })

    it('removes fallback key from sessionStorage and returns true', () => {
      mockSessionStorage['cookie-consent-fallback'] = 'test-value'

      const result = CookieStorage.removeFallback()

      expect(result).toBe(true)
      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('cookie-consent-fallback')
      expect(mockSessionStorage['cookie-consent-fallback']).toBeUndefined()
    })

    it('returns false when sessionStorage removeItem throws error', () => {
      global.sessionStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const result = CookieStorage.removeFallback()

      expect(result).toBe(false)
    })
  })
})

