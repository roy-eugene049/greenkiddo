import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseCard } from '../components/course/CourseCard';
import { CourseService } from '../services/courseService';
import { Course, UserProgress } from '../types/course';
import { BookOpen, Award, Clock, TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { useUserDisplay } from '../hooks/useUserDisplay';
import { getLearningStats, formatTimeSpent } from '../services/progressService';
import { useCourseStore } from '../store/useCourseStore';
import { useProgressStore } from '../store/useProgressStore';
import NextStepsPanel from '../components/recommendations/NextStepsPanel';
import { getRecommendations } from '../services/recommendationService';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { displayName } = useUserDisplay();
  const { courses, enrolledCourses, setCourses, enrollInCourse, isEnrolled, getEnrolledCourses, loading, setLoading } = useCourseStore();
  const { calculateCourseProgress } = useProgressStore();
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    lessonsFinished: 0,
    certificatesEarned: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isLoaded || !user) return;

      setLoading(true);
      try {
        // Get all courses
        const allCourses = await CourseService.getAllCourses();
        setCourses(allCourses);
        
        // Get enrolled courses from store
        const enrolled = getEnrolledCourses();
        const enrolledIds = enrolled.map(c => c.id);

        // Get recommended courses using recommendation service
        const { getRecommendations } = await import('../services/recommendationService');
        const recommendations = await getRecommendations(user.id, 6);
        setRecommendedCourses(recommendations.map(r => r.course));

        // Load progress for enrolled courses
        const progressPromises = enrolled.map(course => {
          const progress = CourseService.getUserProgress(user.id, course.id);
          const lessons = CourseService.getLessonsByCourseId(course.id);
          return Promise.all([progress, lessons]).then(([prog, less]) => ({
            courseId: course.id,
            progress: prog,
            totalLessons: less.length,
          }));
        });
        const progressResults = await Promise.all(progressPromises);
        
        const progressMap: Record<string, UserProgress> = {};
        progressResults.forEach(({ courseId, progress, totalLessons }) => {
          if (progress) {
            // Calculate actual progress percentage
            const actualProgress = calculateCourseProgress(user.id, courseId, totalLessons);
            progressMap[courseId] = {
              ...progress,
              progressPercentage: actualProgress,
            };
          }
        });
        setProgressData(progressMap);

        // Calculate stats using progress service
        const learningStats = getLearningStats(user.id);
        setStats({
          coursesCompleted: 0,
          lessonsFinished: 0,
          certificatesEarned: 0,
          totalTimeSpent: learningStats.totalTimeSpent
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, isLoaded]);

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    try {
      await CourseService.enrollInCourse(
        user.id,
        courseId,
        user.emailAddresses[0]?.emailAddress,
        user.fullName || user.firstName || 'User'
      );
      enrollInCourse(courseId);
      // Reload courses
      const allCourses = await CourseService.getAllCourses();
      setCourses(allCourses);
      const enrolled = getEnrolledCourses();
      const enrolledIds = enrolled.map(c => c.id);
      // Reload recommendations
      const recommendations = await getRecommendations(user.id, 6);
      setRecommendedCourses(recommendations.map(r => r.course));
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Continue your journey to becoming a sustainability champion
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Courses</span>
            </div>
            <p className="text-2xl font-bold">{getEnrolledCourses().length}</p>
            <p className="text-xs text-gray-500">Enrolled</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Certificates</span>
            </div>
            <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
            <p className="text-xs text-gray-500">Earned</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Time Spent</span>
            </div>
            <p className="text-xl font-bold">{formatTimeSpent(stats.totalTimeSpent)}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-gray-400 text-sm">Streak</span>
            </div>
            <p className="text-2xl font-bold">
              {user ? getLearningStats(user.id).currentStreak : 0}
            </p>
            <p className="text-xs text-gray-500">Days</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Progress</span>
            </div>
            <p className="text-2xl font-bold">
              {getEnrolledCourses().length > 0
                ? Math.round(
                    Object.values(progressData).reduce(
                      (acc, p) => acc + p.progressPercentage,
                      0
                    ) / getEnrolledCourses().length
                  )
                : 0}%
            </p>
            <p className="text-xs text-gray-500">Average</p>
          </div>
        </motion.div>

        {/* Continue Learning Section */}
        {getEnrolledCourses().length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Continue Learning</h2>
                <p className="text-gray-400">Pick up where you left off</p>
              </div>
              <Link
                to="/courses"
                className="text-green-ecco hover:text-green-300 flex items-center gap-2 transition-colors text-sm font-medium"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getEnrolledCourses().map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress={true}
                  progressPercentage={progressData[course.id]?.progressPercentage || 0}
                />
              ))}
            </div>
          </motion.section>
        )}


        {/* Next Steps */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <NextStepsPanel userId={user.id} />
          </motion.section>
        )}

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Recommended for You</h2>
                <p className="text-gray-400">Discover new courses to expand your knowledge</p>
              </div>
              <Link
                to="/courses"
                className="text-green-ecco hover:text-green-300 flex items-center gap-2 transition-colors text-sm font-medium"
              >
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedCourses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {getEnrolledCourses().length === 0 && recommendedCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
            <p className="text-gray-400 mb-6">
              Start your sustainability journey by enrolling in a course
            </p>
            <Link
              to="/courses"
              className="inline-block bg-green-ecco text-black font-bold py-3 px-6 rounded-full hover:bg-green-300 transition-colors"
            >
              Browse Courses
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

