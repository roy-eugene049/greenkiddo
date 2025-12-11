import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AdminUser } from '../../types/admin';
import { getAdminUsers, getAdminUserById } from '../../services/adminService';
import { Avatar } from '../../components/common/Avatar';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Eye,
  UserX,
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const adminUsers = await getAdminUsers();
      setUsers(adminUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const user = await getAdminUserById(userId);
      if (user) {
        setSelectedUser(user);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterActive === 'all' ||
      (filterActive === 'active' && user.isActive) ||
      (filterActive === 'inactive' && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
    return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading users...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400 text-lg">
            View and manage platform users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-ecco" />
              <span className="text-gray-400 text-sm">Active Users</span>
            </div>
            <p className="text-2xl font-bold">
              {users.filter(u => u.isActive).length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Certificates</span>
            </div>
            <p className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + u.certificates, 0)}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Total Time</span>
            </div>
            <p className="text-xl font-bold">
              {formatTime(users.reduce((sum, u) => sum + u.totalTimeSpent, 0))}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No users found</h2>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search' : 'No users in the system'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">User</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Email</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Courses</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Completed</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Certificates</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Streak</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Time Spent</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="sm"
                          />
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">
                              Joined {formatDate(user.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{user.email}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="text-sm">{user.enrolledCourses}</span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="text-sm">{user.completedCourses}</span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{user.certificates}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-orange-400" />
                          <span className="text-sm">{user.streak} days</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="text-sm">{formatTime(user.totalTimeSpent)}</span>
                      </td>
                      <td className="text-center py-4 px-6">
                        {user.isActive ? (
                          <span className="px-2 py-1 bg-green-ecco/20 text-green-ecco text-xs font-semibold rounded">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-semibold rounded">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-right py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dashboard/profile?userId=${user.id}`}
                            className="p-2 text-gray-400 hover:text-green-ecco transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">User Details</h3>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
                  <Avatar
                    src={selectedUser.avatar}
                    name={selectedUser.name}
                    size="lg"
                  />
                  <div>
                    <h4 className="text-xl font-bold mb-1">{selectedUser.name}</h4>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Enrolled</p>
                    <p className="text-2xl font-bold">{selectedUser.enrolledCourses}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold">{selectedUser.completedCourses}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Certificates</p>
                    <p className="text-2xl font-bold">{selectedUser.certificates}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Badges</p>
                    <p className="text-2xl font-bold">{selectedUser.badges}</p>
                  </div>
                </div>

                {/* Learning Stats */}
                <div className="space-y-4">
                  <h5 className="font-semibold">Learning Statistics</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Total Time</p>
                        <p className="font-semibold">{formatTime(selectedUser.totalTimeSpent)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm text-gray-400">Current Streak</p>
                        <p className="font-semibold">{selectedUser.streak} days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <h5 className="font-semibold">Account Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Joined:</span>
                      <span>{formatDate(selectedUser.joinedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Last Active:</span>
                      <span>{formatDate(selectedUser.lastActive)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Status:</span>
                      {selectedUser.isActive ? (
                        <span className="px-2 py-1 bg-green-ecco/20 text-green-ecco text-xs font-semibold rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-semibold rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <Link
                    to={`/dashboard/profile?userId=${selectedUser.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Profile
                  </Link>
                  <button
                    className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;

