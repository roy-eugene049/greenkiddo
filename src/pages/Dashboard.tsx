import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseCard } from '../components/course/CourseCard';
import { CourseService } from '../services/courseService';
import { Course, UserProgress } from '../types/course';
import { BookOpen, Award, Clock, TrendingUp, ArrowRight, PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
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
        
        // Mock: Assume user is enrolled in first 2 courses
        // In real app, this would come from user's enrolled courses
        const enrolled = allCourses.slice(0, 2);
        setEnrolledCourses(enrolled);

        // Get recommended courses (rest of the courses)
        const recommended = allCourses.slice(2);
        setRecommendedCourses(recommended);

        // Load progress for enrolled courses
        const progressPromises = enrolled.map(course =>
          CourseService.getUserProgress(user.id, course.id)
        );
        const progressResults = await Promise.all(progressPromises);
        
        const progressMap: Record<string, UserProgress> = {};
        enrolled.forEach((course, index) => {
          if (progressResults[index]) {
            progressMap[course.id] = progressResults[index]!;
          }
        });
        setProgressData(progressMap);

        // Calculate stats (mock data)
        setStats({
          coursesCompleted: 0,
          lessonsFinished: 0,
          certificatesEarned: 0,
          totalTimeSpent: 0
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
      await CourseService.enrollInCourse(user.id, courseId);
      // Reload courses
      const allCourses = await CourseService.getAllCourses();
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        setEnrolledCourses([...enrolledCourses, course]);
        setRecommendedCourses(recommendedCourses.filter(c => c.id !== courseId));
      }
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
            Welcome back, {user?.firstName || 'Learner'}! 👋
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Courses</span>
            </div>
            <p className="text-2xl font-bold">{enrolledCourses.length}</p>
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
            <p className="text-2xl font-bold">{stats.totalTimeSpent}</p>
            <p className="text-xs text-gray-500">Minutes</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Progress</span>
            </div>
            <p className="text-2xl font-bold">
              {enrolledCourses.length > 0
                ? Math.round(
                    Object.values(progressData).reduce(
                      (acc, p) => acc + p.progressPercentage,
                      0
                    ) / enrolledCourses.length
                  )
                : 0}%
            </p>
            <p className="text-xs text-gray-500">Average</p>
          </div>
        </motion.div>

        {/* Continue Learning Section */}
        {enrolledCourses.length > 0 && (
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
              {enrolledCourses.map((course) => (
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
        {enrolledCourses.length === 0 && recommendedCourses.length === 0 && (
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

