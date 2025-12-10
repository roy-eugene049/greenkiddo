import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseService } from '../services/courseService';
import { Course, Lesson } from '../types/course';
import { BookmarkCheck, BookOpen, Clock, ExternalLink, X } from 'lucide-react';

const Bookmarks = () => {
  const { user } = useUser();
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Array<{
    courseId: string;
    lessonId: string;
    course: Course;
    lesson: Lesson;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem(`bookmarks-${user.id}`);
        if (!savedBookmarks) {
          setLoading(false);
          return;
        }

        const bookmarkIds: string[] = JSON.parse(savedBookmarks);
        const bookmarksData: Array<{
          courseId: string;
          lessonId: string;
          course: Course;
          lesson: Lesson;
        }> = [];

        // Load course and lesson data for each bookmark
        for (const bookmarkId of bookmarkIds) {
          // Parse bookmark format: "courseId:lessonId" or just "lessonId"
          const [courseId, lessonId] = bookmarkId.includes(':') 
            ? bookmarkId.split(':') 
            : ['', bookmarkId];

          if (courseId && lessonId) {
            try {
              const course = await CourseService.getCourseById(courseId);
              const lesson = await CourseService.getLessonById(lessonId);
              
              if (course && lesson) {
                bookmarksData.push({ courseId, lessonId, course, lesson });
              }
            } catch (error) {
              console.error(`Error loading bookmark ${bookmarkId}:`, error);
            }
          }
        }

        setBookmarkedLessons(bookmarksData);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const handleRemoveBookmark = (courseId: string, lessonId: string) => {
    if (!user) return;

    const bookmarkKey = `${courseId}:${lessonId}`;
    const savedBookmarks = localStorage.getItem(`bookmarks-${user.id}`);
    
    if (savedBookmarks) {
      const bookmarks: string[] = JSON.parse(savedBookmarks);
      const updatedBookmarks = bookmarks.filter(b => b !== bookmarkKey && b !== lessonId);
      localStorage.setItem(`bookmarks-${user.id}`, JSON.stringify(updatedBookmarks));
      
      setBookmarkedLessons(prev => 
        prev.filter(b => !(b.courseId === courseId && b.lessonId === lessonId))
      );
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading bookmarks...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookmarkCheck className="w-8 h-8 text-green-ecco" />
            <h1 className="text-4xl font-bold">Bookmarked Lessons</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Quick access to your saved lessons
          </p>
        </motion.div>

        {bookmarkedLessons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookmarkCheck className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-gray-400 mb-6">
              Bookmark lessons while learning to access them quickly later
            </p>
            <Link
              to="/courses"
              className="inline-block bg-green-ecco text-black font-bold py-3 px-6 rounded-full hover:bg-green-300 transition-colors"
            >
              Browse Courses
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookmarkedLessons.map((bookmark, index) => (
              <motion.div
                key={`${bookmark.courseId}-${bookmark.lessonId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-ecco/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookmarkCheck className="w-5 h-5 text-green-ecco flex-shrink-0" />
                      <Link
                        to={`/courses/${bookmark.courseId}/lessons/${bookmark.lessonId}`}
                        className="text-xl font-bold hover:text-green-ecco transition-colors"
                      >
                        {bookmark.lesson.title}
                      </Link>
                    </div>
                    <Link
                      to={`/courses/${bookmark.courseId}`}
                      className="text-gray-400 hover:text-white mb-3 inline-flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{bookmark.course.title}</span>
                    </Link>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {bookmark.lesson.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(bookmark.lesson.duration)}</span>
                      </div>
                      {bookmark.lesson.isPreview && (
                        <span className="text-xs bg-green-ecco/20 text-green-ecco px-2 py-1 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Link
                      to={`/courses/${bookmark.courseId}/lessons/${bookmark.lessonId}`}
                      className="px-4 py-2 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
                    >
                      Continue
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.courseId, bookmark.lessonId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;

