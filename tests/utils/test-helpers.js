import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { vi } from 'vitest'

/**
 * Create a test app with global plugins and components
 */
export function createTestApp(component, options = {}) {
  const app = createApp(component)
  
  // Add global plugins if needed
  if (options.plugins) {
    options.plugins.forEach(plugin => app.use(plugin))
  }
  
  return app
}

/**
 * Mount a component with common test options
 */
export function mountComponent(component, options = {}) {
  const defaultOptions = {
    global: {
      stubs: {
        'NuxtLink': 'a',
        'NuxtPage': 'div',
        'NuxtLayout': 'div',
        'ClientOnly': 'div'
      },
      mocks: {
        $t: (key) => key,
        $route: {
          path: '/',
          name: 'index',
          params: {},
          query: {}
        },
        $router: {
          push: vi.fn(),
          replace: vi.fn(),
          go: vi.fn()
        }
      }
    }
  }
  
  return mount(component, {
    ...defaultOptions,
    ...options
  })
}

/**
 * Create mock Storyblok data for testing
 */
export function createMockStoryblokData(type = 'page', overrides = {}) {
  const baseData = {
    content: {
      body: [],
      title: 'Test Title',
      description: 'Test Description'
    },
    name: 'Test Page',
    full_slug: 'test-page',
    slug: 'test-page',
    id: 123,
    uuid: 'test-uuid-123',
    created_at: '2024-01-01T00:00:00Z',
    published_at: '2024-01-01T00:00:00Z',
    first_published_at: '2024-01-01T00:00:00Z',
    is_startpage: false,
    parent_id: null,
    group_id: null,
    alternates: [],
    full_slug: 'test-page',
    default_full_slug: null,
    sort_by_date: null,
    tag_list: [],
    meta_robots: null,
    priority: 0.5,
    schema_org: null,
    target_group: null,
    is_folder: false,
    folder_slug: null,
    position: 0,
    translated_slugs: [],
    publish_at: null,
    unpublish_at: null,
    ...overrides
  }
  
  return baseData
}

/**
 * Create mock blog post data
 */
export function createMockBlogPost(overrides = {}) {
  return createMockStoryblokData('blog', {
    content: {
      title: 'Test Blog Post',
      excerpt: 'This is a test blog post excerpt',
      content: 'This is the full blog post content',
      author: 'Test Author',
      published_date: '2024-01-01',
      ...overrides.content
    },
    name: 'Test Blog Post',
    slug: 'test-blog-post',
    ...overrides
  })
}

/**
 * Create mock contact form data
 */
export function createMockContactFormData(overrides = {}) {
  return {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message',
    ...overrides
  }
}

/**
 * Wait for next tick and flush promises
 */
export async function waitForNextTick() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Mock fetch for API testing
 */
export function mockFetch(response, status = 200) {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    })
  )
}

/**
 * Reset all mocks
 */
export function resetMocks() {
  vi.clearAllMocks()
  vi.clearAllTimers()
}
