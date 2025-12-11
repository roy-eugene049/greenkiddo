import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from '../types/course';

interface ProgressState {
  progress: Record<string, UserProgress>; // Key: `${userId}-${courseId}` or `${userId}-${courseId}-${lessonId}`
  completedLessons: Record<string, Set<string>>; // Key: userId, Value: Set of lesson IDs
  bookmarkedLessons: Record<string, Set<string>>; // Key: userId, Value: Set of lesson IDs
  setProgress: (userId: string, courseId: string, progress: UserProgress) => void;
  updateProgress: (
    userId: string,
    courseId: string,
    updates: Partial<UserProgress>
  ) => void;
  markLessonComplete: (userId: string, courseId: string, lessonId: string) => void;
  markLessonIncomplete: (userId: string, courseId: string, lessonId: string) => void;
  isLessonComplete: (userId: string, courseId: string, lessonId: string) => boolean;
  toggleBookmark: (userId: string, courseId: string, lessonId: string) => void;
  isBookmarked: (userId: string, courseId: string, lessonId: string) => boolean;
  getCourseProgress: (userId: string, courseId: string) => UserProgress | null;
  getCompletedLessons: (userId: string, courseId: string) => string[];
  calculateCourseProgress: (userId: string, courseId: string, totalLessons: number) => number;
}

const getProgressKey = (userId: string, courseId: string, lessonId?: string) => {
  return lessonId
    ? `${userId}-${courseId}-${lessonId}`
    : `${userId}-${courseId}`;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      completedLessons: {},
      bookmarkedLessons: {},
      setProgress: (userId, courseId, progressData) => {
        const key = getProgressKey(userId, courseId);
        set((state) => ({
          progress: { ...state.progress, [key]: progressData },
        }));
      },
      updateProgress: (userId, courseId, updates) => {
        const key = getProgressKey(userId, courseId);
        set((state) => ({
          progress: {
            ...state.progress,
            [key]: {
              ...state.progress[key],
              ...updates,
            } as UserProgress,
          },
        }));
      },
      markLessonComplete: (userId, courseId, lessonId) => {
        set((state) => {
          const userKey = userId;
          const completed = state.completedLessons[userKey] || new Set<string>();
          completed.add(`${courseId}:${lessonId}`);
          
          return {
            completedLessons: {
              ...state.completedLessons,
              [userKey]: completed,
            },
          };
        });
      },
      markLessonIncomplete: (userId, courseId, lessonId) => {
        set((state) => {
          const userKey = userId;
          const completed = state.completedLessons[userKey] || new Set<string>();
          completed.delete(`${courseId}:${lessonId}`);
          
          return {
            completedLessons: {
              ...state.completedLessons,
              [userKey]: completed,
            },
          };
        });
      },
      isLessonComplete: (userId, courseId, lessonId) => {
        const state = get();
        const userKey = userId;
        const completed = state.completedLessons[userKey] || new Set<string>();
        return completed.has(`${courseId}:${lessonId}`);
      },
      toggleBookmark: (userId, courseId, lessonId) => {
        set((state) => {
          const userKey = userId;
          const bookmarked = state.bookmarkedLessons[userKey] || new Set<string>();
          const bookmarkKey = `${courseId}:${lessonId}`;
          
          if (bookmarked.has(bookmarkKey)) {
            bookmarked.delete(bookmarkKey);
          } else {
            bookmarked.add(bookmarkKey);
          }
          
          return {
            bookmarkedLessons: {
              ...state.bookmarkedLessons,
              [userKey]: bookmarked,
            },
          };
        });
      },
      isBookmarked: (userId, courseId, lessonId) => {
        const state = get();
        const userKey = userId;
        const bookmarked = state.bookmarkedLessons[userKey] || new Set<string>();
        return bookmarked.has(`${courseId}:${lessonId}`);
      },
      getCourseProgress: (userId, courseId) => {
        const state = get();
        const key = getProgressKey(userId, courseId);
        return state.progress[key] || null;
      },
      getCompletedLessons: (userId, courseId) => {
        const state = get();
        const userKey = userId;
        const completed = state.completedLessons[userKey] || new Set<string>();
        const prefix = `${courseId}:`;
        
        return Array.from(completed)
          .filter((key) => key.startsWith(prefix))
          .map((key) => key.replace(prefix, ''));
      },
      calculateCourseProgress: (userId, courseId, totalLessons) => {
        const completed = get().getCompletedLessons(userId, courseId);
        if (totalLessons === 0) return 0;
        return Math.round((completed.length / totalLessons) * 100);
      },
    }),
    {
      name: 'greenkiddo-progress-storage',
    }
  )
);

