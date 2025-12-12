/**
 * API Endpoints Configuration
 * 
 * Centralized definition of all API endpoints.
 * This makes it easy to update endpoints when the backend changes.
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
    PREFERENCES: (id: string) => `/users/${id}/preferences`,
    ENROLLMENTS: (id: string) => `/users/${id}/enrollments`,
    PROGRESS: (id: string) => `/users/${id}/progress`,
    CERTIFICATES: (id: string) => `/users/${id}/certificates`,
    ACHIEVEMENTS: (id: string) => `/users/${id}/achievements`,
  },

  // Courses
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    UNENROLL: (id: string) => `/courses/${id}/unenroll`,
    LESSONS: (id: string) => `/courses/${id}/lessons`,
    LESSON_BY_ID: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
    PROGRESS: (id: string) => `/courses/${id}/progress`,
    REVIEWS: (id: string) => `/courses/${id}/reviews`,
    SEARCH: '/courses/search',
  },

  // Lessons
  LESSONS: {
    BASE: '/lessons',
    BY_ID: (id: string) => `/lessons/${id}`,
    COMPLETE: (id: string) => `/lessons/${id}/complete`,
    NOTES: (id: string) => `/lessons/${id}/notes`,
    QUIZ: (id: string) => `/lessons/${id}/quiz`,
  },

  // Quizzes
  QUIZZES: {
    BASE: '/quizzes',
    BY_ID: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    RESULTS: (id: string) => `/quizzes/${id}/results`,
  },

  // Blog
  BLOG: {
    BASE: '/blog',
    BY_ID: (id: string) => `/blog/${id}`,
    BY_SLUG: (slug: string) => `/blog/slug/${slug}`,
    CATEGORIES: '/blog/categories',
    SEARCH: '/blog/search',
  },

  // Forum
  FORUM: {
    BASE: '/forum',
    CATEGORIES: '/forum/categories',
    POSTS: '/forum/posts',
    POST_BY_ID: (id: string) => `/forum/posts/${id}`,
    COMMENTS: (postId: string) => `/forum/posts/${postId}/comments`,
    VOTE_POST: (postId: string) => `/forum/posts/${postId}/vote`,
    VOTE_COMMENT: (commentId: string) => `/forum/comments/${commentId}/vote`,
  },

  // Admin
  ADMIN: {
    BASE: '/admin',
    STATS: '/admin/stats',
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    COURSES: '/admin/courses',
    COURSE_BY_ID: (id: string) => `/admin/courses/${id}`,
    LESSONS: (courseId: string) => `/admin/courses/${courseId}/lessons`,
    LESSON_BY_ID: (courseId: string, lessonId: string) => `/admin/courses/${courseId}/lessons/${lessonId}`,
    QUIZZES: (lessonId: string) => `/admin/lessons/${lessonId}/quizzes`,
    QUIZ_BY_ID: (lessonId: string, quizId: string) => `/admin/lessons/${lessonId}/quizzes/${quizId}`,
    BLOG: '/admin/blog',
    BLOG_BY_ID: (id: string) => `/admin/blog/${id}`,
    ANALYTICS: '/admin/analytics',
    MODERATION: '/admin/moderation',
    SETTINGS: '/admin/settings',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    PREFERENCES: '/notifications/preferences',
  },

  // Search
  SEARCH: {
    GLOBAL: '/search',
    COURSES: '/search/courses',
    LESSONS: '/search/lessons',
    BLOG: '/search/blog',
    FORUM: '/search/forum',
  },

  // Media/Upload
  MEDIA: {
    BASE: '/media',
    UPLOAD: '/media/upload',
    BY_ID: (id: string) => `/media/${id}`,
    DELETE: (id: string) => `/media/${id}`,
  },
} as const;

/**
 * Helper function to build endpoint with parameters
 */
export function buildEndpoint(
  template: string,
  params: Record<string, string | number>
): string {
  let endpoint = template;
  Object.entries(params).forEach(([key, value]) => {
    endpoint = endpoint.replace(`:${key}`, String(value));
  });
  return endpoint;
}

