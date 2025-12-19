import { Course, Lesson, Quiz } from '../types/course';
import { AdminStats, AdminActivity, AdminUser } from '../types/admin';
import { CourseService } from './courseService';
import { getLearningStats } from './progressService';
import { getUserNotifications } from './notificationService';

// Mock admin data - in real app, this would come from backend
const mockAdminUsers: AdminUser[] = [
  {
    id: 'user-1',
    email: 'user1@example.com',
    name: 'Eco Warrior',
    role: 'student',
    enrolledCourses: 3,
    completedCourses: 1,
    totalProgress: 65,
    certificates: 1,
    badges: ['eco-warrior', 'green-learner'],
    totalTimeSpent: 450,
    streak: 7,
    createdAt: '2024-01-01T00:00:00Z',
    joinedAt: '2024-01-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'user2@example.com',
    name: 'Green Learner',
    role: 'student',
    enrolledCourses: 2,
    completedCourses: 0,
    totalProgress: 30,
    certificates: 0,
    badges: ['green-learner'],
    totalTimeSpent: 120,
    streak: 3,
    createdAt: '2024-01-10T00:00:00Z',
    joinedAt: '2024-01-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isActive: true,
  },
];

const mockAdminActivities: AdminActivity[] = [
  {
    id: 'act-1',
    type: 'user_signup',
    description: 'New user signed up',
    userName: 'Eco Champion',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'act-2',
    type: 'course_completed',
    description: 'Course completed',
    userName: 'Eco Warrior',
    courseTitle: 'Introduction to Sustainable Living',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'act-3',
    type: 'enrollment',
    description: 'New enrollment',
    userName: 'Green Learner',
    courseTitle: 'Renewable Energy Basics',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
];

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const courses = await CourseService.getAllCourses();
  let totalLessons = 0;
  for (const course of courses) {
    const lessons = await CourseService.getLessonsByCourseId(course.id);
    totalLessons += lessons.length;
  }

  const totalEnrollments = mockAdminUsers.reduce((sum, user) => sum + user.enrolledCourses, 0);
  const coursesCompleted = mockAdminUsers.reduce((sum, user) => sum + user.completedCourses, 0);
  const activeUsers = mockAdminUsers.filter(user => user.isActive).length;

  const completionRate = totalEnrollments > 0
    ? (coursesCompleted / totalEnrollments) * 100
    : 0;

  return {
    totalUsers: mockAdminUsers.length,
    totalCourses: courses.length,
    totalLessons,
    totalEnrollments,
    activeUsers,
    coursesCompleted,
    averageCompletionRate: Math.round(completionRate * 10) / 10,
    recentActivity: mockAdminActivities.slice(0, 10),
  };
};

/**
 * Get all admin users
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockAdminUsers];
};

/**
 * Get user by ID
 */
export const getAdminUserById = async (userId: string): Promise<AdminUser | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockAdminUsers.find(user => user.id === userId) || null;
};

const STORAGE_KEY_COURSES = 'greenkiddo_admin_courses';

/**
 * Get custom courses from localStorage
 */
const getCustomCourses = (): Course[] => {
  const stored = localStorage.getItem(STORAGE_KEY_COURSES);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save custom courses to localStorage
 */
const saveCustomCourses = (courses: Course[]): void => {
  localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
};

/**
 * Create a new course
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'lessons' | 'enrolledCount' | 'rating'>): Promise<Course> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCourse: Course = {
    ...courseData,
    id: `course-${Date.now()}`,
    lessons: [],
    enrolledCount: 0,
    rating: {
      average: 0,
      count: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage
  const customCourses = getCustomCourses();
  customCourses.push(newCourse);
  saveCustomCourses(customCourses);

  return newCourse;
};

/**
 * Update a course
 */
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const course = await CourseService.getCourseById(courseId);
  if (!course) return null;

  const updatedCourse: Course = {
    ...course,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Update in localStorage if it's a custom course
  const customCourses = getCustomCourses();
  const index = customCourses.findIndex(c => c.id === courseId);
  if (index !== -1) {
    customCourses[index] = updatedCourse;
    saveCustomCourses(customCourses);
  }

  return updatedCourse;
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const course = await CourseService.getCourseById(courseId);
  if (!course) return false;

  // Remove from localStorage if it's a custom course
  const customCourses = getCustomCourses();
  const filtered = customCourses.filter(c => c.id !== courseId);
  if (filtered.length !== customCourses.length) {
    saveCustomCourses(filtered);
    return true;
  }

  // In real app, this would delete from backend
  return true;
};

const STORAGE_KEY_LESSONS = 'greenkiddo_admin_lessons';

/**
 * Get custom lessons from localStorage
 */
const getCustomLessons = (): Lesson[] => {
  const stored = localStorage.getItem(STORAGE_KEY_LESSONS);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save custom lessons to localStorage
 */
const saveCustomLessons = (lessons: Lesson[]): void => {
  localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons));
};

