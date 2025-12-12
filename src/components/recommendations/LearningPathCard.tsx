import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { LearningPath } from '../../services/recommendationService';

interface LearningPathCardProps {
  path: LearningPath;
  progress?: number; // 0-100
}

const LearningPathCard = ({ path, progress = 0 }: LearningPathCardProps) => {
  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-ecco/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{path.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{path.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[path.difficulty]}`}
        >
          {path.difficulty}
        </span>
      </div>

      {progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-green-ecco font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-ecco h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          {path.courses.length} courses
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          ~{path.estimatedDuration}h
        </span>
        {path.category.length > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {path.category[0]}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {path.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/learning-paths/${path.id}`}
          className="flex items-center gap-2 text-green-ecco hover:text-green-300 transition-colors text-sm font-semibold"
        >
          View Path
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default LearningPathCard;

