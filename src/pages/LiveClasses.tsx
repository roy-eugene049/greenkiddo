import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { LiveClass } from '../types/liveClass';
import {
  getAllLiveClasses,
  getUpcomingLiveClasses,
  getLiveClassesByStatus,
  registerForLiveClass,
  isUserRegistered,
} from '../services/liveClassService';
import {
  Video,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

const LiveClasses = () => {
  const { user } = useUser();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, [filter]);

  const loadClasses = () => {
    setLoading(true);
    let filtered: LiveClass[] = [];

    switch (filter) {
      case 'upcoming':
        filtered = getUpcomingLiveClasses();
        break;
      case 'live':
        filtered = getLiveClassesByStatus('live');
        break;
      case 'completed':
        filtered = getLiveClassesByStatus('completed');
        break;
      default:
        filtered = getAllLiveClasses();
    }

    setClasses(filtered);
    setLoading(false);
  };

  const handleRegister = (classId: string) => {
    if (!user) return;

    try {
      registerForLiveClass(classId, user.id);
      loadClasses();
    } catch (error) {
      console.error('Error registering for class:', error);
    }
  };

  const getStatusBadge = (status: LiveClass['status']) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-semibold">
            Scheduled
          </span>
        );
      case 'live':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            Live Now
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded text-xs font-semibold">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-semibold">
            Cancelled
          </span>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Live Classes</h1>
            <p className="text-gray-400">Join interactive live sessions with instructors</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            {(['all', 'upcoming', 'live', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === f
                    ? 'bg-green-ecco text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Classes Grid */}
          {classes.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold mb-2">No classes found</h3>
              <p className="text-gray-400">Check back later for upcoming live classes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((liveClass) => (
                <motion.div
                  key={liveClass.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-green-ecco/50 transition-colors"
                >
                  {/* Thumbnail/Status */}
                  <div className="relative h-48 bg-gradient-to-br from-green-ecco/20 to-blue-500/20 flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(liveClass.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{liveClass.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {liveClass.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(liveClass.scheduledAt), 'MMM dd, yyyy • h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{liveClass.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {liveClass.currentParticipants} / {liveClass.maxParticipants} participants
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-semibold">Instructor:</span> {liveClass.instructor.name}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {liveClass.status === 'live' ? (
                        <Link
                          to={`/dashboard/live-classes/${liveClass.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Join Now
                        </Link>
                      ) : liveClass.status === 'scheduled' ? (
                        <>
                          {user && isUserRegistered(liveClass.id, user.id) ? (
                            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco/20 text-green-ecco border border-green-ecco/30 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                              Registered
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRegister(liveClass.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco hover:bg-green-300 text-black font-semibold rounded-lg transition-colors"
                            >
                              Register
                            </button>
                          )}
                          <Link
                            to={`/dashboard/live-classes/${liveClass.id}`}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </>
                      ) : liveClass.status === 'completed' && liveClass.recordingUrl ? (
                        <Link
                          to={`/dashboard/live-classes/${liveClass.id}/recording`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Watch Recording
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveClasses;

