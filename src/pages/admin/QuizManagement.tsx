import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Lesson, Quiz } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { createQuiz, updateQuiz, deleteQuiz, getQuizzesByLessonId } from '../../services/adminService';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  HelpCircle,
  Clock,
  Target,
} from 'lucide-react';

const QuizManagement = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId]);

  const loadLessonData = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const lessonData = await CourseService.getLessonById(lessonId);
      if (lessonData) {
        setLesson(lessonData);
      }
      const lessonQuizzes = await getQuizzesByLessonId(lessonId);
      setQuizzes(lessonQuizzes);
    } catch (error) {
      console.error('Error loading lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    setDeleting(true);
    try {
      await deleteQuiz(quizId);
      await loadLessonData();
      setShowDeleteModal(false);
      setSelectedQuiz(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading quizzes...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Lesson not found</div>
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
              onClick={() => navigate(`/dashboard/admin/courses/${courseId}/lessons`)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Quizzes</h1>
              <p className="text-gray-400 text-lg">
                {lesson.title}
              </p>
            </div>
          </div>
          <Link
            to={`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes/new`}
            className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Quiz
          </Link>
        </div>

        {/* Lesson Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{lesson.duration} min</span>
                <span>•</span>
                <span className="capitalize">{lesson.content.type}</span>
                <span>•</span>
                <span>{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}</span>
              </div>
            </div>
            <Link
              to={`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/edit`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Edit Lesson
            </Link>
          </div>
        </div>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No quizzes yet</h2>
            <p className="text-gray-400 mb-6">
              Get started by adding a quiz to this lesson
            </p>
            <Link
              to={`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-ecco/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <HelpCircle className="w-5 h-5 text-green-ecco" />
                      <h3 className="font-semibold text-xl">{quiz.title}</h3>
                    </div>
                    {quiz.description && (
                      <p className="text-sm text-gray-400 mb-4">
                        {quiz.description}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>{quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{quiz.passingScore}% passing score</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.timeLimit} min time limit</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>{quiz.attemptsAllowed} {quiz.attemptsAllowed === 1 ? 'attempt' : 'attempts'} allowed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/courses/${courseId}/lessons/${lessonId}/quiz?quizId=${quiz.id}`}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Preview Quiz"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quiz.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-ecco transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Quiz"
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
        {showDeleteModal && selectedQuiz && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2">Delete Quiz</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{selectedQuiz.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedQuiz(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedQuiz.id)}
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

export default QuizManagement;

