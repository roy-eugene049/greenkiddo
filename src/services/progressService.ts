import { UserProgress } from '../types/course';

interface LearningSession {
  date: string; // ISO date string (YYYY-MM-DD)
  timeSpent: number; // in minutes
  lessonsCompleted: string[]; // lesson IDs
}

interface UserLearningData {
  userId: string;
  sessions: LearningSession[];
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  lastActivityDate: string; // ISO date string
}

const STORAGE_KEY_PREFIX = 'greenkiddo_learning_';

/**
 * Get learning data for a user
 */
export const getUserLearningData = (userId: string): UserLearningData => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }

  // Return default data
  return {
    userId,
    sessions: [],
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    lastActivityDate: '',
  };
};

/**
 * Save learning data for a user
 */
const saveUserLearningData = (data: UserLearningData): void => {
  const key = `${STORAGE_KEY_PREFIX}${data.userId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Get today's date as YYYY-MM-DD
 */
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get yesterday's date as YYYY-MM-DD
 */
const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Record a learning session (time spent on a lesson)
 */
export const recordLearningSession = (
  userId: string,
  lessonId: string,
  timeSpentMinutes: number
): void => {
  const data = getUserLearningData(userId);
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // Find or create today's session
  let todaySession = data.sessions.find(s => s.date === today);
  
  if (!todaySession) {
    todaySession = {
      date: today,
      timeSpent: 0,
      lessonsCompleted: [],
    };
    data.sessions.push(todaySession);
  }

  // Update today's session
  todaySession.timeSpent += timeSpentMinutes;
  if (!todaySession.lessonsCompleted.includes(lessonId)) {
    todaySession.lessonsCompleted.push(lessonId);
  }

  // Update total time spent
  data.totalTimeSpent += timeSpentMinutes;

  // Update streak
  if (data.lastActivityDate === yesterday) {
    // Continuing streak
    data.currentStreak += 1;
  } else if (data.lastActivityDate === today) {
    // Same day, no change to streak
  } else {
    // Streak broken or first activity
    if (data.lastActivityDate && data.lastActivityDate !== yesterday) {
      // Streak broken
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
      }
      data.currentStreak = 1;
    } else {
      // First activity or continuing from yesterday
      data.currentStreak = data.currentStreak || 1;
    }
  }

  data.lastActivityDate = today;
  saveUserLearningData(data);
};

/**
 * Record lesson completion
 */
export const recordLessonCompletion = (userId: string, lessonId: string): void => {
  const data = getUserLearningData(userId);
  const today = getTodayDate();

  // Find or create today's session
  let todaySession = data.sessions.find(s => s.date === today);
  
  if (!todaySession) {
    todaySession = {
      date: today,
      timeSpent: 0,
      lessonsCompleted: [],
    };
    data.sessions.push(todaySession);
  }

  // Add lesson if not already completed today
  if (!todaySession.lessonsCompleted.includes(lessonId)) {
    todaySession.lessonsCompleted.push(lessonId);
  }

  // Update streak (same logic as recordLearningSession)
  const yesterday = getYesterdayDate();
  if (data.lastActivityDate === yesterday) {
    data.currentStreak += 1;
  } else if (data.lastActivityDate !== today) {
    if (data.lastActivityDate && data.lastActivityDate !== yesterday) {
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
      }
      data.currentStreak = 1;
    } else {
      data.currentStreak = data.currentStreak || 1;
    }
  }

  data.lastActivityDate = today;
  saveUserLearningData(data);
};

/**
 * Get current streak
 */
export const getCurrentStreak = (userId: string): number => {
  const data = getUserLearningData(userId);
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // Check if streak is still valid
  if (data.lastActivityDate === today || data.lastActivityDate === yesterday) {
    return data.currentStreak;
  }

  // Streak broken (more than 1 day since last activity)
  return 0;
};

/**
 * Get total time spent (in minutes)
 */
export const getTotalTimeSpent = (userId: string): number => {
  const data = getUserLearningData(userId);
  return data.totalTimeSpent;
};

/**
 * Get time spent today (in minutes)
 */
export const getTimeSpentToday = (userId: string): number => {
  const data = getUserLearningData(userId);
  const today = getTodayDate();
  const todaySession = data.sessions.find(s => s.date === today);
  return todaySession?.timeSpent || 0;
};

/**
 * Get learning statistics
 */
export const getLearningStats = (userId: string) => {
  const data = getUserLearningData(userId);
  const currentStreak = getCurrentStreak(userId);
  
  return {
    currentStreak,
    longestStreak: data.longestStreak,
    totalTimeSpent: data.totalTimeSpent,
    timeSpentToday: getTimeSpentToday(userId),
    totalSessions: data.sessions.length,
    lastActivityDate: data.lastActivityDate,
  };
};

/**
 * Format time in minutes to a readable string
 */
export const formatTimeSpent = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
};

/**
 * Check if user has activity today
 */
export const hasActivityToday = (userId: string): boolean => {
  const data = getUserLearningData(userId);
  const today = getTodayDate();
  return data.lastActivityDate === today;
};

