import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AnalyticsData } from '../../types/analytics';
import { getAnalyticsData } from '../../services/analyticsService';
import {
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
    return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Failed to load analytics</div>
        </div>
      </DashboardLayout>
    );
  }

  const { overview, learningMetrics, coursePerformance } = analytics;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400 text-lg">
              Insights into your learning platform performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Users</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(overview.totalUsers)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {overview.activeUsers} active
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Enrollments</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(overview.totalEnrollments)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {overview.totalCompletions} completed
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Completion Rate</span>
            </div>
            <p className="text-3xl font-bold">{overview.averageCompletionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              Average across courses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Time Spent</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(overview.totalTimeSpent)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(overview.averageTimePerUser)} avg/user
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Most Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <h2 className="text-xl font-bold">Most Popular Courses</h2>
            </div>
            <div className="space-y-4">
              {learningMetrics.mostPopularCourses.map((course, index) => (
                <div key={course.courseId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                      <p className="font-semibold text-sm">{course.courseTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{course.enrollments} enrollments</span>
                      <span>•</span>
                      <span>{course.completionRate}% completion</span>
                      <span>•</span>
                      <span>⭐ {course.averageRating}</span>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-ecco h-2 rounded-full"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Engagement by Category</h2>
            </div>
            <div className="space-y-4">
              {learningMetrics.engagementByCategory.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{category.category}</span>
                    <span className="text-xs text-gray-400">
                      {category.enrollments} enrollments
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{
                        width: `${(category.enrollments / learningMetrics.engagementByCategory[0]?.enrollments || 1) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{category.completions} completions</span>
                    <span>⭐ {category.averageRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Course Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Course Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Course</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Enrollments</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Completions</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Completion Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Avg Time</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Rating</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((course) => (
                  <tr key={course.courseId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-sm">{course.courseTitle}</p>
                    </td>
                    <td className="text-right py-3 px-4 text-sm">{course.enrollments}</td>
                    <td className="text-right py-3 px-4 text-sm">{course.completions}</td>
                    <td className="text-right py-3 px-4 text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <span>{course.completionRate}%</span>
                        <div className="w-16 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-green-ecco h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-sm">
                      {formatTime(course.averageTimeSpent)}
                    </td>
                    <td className="text-right py-3 px-4 text-sm">
                      ⭐ {course.averageRating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Learning Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Avg Course Progress</span>
            </div>
            <p className="text-2xl font-bold">{learningMetrics.averageCourseProgress}%</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Avg Lesson Time</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(learningMetrics.averageLessonCompletionTime)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Total Courses</span>
            </div>
            <p className="text-2xl font-bold">{overview.totalCourses}</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;

