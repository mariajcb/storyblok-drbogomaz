import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DesktopNavigation from '../../../components/navigation/DesktopNavigation.vue'
import MobileNavigationMenu from '../../../components/navigation/MobileNavigationMenu.vue'
import NavigationHamburgerButton from '../../../components/navigation/NavigationHamburgerButton.vue'

describe('Navigation Flow E2E', () => {
  let wrapper

  beforeEach(() => {
    const NavigationFlow = {
      template: `
        <div>
          <DesktopNavigation />
          <NavigationHamburgerButton 
            :isOpen="mobileMenuOpen" 
            @toggle="toggleMobileMenu" 
          />
          <MobileNavigationMenu 
            :isOpen="mobileMenuOpen" 
            @close="closeMobileMenu" 
          />
        </div>
      `,
      components: {
        DesktopNavigation,
        NavigationHamburgerButton,
        MobileNavigationMenu
      },
      data() {
        return {
          mobileMenuOpen: false
        }
      },
      methods: {
        toggleMobileMenu() {
          this.mobileMenuOpen = !this.mobileMenuOpen
        },
        closeMobileMenu() {
          this.mobileMenuOpen = false
        }
      }
    }

    wrapper = mount(NavigationFlow, {
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

  it('should allow users to navigate between pages via desktop navigation', () => {
    const desktopNav = wrapper.findComponent(DesktopNavigation)
    const links = desktopNav.findAll('a')
    
    // All main pages
    expect(links[0].attributes('href')).toBe('/')
    expect(links[1].attributes('href')).toBe('/blog')
    expect(links[2].attributes('href')).toBe('/contact')
  })

  it('should allow users to navigate between pages via mobile navigation', async () => {
    const hamburgerButton = wrapper.findComponent(NavigationHamburgerButton)
    const mobileMenu = wrapper.findComponent(MobileNavigationMenu)
    
    await hamburgerButton.find('button').trigger('click')
    
    const links = mobileMenu.findAll('a')

    expect(links[0].attributes('href')).toBe('/')
    expect(links[1].attributes('href')).toBe('/blog')
    expect(links[2].attributes('href')).toBe('/contact')
  })

  it('should provide consistent navigation experience across desktop and mobile', () => {
    const desktopNav = wrapper.findComponent(DesktopNavigation)
    const mobileMenu = wrapper.findComponent(MobileNavigationMenu)
    
    const desktopLinks = desktopNav.findAll('a')
    const mobileLinks = mobileMenu.findAll('a')
    
  // Both should have the same navigation options
    expect(desktopLinks).toHaveLength(3)
    expect(mobileLinks).toHaveLength(3)
    
    // Both should link to the same pages
    for (let i = 0; i < 3; i++) {
      expect(desktopLinks[i].attributes('href')).toBe(mobileLinks[i].attributes('href'))
    }
  })

  it('should allow users to open and close mobile navigation', async () => {
    const hamburgerButton = wrapper.findComponent(NavigationHamburgerButton)
    const mobileMenu = wrapper.findComponent(MobileNavigationMenu)
    
    // Initially closed
    expect(mobileMenu.props('isOpen')).toBe(false)
    
    await hamburgerButton.find('button').trigger('click')
    expect(mobileMenu.props('isOpen')).toBe(true)
    
    await mobileMenu.find('button[aria-label="Close menu"]').trigger('click')
    expect(mobileMenu.props('isOpen')).toBe(false)
  })

  it('should automatically close mobile menu when user navigates', async () => {
    const hamburgerButton = wrapper.findComponent(NavigationHamburgerButton)
    const mobileMenu = wrapper.findComponent(MobileNavigationMenu)
    
    await hamburgerButton.find('button').trigger('click')
    expect(mobileMenu.props('isOpen')).toBe(true)
    
    const links = mobileMenu.findAll('a')
    await links[0].trigger('click')
    
    expect(mobileMenu.props('isOpen')).toBe(false)
  })

  it('should provide accessible navigation for screen readers', () => {
    const hamburgerButton = wrapper.findComponent(NavigationHamburgerButton)
    const mobileMenu = wrapper.findComponent(MobileNavigationMenu)
    
    const button = hamburgerButton.find('button')
    expect(button.attributes('aria-expanded')).toBeDefined()
    expect(button.attributes('aria-label')).toBe('Toggle navigation menu')
    
    const menu = mobileMenu.find('div[role="dialog"]')
    expect(menu.attributes('role')).toBe('dialog')
    expect(menu.attributes('aria-modal')).toBe('true')
  })

  it('should hide desktop navigation on mobile and hamburger button on desktop', () => {
    const desktopNav = wrapper.findComponent(DesktopNavigation)
    const hamburgerButton = wrapper.findComponent(NavigationHamburgerButton)
    
    const desktopNavElement = desktopNav.find('nav')
    expect(desktopNavElement.classes()).toContain('hidden')
    expect(desktopNavElement.classes()).toContain('lg:block')
    
    const button = hamburgerButton.find('button')
    expect(button.classes()).toContain('lg:hidden')
  })
})
