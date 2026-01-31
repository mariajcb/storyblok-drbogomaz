import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Teaser from '../../../storyblok/Teaser.vue'
import Bio from '../../../storyblok/Bio.vue'
import Blog from '../../../storyblok/Blog.vue'

describe('Storyblok Content Fallback Integration', () => {
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

  describe('Teaser Component Fallbacks', () => {
    it('uses default values when headline is missing', () => {
      const mockBlok = {
        Image: { filename: 'test.jpg' }
      }

      const wrapper = mount(Teaser, {
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

      expect(wrapper.text()).toContain('Default Title')
    })

    it('uses default values when subtitle is missing', () => {
      const mockBlok = {
        headline: 'Test',
        Image: { filename: 'test.jpg' }
      }

      const wrapper = mount(Teaser, {
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

      expect(wrapper.text()).toContain('Default Subtitle')
    })

    it('handles missing image alt text', () => {
      const mockBlok = {
        headline: 'Test',
        Image: {
          filename: 'test.jpg'
        }
      }

      const wrapper = mount(Teaser, {
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

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('alt')).toBe('')
    })
  })

  describe('Bio Component Fallbacks', () => {
    it('handles missing text content gracefully', () => {
      const mockBlok = {
        title: 'About Me',
        image: { filename: 'test.jpg', description: 'Test' }
      }

      const wrapper = mount(Bio, {
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

      expect(wrapper.text()).toContain('About Me')
    })

    it('handles missing second text block gracefully', () => {
      const mockBlok = {
        title: 'About Me',
        text: 'First text',
        image: { filename: 'test.jpg', description: 'Test' }
      }

      const wrapper = mount(Bio, {
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

      expect(wrapper.text()).toContain('About Me')
      expect(wrapper.text()).toContain('First text')
    })
  })

  describe('Blog Component Fallbacks', () => {
    it('handles missing intro gracefully', () => {
      const mockBlok = {
        name: 'Blog Post',
        body: 'Content'
      }

      const wrapper = mount(Blog, {
        props: { blok: mockBlok },
        global: {
          mocks: {
            $gtag: mockGtag
          }
        }
      })

      expect(wrapper.text()).toContain('Blog Post')
      expect(wrapper.text()).toContain('Content')
    })

    it('handles empty body content gracefully', () => {
      const mockBlok = {
        name: 'Blog Post',
        intro: 'Introduction',
        body: ''
      }

      const wrapper = mount(Blog, {
        props: { blok: mockBlok },
        global: {
          mocks: {
            $gtag: mockGtag
          }
        }
      })

      expect(wrapper.text()).toContain('Blog Post')
      expect(wrapper.text()).toContain('Introduction')
    })
  })
})

