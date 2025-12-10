import { Course, Lesson, Quiz, UserProgress } from '../types/course';
import { 
  mockCourses, 
  mockLessons, 
  mockQuizzes,
  getCourseById,
  getLessonsByCourseId,
  getQuizById,
  getCoursesByCategory,
  getCoursesByDifficulty,
  searchCourses
} from './mockData';

// This service will eventually connect to a real backend
// For now, it uses mock data

export class CourseService {
  // Get all courses
  static async getAllCourses(): Promise<Course[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourses;
  }

  // Get course by ID
  static async getCourseById(id: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = getCourseById(id);
    if (!course) return null;
    
    // Attach lessons to course (lessons are loaded separately)
    return course;
  }

  // Get lessons for a course
  static async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getLessonsByCourseId(courseId);
  }

  // Get lesson by ID
  static async getLessonById(lessonId: string): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLessons.find(lesson => lesson.id === lessonId) || null;
  }

  // Get quiz by ID
  static async getQuizById(quizId: string): Promise<Quiz | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getQuizById(quizId) || null;
  }

  // Filter courses
  static async filterCourses(filters: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockCourses];

    if (filters.category) {
      filtered = getCoursesByCategory(filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }

    if (filters.search) {
      filtered = searchCourses(filters.search);
    }

    return filtered;
  }

  // Enroll in course (mock - will need backend)
  static async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real implementation, this would call an API
    console.log(`User ${userId} enrolled in course ${courseId}`);
    return true;
  }

  // Get user progress for a course
  static async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock progress data
    return {
      userId,
      courseId,
      completed: false,
      progressPercentage: 0,
      lastAccessed: new Date().toISOString(),
      timeSpent: 0,
      bookmarked: false
    };
  }

  // Update lesson progress
  static async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    completed: boolean
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Progress updated for user ${userId}, course ${courseId}, lesson ${lessonId}`);
    return true;
  }

  // Submit quiz
  static async submitQuiz(
    userId: string,
    quizId: string,
    answers: Record<string, string | string[]>
  ): Promise<{
    score: number;
    percentage: number;
    passed: boolean;
    correctAnswers: Record<string, string | string[]>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const quiz = getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const correctAnswers: Record<string, string | string[]> = {};

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      correctAnswers[question.id] = correctAnswer;

      if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            userAnswer.length === correctAnswer.length &&
            userAnswer.every(ans => correctAnswer.includes(ans))) {
          correctCount++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          correctCount++;
        }
      }
    });

    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= quiz.passingScore;

    return {
      score: correctCount,
      percentage,
      passed,
      correctAnswers
    };
  }
}

