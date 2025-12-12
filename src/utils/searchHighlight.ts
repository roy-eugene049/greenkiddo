/**
 * Search Highlight Utilities
 * 
 * Functions for highlighting search terms in text
 */

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string,
  query: string,
  maxLength: number = 200
): string {
  if (!query || !text) return text;
  
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 2); // Only highlight terms longer than 2 characters
  
  if (terms.length === 0) return text;
  
  // Find all matches with their positions
  const matches: Array<{ start: number; end: number; term: string }> = [];
  const lowerText = text.toLowerCase();
  
  terms.forEach(term => {
    let index = 0;
    while ((index = lowerText.indexOf(term, index)) !== -1) {
      matches.push({
        start: index,
        end: index + term.length,
        term: text.substring(index, index + term.length),
      });
      index += term.length;
    }
  });
  
  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);
  
  // Merge overlapping matches
  const merged: Array<{ start: number; end: number; term: string }> = [];
  matches.forEach(match => {
    const last = merged[merged.length - 1];
    if (last && match.start <= last.end) {
      // Merge with previous
      last.end = Math.max(last.end, match.end);
      last.term = text.substring(last.start, last.end);
    } else {
      merged.push({ ...match });
    }
  });
  
  // Build highlighted text
  let highlighted = '';
  let lastIndex = 0;
  
  merged.forEach(match => {
    // Add text before match
    highlighted += escapeHtml(text.substring(lastIndex, match.start));
    // Add highlighted match
    highlighted += `<mark class="bg-green-ecco/30 text-green-ecco font-semibold">${escapeHtml(match.term)}</mark>`;
    lastIndex = match.end;
  });
  
  // Add remaining text
  highlighted += escapeHtml(text.substring(lastIndex));
  
  // Truncate if too long
  if (highlighted.length > maxLength) {
    // Find a good truncation point (after a highlighted term if possible)
    const truncated = highlighted.substring(0, maxLength);
    const lastMark = truncated.lastIndexOf('<mark');
    if (lastMark > maxLength * 0.7) {
      // Find the closing tag
      const closingTag = truncated.indexOf('</mark>', lastMark);
      if (closingTag !== -1) {
        return truncated.substring(0, closingTag + 7) + '...';
      }
    }
    return truncated + '...';
  }
  
  return highlighted;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Extract snippet from text with highlighted terms
 */
export function getSearchSnippet(
  text: string,
  query: string,
  snippetLength: number = 150
): string {
  if (!text || !query) return text.substring(0, snippetLength);
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(term => term.length > 2);
  
  if (terms.length === 0) {
    return text.substring(0, snippetLength) + (text.length > snippetLength ? '...' : '');
  }
  
  // Find first match
  let bestMatch = -1;
  let bestTerm = '';
  
  for (const term of terms) {
    const index = lowerText.indexOf(term);
    if (index !== -1 && (bestMatch === -1 || index < bestMatch)) {
      bestMatch = index;
      bestTerm = term;
    }
  }
  
  if (bestMatch === -1) {
    return text.substring(0, snippetLength) + (text.length > snippetLength ? '...' : '');
  }
  
  // Extract snippet around the match
  const start = Math.max(0, bestMatch - snippetLength / 2);
  const end = Math.min(text.length, bestMatch + bestTerm.length + snippetLength / 2);
  
  let snippet = text.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  // Highlight the terms
  return highlightSearchTerms(snippet, query, snippetLength * 2);
}

/**
 * Highlight search terms in title
 */
export function highlightTitle(title: string, query: string): string {
  return highlightSearchTerms(title, query, title.length);
}

