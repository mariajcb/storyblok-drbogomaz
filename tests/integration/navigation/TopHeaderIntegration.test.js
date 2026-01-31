import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TopHeader from '../../../components/navigation/TopHeader.vue'

describe('TopHeader Navigation Integration', () => {
  let wrapper
  let mockRouter

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

    wrapper = mount(TopHeader, {
      global: {
        stubs: {
          'NuxtLink': {
            template: '<a :href="to" @click.prevent="$emit(\'click\', $event)"><slot /></a>',
            props: ['to'],
            emits: ['click']
          }
        },
        mocks: {
          $router: mockRouter,
          $route: mockRouter.currentRoute.value
        }
      }
    })
  })

  describe('Component Composition', () => {
    it('renders all child navigation components together', () => {
      expect(wrapper.findComponent({ name: 'NavigationHamburgerButton' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MobileNavigationMenu' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'DesktopNavigation' }).exists()).toBe(true)
    })

    it('renders logo link with correct text and route', () => {
      const logoLink = wrapper.find('a[href="/"]')
      expect(logoLink.exists()).toBe(true)
      expect(logoLink.text()).toContain('Dr.Bogomaz')
    })
  })

  describe('Mobile Menu Toggle Flow', () => {
    it('opens mobile menu when hamburger button is clicked', async () => {
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      
      expect(mobileMenu.props('isOpen')).toBe(false)
      expect(mobileMenu.find('div[role="dialog"]').classes()).toContain('hidden')
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(mobileMenu.props('isOpen')).toBe(true)
      expect(mobileMenu.find('div[role="dialog"]').classes()).not.toContain('hidden')
      expect(hamburgerButton.props('isOpen')).toBe(true)
    })

    it('closes mobile menu when close button is clicked', async () => {
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(true)
      
      const closeButton = mobileMenu.find('button[aria-label="Close menu"]')
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(mobileMenu.props('isOpen')).toBe(false)
      expect(mobileMenu.find('div[role="dialog"]').classes()).toContain('hidden')
      expect(hamburgerButton.props('isOpen')).toBe(false)
    })

    it('closes mobile menu when navigation link is clicked', async () => {
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(true)
      
      const homeLink = mobileMenu.findAll('a[href="/"]')[0]
      await homeLink.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(mobileMenu.props('isOpen')).toBe(false)
    })
  })

  describe('Navigation Links', () => {
    it('renders desktop navigation links pointing to /, /blog, and /contact routes with Home, Blog, and Contact labels', () => {
      const desktopNav = wrapper.findComponent({ name: 'DesktopNavigation' })
      const links = desktopNav.findAll('a')
      
      expect(links.length).toBe(3)
      expect(links[0].attributes('href')).toBe('/')
      expect(links[0].text()).toBe('Home')
      expect(links[1].attributes('href')).toBe('/blog')
      expect(links[1].text()).toBe('Blog')
      expect(links[2].attributes('href')).toBe('/contact')
      expect(links[2].text()).toBe('Contact')
    })

    it('renders mobile navigation links pointing to /, /blog, and /contact routes with Home, Blog, and Contact labels', () => {
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      const links = mobileMenu.findAll('a')
      
      expect(links.length).toBe(3)
      expect(links[0].attributes('href')).toBe('/')
      expect(links[0].text()).toBe('Home')
      expect(links[1].attributes('href')).toBe('/blog')
      expect(links[1].text()).toBe('Blog')
      expect(links[2].attributes('href')).toBe('/contact')
      expect(links[2].text()).toBe('Contact')
    })
  })

  describe('Visual State Integration', () => {
    it('updates hamburger button aria-expanded attribute when menu state changes', async () => {
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      const button = hamburgerButton.find('button')
      
      expect(button.attributes('aria-expanded')).toBe('false')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(button.attributes('aria-expanded')).toBe('true')
    })

    it('transforms hamburger icon visual state when menu opens', async () => {
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      const button = hamburgerButton.find('button')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      const spans = hamburgerButton.findAll('span')
      expect(spans[0].classes()).toContain('rotate-45')
      expect(spans[1].classes()).toContain('opacity-0')
      expect(spans[2].classes()).toContain('-rotate-45')
    })
  })

  describe('Accessibility', () => {
    it('provides correct ARIA attributes for mobile menu dialog', () => {
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      const dialog = mobileMenu.find('div[role="dialog"]')
      
      expect(dialog.attributes('role')).toBe('dialog')
      expect(dialog.attributes('aria-modal')).toBe('true')
      expect(dialog.attributes('aria-label')).toBe('Mobile navigation menu')
    })

    it('provides correct ARIA label for close button', () => {
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      const closeButton = mobileMenu.find('button[aria-label="Close menu"]')
      expect(closeButton.attributes('aria-label')).toBe('Close menu')
    })
  })

  describe('Complete User Flow', () => {
    it('handles full navigation flow: open menu, navigate, reopen, and close', async () => {
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      
      expect(mobileMenu.props('isOpen')).toBe(false)
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(true)
      
      const blogLink = mobileMenu.findAll('a[href="/blog"]')[0]
      await blogLink.trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(false)
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(true)
      
      const closeButton = mobileMenu.find('button[aria-label="Close menu"]')
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(mobileMenu.props('isOpen')).toBe(false)
    })

    it('synchronizes state between hamburger button and mobile menu', async () => {
      const hamburgerButton = wrapper.findComponent({ name: 'NavigationHamburgerButton' })
      const mobileMenu = wrapper.findComponent({ name: 'MobileNavigationMenu' })
      
      expect(hamburgerButton.props('isOpen')).toBe(false)
      expect(mobileMenu.props('isOpen')).toBe(false)
      
      await hamburgerButton.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(hamburgerButton.props('isOpen')).toBe(true)
      expect(mobileMenu.props('isOpen')).toBe(true)
      
      const closeButton = mobileMenu.find('button[aria-label="Close menu"]')
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(hamburgerButton.props('isOpen')).toBe(false)
      expect(mobileMenu.props('isOpen')).toBe(false)
    })
  })
})

