import {
  AnalyticsData,
  AnalyticsOverview,
  UserEngagement,
  LearningMetrics,
  CourseAnalytics,
  TimeSeriesData,
} from '../types/analytics';
import { CourseService } from './courseService';
import { getLearningStats } from './progressService';
import { Course } from '../types/course';

/**
 * Generate time series data for the last N days
 */
const generateTimeSeries = (days: number, baseValue: number = 0): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      value: baseValue + Math.floor(Math.random() * 20), // Mock data variation
    });
  }
  
  return data;
};

/**
 * Get analytics overview
 */
export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const courses = await CourseService.getAllCourses();
  
  // Mock data - in real app, this would come from backend
  const totalUsers = 1250;
  const activeUsers = 850;
  const newUsers = 45;
  const totalEnrollments = 3200;
  const totalCompletions = 480;
  const totalTimeSpent = 125000; // minutes
  
  return {
    totalUsers,
    activeUsers,
    newUsers,
    totalCourses: courses.length,
    totalEnrollments,
    totalCompletions,
    averageCompletionRate: totalEnrollments > 0
      ? Math.round((totalCompletions / totalEnrollments) * 100 * 10) / 10
      : 0,
    totalTimeSpent,
    averageTimePerUser: totalUsers > 0
      ? Math.round(totalTimeSpent / totalUsers)
      : 0,
  };
};

/**
 * Get user engagement metrics
 */
export const getUserEngagement = async (days: number = 30): Promise<UserEngagement> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    dailyActiveUsers: generateTimeSeries(days, 50),
    weeklyActiveUsers: generateTimeSeries(Math.ceil(days / 7), 300),
    monthlyActiveUsers: generateTimeSeries(Math.ceil(days / 30), 800),
    newSignups: generateTimeSeries(days, 2),
    courseCompletions: generateTimeSeries(days, 5),
    lessonCompletions: generateTimeSeries(days, 25),
  };
};

/**
 * Get course analytics
 */
export const getCourseAnalytics = async (): Promise<CourseAnalytics[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const courses = await CourseService.getAllCourses();
  
  return courses.map(course => {
    // Mock analytics data
    const enrollments = Math.floor(Math.random() * 500) + 50;
    const completions = Math.floor(enrollments * (0.1 + Math.random() * 0.3));
    const completionRate = enrollments > 0
      ? Math.round((completions / enrollments) * 100 * 10) / 10
      : 0;
    
    return {
      courseId: course.id,
      courseTitle: course.title,
      enrollments,
      completions,
      completionRate,
      averageTimeSpent: Math.floor(Math.random() * 120) + 30,
      averageRating: course.rating.average,
    };
  }).sort((a, b) => b.enrollments - a.enrollments);
};

/**
 * Get learning metrics
 */
export const getLearningMetrics = async (): Promise<LearningMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const courses = await CourseService.getAllCourses();
  const courseAnalytics = await getCourseAnalytics();
  
  // Calculate category engagement
  const categoryMap = new Map<string, { enrollments: number; completions: number; ratings: number[] }>();
  
  courses.forEach(course => {
    course.category.forEach(cat => {
      const analytics = courseAnalytics.find(a => a.courseId === course.id);
      if (analytics) {
        const existing = categoryMap.get(cat) || { enrollments: 0, completions: 0, ratings: [] };
        existing.enrollments += analytics.enrollments;
        existing.completions += analytics.completions;
        existing.ratings.push(analytics.averageRating);
        categoryMap.set(cat, existing);
      }
    });
  });
  
  const engagementByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    enrollments: data.enrollments,
    completions: data.completions,
    averageRating: data.ratings.length > 0
      ? Math.round((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length) * 10) / 10
      : 0,
  })).sort((a, b) => b.enrollments - a.enrollments);
  
  const mostPopular = courseAnalytics.slice(0, 5);
  const leastPopular = [...courseAnalytics]
    .sort((a, b) => a.enrollments - b.enrollments)
    .slice(0, 5);
  
  const totalProgress = courseAnalytics.reduce((sum, c) => sum + c.completionRate, 0);
  const averageProgress = courseAnalytics.length > 0
    ? Math.round((totalProgress / courseAnalytics.length) * 10) / 10
    : 0;
  
  return {
    averageCourseProgress: averageProgress,
    averageLessonCompletionTime: 15, // Mock data
    mostPopularCourses: mostPopular,
    leastPopularCourses: leastPopular,
    completionTrends: generateTimeSeries(30, 10),
    engagementByCategory,
  };
};

/**
 * Get complete analytics data
 */
export const getAnalyticsData = async (timeRange: '7d' | '30d' | '90d' | '1y' | 'all' = '30d'): Promise<AnalyticsData> => {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : timeRange === '1y' ? 365 : 365;
  
  const [overview, userEngagement, learningMetrics, coursePerformance] = await Promise.all([
    getAnalyticsOverview(),
    getUserEngagement(days),
    getLearningMetrics(),
    getCourseAnalytics(),
  ]);
  
  return {
    overview,
    userEngagement,
    learningMetrics,
    coursePerformance,
    timeRange,
  };
};

