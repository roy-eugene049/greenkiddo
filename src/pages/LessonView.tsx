import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseService } from '../services/courseService';
import { Course, Lesson } from '../types/course';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  BookOpen,
  Download,
  FileText,
  PlayCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

const LessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadLessonData = async () => {
      if (!courseId || !lessonId) return;

      setLoading(true);
      try {
        // Load course
        const courseData = await CourseService.getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
        }

        // Load lessons
        const courseLessons = await CourseService.getLessonsByCourseId(courseId);
        setLessons(courseLessons.sort((a, b) => a.order - b.order));

        // Find current lesson
        const lesson = courseLessons.find(l => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          const index = courseLessons.findIndex(l => l.id === lessonId);
          setCurrentLessonIndex(index);
        }

        // Load completed lessons (mock - would come from backend)
        if (user) {
          const progress = await CourseService.getUserProgress(user.id, courseId);
          if (progress?.completed) {
            // In real app, would load all completed lessons
          }
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [courseId, lessonId, user]);

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = lessons[currentLessonIndex - 1];
      navigate(`/courses/${courseId}/lessons/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !courseId || !lessonId) return;

    try {
      await CourseService.updateLessonProgress(user.id, courseId, lessonId, true);
      setCompletedLessons(new Set([...completedLessons, lessonId]));
      
      // Auto-advance to next lesson after a short delay
      setTimeout(() => {
        if (currentLessonIndex < lessons.length - 1) {
          handleNext();
        }
      }, 1000);
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.has(lessonId);
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
          <div className="text-white text-xl">Loading lesson...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentLesson || !course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Lesson not found</h2>
            <Link
              to={`/courses/${courseId}`}
              className="text-green-ecco hover:text-green-300"
            >
              Back to course
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const progressPercentage = lessons.length > 0
    ? ((currentLessonIndex + 1) / lessons.length) * 100
    : 0;

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Curriculum Sidebar */}
        <aside
          className={`
            w-80 bg-gray-900 border-r border-gray-800
            flex flex-col
            transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:static inset-y-0 left-0 z-40
          `}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <Link
                to={`/courses/${courseId}`}
                className="text-sm text-gray-400 hover:text-white mb-1 block"
              >
                ← Back to Course
              </Link>
              <h3 className="font-bold text-white">{course.title}</h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Course Progress</span>
                <span className="text-sm font-semibold text-green-ecco">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="bg-green-ecco h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Curriculum
            </h4>
            <ul className="space-y-2">
              {lessons.map((lesson, index) => {
                const isActive = lesson.id === lessonId;
                const isCompleted = isLessonCompleted(lesson.id);
                const isAccessible = lesson.isPreview || index <= currentLessonIndex || isCompleted;

                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/courses/${courseId}/lessons/${lesson.id}`}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg
                        transition-colors
                        ${
                          isActive
                            ? 'bg-green-ecco/20 text-green-ecco border-l-4 border-green-ecco'
                            : isAccessible
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-600 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-ecco" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">
                            {index + 1}
                          </span>
                          <span className={`text-sm font-medium ${isActive ? 'text-green-ecco' : ''}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {formatDuration(lesson.duration)}
                          </span>
                          {lesson.isPreview && (
                            <span className="text-xs bg-green-ecco/20 text-green-ecco px-2 py-0.5 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Lesson Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4 lg:p-6 flex-shrink-0">
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <BookOpen className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    {currentLesson.title}
                  </h1>
                  <p className="text-gray-400">{currentLesson.description}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    transition-colors
                    ${
                      currentLessonIndex === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </span>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isLessonCompleted(lessonId!)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                      transition-colors
                      ${
                        isLessonCompleted(lessonId!)
                          ? 'bg-green-ecco/20 text-green-ecco cursor-not-allowed'
                          : 'bg-green-ecco text-black hover:bg-green-300'
                      }
                    `}
                  >
                    {isLessonCompleted(lessonId!) ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    transition-colors
                    ${
                      currentLessonIndex === lessons.length - 1
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-white hover:bg-gray-800'
                    }
                  `}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto bg-black">
            <div className="max-w-4xl mx-auto w-full p-4 lg:p-8">
              {/* Video Player */}
              {currentLesson.content.type === 'video' && currentLesson.content.videoUrl && (
                <div className="mb-8">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Video player would be embedded here
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {currentLesson.content.videoUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              {currentLesson.content.type === 'article' && currentLesson.content.articleContent && (
                <div className="prose prose-invert max-w-none mb-8">
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: currentLesson.content.articleContent.replace(/\n/g, '<br />')
                    }}
                  />
                </div>
              )}

              {/* Mixed Content */}
              {currentLesson.content.type === 'mixed' && (
                <div className="space-y-8">
                  {currentLesson.content.videoUrl && (
                    <div className="mb-8">
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Video content</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {currentLesson.content.articleContent && (
                    <div className="prose prose-invert max-w-none">
                      <div
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.content.articleContent.replace(/\n/g, '<br />')
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Resources */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-ecco" />
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {currentLesson.resources.map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-green-ecco" />
                          <div className="flex-1">
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-gray-400">{resource.type.toUpperCase()}</p>
                          </div>
                          <Download className="w-5 h-5 text-gray-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quiz Link */}
              {currentLesson.quizId && (
                <div className="mt-8">
                  <Link
                    to={`/courses/${courseId}/lessons/${lessonId}/quiz`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Take Quiz
                  </Link>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg
                    transition-colors
                    ${
                      currentLessonIndex === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-white hover:bg-gray-800 bg-gray-900'
                    }
                  `}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous Lesson
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-colors
                    ${
                      currentLessonIndex === lessons.length - 1
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'bg-green-ecco text-black hover:bg-green-300'
                    }
                  `}
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonView;

