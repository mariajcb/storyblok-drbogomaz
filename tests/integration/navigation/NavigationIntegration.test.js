import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MobileNavigationMenu from '../../../components/navigation/MobileNavigationMenu.vue'
import NavigationHamburgerButton from '../../../components/navigation/NavigationHamburgerButton.vue'

describe('Navigation Component Integration', () => {
  let hamburgerWrapper, menuWrapper

  beforeEach(() => {
    hamburgerWrapper = mount(NavigationHamburgerButton, {
      props: {
        isOpen: false
      }
    })

    menuWrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: false
      },
      global: {
        stubs: {
          'NuxtLink': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })
  })

  describe('State Synchronization', () => {
    it('synchronizes hamburger button state with mobile menu visibility', async () => {
      await hamburgerWrapper.setProps({ isOpen: true })
      await menuWrapper.setProps({ isOpen: true })
      
      expect(hamburgerWrapper.props('isOpen')).toBe(true)
      expect(menuWrapper.props('isOpen')).toBe(true)
      
      const menu = menuWrapper.find('div[role="dialog"]')
      expect(menu.classes()).not.toContain('hidden')
    })

    it('synchronizes component state when both are updated', async () => {
      await hamburgerWrapper.setProps({ isOpen: true })
      await menuWrapper.setProps({ isOpen: true })
      
      expect(hamburgerWrapper.props('isOpen')).toBe(true)
      expect(menuWrapper.props('isOpen')).toBe(true)
      
      await hamburgerWrapper.setProps({ isOpen: false })
      await menuWrapper.setProps({ isOpen: false })
      
      expect(hamburgerWrapper.props('isOpen')).toBe(false)
      expect(menuWrapper.props('isOpen')).toBe(false)
    })
  })

  describe('Event Handling', () => {
    it('emits close event when mobile menu close button is clicked', async () => {
      await menuWrapper.setProps({ isOpen: true })
      
      await menuWrapper.find('button[aria-label="Close menu"]').trigger('click')
      
      expect(menuWrapper.emitted('close')).toBeTruthy()
    })

    it('emits toggle event when hamburger button is clicked', async () => {
      const button = hamburgerWrapper.find('button')
      
      await button.trigger('click')
      
      expect(hamburgerWrapper.emitted('toggle')).toBeTruthy()
    })
  })

  describe('Navigation Links', () => {
    it('renders all navigation links with correct routes', () => {
      const links = menuWrapper.findAll('a')
      
      expect(links[0].attributes('href')).toBe('/')
      expect(links[1].attributes('href')).toBe('/blog')
      expect(links[2].attributes('href')).toBe('/contact')
    })
  })

  describe('Responsive Behavior', () => {
    it('applies mobile-only visibility classes to hamburger button', () => {
      const button = hamburgerWrapper.find('button')
      
      expect(button.classes()).toContain('lg:hidden')
    })
  })
})
