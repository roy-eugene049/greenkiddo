import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, FileText, MessageSquare, Newspaper, Filter, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchResult, SearchResultType } from '../types/search';
import { globalSearch } from '../services/searchService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<SearchResultType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, selectedTypes, selectedCategories, sortBy]);

  const performSearch = async () => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await globalSearch({
        query: query.trim(),
        filters: {
          type: selectedTypes.length > 0 ? selectedTypes : undefined,
          category: selectedCategories.length > 0 ? selectedCategories : undefined,
        },
        sortBy,
        limit: 100,
      });
      setResults(searchResults);
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
    setSortBy('relevance');
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
          <h1 className="text-3xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400">
            {loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
          </p>
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
                  <div className="space-y-2">
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
                                  <h3 className="font-semibold text-lg">{result.title}</h3>
                                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">
                                    {getResultTypeLabel(result.type)}
                                  </span>
                                </div>
                                {result.description && (
                                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                    {result.description}
                                  </p>
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

