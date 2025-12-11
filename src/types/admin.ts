export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  activeUsers: number; // Users active in last 30 days
  coursesCompleted: number;
  averageCompletionRate: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_signup' | 'course_created' | 'course_completed' | 'enrollment' | 'certificate_issued';
  description: string;
  userId?: string;
  userName?: string;
  courseId?: string;
  courseTitle?: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  badges: number;
  totalTimeSpent: number; // in minutes
  streak: number;
  joinedAt: string;
  lastActive: string;
  isActive: boolean;
}

