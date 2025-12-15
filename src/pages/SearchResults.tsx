import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Search, BookOpen, FileText, MessageSquare, Newspaper, Filter, X, Clock, Calendar, Save, History, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchResult, SearchResultType } from '../types/search';
import { globalSearch } from '../services/searchService';
import { highlightTitle, getSearchSnippet } from '../utils/searchHighlight';
import { 
  getSearchHistory, 
  addToSearchHistory, 
  clearSearchHistory,
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
  updateSavedSearchUsage,
  getPopularSearches,
  type SavedSearch
} from '../services/searchHistoryService';

const SearchResults = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<SearchResultType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [durationRange, setDurationRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory(user?.id || ''));
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSavedSearches(getSavedSearches(user.id));
      setSearchHistory(getSearchHistory(user.id));
      setPopularSearches(getPopularSearches(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, selectedTypes, selectedCategories, selectedDifficulties, dateRange, durationRange, sortBy]);

  const performSearch = async () => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const filters: any = {
        type: selectedTypes.length > 0 ? selectedTypes : undefined,
        category: selectedCategories.length > 0 ? selectedCategories : undefined,
        difficulty: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
      };

      if (dateRange.from || dateRange.to) {
        filters.dateRange = dateRange;
      }

      if (durationRange.min !== undefined || durationRange.max !== undefined) {
        filters.duration = durationRange;
      }

      const searchResults = await globalSearch({
        query: query.trim(),
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sortBy,
        limit: 100,
      });
      setResults(searchResults);

      // Save to history
      if (user) {
        addToSearchHistory(user.id, query.trim(), filters, searchResults.length);
        setSearchHistory(getSearchHistory(user.id));
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = (type: SearchResultType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setDateRange({});
    setDurationRange({});
    setSortBy('relevance');
  };

  const handleSaveSearch = () => {
    if (!user || !query.trim()) return;
    
    const name = window.prompt('Name this search:');
    if (name && name.trim()) {
      const saved = saveSearch(user.id, name.trim(), query, {
        type: selectedTypes.length > 0 ? selectedTypes : undefined,
        category: selectedCategories.length > 0 ? selectedCategories : undefined,
        difficulty: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
        dateRange: (dateRange.from || dateRange.to) ? dateRange : undefined,
        duration: (durationRange.min !== undefined || durationRange.max !== undefined) ? durationRange : undefined,
      });
      setSavedSearches([...savedSearches, saved]);
    }
  };

  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchParams({ q: savedSearch.query });
    setSelectedTypes(savedSearch.filters?.type || []);
    setSelectedCategories(savedSearch.filters?.category || []);
    setSelectedDifficulties(savedSearch.filters?.difficulty || []);
    setDateRange(savedSearch.filters?.dateRange || {});
    setDurationRange(savedSearch.filters?.duration || {});
    if (user) {
      updateSavedSearchUsage(user.id, savedSearch.id);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-5 h-5" />;
      case 'lesson':
        return <FileText className="w-5 h-5" />;
      case 'forum':
        return <MessageSquare className="w-5 h-5" />;
      case 'blog':
        return <Newspaper className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'course':
        return 'Course';
      case 'lesson':
        return 'Lesson';
      case 'forum':
        return 'Forum Post';
      case 'blog':
        return 'Blog Post';
      default:
        return 'Result';
    }
  };

  const getAvailableCategories = () => {
    const categories = new Set<string>();
    results.forEach(result => {
      if (result.metadata?.category) {
        categories.add(result.metadata.category);
      }
    });
    return Array.from(categories).sort();
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  if (!query) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">Start Searching</h2>
            <p className="text-gray-400">Enter a search query to find courses, lessons, and more</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-400">
                {loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {user && query && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSearch}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm"
                  title="Save this search"
                >
                  <Save className="w-4 h-4" />
                  Save Search
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm"
                  title="Search history"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm"
                  title="Saved searches"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Popular Searches */}
          {!query && popularSearches.length > 0 && (
            <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-ecco" />
                <h3 className="text-sm font-semibold">Popular Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((searchTerm, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchParams({ q: searchTerm })}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition-colors"
                  >
                    {searchTerm}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History Panel */}
          {showHistory && user && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Searches
                </h3>
                <button
                  onClick={() => {
                    clearSearchHistory(user.id);
                    setSearchHistory([]);
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchHistory.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSearchParams({ q: item.query });
                      if (item.filters) {
                        setSelectedTypes(item.filters.type || []);
                        setSelectedCategories(item.filters.category || []);
                        setSelectedDifficulties(item.filters.difficulty || []);
                        setDateRange(item.filters.dateRange || {});
                      }
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.query}</span>
                      {item.resultCount !== undefined && (
                        <span className="text-xs text-gray-500">{item.resultCount} results</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Saved Searches Panel */}
          {showSavedSearches && user && savedSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Save className="w-4 h-4" />
                Saved Searches
              </h3>
              <div className="space-y-2">
                {savedSearches.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded"
                  >
                    <button
                      onClick={() => handleLoadSavedSearch(saved)}
                      className="flex-1 text-left text-sm hover:text-green-ecco transition-colors"
                    >
                      <div className="font-medium">{saved.name}</div>
                      <div className="text-xs text-gray-400">{saved.query}</div>
                    </button>
                    <button
                      onClick={() => {
                        deleteSavedSearch(user.id, saved.id);
                        setSavedSearches(savedSearches.filter(s => s.id !== saved.id));
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete saved search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                {(selectedTypes.length > 0 || selectedCategories.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-green-ecco hover:text-green-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Content Type</h4>
                <div className="space-y-2">
                  {(['course', 'lesson', 'forum', 'blog'] as SearchResultType[]).map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
                      />
                      <span className="text-sm capitalize">{getResultTypeLabel(type)}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        ({groupedResults[type]?.length || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {getAvailableCategories().length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3">Category</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getAvailableCategories().map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Difficulty</h4>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                    <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(difficulty)}
                        onChange={() => {
                          setSelectedDifficulties(prev =>
                            prev.includes(difficulty)
                              ? prev.filter(d => d !== difficulty)
                              : [...prev, difficulty]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
                      />
                      <span className="text-sm capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">From</label>
                    <input
                      type="date"
                      value={dateRange.from || ''}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-ecco"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">To</label>
                    <input
                      type="date"
                      value={dateRange.to || ''}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-ecco"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration (minutes)
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Min</label>
                    <input
                      type="number"
                      min="0"
                      value={durationRange.min || ''}
                      onChange={(e) => setDurationRange({ ...durationRange, min: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-ecco"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Max</label>
                    <input
                      type="number"
                      min="0"
                      value={durationRange.max || ''}
                      onChange={(e) => setDurationRange({ ...durationRange, max: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-ecco"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'popularity')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-ecco"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Newest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="text-gray-400">Searching...</div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="text-green-ecco hover:text-green-300"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedResults).map(([type, typeResults]) => (
                  <div key={type}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      {getResultIcon(type)}
                      {getResultTypeLabel(type)}s ({typeResults.length})
                    </h2>
                    <div className="space-y-3">
                      {typeResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={result.url}
                            className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-green-ecco/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              {result.thumbnail && (
                                <img
                                  src={result.thumbnail}
                                  alt={result.title}
                                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 
                                    className="font-semibold text-lg"
                                    dangerouslySetInnerHTML={{ 
                                      __html: highlightTitle(result.title, query) 
                                    }}
                                  />
                                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">
                                    {getResultTypeLabel(result.type)}
                                  </span>
                                </div>
                                {result.description && (
                                  <p 
                                    className="text-gray-400 text-sm mb-3 line-clamp-2"
                                    dangerouslySetInnerHTML={{ 
                                      __html: getSearchSnippet(result.description, query) 
                                    }}
                                  />
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {result.metadata?.category && (
                                    <span>{result.metadata.category}</span>
                                  )}
                                  {result.metadata?.difficulty && (
                                    <span className="capitalize">{result.metadata.difficulty}</span>
                                  )}
                                  {result.metadata?.author && (
                                    <span>By {result.metadata.author}</span>
                                  )}
                                  {result.metadata?.date && (
                                    <span>
                                      {new Date(result.metadata.date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {result.metadata.tags.slice(0, 3).map(tag => (
                                      <span
                                        key={tag}
                                        className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchResults;

