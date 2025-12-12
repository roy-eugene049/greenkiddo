export type SearchResultType = 'course' | 'lesson' | 'blog' | 'forum' | 'user';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  metadata?: {
    category?: string;
    difficulty?: string;
    author?: string;
    date?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  relevanceScore?: number;
}

export interface SearchFilters {
  type?: SearchResultType[];
  category?: string[];
  difficulty?: string[];
  tags?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  duration?: {
    min?: number; // in minutes
    max?: number; // in minutes
  };
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'popularity';
}

