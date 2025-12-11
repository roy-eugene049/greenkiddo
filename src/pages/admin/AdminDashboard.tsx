import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AdminStats } from '../../types/admin';
import { getAdminStats } from '../../services/adminService';
import {
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  TrendingUp,
  Activity,
  Award,
  Clock,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading admin dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Failed to load stats</div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      link: '/dashboard/admin/users',
    },
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: stats.totalCourses,
      color: 'text-green-ecco',
      bgColor: 'bg-green-ecco/20',
      link: '/dashboard/admin/courses',
    },
    {
      icon: FileText,
      label: 'Total Lessons',
      value: stats.totalLessons,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      link: '/dashboard/admin/courses',
    },
    {
      icon: GraduationCap,
      label: 'Enrollments',
      value: stats.totalEnrollments,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      link: '/dashboard/admin/users',
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: stats.activeUsers,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      link: '/dashboard/admin/users',
    },
    {
      icon: Award,
      label: 'Courses Completed',
      value: stats.coursesCompleted,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20',
      link: '/dashboard/admin/analytics',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: `${stats.averageCompletionRate}%`,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/20',
      link: '/dashboard/admin/analytics',
    },
    {
      icon: Clock,
      label: 'Recent Activity',
      value: stats.recentActivity.length,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/20',
      link: '/dashboard/admin/activity',
    },
  ];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'course_created':
        return <BookOpen className="w-4 h-4 text-green-ecco" />;
      case 'course_completed':
        return <Award className="w-4 h-4 text-yellow-400" />;
      case 'enrollment':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'certificate_issued':
        return <Award className="w-4 h-4 text-orange-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Overview of your learning platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={card.link}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-green-ecco/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold mb-1">{card.value}</p>
                <p className="text-sm text-gray-400">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Link
              to="/dashboard/admin/activity"
              className="text-sm text-green-ecco hover:text-green-300"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            ) : (
              stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">{activity.description}</p>
                    {activity.userName && (
                      <p className="text-xs text-gray-400 mb-1">
                        User: {activity.userName}
                      </p>
                    )}
                    {activity.courseTitle && (
                      <p className="text-xs text-gray-400">
                        Course: {activity.courseTitle}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/admin/courses/new"
              className="p-4 bg-green-ecco/20 border border-green-ecco/50 rounded-lg hover:bg-green-ecco/30 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-green-ecco mb-2" />
              <h3 className="font-semibold mb-1">Create New Course</h3>
              <p className="text-sm text-gray-400">Add a new course to the platform</p>
            </Link>
            <Link
              to="/dashboard/admin/users"
              className="p-4 bg-blue-400/20 border border-blue-400/50 rounded-lg hover:bg-blue-400/30 transition-colors"
            >
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-gray-400">View and manage user accounts</p>
            </Link>
            <Link
              to="/dashboard/admin/analytics"
              className="p-4 bg-purple-400/20 border border-purple-400/50 rounded-lg hover:bg-purple-400/30 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-semibold mb-1">View Analytics</h3>
              <p className="text-sm text-gray-400">See detailed platform analytics</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

