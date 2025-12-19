import { 
  Points, 
  Level, 
  Leaderboard, 
  LeaderboardEntry, 
  Challenge, 
  Quest, 
  Achievement,
  GamificationStats 
} from '../types/gamification';
import { getUserLearningData, getLearningStats } from './progressService';
import { CourseService } from './courseService';
import { useCourseStore } from '../store/useCourseStore';

const STORAGE_KEY_PREFIX = 'greenkiddo_gamification_';

// XP required for each level (exponential growth)
const XP_PER_LEVEL = [
  0,    // Level 1 (starting level)
  100,  // Level 2
  250,  // Level 3
  500,  // Level 4
  1000, // Level 5
  2000, // Level 6
  3500, // Level 7
  5500, // Level 8
  8000, // Level 9
  12000, // Level 10
];

// Calculate XP for level beyond 10
const calculateXPForLevel = (level: number): number => {
  if (level <= 10) {
    return XP_PER_LEVEL[level - 1] || 0;
  }
  // Exponential growth: base * (1.5 ^ (level - 10))
  const base = 12000;
  return Math.floor(base * Math.pow(1.5, level - 10));
};

// Level titles
const LEVEL_TITLES: Record<number, string> = {
  1: 'Seedling',
  2: 'Sprout',
  3: 'Sapling',
  4: 'Young Tree',
  5: 'Growing Tree',
  6: 'Mature Tree',
  7: 'Forest Guardian',
  8: 'Eco Warrior',
  9: 'Sustainability Master',
  10: 'Green Champion',
};

const getLevelTitle = (level: number): string => {
  if (level <= 10) {
    return LEVEL_TITLES[level] || `Level ${level}`;
  }
  if (level <= 20) {
    return `Eco Master ${level - 10}`;
  }
  if (level <= 30) {
    return `Sustainability Legend ${level - 20}`;
  }
  return `Green Hero ${level}`;
};

/**
 * Get gamification data for a user
 */
