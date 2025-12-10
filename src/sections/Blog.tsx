import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogService } from '../services/blogService';
import { BlogPost, BlogCategory } from '../types/blog';
import { Search, Clock, Eye, Heart, Calendar, Filter } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          BlogService.getAllPosts(),
          BlogService.getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchQuery, posts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading blog posts...</div>
      </section>
    );
  }

  return (
    <section className="bg-black min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 text-4xl lg:text-5xl tracking-tight font-extrabold text-green-ecco">
            Our Blog
          </h1>
          <p className="font-light text-gray-400 text-lg max-w-2xl mx-auto">
            Discover sustainability tips, educational content, and fun activities to help kids learn about protecting our planet.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-colors
                ${
                  selectedCategory === 'all'
                    ? 'bg-green-ecco text-black'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold transition-colors
                  ${
                    selectedCategory === category.slug
                      ? 'bg-green-ecco text-black'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                {category.name} ({category.postCount})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-8 lg:grid-cols-2"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-green-ecco/50 transition-colors"
              >
                {post.featuredImage && (
                  <Link to={`/blog/${post.slug}`}>
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </Link>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-green-ecco/10 text-green-ecco text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-white hover:text-green-ecco transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-5 font-light text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {post.author.avatar && (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                    )}
                    <div>
                      <span className="font-medium text-white block">{post.author.name}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center font-medium text-green-ecco hover:text-green-300 transition-colors"
                  >
                    Read more
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-2xl font-bold mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-green-ecco text-black font-bold py-3 px-6 rounded-full hover:bg-green-300 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog