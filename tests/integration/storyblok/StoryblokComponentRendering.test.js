import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Page from '../../../storyblok/Page.vue'
import Teaser from '../../../storyblok/Teaser.vue'
import Bio from '../../../storyblok/Bio.vue'
import Blog from '../../../storyblok/Blog.vue'

describe('Storyblok Component Rendering Integration', () => {
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

  describe('Page Component Composition', () => {
    it('renders child Storyblok components dynamically', () => {
      const mockBlok = {
        body: [
          { component: 'teaser', _uid: '1', headline: 'Test Headline' },
          { component: 'bio', _uid: '2', title: 'Test Bio' }
        ]
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component">{{ blok.headline || blok.title }}</div>',
              props: ['blok']
            }
          }
        }
      })

      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(2)
      expect(components[0].text()).toBe('Test Headline')
      expect(components[1].text()).toBe('Test Bio')
    })
  })

  describe('Teaser Component', () => {
    it('renders content from Storyblok data', () => {
      const mockBlok = {
        headline: 'Welcome',
        subtitle: 'Subtitle',
        body: 'Body text',
        Image: {
          filename: 'https://example.com/image.jpg',
          alt: 'Hero image'
        }
      }

      const wrapper = mount(Teaser, {
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

      expect(wrapper.text()).toContain('Welcome')
      expect(wrapper.text()).toContain('Subtitle')
      expect(wrapper.text()).toContain('Body text')
    })

    it('renders contact link pointing to /contact route', () => {
      const mockBlok = {
        headline: 'Test',
        Image: { filename: 'test.jpg' }
      }

      const wrapper = mount(Teaser, {
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

      const contactLink = wrapper.find('a[href="/contact"]')
      expect(contactLink.exists()).toBe(true)
      expect(contactLink.text()).toContain('Contact')
    })

    it('handles missing image data gracefully', () => {
      const mockBlok = {
        headline: 'Test',
        subtitle: 'Subtitle',
        body: 'Body'
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

      expect(wrapper.text()).toContain('Test')
      expect(wrapper.find('img').exists()).toBe(true)
    })
  })

  describe('Bio Component', () => {
    it('renders markdown content from Storyblok data', () => {
      const mockBlok = {
        title: 'About Me',
        text: 'This is **bold** text',
        text2: 'More content',
        image: { filename: 'test.jpg', description: 'Bio image' },
        call_to_action_btn: 'Read Blog'
      }

      const wrapper = mount(Bio, {
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

      expect(wrapper.text()).toContain('About Me')
      expect(wrapper.html()).toContain('bold')
    })

    it('renders blog link pointing to /blog route', () => {
      const mockBlok = {
        title: 'Test',
        text: 'Content',
        call_to_action_btn: 'Read Blog'
      }

      const wrapper = mount(Bio, {
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

      const blogLink = wrapper.find('a[href="/blog"]')
      expect(blogLink.exists()).toBe(true)
      expect(blogLink.text()).toContain('Read Blog')
    })
  })

  describe('Blog Component', () => {
    it('renders markdown content from Storyblok data', () => {
      const mockBlok = {
        name: 'Blog Post Title',
        intro: 'Introduction',
        body: '# Heading\n\nParagraph text'
      }

      const wrapper = mount(Blog, {
        props: { blok: mockBlok },
        global: {
          mocks: {
            $gtag: mockGtag
          }
        }
      })

      expect(wrapper.text()).toContain('Blog Post Title')
      expect(wrapper.text()).toContain('Introduction')
      expect(wrapper.html()).toContain('Heading')
    })

    it('handles missing body content gracefully', () => {
      const mockBlok = {
        name: 'Blog Post',
        intro: 'Intro'
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
      expect(wrapper.text()).toContain('Intro')
    })
  })
})

