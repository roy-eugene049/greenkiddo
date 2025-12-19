import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Trophy, Calendar, Users, Award } from 'lucide-react';
import { Leaderboard as LeaderboardType } from '../types/gamification';
import { getLeaderboard } from '../services/gamificationService';
import { LeaderboardCard } from '../components/gamification/LeaderboardCard';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getLeaderboard(selectedPeriod, user.id);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [user, selectedPeriod]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please sign in to view the leaderboard</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No leaderboard data available</div>
      </div>
    );
  }

  const periods = [
    { value: 'daily' as const, label: 'Daily', icon: Calendar },
    { value: 'weekly' as const, label: 'Weekly', icon: Calendar },
    { value: 'monthly' as const, label: 'Monthly', icon: Calendar },
    { value: 'all-time' as const, label: 'All Time', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-green-ecco" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-gray-400">Compete with other learners and climb the ranks!</p>
        </div>

        {/* Period Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                  ${selectedPeriod === period.value
                    ? 'bg-green-ecco/20 border-green-ecco text-green-ecco'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {period.label}
              </button>
            );
          })}
        </div>

        {/* User's Rank Card (if not in top 100) */}
        {leaderboard.userEntry && leaderboard.userRank && leaderboard.userRank > 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Your Rank</h3>
              <LeaderboardCard entry={leaderboard.userEntry} isCurrentUser={true} />
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.entries.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-1"
            >
              <div className="bg-gray-900 border-2 border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🥈</div>
                <div className="text-gray-300 font-bold text-lg mb-1">2nd</div>
                <div className="text-white font-semibold truncate">{leaderboard.entries[1].userName}</div>
                <div className="text-green-ecco font-bold mt-2">{leaderboard.entries[1].points.toLocaleString()} pts</div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 md:order-2"
            >
              <div className="bg-gradient-to-b from-yellow-400/20 to-gray-900 border-2 border-yellow-400 rounded-lg p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Trophy className="w-8 h-8 text-yellow-400" fill="currentColor" />
                </div>
                <div className="text-4xl mb-2">🥇</div>
                <div className="text-yellow-400 font-bold text-lg mb-1">1st</div>
                <div className="text-white font-semibold truncate">{leaderboard.entries[0].userName}</div>
                <div className="text-green-ecco font-bold mt-2">{leaderboard.entries[0].points.toLocaleString()} pts</div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3"
            >
              <div className="bg-gray-900 border-2 border-orange-400 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🥉</div>
                <div className="text-orange-400 font-bold text-lg mb-1">3rd</div>
                <div className="text-white font-semibold truncate">{leaderboard.entries[2].userName}</div>
                <div className="text-green-ecco font-bold mt-2">{leaderboard.entries[2].points.toLocaleString()} pts</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold">All Rankings</h2>
            <span className="text-gray-500 text-sm">({leaderboard.entries.length} players)</span>
          </div>

          {leaderboard.entries.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No rankings yet. Be the first to earn points!</p>
            </div>
          ) : (
            leaderboard.entries.map((entry, index) => (
              <LeaderboardCard
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === user.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

