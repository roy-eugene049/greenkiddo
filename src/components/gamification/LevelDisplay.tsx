import { Award, Star } from 'lucide-react';
import { Level } from '../../types/gamification';
import { motion } from 'framer-motion';

interface LevelDisplayProps {
  level: Level;
  showProgress?: boolean;
  compact?: boolean;
}

export const LevelDisplay = ({ level, showProgress = true, compact = false }: LevelDisplayProps) => {
  const progressPercentage = level.xpToNextLevel > 0 
    ? (level.currentXP / level.xpToNextLevel) * 100 
    : 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-green-ecco" />
        <span className="text-white font-semibold">Lv. {level.current}</span>
        <span className="text-gray-400 text-sm">{level.title}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Award className="w-8 h-8 text-green-ecco" />
            {level.current >= 10 && (
              <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" fill="currentColor" />
            )}
          </div>
          <div>
            <div className="text-white font-semibold text-lg">Level {level.current}</div>
            <div className="text-sm text-gray-400">{level.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total XP</div>
          <div className="text-lg font-bold text-green-ecco">{level.totalXP.toLocaleString()}</div>
        </div>
      </div>

      {showProgress && level.xpToNextLevel > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {level.currentXP.toLocaleString()} / {level.xpToNextLevel.toLocaleString()} XP
            </span>
            <span className="text-green-ecco font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-ecco to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            {level.xpToNextLevel - level.currentXP} XP to Level {level.current + 1}
          </div>
        </div>
      )}

      {level.xpToNextLevel === 0 && (
        <div className="text-center py-2">
          <div className="text-green-ecco font-semibold">Max Level Reached!</div>
          <div className="text-xs text-gray-400 mt-1">You're a true champion</div>
        </div>
      )}
    </div>
  );
};

