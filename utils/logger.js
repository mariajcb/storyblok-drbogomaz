// Logging utility for cookie consent system

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

const isDevelopment = process.env.NODE_ENV === 'development'

export const Logger = {
  error(message, ...args) {
    console.error(`[Cookie Consent] ${message}`, ...args)
  },

  warn(message, ...args) {
    console.warn(`[Cookie Consent] ${message}`, ...args)
  },

  info(message, ...args) {
    if (isDevelopment) {
      console.log(`[Cookie Consent] ${message}`, ...args)
    }
  },

  debug(message, ...args) {
    if (isDevelopment) {
      console.log(`[Cookie Consent Debug] ${message}`, ...args)
    }
  },

  analyticsFailure(eventName, error) {
    this.warn(`Could not track ${eventName}:`, error.message)
  }
}
