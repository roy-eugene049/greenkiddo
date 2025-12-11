export type NotificationType = 
  | 'achievement'
  | 'course_update'
  | 'forum_reply'
  | 'forum_mention'
  | 'certificate_earned'
  | 'badge_earned'
  | 'course_completed'
  | 'lesson_reminder'
  | 'streak_milestone'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string; // URL to navigate when clicked
  read: boolean;
  createdAt: string;
  icon?: string; // Icon identifier for display
  metadata?: Record<string, unknown>; // Additional data
}

export interface NotificationPreferences {
  userId: string;
  email: {
    achievements: boolean;
    courseUpdates: boolean;
    forumActivity: boolean;
    weeklyDigest: boolean;
  };
  push: {
    achievements: boolean;
    courseUpdates: boolean;
    forumActivity: boolean;
  };
  inApp: {
    achievements: boolean;
    courseUpdates: boolean;
    forumActivity: boolean;
    reminders: boolean;
  };
}

