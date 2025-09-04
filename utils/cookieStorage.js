// Cookie storage utility for managing localStorage and fallback sessionStorage

const STORAGE_KEY = 'cookie-consent'
const FALLBACK_KEY = 'cookie-consent-fallback'

export const CookieStorage = {
  isAvailable() {
    if (!process.client) return false
    
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  },

  get(key) {
    if (!process.client) return null
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      return null
    }
  },

  set(key, data) {
    if (!process.client) return false
    
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (e) {
      return false
    }
  },

  remove(key) {
    if (!process.client) return false
    
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  },

  getFallback() {
    if (!process.client) return null
    
    try {
      const fallback = sessionStorage.getItem(FALLBACK_KEY)
      return fallback ? JSON.parse(fallback) : null
    } catch (e) {
      return null
    }
  },

  setFallback(data) {
    if (!process.client) return false
    
    try {
      sessionStorage.setItem(FALLBACK_KEY, JSON.stringify(data))
      return true
    } catch (e) {
      return false
    }
  },

  removeFallback() {
    if (!process.client) return false
    
    try {
      sessionStorage.removeItem(FALLBACK_KEY)
      return true
    } catch (e) {
      return false
    }
  }
}
