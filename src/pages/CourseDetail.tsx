import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { CourseService } from '../services/courseService';
import { Course, Lesson } from '../types/course';
import { 
  Clock, 
  Users, 
  Star, 
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import ReviewsSection from '../components/course/ReviewsSection';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      setLoading(true);
      try {
        const courseData = await CourseService.getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
          // Load lessons separately if not included
          if (courseData.lessons && courseData.lessons.length > 0) {
            setLessons(courseData.lessons);
          } else {
            const courseLessons = await CourseService.getLessonsByCourseId(courseId);
            setLessons(courseLessons);
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (!courseId || !user) return;

    setEnrolling(true);
    try {
      await CourseService.enrollInCourse(
        user.id,
        courseId,
        user.emailAddresses[0]?.emailAddress,
        user.fullName || user.firstName || 'User'
      );
      setIsEnrolled(true);
      // Navigate to first lesson
      if (lessons.length > 0) {
        navigate(`/courses/${courseId}/lessons/${lessons[0].id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course not found</h2>
          <Link
            to="/courses"
            className="text-green-ecco hover:text-green-300"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-2 mb-4">
                {course.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-green-ecco/20 text-green-ecco rounded-full text-sm font-semibold"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 max-w-3xl">{course.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-4">About This Course</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{course.description}</p>
              </div>
            </motion.section>

            {/* Curriculum */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Curriculum</h2>
              {lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-green-ecco/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-ecco/20 text-green-ecco flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-gray-400">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          {formatDuration(lesson.duration)}
                        </span>
                        {lesson.isPreview && (
                          <span className="px-2 py-1 bg-green-ecco/20 text-green-ecco rounded text-xs">
                            Preview
                          </span>
                        )}
                        {isEnrolled || lesson.isPreview ? (
                          <Link
                            to={`/courses/${courseId}/lessons/${lesson.id}`}
                            className="text-green-ecco hover:text-green-300"
                          >
                            <PlayCircle className="w-6 h-6" />
                          </Link>
                        ) : (
                          <PlayCircle className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Lessons coming soon...</p>
              )}
            </motion.section>

            {/* Instructor */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-4">Instructor</h2>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {course.instructor.avatar && (
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold mb-1">{course.instructor.name}</h3>
                    {course.instructor.bio && (
                      <p className="text-gray-400">{course.instructor.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Reviews Section */}
            {courseId && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ReviewsSection courseId={courseId} />
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Course Info Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-2xl font-bold text-green-ecco">
                      {course.price.isFree ? 'Free' : `$${course.price.amount}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-semibold">{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Students
                    </span>
                    <span className="font-semibold">
                      {course.enrolledCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      Rating
                    </span>
                    <span className="font-semibold">
                      {course.rating.average.toFixed(1)} ({course.rating.count})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="font-semibold capitalize">{course.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lessons</span>
                    <span className="font-semibold">{lessons.length}</span>
                  </div>
                </div>

                {/* Enroll Button */}
                {isEnrolled ? (
                  <Link
                    to={`/courses/${courseId}/lessons`}
                    className="w-full bg-green-ecco text-black font-bold py-3 px-6 rounded-full text-center hover:bg-green-300 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue Learning <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <motion.button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-green-ecco text-black font-bold py-3 px-6 rounded-full hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </motion.button>
                )}
              </div>

              {/* Tags */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

