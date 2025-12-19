import { CheckCircle2, Lock, Star, Award } from 'lucide-react';
import { Quest } from '../../types/gamification';
import { motion } from 'framer-motion';

interface QuestCardProps {
  quest: Quest;
  onStepComplete?: (questId: string, stepId: string) => void;
}

const getDifficultyColor = (difficulty: Quest['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 border-green-500 text-green-400';
    case 'medium':
      return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    case 'hard':
      return 'bg-red-500/20 border-red-500 text-red-400';
    default:
      return 'bg-gray-500/20 border-gray-500 text-gray-400';
  }
};

const getTypeIcon = (type: Quest['type']) => {
  switch (type) {
    case 'main':
      return '⭐';
    case 'side':
      return '📋';
    case 'daily':
      return '📅';
    default:
      return '🎯';
  }
};

export const QuestCard = ({ quest, onStepComplete }: QuestCardProps) => {
  const progressPercentage = quest.target > 0 
    ? Math.min((quest.progress / quest.target) * 100, 100)
    : 0;
  
  const difficultyColor = getDifficultyColor(quest.difficulty);
  const completedSteps = quest.steps.filter(s => s.completed).length;
  const totalSteps = quest.steps.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gray-900 border rounded-lg p-4 transition-all
        ${!quest.unlocked 
          ? 'border-gray-700 opacity-60' 
          : quest.completed
          ? 'border-green-ecco bg-green-ecco/5'
          : 'border-gray-800 hover:border-gray-700'
        }
      `}
    >
      {!quest.unlocked && (
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-sm">Locked - Complete prerequisites to unlock</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{getTypeIcon(quest.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${quest.completed ? 'text-green-ecco' : quest.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {quest.title}
              </h3>
              {quest.completed && (
                <CheckCircle2 className="w-5 h-5 text-green-ecco flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${difficultyColor}`}>
                {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
              </div>
              <div className="text-xs text-gray-500">
                {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)} Quest
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {quest.unlocked && !quest.completed && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              {quest.progress} / {quest.target}
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

      {/* Steps */}
      {quest.steps && quest.steps.length > 0 && (
        <div className="space-y-2 mb-3">
          <div className="text-xs text-gray-400 font-medium">
            Steps ({completedSteps}/{totalSteps})
          </div>
          {quest.steps.map((step) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-2 p-2 rounded text-sm
                ${step.completed 
                  ? 'bg-green-ecco/10 border border-green-ecco/30' 
                  : 'bg-gray-800 border border-gray-700'
                }
              `}
            >
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-ecco flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className={step.completed ? 'text-green-ecco' : 'text-gray-300'}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-ecco">
            <Award className="w-4 h-4" />
            <span className="font-medium">{quest.rewards.points} pts</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <span className="font-medium">+{quest.rewards.xp} XP</span>
          </div>
          {quest.rewards.badge && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4" />
              <span className="font-medium">Badge</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

