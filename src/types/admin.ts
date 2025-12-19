export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  activeUsers: number;
  completedCourses: number;
  coursesCompleted: number;
  averageCompletionRate: number;
  totalRevenue?: number;
  recentActivity: AdminActivity[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'instructor' | 'student';
  createdAt: string;
  joinedAt: string;
  lastActiveAt: string;
  isActive: boolean;
  enrolledCourses: number;
  completedCourses: number;
  totalProgress: number;
  totalTimeSpent: number; // in minutes
  streak: number;
  certificates: number;
  badges: string[];
}

export interface AdminActivity {
  id: string;
  type: 'user_signup' | 'course_created' | 'course_completed' | 'enrollment' | 'certificate_issued';
  description: string;
  userName?: string;
  courseTitle?: string;
  timestamp: string;
}

export interface CourseManagementData {
  courses: any[];
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
}

export interface LessonManagementData {
  lessons: any[];
  totalLessons: number;
}

export interface UserManagementData {
  users: any[];
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone?: string;
  supportEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  features: {
    enableForum: boolean;
    enableBlog: boolean;
    enableCertificates: boolean;
    enableBadges: boolean;
    enableReviews: boolean;
    enableNotifications: boolean;
  };
  email: {
    fromName: string;
    fromEmail: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
  };
  notifications: {
    emailOnSignup: boolean;
    emailOnEnrollment: boolean;
    emailOnCompletion: boolean;
    emailOnAchievement: boolean;
    emailWeeklyDigest: boolean;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage?: string;
  };
}
