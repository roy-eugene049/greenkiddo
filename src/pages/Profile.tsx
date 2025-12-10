import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseService } from '../services/courseService';
import { Course, Certificate, Badge } from '../types/course';
import {
  Mail,
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  GraduationCap,
  Trophy,
  Edit,
  CheckCircle2,
  X,
  Save,
  Sparkles
} from 'lucide-react';
import { mockBadges } from '../services/mockData';
import {
  getUserPreferences,
  saveUserPreferences,
  generateRandomEcoName,
  getDisplayName,
  getDisplayAvatar,
  setAvatarOptions
} from '../services/userPreferences';
import { getAvatarOptions, refreshAvatarCache, type RandomUserAvatar } from '../services/avatarService';

const Profile = () => {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
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
  
  // User preferences state
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [useEcoName, setUseEcoName] = useState(false);
  const [selectedEcoName, setSelectedEcoName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [availableAvatars, setAvailableAvatars] = useState<RandomUserAvatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  
  // Load user preferences
  useEffect(() => {
    if (user) {
      const prefs = getUserPreferences(user.id);
      setUseEcoName(prefs.useEcoName);
      setSelectedEcoName(prefs.selectedEcoName || '');
      setSelectedAvatar(prefs.selectedAvatar);
    }
  }, [user]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Load courses
        const allCourses = await CourseService.getAllCourses();
        const enrolled = allCourses.slice(0, 2); // Mock enrolled courses
        setEnrolledCourses(enrolled);

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

  const handleSaveNamePreference = () => {
    if (!user) return;
    
    const prefs = {
      useEcoName,
      selectedEcoName: useEcoName ? selectedEcoName : null,
      selectedAvatar: getUserPreferences(user.id).selectedAvatar
    };
    
    saveUserPreferences(user.id, prefs);
    setShowNameEditor(false);
  };

  const handleSaveAvatarPreference = () => {
    if (!user) return;
    
    const selectedAvatarData = availableAvatars.find(a => a.id === selectedAvatar);
    
    const prefs = {
      useEcoName: getUserPreferences(user.id).useEcoName,
      selectedEcoName: getUserPreferences(user.id).selectedEcoName,
      selectedAvatar: selectedAvatar || null,
      selectedAvatarUrl: selectedAvatarData?.url || null
    };
    
    saveUserPreferences(user.id, prefs);
    setShowAvatarPicker(false);
  };

  // Load avatars when picker opens
  useEffect(() => {
    if (showAvatarPicker && availableAvatars.length === 0) {
      setLoadingAvatars(true);
      getAvatarOptions().then(avatars => {
        setAvailableAvatars(avatars);
        // Update the global avatarOptions for compatibility
        setAvatarOptions(avatars);
        setLoadingAvatars(false);
      }).catch(() => {
        setLoadingAvatars(false);
      });
    }
  }, [showAvatarPicker, availableAvatars.length]);

  const handleRefreshAvatars = async () => {
    setLoadingAvatars(true);
    const newAvatars = await refreshAvatarCache();
    setAvailableAvatars(newAvatars);
    setAvatarOptions(newAvatars);
    setLoadingAvatars(false);
  };

  const handleRandomEcoName = () => {
    setSelectedEcoName(generateRandomEcoName());
  };

  // Get display values
  const displayName = user ? getDisplayName(user.id, user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User') : 'User';
  const displayAvatar = user ? getDisplayAvatar(user.id, user.imageUrl) : { type: 'url' as const, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' };

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
                <img
                  src={displayAvatar.value}
                  alt={displayName}
                  className="w-24 h-24 rounded-full border-4 border-green-ecco object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'User'}`;
                  }}
                />
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border-2 border-gray-700 hover:border-green-ecco transition-colors"
                  title="Change Avatar"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                    {displayName}
                    {useEcoName && (
                      <span className="text-lg text-green-ecco" title="Eco Champion Name">
                        <Sparkles className="w-5 h-5" />
                      </span>
                    )}
                  </h1>
                  {user?.hasVerifiedEmailAddress && (
                    <CheckCircle2 className="w-6 h-6 text-green-ecco" />
                  )}
                  <button
                    onClick={() => setShowNameEditor(true)}
                    className="ml-2 p-2 text-gray-400 hover:text-green-ecco transition-colors"
                    title="Edit Display Name"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
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

        {/* Name Editor Modal */}
        <AnimatePresence>
          {showNameEditor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={() => setShowNameEditor(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-green-ecco" />
                      Choose Your Display Name
                    </h2>
                    <button
                      onClick={() => setShowNameEditor(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Name Type Toggle */}
                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="radio"
                          checked={!useEcoName}
                          onChange={() => setUseEcoName(false)}
                          className="w-5 h-5 text-green-ecco"
                        />
                        <div>
                          <div className="font-semibold text-white">Real Name</div>
                          <div className="text-sm text-gray-400">
                            {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border-2 border-green-ecco/50">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="radio"
                          checked={useEcoName}
                          onChange={() => {
                            setUseEcoName(true);
                            if (!selectedEcoName) {
                              setSelectedEcoName(generateRandomEcoName());
                            }
                          }}
                          className="w-5 h-5 text-green-ecco"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            Eco Champion Name
                            <Sparkles className="w-4 h-4 text-green-ecco" />
                          </div>
                          <div className="text-sm text-gray-400">
                            Choose a fun eco-themed name
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Eco Name Generator */}
                    {useEcoName && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center space-y-4">
                          <div>
                            <p className="text-gray-400 mb-4">
                              Generate a unique eco champion name! Each click creates a brand new, creative name from millions of possible combinations.
                            </p>
                            <button
                              onClick={handleRandomEcoName}
                              className="w-full px-6 py-4 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-green-ecco/50 transform hover:scale-105"
                            >
                              <span className="text-2xl">🎲</span>
                              <span>Generate Random Eco Name</span>
                            </button>
                          </div>

                          {selectedEcoName && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-6 bg-green-ecco/10 border-2 border-green-ecco/30 rounded-lg"
                            >
                              <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-green-ecco" />
                                Your Eco Champion Name:
                              </div>
                              <div className="text-2xl font-bold text-green-ecco">{selectedEcoName}</div>
                              <p className="text-xs text-gray-500 mt-2">
                                Don't like it? Click the button above to generate another one!
                              </p>
                            </motion.div>
                          )}

                          {!selectedEcoName && (
                            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                              <p className="text-sm text-gray-400">
                                Click the button above to generate your unique eco champion name
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={handleSaveNamePreference}
                        disabled={useEcoName && !selectedEcoName}
                        className="flex-1 px-6 py-3 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save Name
                      </button>
                      <button
                        onClick={() => setShowNameEditor(false)}
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Avatar Picker Modal */}
        <AnimatePresence>
          {showAvatarPicker && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={() => setShowAvatarPicker(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      Choose Your Avatar
                    </h2>
                    <button
                      onClick={() => setShowAvatarPicker(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Use Account Avatar Option */}
                    <div
                      onClick={() => setSelectedAvatar(null)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedAvatar === null
                          ? 'bg-green-ecco/20 border-2 border-green-ecco'
                          : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="Account Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-green-ecco flex items-center justify-center">
                            <span className="text-black text-2xl font-bold">
                              {user?.firstName?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">Use Account Avatar</div>
                          <div className="text-sm text-gray-400">Your profile picture from your account</div>
                        </div>
                        {selectedAvatar === null && (
                          <CheckCircle2 className="w-6 h-6 text-green-ecco ml-auto" />
                        )}
                      </div>
                    </div>

                    {/* Random Avatars Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Choose Your Avatar</h3>
                        <button
                          onClick={handleRefreshAvatars}
                          disabled={loadingAvatars}
                          className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <span>🔄</span>
                          {loadingAvatars ? 'Loading...' : 'Refresh'}
                        </button>
                      </div>
                      {loadingAvatars && availableAvatars.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-green-ecco">Loading avatars...</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                          {availableAvatars.map((avatar) => (
                            <button
                              key={avatar.id}
                              onClick={() => setSelectedAvatar(avatar.id)}
                              className={`aspect-square rounded-lg flex items-center justify-center transition-all overflow-hidden ${
                                selectedAvatar === avatar.id
                                  ? 'bg-green-ecco/30 border-2 border-green-ecco scale-110'
                                  : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600 hover:scale-105'
                              }`}
                              title={avatar.name}
                            >
                              <img
                                src={avatar.thumbnail}
                                alt={avatar.name}
                                className="w-full h-full object-cover"
                              />
                              {selectedAvatar === avatar.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-green-ecco/20">
                                  <CheckCircle2 className="w-6 h-6 text-green-ecco" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    {selectedAvatar !== null && availableAvatars.length > 0 && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">Preview:</div>
                        <div className="flex items-center gap-4">
                          <img
                            src={availableAvatars.find(a => a.id === selectedAvatar)?.url}
                            alt="Selected Avatar"
                            className="w-16 h-16 rounded-full object-cover border-2 border-green-ecco"
                          />
                          <div>
                            <div className="font-semibold text-white">
                              {availableAvatars.find(a => a.id === selectedAvatar)?.name}
                            </div>
                            <div className="text-sm text-gray-400">This will be your avatar</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={handleSaveAvatarPreference}
                        className="flex-1 px-6 py-3 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save Avatar
                      </button>
                      <button
                        onClick={() => setShowAvatarPicker(false)}
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

