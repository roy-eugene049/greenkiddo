import { Coins, TrendingUp } from 'lucide-react';
import { Points } from '../../types/gamification';

interface PointsDisplayProps {
  points: Points;
  showBreakdown?: boolean;
  compact?: boolean;
}

export const PointsDisplay = ({ points, showBreakdown = false, compact = false }: PointsDisplayProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-green-ecco" />
        <span className="text-white font-semibold">{points.total.toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-green-ecco" />
          <h3 className="text-white font-semibold text-lg">Points</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-ecco">{points.total.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
      </div>

      {showBreakdown && (
        <div className="space-y-2 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">This Week</span>
            <span className="text-white font-medium">{points.thisWeek.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">This Month</span>
            <span className="text-white font-medium">{points.thisMonth.toLocaleString()}</span>
          </div>
        </div>
      )}

      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Breakdown</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Lessons Completed</span>
              <span className="text-gray-300">{points.breakdown.lessonsCompleted}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Courses Completed</span>
              <span className="text-gray-300">{points.breakdown.coursesCompleted}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Quizzes Passed</span>
              <span className="text-gray-300">{points.breakdown.quizzesPassed}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Streaks</span>
              <span className="text-gray-300">{points.breakdown.streaks}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Challenges</span>
              <span className="text-gray-300">{points.breakdown.challenges}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Social</span>
              <span className="text-gray-300">{points.breakdown.social}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

