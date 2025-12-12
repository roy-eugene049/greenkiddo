/**
 * Recommendation Service
 * 
 * Provides personalized course recommendations and learning paths
 */

import { CourseService } from './courseService';
import { Course } from '../types/course';
import { getLearningStats, getTotalTimeSpent } from './progressService';
import { getEnrolledCourses } from '../store/useCourseStore';

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[]; // Course IDs in order
  estimatedDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string[];
  tags: string[];
  createdAt: string;
}

export interface Recommendation {
  course: Course;
  reason: string;
  score: number;
  type: 'similar' | 'prerequisite' | 'next_step' | 'popular' | 'trending' | 'completion';
}

export interface NextStep {
  courseId?: string;
  lessonId?: string;
  type: 'continue_course' | 'start_course' | 'complete_lesson' | 'take_quiz';
  title: string;
  description: string;
  priority: number;
}

const LEARNING_PATHS_KEY = 'greenkiddo_learning_paths';

/**
 * Get personalized course recommendations
 */
export async function getRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
  const allCourses = await CourseService.getAllCourses();
  const enrolledCourses = getEnrolledCourses();
  const enrolledIds = new Set(enrolledCourses.map(c => c.id));
  
  // Get user progress data
  const learningStats = getLearningStats(userId);
  const timeSpent = getTotalTimeSpent(userId);
  
  // Get completed courses
  const completedCourses: string[] = [];
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    if (progress?.completed) {
      completedCourses.push(course.id);
    }
  }
  
  // Filter out enrolled courses
  const availableCourses = allCourses.filter(c => !enrolledIds.has(c.id));
  
  const recommendations: Recommendation[] = [];
  
  for (const course of availableCourses) {
    let score = 0;
    let reasons: string[] = [];
    
    // 1. Similar courses (same category/tags as completed courses)
    if (completedCourses.length > 0) {
      const completedCourseData = allCourses.filter(c => completedCourses.includes(c.id));
      const commonCategories = course.category.filter(cat =>
        completedCourseData.some(cc => cc.category.includes(cat))
      );
      const commonTags = course.tags.filter(tag =>
        completedCourseData.some(cc => cc.tags.includes(tag))
      );
      
      if (commonCategories.length > 0) {
        score += 30;
        reasons.push(`Similar to courses you've completed in ${commonCategories[0]}`);
      }
      if (commonTags.length > 0) {
        score += 20;
      }
    }
    
    // 2. Prerequisite completion
    if (course.prerequisites && course.prerequisites.length > 0) {
      const hasAllPrerequisites = course.prerequisites.every(prereqId =>
        completedCourses.includes(prereqId)
      );
      if (hasAllPrerequisites) {
        score += 50;
        reasons.push('You\'ve completed all prerequisites');
      } else {
        // Lower score if prerequisites not met
        score -= 30;
      }
    }
    
    // 3. Difficulty progression
    if (completedCourses.length > 0) {
      const completedCourseData = allCourses.filter(c => completedCourses.includes(c.id));
      const avgDifficulty = getAverageDifficulty(completedCourseData);
      const courseDifficulty = getDifficultyLevel(course.difficulty);
      
      if (courseDifficulty === avgDifficulty + 1) {
        score += 25;
        reasons.push('Perfect next step in difficulty');
      } else if (courseDifficulty > avgDifficulty + 1) {
        score -= 15;
      }
    } else {
      // For beginners, recommend beginner courses
      if (course.difficulty === 'beginner') {
        score += 20;
        reasons.push('Great starting point');
      }
    }
    
    // 4. Popular courses
    if (course.enrolledCount > 100) {
      score += 15;
      reasons.push('Popular choice');
    }
    
    // 5. High ratings
    if (course.rating.average >= 4.5) {
      score += 20;
      reasons.push('Highly rated');
    }
    
    // 6. Time-based recommendations (if user has limited time)
    if (timeSpent < 60 && course.duration <= 2) {
      score += 10;
      reasons.push('Quick course');
    }
    
    // 7. Category interest (based on enrolled courses)
    if (enrolledCourses.length > 0) {
      const enrolledCategories = new Set(
        enrolledCourses.flatMap(c => c.category)
      );
      if (course.category.some(cat => enrolledCategories.has(cat))) {
        score += 15;
        reasons.push('Matches your interests');
      }
    }
    
    if (score > 0) {
      recommendations.push({
        course,
        reason: reasons[0] || 'Recommended for you',
        score,
        type: getRecommendationType(course, completedCourses, enrolledCourses),
      });
    }
  }
  
  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get next steps for user
 */
