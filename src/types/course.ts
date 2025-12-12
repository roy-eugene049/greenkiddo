export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string[];
  tags: string[];
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  lessons: Lesson[];
  enrolledCount: number;
  rating: {
    average: number;
    count: number;
  };
  language: string;
  prerequisites?: string[]; // Course IDs that must be completed first
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: LessonContent;
  duration: number; // in minutes
  order: number;
  isPreview: boolean;
  resources?: Resource[];
  quizId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonContent {
  type: 'video' | 'article' | 'interactive' | 'mixed';
  videoUrl?: string;
  articleContent?: string; // markdown or HTML
  interactiveContent?: InteractiveContent;
}

export interface InteractiveContent {
  type: 'simulation' | 'game' | 'quiz' | 'worksheet';
  data: Record<string, unknown>;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'link' | 'document';
  url: string;
  size?: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  lessonId?: string;
  completed: boolean;
  progressPercentage: number;
  lastAccessed: string;
  timeSpent: number; // in minutes
  quizScores?: QuizScore[];
  notes?: Note[];
  bookmarked: boolean;
}

export interface QuizScore {
  quizId: string;
  score: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  attemptNumber: number;
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  timestamp?: number; // for video notes
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  certificateUrl: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: 'achievement' | 'milestone' | 'special';
}

export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: Certificate[];
  badges: Badge[];
  totalTimeSpent: number;
  streak: number;
  joinedAt: string;
}

