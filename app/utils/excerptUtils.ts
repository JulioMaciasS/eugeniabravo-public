/**
 * Generate an excerpt from HTML content
 * @param content - HTML content string
 * @param maxLength - Maximum length of excerpt (default: 160)
 * @returns Clean text excerpt
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return '';

  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decodedContent = textContent
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Clean up extra whitespace
  const cleanContent = decodedContent.replace(/\s+/g, ' ').trim();
  
  // Truncate to maxLength
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Find the last complete word within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    // If we can find a good word boundary, use it
    return truncated.substring(0, lastSpaceIndex) + '...';
  } else {
    // Otherwise, just truncate at the limit
    return truncated + '...';
  }
}
