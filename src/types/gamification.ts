export interface Points {
  total: number;
  thisWeek: number;
  thisMonth: number;
  breakdown: {
    lessonsCompleted: number;
    coursesCompleted: number;
    quizzesPassed: number;
    streaks: number;
    challenges: number;
    social: number; // forum posts, reviews, etc.
  };
}

export interface Level {
  current: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  title: string;
  badge?: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  rank: number;
  points: number;
  level: number;
  badge?: string;
  change?: number; // rank change from previous period
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  userRank?: number;
  userEntry?: LeaderboardEntry;
  lastUpdated: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'learning' | 'streak' | 'social' | 'quiz' | 'exploration';
  icon: string;
  pointsReward: number;
  xpReward: number;
  badgeReward?: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  expiresAt?: string;
  requirements: ChallengeRequirement[];
}

export interface ChallengeRequirement {
  type: 'complete_lessons' | 'complete_courses' | 'maintain_streak' | 'pass_quizzes' | 'forum_posts' | 'reviews' | 'time_spent';
  target: number;
  current: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    points: number;
    xp: number;
    badge?: string;
  };
  progress: number;
  target: number;
  completed: boolean;
  unlocked: boolean;
  requirements?: string[]; // Quest IDs that must be completed first
  steps: QuestStep[];
}

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'course' | 'quiz' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsReward: number;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface GamificationStats {
  userId: string;
  points: Points;
  level: Level;
  achievements: Achievement[];
  challenges: Challenge[];
  quests: Quest[];
  leaderboardRank?: number;
  lastUpdated: string;
}

