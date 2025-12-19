export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseId?: string; // If group is for a specific course
  category: string;
  icon?: string;
  coverImage?: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  members: StudyGroupMember[];
  maxMembers?: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    allowMemberPosts: boolean;
  };
}

export interface StudyGroupMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  status: 'active' | 'inactive';
}

export interface StudyGroupPost {
  id: string;
  groupId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'resource' | 'question' | 'announcement';
  attachments?: Attachment[];
  likes: number;
  comments: StudyGroupComment[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroupComment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  replies?: StudyGroupComment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'image' | 'link';
  url: string;
  size?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  attachments?: Attachment[];
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  type: 'direct' | 'group';
  groupName?: string;
  groupAvatar?: string;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export interface GroupProject {
  id: string;
  groupId: string;
  name: string;
  description: string;
  courseId?: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  members: GroupProjectMember[];
  tasks: ProjectTask[];
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupProjectMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'leader' | 'member';
  tasksAssigned: string[]; // Task IDs
  joinedAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string[]; // User IDs
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CollaborativeNote {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  lessonId?: string;
  groupId?: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  collaborators: NoteCollaborator[];
  version: number;
  versions: NoteVersion[];
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastEditedBy?: {
    id: string;
    name: string;
  };
}

export interface NoteCollaborator {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface NoteVersion {
  version: number;
  content: string;
  editedBy: {
    id: string;
    name: string;
  };
  editedAt: string;
  changes?: string;
}

export interface StudyBuddy {
  id: string;
  userId: string;
  matchedUserId: string;
  userName: string;
  matchedUserName: string;
  userAvatar?: string;
  matchedUserAvatar?: string;
  compatibility: number; // 0-100
  commonInterests: string[];
  commonCourses: string[];
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  matchedAt: string;
  lastInteraction?: string;
}

export interface StudyBuddyProfile {
  userId: string;
  userName: string;
  userAvatar?: string;
  bio?: string;
  interests: string[];
  learningGoals: string[];
  preferredStudyTimes: string[];
  timezone?: string;
  availability: 'available' | 'busy' | 'away';
  lookingFor: 'study-buddy' | 'group' | 'both';
  courses: string[];
  level: number;
  badges: string[];
}

export interface GroupChallenge {
  id: string;
  groupId: string;
  name: string;
  description: string;
  type: 'course-completion' | 'quiz-competition' | 'streak-challenge' | 'custom';
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: GroupChallengeParticipant[];
  rules: string[];
  rewards?: {
    points: number;
    badge?: string;
  };
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  leaderboard: GroupChallengeLeaderboardEntry[];
  createdAt: string;
}

export interface GroupChallengeParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  progress: number;
  score?: number;
  joinedAt: string;
}

export interface GroupChallengeLeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  rank: number;
  score: number;
  progress: number;
}

export interface SocialFeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
  };
  type: 'achievement' | 'course-completion' | 'milestone' | 'group-activity' | 'custom';
  content: string;
  image?: string;
  link?: {
    url: string;
    title: string;
    description?: string;
  };
  likes: number;
  comments: SocialFeedComment[];
  shares: number;
  isLiked: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialFeedComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  replies?: SocialFeedComment[];
}

