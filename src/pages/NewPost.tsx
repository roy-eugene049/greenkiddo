import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ForumService } from '../services/forumService';
import { ForumCategory } from '../types/forum';
import { ArrowLeft, Send } from 'lucide-react';
import { useUserDisplay } from '../hooks/useUserDisplay';

const NewPost = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { displayName, displayAvatar } = useUserDisplay();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await ForumService.getCategories();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setCategoryId(categoriesData[0].id);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const post = await ForumService.createPost({
        categoryId,
        title: title.trim(),
        content: content.trim(),
        author: {
          id: user.id,
          name: displayName,
          avatar: displayAvatar.value,
          badges: []
        },
        tags: tagArray
      });

      navigate(`/community/posts/${post.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">You must be logged in to create a post</h2>
            <button
              onClick={() => navigate('/community')}
              className="text-green-ecco hover:underline"
            >
              Back to Forum
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Forum
        </button>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black border border-gray-800 rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Create New Post</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-green-ecco"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your post"
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                required
                maxLength={200}
              />
              <p className="text-sm text-gray-400 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here. You can use markdown formatting."
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                rows={12}
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Tip: Use line breaks to separate paragraphs. Keep it clear and engaging!
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., sustainability, tips, recycling)"
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
              />
              <p className="text-sm text-gray-400 mt-1">
                Separate tags with commas. Tags help others find your post.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                {submitting ? 'Creating Post...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default NewPost;

