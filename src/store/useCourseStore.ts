import { create } from 'zustand';
import { Course } from '../types/course';

interface CourseState {
  courses: Course[];
  enrolledCourses: string[]; // Course IDs
  loading: boolean;
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  getEnrolledCourses: () => Course[];
  setLoading: (loading: boolean) => void;
}

export const useCourseStore = create<CourseState>()(
  (set, get) => ({
    courses: [],
    enrolledCourses: [],
    loading: false,
    setCourses: (courses) => set({ courses }),
    addCourse: (course) =>
      set((state) => ({
        courses: [...state.courses, course],
      })),
    updateCourse: (courseId, updates) =>
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId ? { ...course, ...updates } : course
        ),
      })),
    enrollInCourse: (courseId) =>
      set((state) => ({
        enrolledCourses: state.enrolledCourses.includes(courseId)
          ? state.enrolledCourses
          : [...state.enrolledCourses, courseId],
      })),
    unenrollFromCourse: (courseId) =>
      set((state) => ({
        enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
      })),
    isEnrolled: (courseId) => {
      const state = get();
      return state.enrolledCourses.includes(courseId);
    },
    getEnrolledCourses: () => {
      const state = get();
      return state.courses.filter((course) =>
        state.enrolledCourses.includes(course.id)
      );
    },
    setLoading: (loading) => set({ loading }),
  })
);

