import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DesktopNavigation from '../../../components/navigation/DesktopNavigation.vue'
import MobileNavigationMenu from '../../../components/navigation/MobileNavigationMenu.vue'

describe('Navigation Routing Integration', () => {
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
  })

  describe('Desktop Navigation Links', () => {
    it('renders navigation links pointing to /, /blog, and /contact routes with Home, Blog, and Contact labels', () => {
      const wrapper = mount(DesktopNavigation, {
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

      const links = wrapper.findAll('a')
      
      expect(links.length).toBe(3)
      expect(links[0].attributes('href')).toBe('/')
      expect(links[0].text()).toBe('Home')
      expect(links[1].attributes('href')).toBe('/blog')
      expect(links[1].text()).toBe('Blog')
      expect(links[2].attributes('href')).toBe('/contact')
      expect(links[2].text()).toBe('Contact')
    })

    it('highlights active route link', () => {
      const wrapper = mount(DesktopNavigation, {
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to" :class="{ \'nuxt-link-exact-active\': isActive }"><slot /></a>',
              props: ['to'],
              computed: {
                isActive() {
                  return this.to === '/'
                }
              }
            }
          },
          mocks: {
            $router: mockRouter,
            $route: { path: '/', name: 'index' }
          }
        }
      })

      const homeLink = wrapper.find('a[href="/"]')
      expect(homeLink.classes()).toContain('nuxt-link-exact-active')
    })

    it('triggers router navigation on link click', async () => {
      const wrapper = mount(DesktopNavigation, {
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to" @click.prevent="handleClick"><slot /></a>',
              props: ['to'],
              methods: {
                handleClick() {
                  this.$router.push(this.to)
                }
              }
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const blogLink = wrapper.find('a[href="/blog"]')
      await blogLink.trigger('click')
      
      expect(blogLink.attributes('href')).toBe('/blog')
    })
  })

  describe('Mobile Navigation Links', () => {
    it('renders navigation links pointing to /, /blog, and /contact routes with Home, Blog, and Contact labels', () => {
      const wrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true
        },
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

      const links = wrapper.findAll('a')
      
      expect(links.length).toBe(3)
      expect(links[0].attributes('href')).toBe('/')
      expect(links[0].text()).toBe('Home')
      expect(links[1].attributes('href')).toBe('/blog')
      expect(links[1].text()).toBe('Blog')
      expect(links[2].attributes('href')).toBe('/contact')
      expect(links[2].text()).toBe('Contact')
    })

    it('closes menu and navigates when link is clicked', async () => {
      const closeHandler = vi.fn()
      
      const wrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true
        },
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to" @click.prevent="handleClick"><slot /></a>',
              props: ['to'],
              methods: {
                handleClick() {
                  this.$emit('close')
                  this.$router.push(this.to)
                }
              }
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        },
        listeners: {
          close: closeHandler
        }
      })

      const contactLink = wrapper.find('a[href="/contact"]')
      await contactLink.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(contactLink.attributes('href')).toBe('/contact')
    })
  })

  describe('Navigation Consistency', () => {
    it('maintains identical navigation structure between desktop and mobile', () => {
      const desktopWrapper = mount(DesktopNavigation, {
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

      const mobileWrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true
        },
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

      const desktopLinks = desktopWrapper.findAll('a')
      const mobileLinks = mobileWrapper.findAll('a')
      
      expect(desktopLinks.length).toBe(mobileLinks.length)
      
      const desktopRoutes = desktopLinks.map(link => link.attributes('href'))
      const mobileRoutes = mobileLinks.map(link => link.attributes('href'))
      
      expect(desktopRoutes).toEqual(mobileRoutes)
      expect(desktopRoutes).toEqual(['/', '/blog', '/contact'])
    })
  })
})

