import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computed, ref } from 'vue'

const createShowBannerLogic = () => {
  const isLoaded = ref(false)
  const hasResponded = ref(false)
  const hasInteracted = ref(false)
  const originalProcessClient = process.client

  const showBanner = computed(() => {
    return process.client && isLoaded.value && !hasResponded.value && !hasInteracted.value
  })

  return {
    isLoaded,
    hasResponded,
    hasInteracted,
    showBanner,
    reset: () => {
      process.client = originalProcessClient
    }
  }
}

describe('CookieBanner showBanner Logic', () => {
  beforeEach(() => {
    process.client = true
  })

  describe('Banner Visibility Conditions', () => {
    it('returns false when not on client side', () => {
      const { showBanner } = createShowBannerLogic()
      process.client = false

      expect(showBanner.value).toBe(false)
    })

    it('returns false when consent is not loaded', () => {
      const { isLoaded, showBanner } = createShowBannerLogic()
      isLoaded.value = false

      expect(showBanner.value).toBe(false)
    })

    it('returns false when user has already responded', () => {
      const { isLoaded, hasResponded, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      hasResponded.value = true

      expect(showBanner.value).toBe(false)
    })

    it('returns false when user has interacted with banner', () => {
      const { isLoaded, hasInteracted, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      hasInteracted.value = true

      expect(showBanner.value).toBe(false)
    })

    it('returns true when all conditions are met', () => {
      const { isLoaded, showBanner } = createShowBannerLogic()
      isLoaded.value = true

      expect(showBanner.value).toBe(true)
    })
  })

  describe('Banner Visibility State Transitions', () => {
    it('becomes visible when consent loads and user has not responded', () => {
      const { isLoaded, showBanner } = createShowBannerLogic()
      
      expect(showBanner.value).toBe(false)
      
      isLoaded.value = true
      
      expect(showBanner.value).toBe(true)
    })

    it('becomes hidden when user responds to consent', () => {
      const { isLoaded, hasResponded, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      
      expect(showBanner.value).toBe(true)
      
      hasResponded.value = true
      
      expect(showBanner.value).toBe(false)
    })

    it('becomes hidden when user interacts with banner', () => {
      const { isLoaded, hasInteracted, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      
      expect(showBanner.value).toBe(true)
      
      hasInteracted.value = true
      
      expect(showBanner.value).toBe(false)
    })

    it('stays hidden when user has already responded even if loaded', () => {
      const { isLoaded, hasResponded, showBanner } = createShowBannerLogic()
      hasResponded.value = true
      isLoaded.value = true
      
      expect(showBanner.value).toBe(false)
    })
  })

  describe('Multiple Condition Combinations', () => {
    it('returns false when consent not loaded and user has not responded', () => {
      const { showBanner } = createShowBannerLogic()
      
      expect(showBanner.value).toBe(false)
    })

    it('returns false when consent loaded but user has responded', () => {
      const { isLoaded, hasResponded, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      hasResponded.value = true
      
      expect(showBanner.value).toBe(false)
    })

    it('returns false when consent loaded but user has interacted', () => {
      const { isLoaded, hasInteracted, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      hasInteracted.value = true
      
      expect(showBanner.value).toBe(false)
    })

    it('returns false when user has both responded and interacted', () => {
      const { isLoaded, hasResponded, hasInteracted, showBanner } = createShowBannerLogic()
      isLoaded.value = true
      hasResponded.value = true
      hasInteracted.value = true
      
      expect(showBanner.value).toBe(false)
    })
  })
})

