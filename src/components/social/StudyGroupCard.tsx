import { Users, Lock, Globe, Calendar, ArrowRight } from 'lucide-react';
import { StudyGroup } from '../../types/social';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StudyGroupCardProps {
  group: StudyGroup;
}

export const StudyGroupCard = ({ group }: StudyGroupCardProps) => {
  const memberCount = group.members.length;
  const isFull = group.maxMembers && memberCount >= group.maxMembers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-ecco transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {group.icon && (
            <div className="text-4xl">{group.icon}</div>
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/dashboard/study-groups/${group.id}`}>
              <h3 className="text-xl font-semibold text-white mb-1 hover:text-green-ecco transition-colors">
                {group.name}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {group.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {memberCount}
                  {group.maxMembers && ` / ${group.maxMembers}`} members
                </span>
              </div>
              <div className="flex items-center gap-1">
                {group.isPublic ? (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(group.lastActivityAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {group.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          {group.category}
        </div>
        <Link
          to={`/dashboard/study-groups/${group.id}`}
          className="flex items-center gap-2 text-green-ecco hover:text-green-300 transition-colors text-sm font-medium"
        >
          View Group
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isFull && (
        <div className="mt-3 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-400">
          Group is full
        </div>
      )}
    </motion.div>
  );
};

