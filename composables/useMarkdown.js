import { marked } from 'marked'

export const useMarkdown = () => {
  const renderMarkdown = (content) => {
    if (!content) return ''
    // Ensure consistent line endings and remove any extra whitespace
    const normalizedContent = content.trim().replace(/\r\n/g, '\n')
    return marked(normalizedContent, {
      // Add options to ensure consistent rendering
      gfm: true,
      breaks: true,
      sanitize: false
    })
  }

  return {
    renderMarkdown
  }
} 