import { Notification, NotificationPreferences } from '../types/notification';

const STORAGE_KEY_PREFIX = 'greenkiddo_notifications_';
const PREFERENCES_KEY_PREFIX = 'greenkiddo_notif_prefs_';

/**
 * Get all notifications for a user
 */
export const getUserNotifications = (userId: string): Notification[] => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save notifications for a user
 */
const saveUserNotifications = (userId: string, notifications: Notification[]): void => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.setItem(key, JSON.stringify(notifications));
};

/**
 * Get unread notification count
 */
export const getUnreadCount = (userId: string): number => {
  const notifications = getUserNotifications(userId);
  return notifications.filter(n => !n.read).length;
};

/**
 * Create a new notification
 */
export const createNotification = (
  userId: string,
  notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Notification => {
  const notifications = getUserNotifications(userId);
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  notifications.unshift(newNotification); // Add to beginning
  
  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications.splice(100);
  }
  
  saveUserNotifications(userId, notifications);
  return newNotification;
};

/**
 * Mark notification as read
 */
export const markAsRead = (userId: string, notificationId: string): boolean => {
  const notifications = getUserNotifications(userId);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (!notification) return false;
  
  notification.read = true;
  saveUserNotifications(userId, notifications);
  return true;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = (userId: string): void => {
  const notifications = getUserNotifications(userId);
  notifications.forEach(n => n.read = true);
  saveUserNotifications(userId, notifications);
};

/**
 * Delete a notification
 */
export const deleteNotification = (userId: string, notificationId: string): boolean => {
  const notifications = getUserNotifications(userId);
  const filtered = notifications.filter(n => n.id !== notificationId);
  
  if (filtered.length === notifications.length) return false;
  
  saveUserNotifications(userId, filtered);
  return true;
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (userId: string): void => {
  saveUserNotifications(userId, []);
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = (userId: string): NotificationPreferences => {
  const key = `${PREFERENCES_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default preferences
  return {
    userId,
    email: {
      achievements: true,
      courseUpdates: true,
      forumActivity: false,
      weeklyDigest: true,
    },
    push: {
      achievements: true,
      courseUpdates: true,
      forumActivity: true,
    },
    inApp: {
      achievements: true,
      courseUpdates: true,
      forumActivity: true,
      reminders: true,
    },
  };
};

/**
 * Save notification preferences
 */
export const saveNotificationPreferences = (preferences: NotificationPreferences): void => {
  const key = `${PREFERENCES_KEY_PREFIX}${preferences.userId}`;
  localStorage.setItem(key, JSON.stringify(preferences));
};

/**
 * Helper functions to create specific notification types
 */
export const NotificationHelpers = {
  achievement: (userId: string, title: string, message: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'achievement',
      title,
      message,
      link,
      icon: 'trophy',
    });
  },

  badgeEarned: (userId: string, badgeName: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'badge_earned',
      title: 'New Badge Earned! 🏆',
      message: `You've earned the "${badgeName}" badge!`,
      link,
      icon: 'badge',
    });
  },

  certificateEarned: (userId: string, courseTitle: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'certificate_earned',
      title: 'Certificate Earned! 🎓',
      message: `Congratulations! You've completed "${courseTitle}" and earned a certificate.`,
      link,
      icon: 'certificate',
    });
  },

  courseCompleted: (userId: string, courseTitle: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'course_completed',
      title: 'Course Completed! ✅',
      message: `You've successfully completed "${courseTitle}"!`,
      link,
      icon: 'check-circle',
    });
  },

  streakMilestone: (userId: string, streakDays: number) => {
    return createNotification(userId, {
      userId,
      type: 'streak_milestone',
      title: 'Streak Milestone! 🔥',
      message: `Amazing! You've maintained a ${streakDays}-day learning streak!`,
      link: '/dashboard',
      icon: 'flame',
    });
  },

  forumReply: (userId: string, postTitle: string, authorName: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'forum_reply',
      title: 'New Reply',
      message: `${authorName} replied to your post "${postTitle}"`,
      link,
      icon: 'message',
    });
  },

  forumMention: (userId: string, postTitle: string, authorName: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'forum_mention',
      title: 'You were mentioned',
      message: `${authorName} mentioned you in "${postTitle}"`,
      link,
      icon: 'at-sign',
    });
  },

  courseUpdate: (userId: string, courseTitle: string, updateMessage: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'course_update',
      title: 'Course Updated',
      message: `${courseTitle}: ${updateMessage}`,
      link,
      icon: 'book',
    });
  },

  lessonReminder: (userId: string, courseTitle: string, lessonTitle: string, link?: string) => {
    return createNotification(userId, {
      userId,
      type: 'lesson_reminder',
      title: 'Continue Learning',
      message: `Don't forget to complete "${lessonTitle}" from "${courseTitle}"`,
      link,
      icon: 'clock',
    });
  },
};

