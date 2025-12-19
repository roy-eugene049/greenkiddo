export interface StudentProgressAnalytics {
  userId: string;
  userName: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageCourseProgress: number;
  completionRate: number;
  courses: StudentCourseProgress[];
  weeklyActivity: TimeSeriesData[];
  monthlyActivity: TimeSeriesData[];
  categoryProgress: CategoryProgress[];
  learningVelocity: number; // lessons per week
  lastActivityDate: string;
}

export interface StudentCourseProgress {
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progress: number; // percentage
  lessonsCompleted: number;
  totalLessons: number;
  timeSpent: number; // in minutes
  lastAccessed: string;
  estimatedCompletion?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
}

export interface CategoryProgress {
  category: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  averageProgress: number;
  timeSpent: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface EngagementMetrics {
  dailyActiveMinutes: TimeSeriesData[];
  weeklyActiveMinutes: TimeSeriesData[];
  sessionCount: number;
  averageSessionDuration: number; // in minutes
  peakLearningHours: HourlyActivity[];
  learningDays: number; // days with activity
  consistencyScore: number; // 0-100
}

export interface HourlyActivity {
  hour: number; // 0-23
  activityCount: number;
  averageDuration: number;
}

export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  type: 'student-progress' | 'course-performance' | 'engagement' | 'completion' | 'custom';
  filters: ReportFilters;
  metrics: string[];
  format: 'table' | 'chart' | 'both';
  schedule?: ReportSchedule;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  courses?: string[];
  categories?: string[];
  users?: string[];
  status?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time?: string; // HH:mm format
  recipients?: string[]; // email addresses
}

export interface ReportData {
  report: CustomReport;
  data: any;
  generatedAt: string;
  format: 'json' | 'csv' | 'pdf';
}

