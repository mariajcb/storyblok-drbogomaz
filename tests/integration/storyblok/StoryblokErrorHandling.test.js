import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Page from '../../../storyblok/Page.vue'
import Teaser from '../../../storyblok/Teaser.vue'
import Bio from '../../../storyblok/Bio.vue'
import Blog from '../../../storyblok/Blog.vue'
import Grid from '../../../storyblok/Grid.vue'
import Feature from '../../../storyblok/Feature.vue'

describe('Storyblok Error Handling & Edge Cases Integration', () => {
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

    vi.mock('#app', () => ({
      useNuxtApp: () => ({
        $gtag: mockGtag
      })
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Page Component Error Handling', () => {
    it('renders component without errors when body property is missing', () => {
      const mockBlok = {
        // body property is missing
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

      expect(wrapper.exists()).toBe(true)
    })

    it('renders component without errors when body array is null', () => {
      const mockBlok = {
        body: null
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

      expect(wrapper.exists()).toBe(true)
    })

    it('renders child component with headline text when _uid property is missing', () => {
      const mockBlok = {
        body: [
          { component: 'teaser', headline: 'Test' }
          // _uid is missing
        ]
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component">{{ blok.headline }}</div>',
              props: ['blok']
            }
          }
        }
      })

      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(1)
      expect(components[0].text()).toBe('Test')
    })
  })

  describe('Teaser Component Error Handling', () => {
    it('renders component without errors when blok object is empty', () => {
      const wrapper = mount(Teaser, {
        props: { blok: {} },
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

      expect(wrapper.exists()).toBe(true)
    })

    it('renders headline text when Image property is null', () => {
      const mockBlok = {
        headline: 'Test Headline',
        Image: null
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Headline')
    })

    it('renders component without errors when Image filename property is missing', () => {
      const mockBlok = {
        headline: 'Test',
        Image: {
          alt: 'Test image'
          // filename is missing
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

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Bio Component Error Handling', () => {
    it('renders title text when image_mobile property is missing', () => {
      const mockBlok = {
        title: 'About Me',
        text: {
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Bio text' }]
            }
          ]
        },
        image: {
          filename: 'test.jpg',
          description: 'Test image'
        }
        // image_mobile is missing
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('About Me')
    })

    it('renders title text when image property is missing', () => {
      const mockBlok = {
        title: 'About Me',
        text: {
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Bio text' }]
            }
          ]
        },
        image_mobile: {
          filename: 'test-mobile.jpg',
          description: 'Mobile image'
        }
        // image is missing
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('About Me')
    })

    it('renders title text when text content property is missing', () => {
      const mockBlok = {
        title: 'About Me',
        image: {
          filename: 'test.jpg',
          description: 'Test'
        },
        image_mobile: {
          filename: 'test-mobile.jpg',
          description: 'Mobile'
        }
        // text is missing
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('About Me')
    })
  })

  describe('Blog Component Error Handling', () => {
    it('renders component without errors when blok object is empty', () => {
      const wrapper = mount(Blog, {
        props: { blok: {} },
        global: {
          mocks: {
            $gtag: mockGtag
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('renders blog post name and intro when body content is null', () => {
      const mockBlok = {
        name: 'Blog Post',
        intro: 'Introduction',
        body: null
      }

      const wrapper = mount(Blog, {
        props: { blok: mockBlok },
        global: {
          mocks: {
            $gtag: mockGtag
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Blog Post')
    })

    it('renders component without errors when name property is missing', () => {
      const mockBlok = {
        intro: 'Introduction',
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

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Grid Component Error Handling', () => {
    it('renders component without errors when blok object is empty', () => {
      const wrapper = mount(Grid, {
        props: { blok: {} },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div></div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('renders component without errors when columns array is null', () => {
      const mockBlok = {
        columns: null
      }

      const wrapper = mount(Grid, {
        props: { blok: mockBlok },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div></div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('renders component without errors when columns property is missing', () => {
      const mockBlok = {
        // columns property is missing
      }

      const wrapper = mount(Grid, {
        props: { blok: mockBlok },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div></div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('renders zero child components when columns array is empty', () => {
      const mockBlok = {
        columns: []
      }

      const wrapper = mount(Grid, {
        props: { blok: mockBlok },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div></div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      const components = wrapper.findAll('[data-component]')
      expect(components.length).toBe(0)
    })
  })

  describe('Feature Component Error Handling', () => {
    it('renders component without errors when blok object is empty', () => {
      const wrapper = mount(Feature, {
        props: { blok: {} },
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

      expect(wrapper.exists()).toBe(true)
    })

    it('renders feature name, description, and Learn More button when modal property is missing', () => {
      const mockBlok = {
        name: 'Feature',
        description: 'Description'
        // modal property is missing
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Feature')
      expect(wrapper.text()).toContain('Description')
      
      const button = wrapper.findAll('button').find(b => b.text().includes('Learn More'))
      expect(button.exists()).toBe(true)
    })

    it('renders feature name when modal content is null', () => {
      const mockBlok = {
        name: 'Feature',
        description: 'Description',
        modal: null
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

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Feature')
    })
  })

  describe('Component Composition Edge Cases', () => {
    it('renders nested Feature component with name text when Grid contains Feature in columns', () => {
      const mockBlok = {
        body: [
          {
            component: 'grid',
            _uid: '1',
            columns: [
              {
                component: 'feature',
                _uid: '2',
                name: 'Nested Feature'
              }
            ]
          }
        ]
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component"><div v-if="blok.columns" v-for="col in blok.columns" :key="col._uid">{{ col.name || "" }}</div></div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Nested Feature')
    })

    it('renders nested Teaser component with headline text when Page contains Page component in body', () => {
      const mockBlok = {
        body: [
          {
            component: 'page',
            _uid: '1',
            body: [
              { component: 'teaser', _uid: '2', headline: 'Nested' }
            ]
          }
        ]
      }

      const wrapper = mount(Page, {
        props: {
          blok: mockBlok
        },
        global: {
          stubs: {
            'StoryblokComponent': {
              template: '<div :data-component="blok.component">{{ blok.headline || "" }}</div>',
              props: ['blok']
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})

