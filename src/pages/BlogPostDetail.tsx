import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { ArrowLeft, Clock, Eye, Heart, Calendar, Tag } from 'lucide-react';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const postData = await BlogService.getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
          <Link to="/blog" className="text-green-ecco hover:text-green-300">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-green-ecco/20 text-green-ecco rounded-full text-sm font-semibold">
                  {post.category}
                </span>
                <span className="text-sm text-gray-400">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n')
                .map(line => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-4xl font-bold mb-4 mt-8">${line.substring(2)}</h1>`;
                  } else if (line.startsWith('## ')) {
                    return `<h2 class="text-3xl font-bold mb-3 mt-6">${line.substring(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3 class="text-2xl font-bold mb-2 mt-4">${line.substring(4)}</h3>`;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="font-semibold text-lg mb-4">${line.replace(/\*\*/g, '')}</p>`;
                  } else if (line.trim() === '') {
                    return '<br />';
                  } else {
                    return `<p class="mb-4">${line}</p>`;
                  }
                })
                .join('')
            }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-green-ecco" />
            <h3 className="font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-start gap-4">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">{post.author.name}</h3>
              {post.author.bio && (
                <p className="text-gray-400">{post.author.bio}</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;

