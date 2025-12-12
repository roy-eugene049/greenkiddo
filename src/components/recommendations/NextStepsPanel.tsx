import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { getNextSteps, NextStep } from '../../services/recommendationService';

interface NextStepsPanelProps {
  userId: string;
}

const NextStepsPanel = ({ userId }: NextStepsPanelProps) => {
  const [nextSteps, setNextSteps] = useState<NextStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNextSteps = async () => {
      setLoading(true);
      try {
        const steps = await getNextSteps(userId);
        setNextSteps(steps);
      } catch (error) {
        console.error('Error loading next steps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNextSteps();
  }, [userId]);

  const getStepIcon = (type: NextStep['type']) => {
    switch (type) {
      case 'continue_course':
        return <PlayCircle className="w-5 h-5 text-green-ecco" />;
      case 'start_course':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'complete_lesson':
        return <CheckCircle className="w-5 h-5 text-yellow-400" />;
      case 'take_quiz':
        return <CheckCircle className="w-5 h-5 text-purple-400" />;
      default:
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  const getStepUrl = (step: NextStep) => {
    if (step.courseId && step.lessonId) {
      return `/courses/${step.courseId}/lessons/${step.lessonId}`;
    }
    if (step.courseId) {
      return `/courses/${step.courseId}`;
    }
    return '/dashboard';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (nextSteps.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-green-ecco" />
          Next Steps
        </h3>
        <p className="text-gray-400">No next steps available. Start a new course!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-green-ecco" />
        Your Next Steps
      </h3>
      <div className="space-y-3">
        {nextSteps.map((step, index) => (
          <motion.div
            key={`${step.courseId}-${step.lessonId}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={getStepUrl(step)}
              className="block p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getStepIcon(step.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white group-hover:text-green-ecco transition-colors mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="capitalize">{step.type.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Priority: {step.priority}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-ecco transition-colors flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NextStepsPanel;