const getUserGamificationData = (userId: string): GamificationStats => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }

  // Return default data
  return {
    userId,
    points: {
      total: 0,
      thisWeek: 0,
      thisMonth: 0,
      breakdown: {
        lessonsCompleted: 0,
        coursesCompleted: 0,
        quizzesPassed: 0,
        streaks: 0,
        challenges: 0,
        social: 0,
      },
    },
    level: {
      current: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      totalXP: 0,
      title: 'Seedling',
    },
    achievements: [],
    challenges: [],
    quests: [],
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Save gamification data for a user
 */
const saveUserGamificationData = (data: GamificationStats): void => {
  const key = `${STORAGE_KEY_PREFIX}${data.userId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Calculate level from total XP
 */
const calculateLevel = (totalXP: number): Level => {
  let currentLevel = 1;
  let xpForCurrentLevel = 0;
  let xpToNextLevel = calculateXPForLevel(2);

  for (let level = 1; level <= 100; level++) {
    const xpRequired = calculateXPForLevel(level);
    if (totalXP >= xpRequired) {
      currentLevel = level;
      xpForCurrentLevel = totalXP - xpRequired;
      xpToNextLevel = calculateXPForLevel(level + 1) - xpRequired;
    } else {
      break;
    }
  }

  return {
    current: currentLevel,
    currentXP: xpForCurrentLevel,
    xpToNextLevel,
    totalXP,
    title: getLevelTitle(currentLevel),
  };
};

/**
 * Award points to a user
 */
export const awardPoints = (
  userId: string,
  category: keyof Points['breakdown'],
  amount: number,
  xpAmount?: number
): void => {
  const data = getUserGamificationData(userId);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Update points
  data.points.total += amount;
  data.points.breakdown[category] += amount;

  // Update weekly points
  const lastUpdated = new Date(data.lastUpdated);
  if (lastUpdated >= weekStart) {
    data.points.thisWeek += amount;
  } else {
    data.points.thisWeek = amount;
  }

  // Update monthly points
  if (lastUpdated >= monthStart) {
    data.points.thisMonth += amount;
  } else {
    data.points.thisMonth = amount;
  }

  // Update XP and level
  if (xpAmount) {
    data.level.totalXP += xpAmount;
    data.level = calculateLevel(data.level.totalXP);
  }

  data.lastUpdated = new Date().toISOString();
  saveUserGamificationData(data);
};

/**
 * Get points for a user
 */
export const getUserPoints = (userId: string): Points => {
  const data = getUserGamificationData(userId);
  return data.points;
};

/**
 * Get level for a user
 */
export const getUserLevel = (userId: string): Level => {
  const data = getUserGamificationData(userId);
  // Recalculate level in case XP changed
  return calculateLevel(data.level.totalXP);
};

/**
 * Get all users' leaderboard data (mock implementation)
 */
const getAllUsersLeaderboardData = (): LeaderboardEntry[] => {
  // In a real app, this would fetch from backend
  // For now, we'll generate mock data from localStorage
  const entries: LeaderboardEntry[] = [];
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      const userId = key.replace(STORAGE_KEY_PREFIX, '');
      const data = getUserGamificationData(userId);
      
      // Only include if user has points
      if (data.points.total > 0) {
        entries.push({
          userId,
          userName: `User ${userId.slice(0, 8)}`, // Mock name
          rank: 0, // Will be set after sorting
          points: data.points.total,
          level: data.level.current,
        });
      }
    }
  });

  // Sort by points descending
  entries.sort((a, b) => b.points - a.points);
  
  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
};

/**
 * Get leaderboard
 */
export const getLeaderboard = (
  period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time',
  userId?: string
): Leaderboard => {
  const allEntries = getAllUsersLeaderboardData();
  
  // Filter by period (for now, we'll use all-time for all periods)
  // In a real app, you'd filter by the period
  let entries = allEntries;

  // Find user's entry if provided
  let userEntry: LeaderboardEntry | undefined;
  let userRank: number | undefined;
  
  if (userId) {
    userEntry = entries.find(e => e.userId === userId);
    userRank = userEntry?.rank;
  }

  return {
    period,
    entries: entries.slice(0, 100), // Top 100
    userRank,
    userEntry,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Get challenges for a user
 */
export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  const data = getUserGamificationData(userId);
  const learningStats = getLearningStats(userId);
  
  // Get enrolled courses from store
  const enrolledCourses = useCourseStore.getState().getEnrolledCourses();
  
  // Get completed courses by checking progress
  const completedCourses: string[] = [];
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    if (progress?.completed) {
      completedCourses.push(course.id);
    }
  }

  // Generate dynamic challenges based on user progress
  const challenges: Challenge[] = [
    {
      id: 'daily_lesson',
      title: 'Daily Learner',
      description: 'Complete 1 lesson today',
      type: 'daily',
      category: 'learning',
      icon: '📚',
      pointsReward: 10,
      xpReward: 20,
      progress: learningStats.timeSpentToday > 0 ? 1 : 0,
      target: 1,
      completed: learningStats.timeSpentToday > 0,
      expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
      requirements: [
        {
          type: 'complete_lessons',
          target: 1,
          current: learningStats.timeSpentToday > 0 ? 1 : 0,
          description: 'Complete 1 lesson',
        },
      ],
    },
    {
      id: 'weekly_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      type: 'weekly',
      category: 'streak',
      icon: '🔥',
      pointsReward: 50,
      xpReward: 100,
      progress: Math.min(learningStats.currentStreak, 7),
      target: 7,
      completed: learningStats.currentStreak >= 7,
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      requirements: [
        {
          type: 'maintain_streak',
          target: 7,
          current: learningStats.currentStreak,
          description: 'Maintain a 7-day learning streak',
        },
      ],
    },
    {
      id: 'complete_course',
      title: 'Course Completer',
      description: 'Complete your first course',
      type: 'special',
      category: 'learning',
      icon: '🎓',
      pointsReward: 100,
      xpReward: 200,
      progress: completedCourses.length,
      target: 1,
      completed: completedCourses.length >= 1,
      requirements: [
        {
          type: 'complete_courses',
          target: 1,
          current: completedCourses.length,
          description: 'Complete 1 course',
        },
      ],
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Enroll in 5 different courses',
      type: 'monthly',
      category: 'exploration',
      icon: '🗺️',
      pointsReward: 75,
      xpReward: 150,
      progress: enrolledCourses.length,
      target: 5,
      completed: enrolledCourses.length >= 5,
      requirements: [
        {
          type: 'complete_courses',
          target: 5,
          current: enrolledCourses.length,
          description: 'Enroll in 5 courses',
        },
      ],
    },
  ];

  // Update challenges from stored data
  const storedChallenges = data.challenges || [];
  challenges.forEach(challenge => {
    const stored = storedChallenges.find(c => c.id === challenge.id);
    if (stored) {
      challenge.completed = stored.completed;
      challenge.completedAt = stored.completedAt;
    }
  });

  return challenges;
};

/**
 * Complete a challenge
 */
export const completeChallenge = async (userId: string, challengeId: string): Promise<void> => {
  const data = getUserGamificationData(userId);
  const challenges = await getUserChallenges(userId);
  const challenge = challenges.find(c => c.id === challengeId);

  if (!challenge || challenge.completed) {
    return;
  }

  // Award points and XP
  awardPoints(userId, 'challenges', challenge.pointsReward, challenge.xpReward);

  // Mark challenge as completed
  challenge.completed = true;
  challenge.completedAt = new Date().toISOString();

  // Update stored challenges
  data.challenges = challenges;
  saveUserGamificationData(data);
};

/**
 * Get quests for a user
 */
export const getUserQuests = async (userId: string): Promise<Quest[]> => {
  const data = getUserGamificationData(userId);
  const learningStats = getLearningStats(userId);

  // Generate quests
  const quests: Quest[] = [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first lesson',
      type: 'main',
      difficulty: 'easy',
      rewards: {
        points: 25,
        xp: 50,
      },
      progress: learningStats.totalTimeSpent > 0 ? 1 : 0,
      target: 1,
      completed: learningStats.totalTimeSpent > 0,
      unlocked: true,
      steps: [
        {
          id: 'step1',
          title: 'Start a lesson',
          description: 'Open any lesson and start learning',
          completed: learningStats.totalTimeSpent > 0,
          order: 1,
        },
      ],
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Build a 30-day learning streak',
      type: 'main',
      difficulty: 'hard',
      rewards: {
        points: 200,
        xp: 500,
        badge: 'streak_master',
      },
      progress: learningStats.currentStreak,
      target: 30,
      completed: learningStats.currentStreak >= 30,
      unlocked: learningStats.currentStreak >= 7,
      steps: [
        {
          id: 'step1',
          title: '7-day streak',
          description: 'Maintain a 7-day streak',
          completed: learningStats.currentStreak >= 7,
          order: 1,
        },
        {
          id: 'step2',
          title: '14-day streak',
          description: 'Maintain a 14-day streak',
          completed: learningStats.currentStreak >= 14,
          order: 2,
        },
        {
          id: 'step3',
          title: '30-day streak',
          description: 'Maintain a 30-day streak',
          completed: learningStats.currentStreak >= 30,
          order: 3,
        },
      ],
    },
  ];

  // Update from stored data
  const storedQuests = data.quests || [];
  quests.forEach(quest => {
    const stored = storedQuests.find(q => q.id === quest.id);
    if (stored) {
      quest.completed = stored.completed;
      quest.steps = quest.steps.map(step => {
        const storedStep = stored.steps?.find(s => s.id === step.id);
        return storedStep ? { ...step, completed: storedStep.completed } : step;
      });
    }
  });

  return quests;
};

/**
 * Complete a quest step
 */
export const completeQuestStep = async (userId: string, questId: string, stepId: string): Promise<void> => {
  const data = getUserGamificationData(userId);
  const quests = await getUserQuests(userId);
  const quest = quests.find(q => q.id === questId);

  if (!quest) {
    return;
  }

  const step = quest.steps.find(s => s.id === stepId);
  if (step) {
    step.completed = true;
  }

  // Check if all steps are completed
  if (quest.steps.every(s => s.completed) && !quest.completed) {
    quest.completed = true;
    awardPoints(userId, 'challenges', quest.rewards.points, quest.rewards.xp);
  }

  data.quests = quests;
  saveUserGamificationData(data);
};

/**
 * Get achievements for a user
 */
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const data = getUserGamificationData(userId);
  const learningStats = getLearningStats(userId);
  
  // Get completed courses
  const enrolledCourses = useCourseStore.getState().getEnrolledCourses();
  const completedCourses: string[] = [];
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    if (progress?.completed) {
      completedCourses.push(course.id);
    }
  }
  
  const level = getUserLevel(userId);

  const achievements: Achievement[] = [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🌱',
      category: 'milestone',
      rarity: 'common',
      pointsReward: 10,
      xpReward: 20,
      unlocked: learningStats.totalTimeSpent > 0,
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'rare',
      pointsReward: 50,
      xpReward: 100,
      unlocked: learningStats.currentStreak >= 7,
    },
    {
      id: 'course_master',
      name: 'Course Master',
      description: 'Complete 5 courses',
      icon: '🎓',
      category: 'course',
      rarity: 'epic',
      pointsReward: 200,
      xpReward: 500,
      unlocked: completedCourses.length >= 5,
      progress: completedCourses.length,
      target: 5,
    },
    {
      id: 'level_10',
      name: 'Green Champion',
      description: 'Reach level 10',
      icon: '🏆',
      category: 'milestone',
      rarity: 'legendary',
      pointsReward: 500,
      xpReward: 1000,
      unlocked: level.current >= 10,
      progress: level.current,
      target: 10,
    },
  ];

  // Update from stored data
  const storedAchievements = data.achievements || [];
  achievements.forEach(achievement => {
    const stored = storedAchievements.find(a => a.id === achievement.id);
    if (stored) {
      achievement.unlocked = stored.unlocked;
      achievement.unlockedAt = stored.unlockedAt;
    }
  });

  return achievements;
};

/**
 * Unlock an achievement
 */
export const unlockAchievement = (userId: string, achievementId: string): void => {
  const data = getUserGamificationData(userId);
  const achievements = getUserAchievements(userId);
  const achievement = achievements.find(a => a.id === achievementId);

  if (!achievement || achievement.unlocked) {
    return;
  }

  // Award points and XP
  awardPoints(userId, 'challenges', achievement.pointsReward, achievement.xpReward);

  // Mark as unlocked
  achievement.unlocked = true;
  achievement.unlockedAt = new Date().toISOString();

  // Update stored achievements
  data.achievements = achievements;
  saveUserGamificationData(data);
};

/**
 * Get full gamification stats for a user
 */
export const getGamificationStats = async (userId: string): Promise<GamificationStats> => {
  const data = getUserGamificationData(userId);
  
  // Refresh calculated values
  data.level = getUserLevel(userId);
  data.achievements = await getUserAchievements(userId);
  data.challenges = await getUserChallenges(userId);
  data.quests = await getUserQuests(userId);
  
  // Check for newly unlocked achievements
  for (const achievement of data.achievements) {
    if (achievement.unlocked && !achievement.unlockedAt) {
      unlockAchievement(userId, achievement.id);
    }
  }

  // Check for completed challenges
  for (const challenge of data.challenges) {
    if (challenge.completed && !challenge.completedAt) {
      await completeChallenge(userId, challenge.id);
    }
  }

  data.lastUpdated = new Date().toISOString();
  saveUserGamificationData(data);
  
  return data;
};

/**
 * Initialize gamification for a new user
 */
export const initializeGamification = (userId: string): void => {
  const data = getUserGamificationData(userId);
  // Already initialized with defaults
  saveUserGamificationData(data);
};

