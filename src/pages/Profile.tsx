import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseService } from '../services/courseService';
import { Course, Certificate, Badge } from '../types/course';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  GraduationCap,
  Trophy,
  Edit,
  CheckCircle2
} from 'lucide-react';
import { mockBadges } from '../services/mockData';

const Profile = () => {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalTimeSpent: 0,
    certificatesEarned: 0,
    badgesEarned: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Load courses
        const allCourses = await CourseService.getAllCourses();
        const enrolled = allCourses.slice(0, 2); // Mock enrolled courses
        setEnrolledCourses(enrolled);
        setCompletedCourses([]); // Mock - no completed courses yet

        // Load certificates (mock)
        const mockCertificates: Certificate[] = [];
        setCertificates(mockCertificates);

        // Load badges
        setBadges(mockBadges);
        const earned = new Set(['badge-1', 'badge-2']);
        setEarnedBadges(earned);

        // Calculate stats
        setStats({
          totalCourses: enrolled.length,
          completedCourses: 0,
          totalLessons: enrolled.reduce((acc, course) => acc + (course.lessons?.length || 0), 0),
          completedLessons: 0,
          totalTimeSpent: 0,
          certificatesEarned: mockCertificates.length,
          badgesEarned: earned.size,
          currentStreak: 0,
          longestStreak: 0
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || 'User'}
                    className="w-24 h-24 rounded-full border-4 border-green-ecco"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-ecco flex items-center justify-center border-4 border-green-ecco">
                    <span className="text-black text-3xl font-bold">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border-2 border-gray-700 hover:border-green-ecco transition-colors">
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {user?.firstName || 'User'} {user?.lastName}
                  </h1>
                  {user?.hasVerifiedEmailAddress && (
                    <CheckCircle2 className="w-6 h-6 text-green-ecco" title="Verified" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                  {user?.primaryEmailAddress && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.primaryEmailAddress.emailAddress}</span>
                    </div>
                  )}
                  {user?.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.createdAt.toString())}</span>
                    </div>
                  )}
                </div>
                {!user?.hasImage && (
                  <p className="text-gray-400 text-sm">
                    Add a bio to tell others about yourself
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Courses</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
            <p className="text-xs text-gray-500">Enrolled</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.completedCourses}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Time Spent</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
            <p className="text-xs text-gray-500">Learning</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Streak</span>
            </div>
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-gray-500">Days</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-green-ecco" />
                  Enrolled Courses
                </h2>
                <Link
                  to="/courses"
                  className="text-sm text-green-ecco hover:text-green-300"
                >
                  Browse More
                </Link>
              </div>
              {enrolledCourses.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No enrolled courses yet</p>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-400">{course.shortDescription}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 capitalize">{course.difficulty}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Certificates */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-green-ecco" />
                  Certificates
                </h2>
                <Link
                  to="/dashboard/certificates"
                  className="text-sm text-green-ecco hover:text-green-300"
                >
                  View All
                </Link>
              </div>
              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 mb-2">No certificates yet</p>
                  <p className="text-sm text-gray-500">Complete courses to earn certificates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.slice(0, 4).map((certificate) => (
                    <div
                      key={certificate.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <h3 className="font-semibold mb-2 line-clamp-2">{certificate.courseTitle}</h3>
                      <p className="text-xs text-gray-400">
                        Issued {formatDate(certificate.issuedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Badges */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-ecco" />
                  Badges
                </h2>
                <Link
                  to="/dashboard/achievements"
                  className="text-sm text-green-ecco hover:text-green-300"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {badges.slice(0, 6).map((badge) => {
                  const isEarned = earnedBadges.has(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center
                        border-2 transition-all
                        ${
                          isEarned
                            ? 'bg-green-ecco/20 border-green-ecco'
                            : 'bg-gray-800 border-gray-700 opacity-50'
                        }
                      `}
                      title={badge.name}
                    >
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      {isEarned && (
                        <CheckCircle2 className="w-4 h-4 text-green-ecco" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  {earnedBadges.size} of {badges.length} badges earned
                </p>
              </div>
            </motion.section>

            {/* Learning Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-ecco" />
                Learning Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Lessons Completed</span>
                    <span className="font-semibold">
                      {stats.completedLessons} / {stats.totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-green-ecco h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: stats.totalLessons > 0
                          ? `${(stats.completedLessons / stats.totalLessons) * 100}%`
                          : 0
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Courses Completed</span>
                    <span className="font-semibold">
                      {stats.completedCourses} / {stats.totalCourses}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-green-ecco h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: stats.totalCourses > 0
                          ? `${(stats.completedCourses / stats.totalCourses) * 100}%`
                          : 0
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Current Streak</span>
                    <span className="text-lg font-bold text-green-ecco">
                      {stats.currentStreak} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Longest Streak</span>
                    <span className="text-lg font-bold">
                      {stats.longestStreak} days
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

