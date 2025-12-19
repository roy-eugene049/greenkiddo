import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LeaderboardEntry } from '../../types/gamification';
import { motion } from 'framer-motion';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" fill="currentColor" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" fill="currentColor" />;
  if (rank === 3) return <Award className="w-6 h-6 text-orange-400" fill="currentColor" />;
  return null;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-orange-400';
  return 'text-gray-400';
};

export const LeaderboardCard = ({ entry, isCurrentUser = false }: LeaderboardCardProps) => {
  const rankIcon = getRankIcon(entry.rank);
  const rankColor = getRankColor(entry.rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex items-center gap-4 p-4 rounded-lg border transition-all
        ${isCurrentUser 
          ? 'bg-green-ecco/10 border-green-ecco' 
          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
        }
      `}
    >
      {/* Rank */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${rankColor}`}>
        {rankIcon || <span>{entry.rank}</span>}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {entry.userAvatar ? (
          <img 
            src={entry.userAvatar} 
            alt={entry.userName}
            className="w-10 h-10 rounded-full border-2 border-gray-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
            {entry.userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className={`font-semibold truncate ${isCurrentUser ? 'text-green-ecco' : 'text-white'}`}>
            {entry.userName}
            {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
          </div>
          <div className="text-xs text-gray-400">Level {entry.level}</div>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <div className="text-lg font-bold text-white">{entry.points.toLocaleString()}</div>
        <div className="text-xs text-gray-400">points</div>
      </div>

      {/* Rank Change */}
      {entry.change !== undefined && entry.change !== 0 && (
        <div className={`flex items-center gap-1 ${entry.change > 0 ? 'text-green-ecco' : 'text-red-400'}`}>
          {entry.change > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">{Math.abs(entry.change)}</span>
        </div>
      )}
      {entry.change === 0 && (
        <div className="text-gray-600">
          <Minus className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};

