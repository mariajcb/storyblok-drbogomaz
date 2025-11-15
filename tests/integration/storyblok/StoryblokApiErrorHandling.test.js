import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Test component that mimics the error/loading pattern from blog pages
const ErrorLoadingTestComponent = defineComponent({
  props: {
    error: String,
    loading: Boolean,
    story: Object
  },
  template: `
    <section class="section">
      <div v-if="error" class="container mx-auto px-4 py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
      </div>
      <div v-else-if="loading" class="container mx-auto px-4 py-8">
        <div class="text-center">Loading blog post...</div>
      </div>
      <Blog v-else-if="story" :blok="story.content" />
    </section>
  `
})

describe('Storyblok API Error Handling & Loading States Integration', () => {
  let mockRouter
  let mockGtag

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      currentRoute: {
        value: {
          path: '/blog/test-post',
          name: 'blog-slug',
          params: { slug: 'test-post' },
          query: {}
        }
      }
    }

    mockGtag = vi.fn()
    global.window = {
      ...global.window,
      gtag: mockGtag,
      location: { pathname: '/blog/test-post' }
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

    vi.mock('#app', () => ({
      useNuxtApp: () => ({
        $gtag: mockGtag
      })
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('API Error Scenarios', () => {
    it('renders error message with red styling when error prop is set to 404 message', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: 'Failed to load blog post: HTTP error! status: 404',
          loading: false,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toContain('Failed to load blog post')
      expect(errorDiv.text()).toContain('404')
      expect(errorDiv.classes()).toContain('border-red-400')
      expect(errorDiv.classes()).toContain('text-red-700')
    })

    it('renders error message when error prop is set to 500 message', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: 'Failed to load blog post: HTTP error! status: 500',
          loading: false,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toContain('Failed to load blog post')
      expect(errorDiv.text()).toContain('500')
    })

    it('renders error message when error prop is set to network failure message', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: 'Failed to load blog post: Network request failed',
          loading: false,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toContain('Failed to load blog post')
      expect(errorDiv.text()).toContain('Network request failed')
    })

    it('renders error message when error prop is set to missing story message', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: 'Blog post not found',
          loading: false,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('Blog post not found')
    })
  })

  describe('Loading State Scenarios', () => {
    it('renders loading message with centered text when loading prop is true', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: true,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const loadingDiv = wrapper.find('.text-center')
      expect(loadingDiv.exists()).toBe(true)
      expect(loadingDiv.text()).toBe('Loading blog post...')
      
      // Error should not be shown
      const errorDiv = wrapper.find('.bg-red-100')
      expect(errorDiv.exists()).toBe(false)
    })

    it('renders loading message in container with padding', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: true,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      const container = wrapper.find('.container')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('mx-auto')
      expect(container.classes()).toContain('px-4')
      expect(container.classes()).toContain('py-8')
    })

    it('transitions from loading to error state when error prop changes', async () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: true,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      // Initially shows loading
      expect(wrapper.find('.text-center').exists()).toBe(true)
      expect(wrapper.find('.bg-red-100').exists()).toBe(false)

      // Update to error state
      await wrapper.setProps({
        error: 'Failed to load blog post: HTTP error! status: 500',
        loading: false
      })

      // Now shows error, not loading
      expect(wrapper.find('.text-center').exists()).toBe(false)
      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
      expect(wrapper.find('.bg-red-100').text()).toContain('Failed to load blog post')
    })

    it('transitions from loading to content state when story prop is provided', async () => {
      const mockStory = {
        content: {
          name: 'Test Post',
          body: 'Content'
        }
      }

      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: true,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>',
              props: ['blok']
            }
          }
        }
      })

      // Initially shows loading
      expect(wrapper.find('.text-center').exists()).toBe(true)
      // Blog component should not be rendered while loading
      expect(wrapper.text()).not.toContain('Blog Content')

      // Update to success state
      await wrapper.setProps({
        loading: false,
        story: mockStory
      })

      // Now shows content, not loading
      expect(wrapper.find('.text-center').exists()).toBe(false)
      // Blog component should be rendered (check by looking for the stubbed content)
      expect(wrapper.text()).toContain('Blog Content')
    })
  })

  describe('State Priority Logic', () => {
    it('renders error message when both error and loading props are set, prioritizing error', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: 'Failed to load blog post',
          loading: true,
          story: null
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      // Error should be shown (v-if="error" comes first in template)
      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
      expect(wrapper.find('.text-center').exists()).toBe(false)
    })

    it('renders loading message when loading is true and no error', () => {
      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: true,
          story: { content: { name: 'Test' } }
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>'
            }
          }
        }
      })

      // Loading should be shown (v-else-if="loading" comes before content)
      expect(wrapper.find('.text-center').exists()).toBe(true)
      // Blog component should not be rendered while loading
      expect(wrapper.text()).not.toContain('Blog Content')
    })

    it('renders Blog component when story is provided and not loading and no error', () => {
      const mockStory = {
        content: {
          name: 'Test Post',
          body: 'Content'
        }
      }

      const wrapper = mount(ErrorLoadingTestComponent, {
        props: {
          error: null,
          loading: false,
          story: mockStory
        },
        global: {
          stubs: {
            'Blog': {
              template: '<div>Blog Content</div>',
              props: ['blok']
            }
          }
        }
      })

      // Content should be shown
      expect(wrapper.find('.bg-red-100').exists()).toBe(false)
      expect(wrapper.find('.text-center').exists()).toBe(false)
      // Blog component should be rendered (check by looking for the stubbed content)
      expect(wrapper.text()).toContain('Blog Content')
    })
  })
})

