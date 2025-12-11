import { Course, Lesson } from '../types/course';
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
    enrolledCourses: 3,
    completedCourses: 1,
    certificates: 1,
    badges: 2,
    totalTimeSpent: 450,
    streak: 7,
    joinedAt: '2024-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'user2@example.com',
    name: 'Green Learner',
    enrolledCourses: 2,
    completedCourses: 0,
    certificates: 0,
    badges: 1,
    totalTimeSpent: 120,
    streak: 3,
    joinedAt: '2024-01-10T00:00:00Z',
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
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

  // In real app, this would save to backend
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

  // In real app, this would save to backend
  return updatedLesson;
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lesson = await CourseService.getLessonById(lessonId);
  if (!lesson) return false;

  // In real app, this would delete from backend
  return true;
};

