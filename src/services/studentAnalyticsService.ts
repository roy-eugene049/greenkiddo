import {
  StudentProgressAnalytics,
  StudentCourseProgress,
  CategoryProgress,
  EngagementMetrics,
  TimeSeriesData,
  HourlyActivity,
} from '../types/studentAnalytics';
import { getLearningStats, getTotalTimeSpent, getTimeSpentToday } from './progressService';
import { useCourseStore } from '../store/useCourseStore';
import { CourseService } from './courseService';
import { getUserLevel, getUserPoints } from './gamificationService';

/**
 * Get comprehensive student progress analytics
 */
export const getStudentProgressAnalytics = async (userId: string): Promise<StudentProgressAnalytics> => {
  const learningStats = getLearningStats(userId);
  const enrolledCourses = useCourseStore.getState().getEnrolledCourses();
  const level = getUserLevel(userId);
  const points = getUserPoints(userId);

  // Get course progress details
  const coursesProgress: StudentCourseProgress[] = [];
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    const lessons = await CourseService.getLessonsByCourseId(course.id);
    const completedLessons = lessons.filter(l => {
      // Check if lesson is completed (simplified check)
      return progress?.completed || false;
    }).length;

    const courseProgress: StudentCourseProgress = {
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: progress?.lastAccessed || new Date().toISOString(),
      progress: progress?.progressPercentage || 0,
      lessonsCompleted: completedLessons,
      totalLessons: lessons.length,
      timeSpent: progress?.timeSpent || 0,
      lastAccessed: progress?.lastAccessed || new Date().toISOString(),
      status: progress?.completed ? 'completed' : progress?.progressPercentage > 0 ? 'in-progress' : 'not-started',
    };

    coursesProgress.push(courseProgress);
  }

  // Calculate category progress
  const categoryMap = new Map<string, { courses: number; completed: number; progress: number[]; timeSpent: number }>();
  
  enrolledCourses.forEach(course => {
    const courseProg = coursesProgress.find(cp => cp.courseId === course.id);
    if (courseProg) {
      course.category.forEach(cat => {
        const existing = categoryMap.get(cat) || { courses: 0, completed: 0, progress: [], timeSpent: 0 };
        existing.courses += 1;
        if (courseProg.status === 'completed') existing.completed += 1;
        existing.progress.push(courseProg.progress);
        existing.timeSpent += courseProg.timeSpent;
        categoryMap.set(cat, existing);
      });
    }
  });

  const categoryProgress: CategoryProgress[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    coursesEnrolled: data.courses,
    coursesCompleted: data.completed,
    averageProgress: data.progress.length > 0
      ? Math.round(data.progress.reduce((a, b) => a + b, 0) / data.progress.length)
      : 0,
    timeSpent: data.timeSpent,
  }));

  // Generate weekly activity (last 8 weeks)
  const weeklyActivity: TimeSeriesData[] = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    weeklyActivity.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 10) + 5, // Mock data - would come from actual activity logs
    });
  }

  // Generate monthly activity (last 6 months)
  const monthlyActivity: TimeSeriesData[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    monthlyActivity.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      value: Math.floor(Math.random() * 50) + 20, // Mock data
    });
  }

  const totalCoursesCompleted = coursesProgress.filter(c => c.status === 'completed').length;
  const totalLessonsCompleted = coursesProgress.reduce((sum, c) => sum + c.lessonsCompleted, 0);
  const averageProgress = coursesProgress.length > 0
    ? Math.round(coursesProgress.reduce((sum, c) => sum + c.progress, 0) / coursesProgress.length)
    : 0;

  return {
    userId,
    userName: 'User', // Would come from user profile
    totalCoursesEnrolled: enrolledCourses.length,
    totalCoursesCompleted,
    totalLessonsCompleted,
    totalTimeSpent: learningStats.totalTimeSpent,
    currentStreak: learningStats.currentStreak,
    longestStreak: learningStats.longestStreak,
    averageCourseProgress: averageProgress,
    completionRate: enrolledCourses.length > 0
      ? Math.round((totalCoursesCompleted / enrolledCourses.length) * 100)
      : 0,
    courses: coursesProgress,
    weeklyActivity,
    monthlyActivity,
    categoryProgress,
    learningVelocity: Math.round(totalLessonsCompleted / Math.max(1, Math.floor((Date.now() - new Date(learningStats.lastActivityDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 7)))), // lessons per week
    lastActivityDate: learningStats.lastActivityDate,
  };
};

/**
 * Get engagement metrics for a student
 */
export const getStudentEngagementMetrics = async (userId: string): Promise<EngagementMetrics> => {
  const learningStats = getLearningStats(userId);
  
  // Generate daily active minutes (last 30 days)
  const dailyActiveMinutes: TimeSeriesData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dailyActiveMinutes.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 120) + 10, // Mock data
    });
  }

  // Generate weekly active minutes (last 12 weeks)
  const weeklyActiveMinutes: TimeSeriesData[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    weeklyActiveMinutes.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 600) + 100, // Mock data
    });
  }

  // Generate hourly activity (peak learning hours)
  const hourlyActivity: HourlyActivity[] = [];
  for (let hour = 0; hour < 24; hour++) {
    hourlyActivity.push({
      hour,
      activityCount: Math.floor(Math.random() * 50),
      averageDuration: Math.floor(Math.random() * 60) + 15,
    });
  }

  // Calculate consistency score (based on activity days vs total days)
  const activityDays = dailyActiveMinutes.filter(d => d.value > 0).length;
  const consistencyScore = Math.round((activityDays / 30) * 100);

  return {
    dailyActiveMinutes,
    weeklyActiveMinutes,
    sessionCount: learningStats.totalSessions || 0,
    averageSessionDuration: learningStats.totalSessions > 0
      ? Math.round(learningStats.totalTimeSpent / learningStats.totalSessions)
      : 0,
    peakLearningHours: hourlyActivity.sort((a, b) => b.activityCount - a.activityCount).slice(0, 5),
    learningDays: activityDays,
    consistencyScore,
  };
};

