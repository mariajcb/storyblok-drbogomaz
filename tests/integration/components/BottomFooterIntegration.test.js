import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BottomFooter from '../../../components/BottomFooter.vue'

describe('BottomFooter Component Integration', () => {
  let mockRouter
  let mockLocalStorage
  let mockWindowReload

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

    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.localStorage = mockLocalStorage

    mockWindowReload = vi.fn()
    global.window = {
      ...global.window,
      location: { reload: mockWindowReload }
    }

    global.process = { client: true }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Footer Links', () => {
    it('renders navigation links pointing to /privacy, /contact, and /blog routes', () => {
      const wrapper = mount(BottomFooter, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': 'div'
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const links = wrapper.findAll('a')
      const routes = links.map(link => link.attributes('href'))
      
      expect(routes).toContain('/privacy')
      expect(routes).toContain('/contact')
      expect(routes).toContain('/blog')
    })
  })

  describe('Cookie Preferences Button', () => {
    it('clears cookie consent and reloads page when clicked', async () => {
      const wrapper = mount(BottomFooter, {
        global: {
          stubs: {
            'NuxtLink': 'a',
            'ClientOnly': 'div'
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const cookieButton = wrapper.find('button')
      await cookieButton.trigger('click')

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('cookie-consent')
      expect(mockWindowReload).toHaveBeenCalled()
    })
  })
})

