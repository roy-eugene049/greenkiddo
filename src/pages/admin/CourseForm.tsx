import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Course } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { createCourse, updateCourse } from '../../services/adminService';
import { useCourseStore } from '../../store/useCourseStore';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  category: z.array(z.string()).min(1, 'Select at least one category'),
  tags: z.array(z.string()).optional(),
  language: z.string().default('English'),
  price: z.object({
    amount: z.number().min(0),
    currency: z.string().default('USD'),
    isFree: z.boolean().default(true),
  }),
  instructor: z.object({
    id: z.string(),
    name: z.string().min(1, 'Instructor name is required'),
    avatar: z.string().url().optional().or(z.literal('')),
    bio: z.string().optional(),
  }),
  isPublished: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;

const availableCategories = [
  'Climate',
  'Energy',
  'Waste',
  'Technology',
  'Lifestyle',
  'Education',
  'Business',
  'Policy',
];

const CourseForm = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const { courses, setCourses } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!courseId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      thumbnail: '',
      duration: 60,
      difficulty: 'beginner',
      category: [],
      tags: [],
      language: 'English',
      price: {
        amount: 0,
        currency: 'USD',
        isFree: true,
      },
      instructor: {
        id: 'instructor-1',
        name: '',
        avatar: '',
        bio: '',
      },
      isPublished: false,
    },
  });

  const watchedCategory = watch('category');
  const watchedTags = watch('tags') || [];
  const watchedIsFree = watch('price.isFree');

  useEffect(() => {
    if (isEditMode && courseId) {
      loadCourse();
    }
  }, [courseId, isEditMode]);

  const loadCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const course = await CourseService.getCourseById(courseId);
      if (course) {
        setValue('title', course.title);
        setValue('description', course.description);
        setValue('shortDescription', course.shortDescription || '');
        setValue('thumbnail', course.thumbnail);
        setValue('duration', course.duration);
        setValue('difficulty', course.difficulty);
        setValue('category', course.category);
        setValue('tags', course.tags);
        setValue('language', course.language);
        setValue('price', course.price);
        setValue('instructor', course.instructor);
        setValue('isPublished', course.isPublished);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setSaving(true);
    try {
      if (isEditMode && courseId) {
        const updated = await updateCourse(courseId, data as Partial<Course>);
        if (!updated) {
          throw new Error('Failed to update course');
        }
      } else {
        const created = await createCourse(data as Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'lessons' | 'enrolledCount' | 'rating'>);
        if (!created) {
          throw new Error('Failed to create course');
        }
      }
      
      // Reload courses from service
      const allCourses = await CourseService.getAllCourses();
      setCourses(allCourses);
      
      navigate('/dashboard/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    const current = watchedCategory || [];
    if (current.includes(category)) {
      setValue('category', current.filter(c => c !== category));
    } else {
      setValue('category', [...current, category]);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !watchedTags.includes(tag.trim())) {
      setValue('tags', [...watchedTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(t => t !== tagToRemove));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading course...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/admin/courses')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isEditMode ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-gray-400 text-lg">
              {isEditMode ? 'Update course information' : 'Add a new course to the platform'}
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
                  Course Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="e.g., Introduction to Sustainable Living"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Short Description
                </label>
                <input
                  {...register('shortDescription')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="Brief one-line description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  placeholder="Detailed course description..."
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Thumbnail URL
                </label>
                <input
                  {...register('thumbnail')}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.thumbnail && (
                  <p className="text-red-400 text-xs mt-1">{errors.thumbnail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Course Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Duration (minutes) *
                </label>
                <input
                  {...register('duration', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                />
                {errors.duration && (
                  <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Difficulty *
                </label>
                <select
                  {...register('difficulty')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Language
                </label>
                <input
                  {...register('language')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  defaultValue="English"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedIsFree}
                      onChange={(e) => setValue('price.isFree', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
                    />
                    <span className="text-sm">Free Course</span>
                  </label>
                  {!watchedIsFree && (
                    <input
                      {...register('price.amount', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                      placeholder="0.00"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Categories *</h2>
            <div className="flex flex-wrap gap-3">
              {availableCategories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${
                      watchedCategory?.includes(category)
                        ? 'bg-green-ecco text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-400 text-xs mt-2">{errors.category.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {watchedTags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Instructor</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instructor Name *
                </label>
                <input
                  {...register('instructor.name')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="e.g., Dr. Sarah Green"
                />
                {errors.instructor?.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.instructor.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instructor Avatar URL
                </label>
                <input
                  {...register('instructor.avatar')}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instructor Bio
                </label>
                <textarea
                  {...register('instructor.bio')}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  placeholder="Brief bio about the instructor..."
                />
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Publish Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isPublished')}
                className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
              />
              <div>
                <span className="font-semibold">Publish Course</span>
                <p className="text-sm text-gray-400">
                  Make this course visible to all users
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/courses')}
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
                  {isEditMode ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CourseForm;

