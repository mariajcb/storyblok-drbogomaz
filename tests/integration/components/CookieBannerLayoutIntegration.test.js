import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CookieBanner from '../../../components/CookieBanner.vue'

describe('CookieBanner Layout Integration', () => {
  let mockRouter
  let mockGtag
  let mockAcceptAll
  let mockRejectAll
  let mockHasResponded
  let mockIsLoaded
  let mockConsentError
  let handleConsentUpdate

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      currentRoute: {
        value: {
          path: '/',
          name: 'index',
          params: {},
          query: {}
        }
      }
    }

    mockGtag = vi.fn()
    mockAcceptAll = vi.fn().mockResolvedValue(undefined)
    mockRejectAll = vi.fn().mockResolvedValue(undefined)
    mockHasResponded = vi.fn().mockReturnValue(false)
    mockIsLoaded = ref(true)
    mockConsentError = ref(null)
    handleConsentUpdate = vi.fn()

    // Don't override global objects - let jsdom handle DOM
    // Composables are mocked globally in setup.js
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Consent Update Event Handling', () => {
    it('emits consent-updated event when user accepts cookies', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': {
              template: '<div><slot /></div>'
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        },
        listeners: {
          'consent-updated': handleConsentUpdate
        }
      })

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('consent-updated')).toBeTruthy()
      expect(handleConsentUpdate).toHaveBeenCalledWith({ analytics: true })
    })

    it('emits consent-updated event when user rejects cookies', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': {
              template: '<div><slot /></div>'
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        },
        listeners: {
          'consent-updated': handleConsentUpdate
        }
      })

      const rejectButton = wrapper.find('.cookie-banner__btn--reject')
      await rejectButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('consent-updated')).toBeTruthy()
      expect(handleConsentUpdate).toHaveBeenCalledWith({ analytics: false })
    })

    it('allows parent layout to handle consent updates', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': {
              template: '<div><slot /></div>'
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        },
        listeners: {
          'consent-updated': handleConsentUpdate
        }
      })

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      expect(handleConsentUpdate).toHaveBeenCalled()
      expect(handleConsentUpdate.mock.calls[0][0]).toEqual({ analytics: true })
    })
  })

  describe('Banner Visibility After Consent', () => {
    it('hides banner after consent is accepted', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': {
              template: '<div><slot /></div>'
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      expect(wrapper.find('.cookie-banner').exists()).toBe(true)

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      mockHasResponded.mockReturnValue(true)
      await wrapper.vm.$nextTick()

      const banner = wrapper.find('.cookie-banner')
      expect(banner.exists()).toBe(false)
    })

    it('hides banner after consent is rejected', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': {
              template: '<div><slot /></div>'
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      expect(wrapper.find('.cookie-banner').exists()).toBe(true)

      const rejectButton = wrapper.find('.cookie-banner__btn--reject')
      await rejectButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      mockHasResponded.mockReturnValue(true)
      await wrapper.vm.$nextTick()

      const banner = wrapper.find('.cookie-banner')
      expect(banner.exists()).toBe(false)
    })
  })
})

