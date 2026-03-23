/**
 * Stub for Nuxt's #app module in Vitest (no Nuxt auto-import).
 * Tests that need a specific $gtag can override via vi.mock('#app', ...).
 */
export function useNuxtApp() {
  return {
    $gtag: typeof globalThis !== 'undefined' && globalThis.gtag ? globalThis.gtag : () => {}
  }
}

export function useRoute() {
  return {
    path: '/',
    name: 'index',
    params: {},
    query: {}
  }
}

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    go: () => {}
  }
}

export function useStoryblokApi() {
  return {
    get: async () => ({ data: {} })
  }
}

export function useStoryblok() {
  return {
    storybridge: {
      on: () => {}
    }
  }
}

export function useCookieConsent() {
  return {
    hasResponded: false,
    consent: {
      analytics: false,
      marketing: false
    },
    updateConsent: () => {}
  }
}
