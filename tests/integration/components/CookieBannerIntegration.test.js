import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CookieBanner from '../../../components/CookieBanner.vue'

describe('CookieBanner Component Integration', () => {
  let mockRouter
  let mockGtag
  let mockAcceptAll
  let mockRejectAll
  let mockHasResponded
  let mockIsLoaded
  let mockError
  let mockConsentError

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
    mockError = ref(null)
    mockConsentError = ref(null)

    // Don't override global objects - let jsdom handle DOM
    // Composables are mocked globally in setup.js
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Banner Visibility', () => {
    it('shows banner when consent has not been responded to', () => {
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

      const banner = wrapper.find('.cookie-banner')
      expect(banner.exists()).toBe(true)
    })

    it('hides banner when consent has been responded to', () => {
      mockHasResponded.mockReturnValue(true)
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

      const banner = wrapper.find('.cookie-banner')
      expect(banner.exists()).toBe(false)
    })
  })

  describe('Accept All Cookies Flow', () => {
    it('calls acceptAll when accept button is clicked', async () => {
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

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockAcceptAll).toHaveBeenCalled()
    })

    it('emits consent-updated event with analytics true when accept is clicked', async () => {
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

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('consent-updated')).toBeTruthy()
      if (wrapper.emitted('consent-updated')) {
        expect(wrapper.emitted('consent-updated')[0][0]).toEqual({ analytics: true })
      }
    })

    it('shows processing state while accepting consent', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true
      mockAcceptAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

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

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(acceptButton.text()).toContain('Processing...')
      expect(acceptButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Reject All Cookies Flow', () => {
    it('calls rejectAll when reject button is clicked', async () => {
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

      const rejectButton = wrapper.find('.cookie-banner__btn--reject')
      await rejectButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockRejectAll).toHaveBeenCalled()
    })

    it('emits consent-updated event with analytics false when reject is clicked', async () => {
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

      const rejectButton = wrapper.find('.cookie-banner__btn--reject')
      await rejectButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('consent-updated')).toBeTruthy()
      if (wrapper.emitted('consent-updated')) {
        expect(wrapper.emitted('consent-updated')[0][0]).toEqual({ analytics: false })
      }
    })

    it('shows processing state while rejecting consent', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true
      mockRejectAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

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

      const rejectButton = wrapper.find('.cookie-banner__btn--reject')
      await rejectButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(rejectButton.text()).toContain('Processing...')
      expect(rejectButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('provides correct ARIA attributes for dialog', () => {
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

      const banner = wrapper.find('.cookie-banner')
      expect(banner.attributes('role')).toBe('dialog')
      expect(banner.attributes('aria-modal')).toBe('true')
      expect(banner.attributes('aria-labelledby')).toBe('cookie-banner-title')
      expect(banner.attributes('aria-describedby')).toBe('cookie-banner-description')
    })

    it('provides correct ARIA labels for buttons', () => {
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

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      const rejectButton = wrapper.find('.cookie-banner__btn--reject')

      expect(acceptButton.attributes('aria-describedby')).toBeTruthy()
      expect(rejectButton.attributes('aria-describedby')).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when consent operation fails', async () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true
      mockAcceptAll.mockRejectedValue(new Error('Storage error'))

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

      const acceptButton = wrapper.find('.cookie-banner__btn--accept')
      await acceptButton.trigger('click')
      await wrapper.vm.$nextTick()

      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()

      const errorMessage = wrapper.find('.cookie-banner__error')
      expect(errorMessage.exists()).toBe(true)
    })
  })

  describe('Privacy Policy Link', () => {
    it('renders privacy policy link pointing to /privacy route', () => {
      mockHasResponded.mockReturnValue(false)
      mockIsLoaded.value = true

      const wrapper = mount(CookieBanner, {
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            },
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

      const privacyLink = wrapper.find('a[href="/privacy"]')
      expect(privacyLink.exists()).toBe(true)
      expect(privacyLink.text()).toContain('privacy practices')
    })
  })
})

