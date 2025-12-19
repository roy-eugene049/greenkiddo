import { CheckCircle2, Clock, Target, Award } from 'lucide-react';
import { Challenge } from '../../types/gamification';
import { motion } from 'framer-motion';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete?: (challengeId: string) => void;
}

const getTypeColor = (type: Challenge['type']) => {
  switch (type) {
    case 'daily':
      return 'bg-blue-500/20 border-blue-500 text-blue-400';
    case 'weekly':
      return 'bg-purple-500/20 border-purple-500 text-purple-400';
    case 'monthly':
      return 'bg-pink-500/20 border-pink-500 text-pink-400';
    case 'special':
      return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    default:
      return 'bg-gray-500/20 border-gray-500 text-gray-400';
  }
};

const getCategoryIcon = (category: Challenge['category']) => {
  switch (category) {
    case 'learning':
      return '📚';
    case 'streak':
      return '🔥';
    case 'social':
      return '👥';
    case 'quiz':
      return '📝';
    case 'exploration':
      return '🗺️';
    default:
      return '🎯';
  }
};

export const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  const progressPercentage = challenge.target > 0 
    ? Math.min((challenge.progress / challenge.target) * 100, 100)
    : 0;
  
  const typeColor = getTypeColor(challenge.type);
  const isExpired = challenge.expiresAt && new Date(challenge.expiresAt) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gray-900 border rounded-lg p-4 transition-all
        ${challenge.completed 
          ? 'border-green-ecco bg-green-ecco/5' 
          : isExpired
          ? 'border-gray-700 opacity-60'
          : 'border-gray-800 hover:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{challenge.icon || getCategoryIcon(challenge.category)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${challenge.completed ? 'text-green-ecco' : 'text-white'}`}>
                {challenge.title}
              </h3>
              {challenge.completed && (
                <CheckCircle2 className="w-5 h-5 text-green-ecco flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
              {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {!challenge.completed && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              {challenge.progress} / {challenge.target}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-ecco to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Requirements */}
      {challenge.requirements && challenge.requirements.length > 0 && (
        <div className="space-y-1 mb-3">
          {challenge.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
              <Target className="w-3 h-3" />
              <span>{req.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-ecco">
            <Award className="w-4 h-4" />
            <span className="font-medium">{challenge.pointsReward} pts</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <span className="font-medium">+{challenge.xpReward} XP</span>
          </div>
        </div>
        {challenge.expiresAt && !challenge.completed && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {isExpired 
                ? 'Expired' 
                : `Expires ${new Date(challenge.expiresAt).toLocaleDateString()}`
              }
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

