import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ForumService } from '../services/forumService';
import { ForumCategory, ForumPost } from '../types/forum';
import {
  MessageSquare,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Pin,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { Avatar } from '../components/common/Avatar';

const CommunityForum = () => {
  const { user, isLoaded } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesData, postsData] = await Promise.all([
          ForumService.getCategories(),
          ForumService.getPosts(selectedCategory === 'all' ? undefined : selectedCategory, searchQuery || undefined)
        ]);
        setCategories(categoriesData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading forum data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchParams({ category: categoryId });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query, category: selectedCategory });
    } else {
      setSearchParams({ category: selectedCategory });
    }
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-green-ecco">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
              <p className="text-gray-400">Connect, learn, and share with fellow sustainability enthusiasts</p>
            </div>
            <Link
              to="/community/new"
              className="flex items-center gap-2 px-4 py-2 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold"
            >
              <Plus size={20} />
              New Post
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts, topics, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-ecco text-black'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-ecco text-black'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.postCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-green-ecco">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
            </p>
            <Link
              to="/community/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold"
            >
              <Plus size={20} />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-black border border-gray-800 rounded-lg p-6 hover:border-green-ecco/50 transition-colors"
              >
                <Link to={`/community/posts/${post.id}`}>
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          ForumService.votePost(post.id, user?.id || '', 'upvote');
                        }}
                        className="p-2 hover:bg-gray-800 rounded transition-colors"
                      >
                        <ThumbsUp size={20} className="text-gray-400 hover:text-green-ecco" />
                      </button>
                      <span className="text-white font-semibold">{post.upvotes - post.downvotes}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          ForumService.votePost(post.id, user?.id || '', 'downvote');
                        }}
                        className="p-2 hover:bg-gray-800 rounded transition-colors"
                      >
                        <ThumbsDown size={20} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {post.isPinned && (
                              <Pin size={16} className="text-green-ecco" fill="currentColor" />
                            )}
                            <h3 className="text-xl font-semibold text-white hover:text-green-ecco transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <span>{getCategoryById(post.categoryId)?.icon}</span>
                              {getCategoryById(post.categoryId)?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatTimeAgo(post.lastActivityAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">{post.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            {post.commentCount} comments
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            {post.views} views
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-900 text-gray-300 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                        <Avatar
                          avatar={post.author.avatar}
                          name={post.author.name}
                          size="sm"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{post.author.name}</div>
                          {post.author.badges && post.author.badges.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {post.author.badges.map((badge) => (
                                <span
                                  key={badge}
                                  className="text-xs px-2 py-0.5 bg-green-ecco/20 text-green-ecco rounded"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommunityForum;