/**
 * Create a new lesson
 */
export const createLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newLesson: Lesson = {
    ...lessonData,
    id: `lesson-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage
  const customLessons = getCustomLessons();
  customLessons.push(newLesson);
  saveCustomLessons(customLessons);

  return newLesson;
};

/**
 * Update a lesson
 */
export const updateLesson = async (lessonId: string, updates: Partial<Lesson>): Promise<Lesson | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lesson = await CourseService.getLessonById(lessonId);
  if (!lesson) return null;

  const updatedLesson: Lesson = {
    ...lesson,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Update in localStorage if it's a custom lesson
  const customLessons = getCustomLessons();
  const index = customLessons.findIndex(l => l.id === lessonId);
  if (index !== -1) {
    customLessons[index] = updatedLesson;
    saveCustomLessons(customLessons);
  }

  return updatedLesson;
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lesson = await CourseService.getLessonById(lessonId);
  if (!lesson) return false;

  // Remove from localStorage if it's a custom lesson
  const customLessons = getCustomLessons();
  const filtered = customLessons.filter(l => l.id !== lessonId);
  if (filtered.length !== customLessons.length) {
    saveCustomLessons(filtered);
    return true;
  }

  // In real app, this would delete from backend
  return true;
};

const STORAGE_KEY_QUIZZES = 'greenkiddo_admin_quizzes';

/**
 * Get custom quizzes from localStorage
 */
const getCustomQuizzes = (): Quiz[] => {
  const stored = localStorage.getItem(STORAGE_KEY_QUIZZES);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save custom quizzes to localStorage
 */
const saveCustomQuizzes = (quizzes: Quiz[]): void => {
  localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
};

/**
 * Create a new quiz
 */
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newQuiz: Quiz = {
    ...quizData,
    id: `quiz-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage
  const customQuizzes = getCustomQuizzes();
  customQuizzes.push(newQuiz);
  saveCustomQuizzes(customQuizzes);

  return newQuiz;
};

/**
 * Update a quiz
 */
export const updateQuiz = async (quizId: string, updates: Partial<Quiz>): Promise<Quiz | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const quiz = await CourseService.getQuizById(quizId);
  if (!quiz) return null;

  const updatedQuiz: Quiz = {
    ...quiz,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Update in localStorage if it's a custom quiz
  const customQuizzes = getCustomQuizzes();
  const index = customQuizzes.findIndex(q => q.id === quizId);
  if (index !== -1) {
    customQuizzes[index] = updatedQuiz;
    saveCustomQuizzes(customQuizzes);
  }

  return updatedQuiz;
};

/**
 * Delete a quiz
 */
export const deleteQuiz = async (quizId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const quiz = await CourseService.getQuizById(quizId);
  if (!quiz) return false;

  // Remove from localStorage if it's a custom quiz
  const customQuizzes = getCustomQuizzes();
  const filtered = customQuizzes.filter(q => q.id !== quizId);
  if (filtered.length !== customQuizzes.length) {
    saveCustomQuizzes(filtered);
    return true;
  }

  // In real app, this would delete from backend
  return true;
};

/**
 * Get all quizzes for a lesson
 */
export const getQuizzesByLessonId = async (lessonId: string): Promise<Quiz[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const customQuizzes = getCustomQuizzes();
  return customQuizzes.filter(q => q.lessonId === lessonId);
};

