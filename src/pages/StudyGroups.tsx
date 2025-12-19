import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Users, Plus, Search, Filter, Globe, Lock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StudyGroup } from '../types/social';
import { getStudyGroups, createStudyGroup } from '../services/socialService';
import { StudyGroupCard } from '../components/social/StudyGroupCard';
import { motion } from 'framer-motion';

const StudyGroups = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private' | 'my-groups'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'General',
    isPublic: true,
    tags: [] as string[],
    maxMembers: undefined as number | undefined,
  });

  useEffect(() => {
    const loadGroups = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const groupsData = await getStudyGroups(user.id);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading study groups:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [user]);

  const handleCreateGroup = async () => {
    if (!user || !newGroup.name.trim()) return;

    try {
      const created = await createStudyGroup({
        ...newGroup,
        createdBy: {
          id: user.id,
          name: user.fullName || user.firstName || 'User',
          avatar: user.imageUrl,
        },
        tags: newGroup.tags,
      });
      
      setGroups([created, ...groups]);
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        description: '',
        category: 'General',
        isPublic: true,
        tags: [],
        maxMembers: undefined,
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'public' && group.isPublic) ||
      (filter === 'private' && !group.isPublic) ||
      (filter === 'my-groups' && group.members.some(m => m.userId === user?.id));

    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Please sign in to view study groups</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-green-ecco" />
              Study Groups
            </h1>
            <p className="text-gray-400">Join or create study groups to learn together</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-green-ecco text-black font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search study groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'all'
                  ? 'bg-green-ecco/20 border-green-ecco text-green-ecco'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                filter === 'public'
                  ? 'bg-green-ecco/20 border-green-ecco text-green-ecco'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              Public
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                filter === 'private'
                  ? 'bg-green-ecco/20 border-green-ecco text-green-ecco'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <Lock className="w-4 h-4" />
              Private
            </button>
            <button
              onClick={() => setFilter('my-groups')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === 'my-groups'
                  ? 'bg-green-ecco/20 border-green-ecco text-green-ecco'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              My Groups
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading study groups...</div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No study groups found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a study group!'}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-ecco text-black font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-colors"
              >
                Create Group
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Create Study Group</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-ecco"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-ecco"
                    rows={4}
                    placeholder="Describe your study group"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newGroup.category}
                    onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-ecco"
                  >
                    <option value="General">General</option>
                    <option value="Course-Specific">Course-Specific</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Project-Based">Project-Based</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGroup.isPublic}
                      onChange={(e) => setNewGroup({ ...newGroup, isPublic: e.target.checked })}
                      className="w-4 h-4 text-green-ecco bg-gray-800 border-gray-700 rounded focus:ring-green-ecco"
                    />
                    <span className="text-sm text-gray-300">Public Group</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Members (optional)
                  </label>
                  <input
                    type="number"
                    value={newGroup.maxMembers || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, maxMembers: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-ecco"
                    placeholder="Leave empty for unlimited"
                    min="2"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-green-ecco text-black font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-colors"
                  disabled={!newGroup.name.trim()}
                >
                  Create Group
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyGroups;

