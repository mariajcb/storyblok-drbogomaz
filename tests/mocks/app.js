/**
 * Stub for Nuxt's #app module in Vitest (no Nuxt auto-import).
 * Tests that need a specific $gtag can override via vi.mock('#app', ...).
 */
export function useNuxtApp() {
  return {
    $gtag: typeof globalThis !== 'undefined' && globalThis.gtag ? globalThis.gtag : () => {}
  }
}
