import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Course } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { useCourseStore } from '../../store/useCourseStore';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';

const CourseManagement = () => {
  const { courses, setCourses, loading, setLoading } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      // Always fetch fresh data from service (which includes custom courses)
      const allCourses = await CourseService.getAllCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      // In real app, this would call the admin service
      // await deleteCourse(courseId);
      await loadCourses();
      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      // In real app, this would call the admin service
      // await updateCourse(course.id, { isPublished: !course.isPublished });
      await loadCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterPublished === 'all' ||
      (filterPublished === 'published' && course.isPublished) ||
      (filterPublished === 'unpublished' && !course.isPublished);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading courses...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-400 text-lg">
              Create, edit, and manage courses
            </p>
          </div>
          <Link
            to="/dashboard/admin/courses/new"
            className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
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
                placeholder="Search courses..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'unpublished')}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ecco"
              >
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No courses found</h2>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first course'}
            </p>
            {!searchQuery && (
              <Link
                to="/dashboard/admin/courses/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-ecco/50 transition-colors"
              >
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{course.title}</h3>
                          {course.isPublished ? (
                            <span className="px-2 py-1 bg-green-ecco/20 text-green-ecco text-xs font-semibold rounded">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-semibold rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                      <span>Instructor: {course.instructor.name}</span>
                      <span>•</span>
                      <span>{course.duration} min</span>
                      <span>•</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>•</span>
                      <span>{course.enrolledCount} students</span>
                      <span>•</span>
                      <span>⭐ {course.rating.average} ({course.rating.count})</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 5).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/dashboard/admin/courses/${course.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => togglePublish(course)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {course.isPublished ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Publish
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-2">Delete Course</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone and will remove all associated lessons and data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedCourse.id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement;

