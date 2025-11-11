import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Page from '../../../storyblok/Page.vue'
import Grid from '../../../storyblok/Grid.vue'
import Feature from '../../../storyblok/Feature.vue'

describe('Storyblok Dynamic Composition Integration', () => {
  let mockRouter
  let mockGtag

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
    global.window = {
      ...global.window,
      gtag: mockGtag,
      location: { pathname: '/' }
    }
    global.process = { client: true }

    vi.mock('~/composables/useMarkdown', () => ({
      useMarkdown: () => ({
        renderMarkdown: (content) => {
          if (!content) return ''
          return `<p>${content}</p>`
        }
      })
    }))
  })

  describe('Page Component', () => {
    it('renders multiple child components in sequence', () => {
      const mockBlok = {
        body: [
          { component: 'teaser', _uid: '1', headline: 'First' },
          { component: 'bio', _uid: '2', title: 'Second' },
          { component: 'blog', _uid: '3', name: 'Third' }
        ]
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component">{{ blok.headline || blok.title || blok.name }}</div>',
              props: ['blok']
            }
          }
        }
      })

      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(3)
      expect(components[0].text()).toBe('First')
      expect(components[1].text()).toBe('Second')
      expect(components[2].text()).toBe('Third')
    })

    it('handles empty body array', () => {
      const mockBlok = {
        body: []
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div></div>',
              props: ['blok']
            }
          }
        }
      })

      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(0)
    })
  })

  describe('Grid Component', () => {
    it('renders child components in grid layout', () => {
      const mockBlok = {
        columns: [
          { component: 'feature', _uid: '1', name: 'Feature 1' },
          { component: 'feature', _uid: '2', name: 'Feature 2' },
          { component: 'feature', _uid: '3', name: 'Feature 3' }
        ]
      }

      const wrapper = mount(Grid, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component">{{ blok.name }}</div>',
              props: ['blok']
            }
          }
        }
      })

      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(3)
      expect(components[0].text()).toBe('Feature 1')
      expect(components[1].text()).toBe('Feature 2')
      expect(components[2].text()).toBe('Feature 3')
    })
  })

  describe('Feature Component Modal', () => {
    it('opens modal when Learn More button is clicked', async () => {
      const mockBlok = {
        name: 'Feature Name',
        description: 'Feature description',
        modal: 'Modal **content**'
      }

      const wrapper = mount(Feature, {
        props: { blok: mockBlok },
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const button = wrapper.find('button')
      expect(button.text()).toContain('Learn More')

      await button.trigger('click')
      await wrapper.vm.$nextTick()

      const modal = wrapper.find('[role="dialog"]')
      expect(modal.exists()).toBe(true)
      expect(modal.attributes('aria-modal')).toBe('true')
    })

    it('closes modal when close button is clicked', async () => {
      const mockBlok = {
        name: 'Feature Name',
        description: 'Description',
        modal: 'Content'
      }

      const wrapper = mount(Feature, {
        props: { blok: mockBlok },
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

      const learnMoreButton = wrapper.find('button')
      await learnMoreButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

      const closeButton = wrapper.find('button[aria-label="Close"]')
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    it('renders markdown content in modal', async () => {
      const mockBlok = {
        name: 'Feature',
        description: 'Description',
        modal: 'Modal **content**'
      }

      const wrapper = mount(Feature, {
        props: { blok: mockBlok },
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

      const button = wrapper.find('button')
      await button.trigger('click')
      await wrapper.vm.$nextTick()

      const modal = wrapper.find('[role="dialog"]')
      expect(modal.html()).toContain('content')
    })

    it('renders contact link pointing to /en/contact route in modal footer', async () => {
      const mockBlok = {
        name: 'Feature',
        description: 'Description',
        modal: 'Content'
      }

      const wrapper = mount(Feature, {
        props: { blok: mockBlok },
        global: {
          stubs: {
            'NuxtLink': {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          },
          mocks: {
            $router: mockRouter,
            $route: mockRouter.currentRoute.value
          }
        }
      })

      const button = wrapper.find('button')
      await button.trigger('click')
      await wrapper.vm.$nextTick()

      const contactLink = wrapper.find('a[href="/en/contact"]')
      expect(contactLink.exists()).toBe(true)
      expect(contactLink.text()).toContain('Book Session')
    })
  })
})

