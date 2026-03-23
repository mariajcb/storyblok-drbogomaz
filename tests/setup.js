import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global test configuration
config.global.stubs = {
  // Stub Nuxt-specific components and directives
  'NuxtLink': 'a',
  'NuxtPage': 'div',
  'NuxtLayout': 'div',
  'ClientOnly': 'div',
  'StoryblokComponent': 'div'
}

// Mock global properties that Nuxt provides
config.global.mocks = {
  $t: (key) => key, // Mock i18n
  $route: {
    path: '/',
    name: 'index',
    params: {},
    query: {}
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn()
  }
}

// Mock window properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Mock window methods (but don't override document since jsdom provides it)
// Only mock specific window properties that need to be controlled
Object.defineProperty(window, 'addEventListener', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'removeEventListener', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'requestAnimationFrame', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'cancelAnimationFrame', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'setTimeout', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'clearTimeout', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'setInterval', { value: vi.fn(), writable: true })
Object.defineProperty(window, 'clearInterval', { value: vi.fn(), writable: true })

// Mock process
global.process = {
  ...global.process,
  client: true,
  server: false
}

// Mock Vue directives
global.vEditable = vi.fn()

// Mock composables globally
global.useCookieConsent = vi.fn(() => ({
  hasResponded: false,
  consent: {
    analytics: false,
    marketing: false
  },
  acceptAll: vi.fn().mockResolvedValue(undefined),
  rejectAll: vi.fn().mockResolvedValue(undefined),
  updateConsent: vi.fn(),
  error: null,
  isLoaded: true
}))

global.useStoryblokApi = vi.fn(() => ({
  get: vi.fn().mockResolvedValue({ data: {} })
}))

global.useNuxtApp = vi.fn(() => ({
  $gtag: vi.fn()
}))

global.useRoute = vi.fn(() => ({
  path: '/',
  name: 'index',
  params: {},
  query: {}
}))

global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn()
}))

global.useStoryblok = vi.fn(() => ({
  storybridge: {
    on: vi.fn()
  }
}))
