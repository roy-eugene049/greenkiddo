import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RichTextEditor from '../../components/common/RichTextEditor';
import { Lesson, LessonContent } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { createLesson, updateLesson } from '../../services/adminService';
import {
  ArrowLeft,
  Save,
  Loader2,
  Video,
  FileText,
  BookOpen,
} from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.object({
    type: z.enum(['video', 'article', 'interactive', 'mixed']),
    videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    articleContent: z.string().optional(),
    interactiveContent: z.object({
      type: z.enum(['simulation', 'game', 'quiz', 'worksheet']),
      data: z.record(z.unknown()),
    }).optional(),
  }).refine(
    (data) => {
      if (data.type === 'video' && !data.videoUrl) {
        return false;
      }
      if ((data.type === 'article' || data.type === 'mixed') && !data.articleContent) {
        return false;
      }
      return true;
    },
    {
      message: 'Content is required based on selected type',
    }
  ),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  order: z.number().min(1, 'Order must be at least 1'),
  isPreview: z.boolean().default(false),
  quizId: z.string().optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

const LessonForm = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!lessonId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      content: {
        type: 'article',
        videoUrl: '',
        articleContent: '',
      },
      duration: 15,
      order: 1,
      isPreview: false,
      quizId: '',
    },
  });

  const watchedContentType = watch('content.type');
  const watchedOrder = watch('order');

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
    if (isEditMode && lessonId) {
      loadLesson();
    } else if (courseId) {
      // Set default order for new lesson
      setDefaultOrder();
    }
  }, [courseId, lessonId, isEditMode]);

  const loadCourseData = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const courseData = await CourseService.getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultOrder = async () => {
    if (!courseId) return;
    try {
      const lessons = await CourseService.getLessonsByCourseId(courseId);
      const maxOrder = lessons.length > 0
        ? Math.max(...lessons.map(l => l.order))
        : 0;
      setValue('order', maxOrder + 1);
    } catch (error) {
      console.error('Error setting default order:', error);
    }
  };

  const loadLesson = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const lesson = await CourseService.getLessonById(lessonId);
      if (lesson) {
        setValue('title', lesson.title);
        setValue('description', lesson.description);
        setValue('content', lesson.content);
        setValue('duration', lesson.duration);
        setValue('order', lesson.order);
        setValue('isPreview', lesson.isPreview);
        setValue('quizId', lesson.quizId || '');
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LessonFormData) => {
    if (!courseId) return;
    
    setSaving(true);
    try {
      const lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> = {
        courseId,
        title: data.title,
        description: data.description,
        content: data.content as LessonContent,
        duration: data.duration,
        order: data.order,
        isPreview: data.isPreview,
        quizId: data.quizId || undefined,
      };

      if (isEditMode && lessonId) {
        await updateLesson(lessonId, lessonData);
      } else {
        await createLesson(lessonData);
      }
      
      navigate(`/dashboard/admin/courses/${courseId}/lessons`);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson. Please try again.');
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
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/dashboard/admin/courses/${courseId}/lessons`)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isEditMode ? 'Edit Lesson' : 'Create New Lesson'}
            </h1>
            <p className="text-gray-400 text-lg">
              {course?.title || 'Add a new lesson to this course'}
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
                  Lesson Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="e.g., Introduction to Sustainability"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  placeholder="Describe what students will learn in this lesson..."
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Order *
                  </label>
                  <input
                    {...register('order', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                  {errors.order && (
                    <p className="text-red-400 text-xs mt-1">{errors.order.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Content Type</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {(['video', 'article', 'interactive', 'mixed'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('content.type', type)}
                  className={`
                    p-4 rounded-lg border-2 transition-colors
                    ${
                      watchedContentType === type
                        ? 'border-green-ecco bg-green-ecco/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    {type === 'video' && <Video className="w-6 h-6" />}
                    {type === 'article' && <FileText className="w-6 h-6" />}
                    {type === 'interactive' && <BookOpen className="w-6 h-6" />}
                    {type === 'mixed' && <FileText className="w-6 h-6" />}
                    <span className="text-sm font-semibold capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Content Fields Based on Type */}
            {watchedContentType === 'video' && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Video URL *
                </label>
                <input
                  {...register('content.videoUrl')}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {(watchedContentType === 'article' || watchedContentType === 'mixed') && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Article Content *
                </label>
                <RichTextEditor
                  content={watch('content.articleContent') || ''}
                  onChange={(html) => setValue('content.articleContent', html)}
                  placeholder="Enter your article content here..."
                  minHeight="400px"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use the toolbar to format your content. Supports headings, lists, links, images, and more.
                </p>
              </div>
            )}

            {watchedContentType === 'interactive' && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Interactive Content
                </label>
                <p className="text-sm text-gray-400 mb-4">
                  Interactive content configuration will be available in a future update.
                </p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPreview')}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-green-ecco focus:ring-green-ecco"
                />
                <div>
                  <span className="font-semibold">Preview Lesson</span>
                  <p className="text-sm text-gray-400">
                    Allow users to view this lesson without enrollment
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Quiz ID (optional)
                </label>
                <input
                  {...register('quizId')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="quiz-123"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link a quiz to this lesson (optional)
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/admin/courses/${courseId}/lessons`)}
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
                  {isEditMode ? 'Update Lesson' : 'Create Lesson'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default LessonForm;

