export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number; // Active in last 30 days
  newUsers: number; // New in last 30 days
  totalCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  averageCompletionRate: number;
  totalTimeSpent: number; // in minutes
  averageTimePerUser: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  averageTimeSpent: number; // in minutes
  averageRating: number;
  totalRevenue?: number; // if paid courses
}

export interface UserEngagement {
  dailyActiveUsers: TimeSeriesData[];
  weeklyActiveUsers: TimeSeriesData[];
  monthlyActiveUsers: TimeSeriesData[];
  newSignups: TimeSeriesData[];
  courseCompletions: TimeSeriesData[];
  lessonCompletions: TimeSeriesData[];
}

export interface LearningMetrics {
  averageCourseProgress: number;
  averageLessonCompletionTime: number; // in minutes
  mostPopularCourses: CourseAnalytics[];
  leastPopularCourses: CourseAnalytics[];
  completionTrends: TimeSeriesData[];
  engagementByCategory: {
    category: string;
    enrollments: number;
    completions: number;
    averageRating: number;
  }[];
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  userEngagement: UserEngagement;
  learningMetrics: LearningMetrics;
  coursePerformance: CourseAnalytics[];
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
}

