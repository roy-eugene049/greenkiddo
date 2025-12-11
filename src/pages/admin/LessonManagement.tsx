import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Course, Lesson } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { createLesson, updateLesson, deleteLesson } from '../../services/adminService';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  FileText,
  Video,
  BookOpen,
  Loader2,
  X,
  HelpCircle,
} from 'lucide-react';

const LessonManagement = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const courseData = await CourseService.getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      }
      const courseLessons = await CourseService.getLessonsByCourseId(courseId);
      setLessons(courseLessons.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!courseId) return;
    
    setDeleting(true);
    try {
      await deleteLesson(lessonId);
      await loadCourseData();
      setShowDeleteModal(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'interactive':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading lessons...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Course not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/admin/courses')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Lessons</h1>
              <p className="text-gray-400 text-lg">
                {course.title}
              </p>
            </div>
          </div>
          <Link
            to={`/dashboard/admin/courses/${courseId}/lessons/new`}
            className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </Link>
        </div>

        {/* Course Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-24 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{lessons.length} lessons</span>
                <span>•</span>
                <span>{course.difficulty}</span>
                <span>•</span>
                <span>{course.instructor.name}</span>
              </div>
            </div>
            <Link
              to={`/dashboard/admin/courses/${courseId}/edit`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Edit Course
            </Link>
          </div>
        </div>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No lessons yet</h2>
            <p className="text-gray-400 mb-6">
              Get started by adding your first lesson to this course
            </p>
            <Link
              to={`/dashboard/admin/courses/${courseId}/lessons/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Lesson
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-green-ecco/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="text-gray-600 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Lesson Number */}
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-400">
                    {lesson.order}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-400">
                        {getLessonIcon(lesson.content.type)}
                      </div>
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                      {lesson.isPreview && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded">
                          Preview
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDuration(lesson.duration)}</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.content.type}</span>
                      {lesson.quizId && (
                        <>
                          <span>•</span>
                          <span>Has Quiz</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/admin/courses/${courseId}/lessons/${lesson.id}/quizzes`}
                      className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                      title="Manage Quizzes"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Preview Lesson"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/dashboard/admin/courses/${courseId}/lessons/${lesson.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-ecco transition-colors"
                      title="Edit Lesson"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedLesson && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2">Delete Lesson</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{selectedLesson.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedLesson(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedLesson.id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LessonManagement;

