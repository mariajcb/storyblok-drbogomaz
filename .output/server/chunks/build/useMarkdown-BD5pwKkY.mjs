import { marked } from 'marked';

const useMarkdown = () => {
  const renderMarkdown = (content) => {
    if (!content) return "";
    const normalizedContent = content.trim().replace(/\r\n/g, "\n");
    return marked(normalizedContent, {
      // Add options to ensure consistent rendering
      gfm: true,
      breaks: true,
      sanitize: false
    });
  };
  return {
    renderMarkdown
  };
};

export { useMarkdown as u };
//# sourceMappingURL=useMarkdown-BD5pwKkY.mjs.map
