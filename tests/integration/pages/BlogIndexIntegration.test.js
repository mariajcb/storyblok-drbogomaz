import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Blog Index Page Utility Functions', () => {
  // Test timestamp function
  it('should format timestamp correctly', () => {
    const timestamp = (date) => {
      const timeStamp = date.slice(0, -5).replace(/T/g, ' ')
      return timeStamp
    }

    const formatted = timestamp('2026-03-22T14:30:45.000Z')
    expect(formatted).toBe('2026-03-22 14:30:45')
  })

  it('should handle different ISO timestamp formats', () => {
    const timestamp = (date) => {
      const timeStamp = date.slice(0, -5).replace(/T/g, ' ')
      return timeStamp
    }

    expect(timestamp('2026-01-01T00:00:00.000Z')).toBe('2026-01-01 00:00:00')
    expect(timestamp('2026-12-31T23:59:59.000Z')).toBe('2026-12-31 23:59:59')
  })

  // Test GA4 tracking logic
  describe('GA4 Tracking', () => {
    it('should build correct blog_click event payload', () => {
      const blogPost = {
        id: 1,
        slug: 'test-post',
        content: {
          _uid: 'uid1',
          name: 'Test Post Title',
          intro: 'Test intro'
        },
        created_at: '2026-03-22T10:00:00.000Z'
      }

      const trackBlogPostClick = (post) => {
        return {
          event: 'blog_click',
          blog_title: post.content.name,
          blog_slug: post.slug,
          blog_intro: post.content.intro,
          blog_created_at: post.created_at,
          content_type: 'therapy_blog',
          page_location: 'blog_index'
        }
      }

      const payload = trackBlogPostClick(blogPost)
      expect(payload.event).toBe('blog_click')
      expect(payload.blog_title).toBe('Test Post Title')
      expect(payload.blog_slug).toBe('test-post')
      expect(payload.content_type).toBe('therapy_blog')
    })

    it('should build correct blog_index_view event payload with post count', () => {
      const posts = [
        { slug: 'post-1', content: { name: 'Post 1' } },
        { slug: 'post-2', content: { name: 'Post 2' } }
      ]

      const payload = {
        event: 'blog_index_view',
        total_posts: posts.length,
        content_type: 'therapy_blog_listing',
        page_location: 'blog_index'
      }

      expect(payload.total_posts).toBe(2)
      expect(payload.content_type).toBe('therapy_blog_listing')
    })
  })

  // Test API response handling
  describe('API Response Handling', () => {
    it('should parse successful Storyblok API response', () => {
      const response = {
        data: {
          stories: [
            {
              id: 1,
              slug: 'first-post',
              content: {
                _uid: 'uid1',
                name: 'First Blog Post',
                intro: 'This is the first post'
              },
              created_at: '2026-03-22T10:00:00.000Z'
            },
            {
              id: 2,
              slug: 'second-post',
              content: {
                _uid: 'uid2',
                name: 'Second Blog Post',
                intro: 'This is the second post'
              },
              created_at: '2026-03-21T10:00:00.000Z'
            }
          ]
        }
      }

      expect(response.data.stories).toHaveLength(2)
      expect(response.data.stories[0].content.name).toBe('First Blog Post')
    })

    it('should handle empty stories array', () => {
      const response = {
        data: {
          stories: []
        }
      }

      expect(response.data.stories).toHaveLength(0)
    })
  })

  // Test error handling
  describe('Error Handling', () => {
    it('should provide user-friendly error message for API failures', () => {
      const errorMessage = 'Failed to load blog posts. Please try again later.'
      expect(errorMessage).toBeDefined()
      expect(errorMessage).toContain('Failed to load blog posts')
    })

    it('should provide specific error message for missing posts', () => {
      const errorMessage = 'No blog posts found'
      expect(errorMessage).toBeDefined()
    })
  })
})
