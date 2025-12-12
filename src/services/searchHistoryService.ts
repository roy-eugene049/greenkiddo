/**
 * Search History Service
 * 
 * Manages user search history and saved searches
 */

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters?: {
    type?: string[];
    category?: string[];
    difficulty?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  };
  timestamp: string;
  resultCount?: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters?: {
    type?: string[];
    category?: string[];
    difficulty?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  };
  createdAt: string;
  lastUsed?: string;
}

const HISTORY_KEY_PREFIX = 'greenkiddo_search_history_';
const SAVED_SEARCHES_KEY_PREFIX = 'greenkiddo_saved_searches_';
const MAX_HISTORY_ITEMS = 50;

/**
 * Get search history for a user
 */
export function getSearchHistory(userId: string): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  const history: SearchHistoryItem[] = JSON.parse(stored);
  return history.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Add search to history
 */
export function addToSearchHistory(
  userId: string,
  query: string,
  filters?: SearchHistoryItem['filters'],
  resultCount?: number
): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  const existing = getSearchHistory(userId);
  
  // Remove duplicate if exists
  const filtered = existing.filter(
    item => item.query.toLowerCase() !== query.toLowerCase() ||
            JSON.stringify(item.filters) !== JSON.stringify(filters)
  );
  
  const newItem: SearchHistoryItem = {
    id: `history-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    query: query.trim(),
    filters,
    timestamp: new Date().toISOString(),
    resultCount,
  };
  
  // Add to beginning and limit size
  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(key, JSON.stringify(updated));
}

/**
 * Clear search history
 */
export function clearSearchHistory(userId: string): void {
  if (typeof window === 'undefined') return;
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  localStorage.removeItem(key);
}

/**
 * Remove item from search history
 */
export function removeFromSearchHistory(userId: string, itemId: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  const existing = getSearchHistory(userId);
  const filtered = existing.filter(item => item.id !== itemId);
  localStorage.setItem(key, JSON.stringify(filtered));
}

/**
 * Get saved searches for a user
 */
export function getSavedSearches(userId: string): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  
  const key = `${SAVED_SEARCHES_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  return JSON.parse(stored);
}

/**
 * Save a search
 */
export function saveSearch(
  userId: string,
  name: string,
  query: string,
  filters?: SavedSearch['filters']
): SavedSearch {
  if (typeof window === 'undefined') {
    throw new Error('Cannot save search in non-browser environment');
  }
  
  const key = `${SAVED_SEARCHES_KEY_PREFIX}${userId}`;
  const existing = getSavedSearches(userId);
  
  const newSearch: SavedSearch = {
    id: `saved-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId,
    name,
    query: query.trim(),
    filters,
    createdAt: new Date().toISOString(),
  };
  
  existing.push(newSearch);
  localStorage.setItem(key, JSON.stringify(existing));
  
  return newSearch;
}

/**
 * Delete a saved search
 */
export function deleteSavedSearch(userId: string, searchId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = `${SAVED_SEARCHES_KEY_PREFIX}${userId}`;
  const existing = getSavedSearches(userId);
  const filtered = existing.filter(search => search.id !== searchId);
  
  if (filtered.length < existing.length) {
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

/**
 * Update saved search last used timestamp
 */
export function updateSavedSearchUsage(userId: string, searchId: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `${SAVED_SEARCHES_KEY_PREFIX}${userId}`;
  const existing = getSavedSearches(userId);
  const updated = existing.map(search =>
    search.id === searchId
      ? { ...search, lastUsed: new Date().toISOString() }
      : search
  );
  
  localStorage.setItem(key, JSON.stringify(updated));
}

/**
 * Get popular searches (based on history frequency)
 */
export function getPopularSearches(userId?: string): string[] {
  if (typeof window === 'undefined') return [];
  
  const allHistory: SearchHistoryItem[] = [];
  
  // Get history from all users (for popular searches)
  if (userId) {
    allHistory.push(...getSearchHistory(userId));
  } else {
    // Get from all users (for global popular searches)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(HISTORY_KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          allHistory.push(...JSON.parse(stored));
        }
      }
    }
  }
  
  // Count query frequency
  const queryCounts = new Map<string, number>();
  allHistory.forEach(item => {
    const count = queryCounts.get(item.query.toLowerCase()) || 0;
    queryCounts.set(item.query.toLowerCase(), count + 1);
  });
  
  // Sort by frequency and return top 10
  return Array.from(queryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query]) => query);
}