export async function getNextSteps(userId: string): Promise<NextStep[]> {
  const nextSteps: NextStep[] = [];
  const enrolledCourses = getEnrolledCourses();
  
  // 1. Continue in-progress courses
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    if (progress && !progress.completed && progress.progressPercentage > 0) {
      const lessons = await CourseService.getLessonsByCourseId(course.id);
      const completedLessonIds = progress.completedLessons || [];
      const nextLesson = lessons
        .sort((a, b) => a.order - b.order)
        .find(lesson => !completedLessonIds.includes(lesson.id));
      
      if (nextLesson) {
        nextSteps.push({
          courseId: course.id,
          lessonId: nextLesson.id,
          type: 'continue_course',
          title: `Continue: ${course.title}`,
          description: `Next lesson: ${nextLesson.title}`,
          priority: 100 - progress.progressPercentage, // Higher priority for courses closer to completion
        });
      }
    }
  }
  
  // 2. Start new enrolled courses
  for (const course of enrolledCourses) {
    const progress = await CourseService.getUserProgress(userId, course.id);
    if (!progress || progress.progressPercentage === 0) {
      const lessons = await CourseService.getLessonsByCourseId(course.id);
      const firstLesson = lessons.sort((a, b) => a.order - b.order)[0];
      
      if (firstLesson) {
        nextSteps.push({
          courseId: course.id,
          lessonId: firstLesson.id,
          type: 'start_course',
          title: `Start: ${course.title}`,
          description: `Begin your learning journey`,
          priority: 50,
        });
      }
    }
  }
  
  // 3. Complete lessons with quizzes
  for (const course of enrolledCourses) {
    const lessons = await CourseService.getLessonsByCourseId(course.id);
    const progress = await CourseService.getUserProgress(userId, course.id);
    const completedLessonIds = progress?.completedLessons || [];
    
    for (const lesson of lessons) {
      if (lesson.quizId && !completedLessonIds.includes(lesson.id)) {
        const isCompleted = completedLessonIds.includes(lesson.id);
        if (!isCompleted) {
          nextSteps.push({
            courseId: course.id,
            lessonId: lesson.id,
            type: 'take_quiz',
            title: `Take Quiz: ${lesson.title}`,
            description: `Complete the quiz for ${lesson.title}`,
            priority: 30,
          });
        }
      }
    }
  }
  
  // Sort by priority
  return nextSteps.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

/**
 * Get learning paths
 */
export function getLearningPaths(): LearningPath[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(LEARNING_PATHS_KEY);
  if (!stored) {
    // Return default learning paths
    return getDefaultLearningPaths();
  }
  
  const paths: LearningPath[] = JSON.parse(stored);
  return [...paths, ...getDefaultLearningPaths()];
}

/**
 * Create a custom learning path
 */
export function createLearningPath(
  name: string,
  description: string,
  courses: string[],
  difficulty: LearningPath['difficulty'],
  category: string[],
  tags: string[]
): LearningPath {
  if (typeof window === 'undefined') {
    throw new Error('Cannot create learning path in non-browser environment');
  }
  
  const path: LearningPath = {
    id: `path-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    name,
    description,
    courses,
    estimatedDuration: 0, // Will be calculated
    difficulty,
    category,
    tags,
    createdAt: new Date().toISOString(),
  };
  
  const existing = getLearningPaths();
  existing.push(path);
  localStorage.setItem(LEARNING_PATHS_KEY, JSON.stringify(existing));
  
  return path;
}

/**
 * Get recommended learning paths for user
 */
export async function getRecommendedPaths(userId: string): Promise<LearningPath[]> {
  const allPaths = getLearningPaths();
  const enrolledCourses = getEnrolledCourses();
  const enrolledIds = new Set(enrolledCourses.map(c => c.id));
  
  // Score paths based on user progress
  const scoredPaths = allPaths.map(path => {
    let score = 0;
    
    // Check how many courses in path are completed
    const completedInPath = path.courses.filter(id => enrolledIds.has(id)).length;
    const completionRatio = completedInPath / path.courses.length;
    
    if (completionRatio > 0 && completionRatio < 1) {
      score += 50; // In progress
    } else if (completionRatio === 0) {
      score += 20; // Not started
    }
    
    // Match difficulty
    const learningStats = getLearningStats(userId);
    if (path.difficulty === 'beginner' && learningStats.currentStreak < 7) {
      score += 30;
    }
    
    return { path, score };
  });
  
  return scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(p => p.path);
}

/**
 * Helper functions
 */
function getAverageDifficulty(courses: Course[]): number {
  if (courses.length === 0) return 0;
  const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const sum = courses.reduce((acc, c) => acc + difficultyMap[c.difficulty], 0);
  return Math.round(sum / courses.length);
}

function getDifficultyLevel(difficulty: string): number {
  const map: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };
  return map[difficulty] || 1;
}

function getRecommendationType(
  course: Course,
  completedCourses: string[],
  enrolledCourses: Course[]
): Recommendation['type'] {
  if (course.prerequisites && course.prerequisites.every(p => completedCourses.includes(p))) {
    return 'prerequisite';
  }
  if (enrolledCourses.some(c => c.category.some(cat => course.category.includes(cat)))) {
    return 'similar';
  }
  if (course.enrolledCount > 100) {
    return 'popular';
  }
  return 'next_step';
}

function getDefaultLearningPaths(): LearningPath[] {
  return [
    {
      id: 'path-beginner-sustainability',
      name: 'Sustainability Fundamentals',
      description: 'A comprehensive path for beginners to learn about sustainability and environmental conservation',
      courses: [], // Will be populated with actual course IDs
      estimatedDuration: 20,
      difficulty: 'beginner',
      category: ['Sustainability', 'Environment'],
      tags: ['beginner', 'sustainability', 'environment'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'path-climate-action',
      name: 'Climate Action Path',
      description: 'Learn about climate change and how to take action',
      courses: [],
      estimatedDuration: 30,
      difficulty: 'intermediate',
      category: ['Climate', 'Action'],
      tags: ['climate', 'action', 'intermediate'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'path-renewable-energy',
      name: 'Renewable Energy Mastery',
      description: 'Deep dive into renewable energy technologies and implementation',
      courses: [],
      estimatedDuration: 40,
      difficulty: 'advanced',
      category: ['Energy', 'Technology'],
      tags: ['energy', 'renewable', 'advanced'],
      createdAt: new Date().toISOString(),
    },
  ];
}

