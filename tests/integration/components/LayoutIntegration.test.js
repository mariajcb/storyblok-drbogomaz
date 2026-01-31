import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopHeader from '../../../components/navigation/TopHeader.vue'
import BottomFooter from '../../../components/BottomFooter.vue'

describe('Layout Component Integration', () => {
  let mockRouter
  let mockLocalStorage

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
    global.window = { ...global.window, location: { reload: vi.fn() } }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Navigation Consistency', () => {
    it('maintains consistent navigation routes between header and footer', () => {
      const topHeader = mount(TopHeader, {
        global: {
          stubs: {
            'NuxtLink': 'a'
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const bottomFooter = mount(BottomFooter, {
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

      const headerLinks = topHeader.findComponent({ name: 'DesktopNavigation' }).findAll('a')
      const footerLinks = bottomFooter.findAll('a')

      const headerRoutes = headerLinks.map(link => link.attributes('href'))
      const footerRoutes = footerLinks.map(link => link.attributes('href'))

      expect(footerRoutes).toContain('/blog')
      expect(footerRoutes).toContain('/contact')
      expect(headerRoutes).toContain('/blog')
      expect(headerRoutes).toContain('/contact')
    })
  })
})

