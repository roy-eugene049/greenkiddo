import { ForumPost, ForumComment, ContentReport, ModerationAction } from '../types/forum';
import { ForumService } from './forumService';

// Mock reports
const mockReports: ContentReport[] = [
  {
    id: 'report-1',
    contentId: 'post-4',
    contentType: 'post',
    reason: 'spam',
    description: 'This post contains promotional content',
    reportedBy: {
      id: 'user-5',
      name: 'Community Member',
    },
    status: 'pending',
    createdAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'report-2',
    contentId: 'comment-3',
    contentType: 'comment',
    reason: 'inappropriate',
    description: 'Offensive language used',
    reportedBy: {
      id: 'user-6',
      name: 'Another Member',
    },
    status: 'pending',
    createdAt: '2024-01-17T11:30:00Z',
  },
];

// Mock moderation actions
const mockModerationActions: ModerationAction[] = [
  {
    id: 'action-1',
    contentId: 'post-5',
    contentType: 'post',
    action: 'delete',
    reason: 'Violates community guidelines',
    moderatedBy: {
      id: 'admin-1',
      name: 'Admin User',
    },
    createdAt: '2024-01-16T15:00:00Z',
  },
];

const STORAGE_KEY_REPORTS = 'greenkiddo_moderation_reports';
const STORAGE_KEY_ACTIONS = 'greenkiddo_moderation_actions';

const getStoredReports = (): ContentReport[] => {
  const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
  return stored ? JSON.parse(stored) : [];
};

const saveReports = (reports: ContentReport[]): void => {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
};

const getStoredActions = (): ModerationAction[] => {
  const stored = localStorage.getItem(STORAGE_KEY_ACTIONS);
  return stored ? JSON.parse(stored) : [];
};

const saveActions = (actions: ModerationAction[]): void => {
  localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(actions));
};

export class ModerationService {
  /**
   * Get all pending reports
   */
  static async getPendingReports(): Promise<ContentReport[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = getStoredReports();
    const allReports = [...mockReports, ...stored];
    return allReports.filter(r => r.status === 'pending');
  }

  /**
   * Get all reports
   */
  static async getAllReports(): Promise<ContentReport[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = getStoredReports();
    return [...mockReports, ...stored];
  }

  /**
   * Get moderation actions history
   */
  static async getModerationHistory(): Promise<ModerationAction[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = getStoredActions();
    return [...mockModerationActions, ...stored].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get reported content details
   */
  static async getReportedContent(contentId: string, contentType: 'post' | 'comment'): Promise<ForumPost | ForumComment | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (contentType === 'post') {
      const posts = await ForumService.getPosts();
      return posts.find(p => p.id === contentId) || null;
    } else {
      // For comments, we'd need to fetch from the post
      // This is simplified for now
      return null;
    }
  }

  /**
   * Review a report
   */
  static async reviewReport(
    reportId: string,
    action: 'approve' | 'reject' | 'dismiss',
    moderatorId: string,
    moderatorName: string
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stored = getStoredReports();
    const report = [...mockReports, ...stored].find(r => r.id === reportId);
    
    if (!report) return false;

    const updatedReport: ContentReport = {
      ...report,
      status: action === 'approve' ? 'resolved' : action === 'reject' ? 'reviewed' : 'dismissed',
      reviewedBy: {
        id: moderatorId,
        name: moderatorName,
      },
      reviewedAt: new Date().toISOString(),
    };

    // Update in storage
    const index = stored.findIndex(r => r.id === reportId);
    if (index !== -1) {
      stored[index] = updatedReport;
    } else {
      stored.push(updatedReport);
    }
    saveReports(stored);

    return true;
  }

  /**
   * Perform moderation action
   */
  static async performAction(
    contentId: string,
    contentType: 'post' | 'comment',
    action: 'approve' | 'reject' | 'delete' | 'lock' | 'unlock' | 'pin' | 'unpin',
    moderatorId: string,
    moderatorName: string,
    reason?: string
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Record the action
    const moderationAction: ModerationAction = {
      id: `action-${Date.now()}`,
      contentId,
      contentType,
      action,
      reason,
      moderatedBy: {
        id: moderatorId,
        name: moderatorName,
      },
      createdAt: new Date().toISOString(),
    };

    const stored = getStoredActions();
    stored.push(moderationAction);
    saveActions(stored);

    // In a real app, this would update the actual content
    // For now, we just record the action

    return true;
  }

  /**
   * Get content awaiting moderation
   */
  static async getContentAwaitingModeration(): Promise<{
    posts: ForumPost[];
    comments: ForumComment[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would fetch posts/comments that need moderation
    // For now, return empty arrays
    return {
      posts: [],
      comments: [],
    };
  }
}

