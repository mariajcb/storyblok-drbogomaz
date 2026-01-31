import { describe, it, expect } from 'vitest'
import { useMarkdown } from '~/composables/useMarkdown'

describe('useMarkdown', () => {
  describe('Markdown Rendering', () => {
    it('converts bold markdown text to HTML strong tags', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = 'This is **bold** text'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<strong>bold</strong>')
      expect(result).toContain('This is')
    })

    it('converts markdown headers to HTML h1 and h2 tags', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '# Heading 1\n## Heading 2'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<h1>Heading 1</h1>')
      expect(result).toContain('<h2>Heading 2</h2>')
    })

    it('converts markdown links to HTML anchor tags with href attribute', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '[Link text](https://example.com)'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<a href="https://example.com">Link text</a>')
    })

    it('converts markdown list items to HTML ul and li tags', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '- Item 1\n- Item 2\n- Item 3'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<ul>')
      expect(result).toContain('<li>Item 1</li>')
      expect(result).toContain('<li>Item 2</li>')
      expect(result).toContain('<li>Item 3</li>')
    })

    it('converts markdown code blocks to HTML code tags', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '```javascript\nconst x = 1;\n```'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<code')
      expect(result).toContain('const x = 1')
    })

    it('converts single line breaks to HTML br tags when breaks option is enabled', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = 'Line 1\nLine 2'

      const result = renderMarkdown(markdown)

      expect(result).toContain('<br>')
    })
  })

  describe('Content Normalization', () => {
    it('preserves content when trimming leading and trailing whitespace', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '   \n  Content  \n  '

      const result = renderMarkdown(markdown)

      expect(result).toContain('Content')
      expect(result.trim()).toContain('Content')
    })

    it('returns valid HTML string when converting Windows line endings', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = 'Line 1\r\nLine 2\r\nLine 3'

      const result = renderMarkdown(markdown)

      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('returns valid HTML string when processing mixed line endings', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = 'Line 1\nLine 2\r\nLine 3'

      const result = renderMarkdown(markdown)

      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('Edge Cases', () => {
    it('returns empty string for null content', () => {
      const { renderMarkdown } = useMarkdown()

      expect(renderMarkdown(null)).toBe('')
    })

    it('returns empty string for undefined content', () => {
      const { renderMarkdown } = useMarkdown()

      expect(renderMarkdown(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      const { renderMarkdown } = useMarkdown()

      expect(renderMarkdown('')).toBe('')
    })

    it('returns empty string for whitespace-only content', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = '   \n  \n  '

      const result = renderMarkdown(markdown)

      expect(result).toBe('')
    })

    it('renders all markdown features together in single HTML output', () => {
      const { renderMarkdown } = useMarkdown()
      const markdown = `# Title

This is a **paragraph** with [a link](https://example.com).

- List item 1
- List item 2

\`\`\`javascript
const code = 'example';
\`\`\`
`

      const result = renderMarkdown(markdown)

      expect(result).toContain('<h1>Title</h1>')
      expect(result).toContain('<strong>paragraph</strong>')
      expect(result).toContain('<a href="https://example.com">a link</a>')
      expect(result).toContain('<ul>')
      expect(result).toContain('<code')
    })
  })
})

