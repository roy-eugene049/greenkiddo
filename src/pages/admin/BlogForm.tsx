import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RichTextEditor from '../../components/common/RichTextEditor';
import { BlogPost } from '../../types/blog';
import { BlogService } from '../../services/blogService';
import { createBlogPost, updateBlogPost } from '../../services/blogService';
import { useUser } from '@clerk/clerk-react';
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.union([
    z.string().min(3, 'Slug must be at least 3 characters'),
    z.literal('')
  ]).optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  featuredImage: z.union([
    z.string().url('Invalid URL'),
    z.literal('')
  ]).optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const BlogForm = () => {
  const { postId } = useParams<{ postId?: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const isEditMode = !!postId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featuredImage: '',
    },
  });

  const watchedTitle = watch('title');

  useEffect(() => {
    loadCategories();
    if (isEditMode && postId) {
      loadPost();
    }
  }, [postId, isEditMode]);

  useEffect(() => {
    // Auto-generate slug from title
    if (!isEditMode && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, isEditMode, setValue]);

  const loadCategories = async () => {
    try {
      const cats = await BlogService.getCategories();
      setCategories(cats.map(c => c.name));
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      if (!isEditMode) {
        setLoading(false);
      }
    }
  };

  const loadPost = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const post = await BlogService.getPostById(postId);
      if (post) {
        setValue('title', post.title);
        setValue('slug', post.slug);
        setValue('excerpt', post.excerpt);
        setValue('content', post.content);
        setValue('category', post.category);
        setValue('tags', post.tags.join(', '));
        setValue('featuredImage', post.featuredImage || '');
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const postData: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'views' | 'likes' | 'readTime'> = {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: data.excerpt,
        content: data.content,
        author: {
          id: user.id,
          name: user.fullName || user.emailAddresses[0]?.emailAddress || 'Admin',
          avatar: user.imageUrl,
        },
        category: data.category,
        tags: tagsArray,
        featuredImage: data.featuredImage || undefined,
      };

      if (isEditMode && postId) {
        await updateBlogPost(postId, postData);
      } else {
        await createBlogPost(postData);
      }
      
      navigate('/dashboard/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/admin/blog')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-gray-400 text-lg">
              {isEditMode ? 'Update your blog post' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="Enter blog post title..."
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Slug (URL-friendly version)
                </label>
                <input
                  {...register('slug')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="auto-generated-from-title"
                />
                {errors.slug && (
                  <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-generate from title
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Excerpt *
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  placeholder="A brief summary of your post..."
                />
                {errors.excerpt && (
                  <p className="text-red-400 text-xs mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    {...register('tags')}
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    placeholder="sustainability, tips, kids"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Featured Image URL
                </label>
                <input
                  {...register('featuredImage')}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.featuredImage && (
                  <p className="text-red-400 text-xs mt-1">{errors.featuredImage.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Content</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2">
                Post Content *
              </label>
              <RichTextEditor
                content={watch('content') || ''}
                onChange={(html) => setValue('content', html)}
                placeholder="Write your blog post content here..."
                minHeight="400px"
              />
              {errors.content && (
                <p className="text-red-400 text-xs mt-2">{errors.content.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Use the toolbar to format your content. Supports headings, lists, links, images, and more.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/blog')}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Update Post' : 'Create Post'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BlogForm;

