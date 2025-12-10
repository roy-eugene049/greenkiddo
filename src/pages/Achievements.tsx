import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Badge } from '../types/course';
import { Award, Trophy, Star, Lock, CheckCircle2 } from 'lucide-react';
import { mockBadges } from '../services/mockData';

const Achievements = () => {
  const { user } = useUser();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Load all available badges
        setBadges(mockBadges);

        // Mock: Simulate some earned badges
        // In real app, this would come from user's profile
        const earned = new Set(['badge-1', 'badge-2']); // First Steps and Week Warrior
        setEarnedBadges(earned);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [user]);

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return Award;
      case 'milestone':
        return Trophy;
      case 'special':
        return Star;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement':
        return 'text-green-ecco';
      case 'milestone':
        return 'text-yellow-500';
      case 'special':
        return 'text-purple-500';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'achievement':
        return 'bg-green-ecco/20 border-green-ecco/50';
      case 'milestone':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'special':
        return 'bg-purple-500/20 border-purple-500/50';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  const earnedCount = badges.filter(b => earnedBadges.has(b.id)).length;
  const totalCount = badges.length;
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading achievements...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-green-ecco" />
            <h1 className="text-4xl font-bold">Achievements & Badges</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Track your learning milestones and unlock achievements
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
              <p className="text-gray-400">
                {earnedCount} of {totalCount} badges earned
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-ecco">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-sm text-gray-400">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <motion.div
              className="bg-green-ecco h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const isEarned = earnedBadges.has(badge.id);
            const Icon = getBadgeIcon(badge.category);
            const categoryColor = getCategoryColor(badge.category);
            const categoryBg = getCategoryBg(badge.category);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-gray-900 border rounded-lg p-6
                  transition-all duration-300
                  ${isEarned ? `${categoryBg} border-2` : 'border-gray-800 opacity-60'}
                  ${isEarned ? 'hover:scale-105' : ''}
                `}
              >
                {/* Badge Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      ${isEarned ? categoryBg : 'bg-gray-800 border-2 border-gray-700'}
                    `}
                  >
                    <span className="text-4xl">{badge.icon}</span>
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className={`text-xl font-bold ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    {isEarned && (
                      <Icon className={`w-5 h-5 ${categoryColor}`} />
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${isEarned ? 'text-gray-300' : 'text-gray-500'}`}>
                    {badge.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${isEarned ? categoryBg : 'bg-gray-800 text-gray-500'}
                      `}
                    >
                      {badge.category}
                    </span>
                    {isEarned && badge.earnedAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Locked Overlay */}
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <Lock className="w-8 h-8 text-gray-600" />
                  </div>
                )}

                {/* Earned Badge */}
                {isEarned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-ecco flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-green-ecco" />
              <h3 className="text-lg font-bold">Achievements</h3>
            </div>
            <p className="text-sm text-gray-400">
              Complete specific tasks and milestones to unlock achievement badges.
            </p>
            <div className="mt-4 text-2xl font-bold text-green-ecco">
              {badges.filter(b => b.category === 'achievement' && earnedBadges.has(b.id)).length} / {badges.filter(b => b.category === 'achievement').length}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-bold">Milestones</h3>
            </div>
            <p className="text-sm text-gray-400">
              Reach significant learning milestones and track your progress.
            </p>
            <div className="mt-4 text-2xl font-bold text-yellow-500">
              {badges.filter(b => b.category === 'milestone' && earnedBadges.has(b.id)).length} / {badges.filter(b => b.category === 'milestone').length}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-bold">Special</h3>
            </div>
            <p className="text-sm text-gray-400">
              Rare and special badges for exceptional achievements.
            </p>
            <div className="mt-4 text-2xl font-bold text-purple-500">
              {badges.filter(b => b.category === 'special' && earnedBadges.has(b.id)).length} / {badges.filter(b => b.category === 'special').length}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Achievements;

