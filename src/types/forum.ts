export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
}

export interface ForumPost {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badges?: string[];
  };
  upvotes: number;
  downvotes: number;
  commentCount: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  courseId?: string; // If related to a specific course
  lessonId?: string; // If related to a specific lesson
}

export interface ForumComment {
  id: string;
  postId: string;
  parentId?: string; // For nested replies
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badges?: string[];
  };
  upvotes: number;
  downvotes: number;
  isAccepted?: boolean; // For marking as accepted answer
  createdAt: string;
  updatedAt: string;
  replies?: ForumComment[]; // Nested replies
}

export interface PostVote {
  postId: string;
  userId: string;
  vote: 'upvote' | 'downvote' | null;
}

export interface CommentVote {
  commentId: string;
  userId: string;
  vote: 'upvote' | 'downvote' | null;
}

