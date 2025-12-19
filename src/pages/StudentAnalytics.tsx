import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarChart3, TrendingUp, Clock, BookOpen, Award, Download, FileText, Calendar } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StudentProgressAnalytics, EngagementMetrics } from '../types/studentAnalytics';
import { getStudentProgressAnalytics, getStudentEngagementMetrics } from '../services/studentAnalyticsService';
import { formatTimeSpent } from '../services/progressService';
import { motion } from 'framer-motion';

const StudentAnalytics = () => {
  const { user } = useUser();
  const [progressAnalytics, setProgressAnalytics] = useState<StudentProgressAnalytics | null>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'engagement'>('overview');

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [progress, engagement] = await Promise.all([
          getStudentProgressAnalytics(user.id),
          getStudentEngagementMetrics(user.id),
        ]);
        setProgressAnalytics(progress);
        setEngagementMetrics(engagement);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Please sign in to view analytics</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading your analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progressAnalytics || !engagementMetrics) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Failed to load analytics</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-ecco" />
              My Analytics
            </h1>
            <p className="text-gray-400 text-lg">Track your learning progress and performance</p>
          </div>
          <button
            onClick={() => {
              // Export functionality would go here
              alert('Export functionality coming soon!');
            }}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'engagement', label: 'Engagement', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-ecco text-green-ecco'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-ecco" />
                  <span className="text-gray-400 text-sm">Courses</span>
                </div>
                <p className="text-2xl font-bold">{progressAnalytics.totalCoursesEnrolled}</p>
                <p className="text-xs text-gray-500">Enrolled</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-ecco" />
                  <span className="text-gray-400 text-sm">Completed</span>
                </div>
                <p className="text-2xl font-bold">{progressAnalytics.totalCoursesCompleted}</p>
                <p className="text-xs text-gray-500">
                  {progressAnalytics.completionRate}% rate
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-ecco" />
                  <span className="text-gray-400 text-sm">Time Spent</span>
                </div>
                <p className="text-xl font-bold">{formatTimeSpent(progressAnalytics.totalTimeSpent)}</p>
                <p className="text-xs text-gray-500">Total</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-ecco" />
                  <span className="text-gray-400 text-sm">Progress</span>
                </div>
                <p className="text-2xl font-bold">{progressAnalytics.averageCourseProgress}%</p>
                <p className="text-xs text-gray-500">Average</p>
              </motion.div>
            </div>

            {/* Progress Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Weekly Activity</h3>
              <div className="h-64 flex items-end gap-2">
                {progressAnalytics.weeklyActivity.map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.value / 20) * 100}%` }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-1 bg-green-ecco rounded-t hover:bg-green-300 transition-colors"
                    title={`${data.date}: ${data.value} activities`}
                  />
                ))}
              </div>
            </div>

            {/* Category Progress */}
            {progressAnalytics.categoryProgress.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Progress by Category</h3>
                <div className="space-y-4">
                  {progressAnalytics.categoryProgress.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{cat.category}</span>
                        <span className="text-gray-400 text-sm">
                          {cat.coursesCompleted}/{cat.coursesEnrolled} courses
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-green-ecco h-2 rounded-full transition-all"
                          style={{ width: `${cat.averageProgress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {progressAnalytics.courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{course.courseTitle}</h3>
                    <p className="text-sm text-gray-400">
                      Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'completed'
                      ? 'bg-green-ecco/20 text-green-ecco'
                      : course.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {course.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {course.lessonsCompleted}/{course.totalLessons} lessons ({course.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-ecco h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>Time: {formatTimeSpent(course.timeSpent)}</span>
                    <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Consistency Score</div>
                <div className="text-3xl font-bold text-green-ecco">{engagementMetrics.consistencyScore}%</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Learning Days</div>
                <div className="text-3xl font-bold text-white">{engagementMetrics.learningDays}</div>
                <div className="text-xs text-gray-500 mt-1">out of 30 days</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Avg Session</div>
                <div className="text-3xl font-bold text-white">{engagementMetrics.averageSessionDuration} min</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Daily Activity (Last 30 Days)</h3>
              <div className="h-64 flex items-end gap-1">
                {engagementMetrics.dailyActiveMinutes.map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min((data.value / 120) * 100, 100)}%` }}
                    transition={{ delay: index * 0.01 }}
                    className="flex-1 bg-green-ecco rounded-t hover:bg-green-300 transition-colors"
                    title={`${data.date}: ${data.value} min`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Peak Learning Hours</h3>
              <div className="space-y-3">
                {engagementMetrics.peakLearningHours.map((hour) => (
                  <div key={hour.hour}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white">
                        {hour.hour}:00 - {hour.hour + 1}:00
                      </span>
                      <span className="text-gray-400 text-sm">
                        {hour.activityCount} sessions
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-ecco h-2 rounded-full"
                        style={{ width: `${(hour.activityCount / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAnalytics;

