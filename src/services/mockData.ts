import { Course, Lesson, Quiz, Badge } from '../types/course';

// Mock Courses Data
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Sustainable Living',
    description: 'Learn the fundamentals of sustainable living and how to make eco-friendly choices in your daily life. This course covers the basics of reducing waste, conserving energy, and understanding your environmental impact.',
    shortDescription: 'Master the basics of sustainable living and eco-friendly practices.',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
    instructor: {
      id: 'instructor-1',
      name: 'Dr. Sarah Green',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      bio: 'Environmental scientist with 15 years of experience in sustainability education.'
    },
    duration: 120,
    difficulty: 'beginner',
    category: ['Lifestyle', 'Basics'],
    tags: ['sustainability', 'eco-friendly', 'beginner', 'lifestyle'],
    price: {
      amount: 0,
      currency: 'USD',
      isFree: true
    },
    lessons: [],
    enrolledCount: 1250,
    rating: {
      average: 4.8,
      count: 342
    },
    language: 'en',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isPublished: true
  },
  {
    id: '2',
    title: 'Renewable Energy Basics',
    description: 'Explore the world of renewable energy sources including solar, wind, and hydroelectric power. Understand how these technologies work and their role in combating climate change.',
    shortDescription: 'Discover how renewable energy can power our future sustainably.',
    thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
    instructor: {
      id: 'instructor-2',
      name: 'Prof. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      bio: 'Renewable energy expert and former engineer at leading solar companies.'
    },
    duration: 180,
    difficulty: 'intermediate',
    category: ['Energy', 'Technology'],
    tags: ['renewable-energy', 'solar', 'wind', 'climate'],
    price: {
      amount: 0,
      currency: 'USD',
      isFree: true
    },
    lessons: [],
    enrolledCount: 890,
    rating: {
      average: 4.6,
      count: 201
    },
    language: 'en',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isPublished: true
  },
  {
    id: '3',
    title: 'Waste Reduction & Recycling',
    description: 'Learn practical strategies to reduce waste in your home and community. Master the art of recycling, composting, and making sustainable purchasing decisions.',
    shortDescription: 'Transform your waste habits and become a recycling champion.',
    thumbnail: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop',
    instructor: {
      id: 'instructor-3',
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      bio: 'Zero-waste advocate and sustainability consultant.'
    },
    duration: 90,
    difficulty: 'beginner',
    category: ['Waste Management', 'Lifestyle'],
    tags: ['recycling', 'zero-waste', 'composting', 'reduction'],
    price: {
      amount: 0,
      currency: 'USD',
      isFree: true
    },
    lessons: [],
    enrolledCount: 2100,
    rating: {
      average: 4.9,
      count: 456
    },
    language: 'en',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    isPublished: true
  },
  {
    id: '4',
    title: 'Climate Change & Digitalization',
    description: 'Understand how our digital world impacts the environment and learn ways to use technology responsibly. Explore the carbon footprint of digital activities and sustainable tech solutions.',
    shortDescription: 'Navigate the intersection of technology and environmental responsibility.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    instructor: {
      id: 'instructor-4',
      name: 'Dr. James Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
      bio: 'Tech sustainability researcher and climate advocate.'
    },
    duration: 150,
    difficulty: 'intermediate',
    category: ['Technology', 'Climate'],
    tags: ['digitalization', 'carbon-footprint', 'tech', 'climate-change'],
    price: {
      amount: 0,
      currency: 'USD',
      isFree: true
    },
    lessons: [],
    enrolledCount: 650,
    rating: {
      average: 4.7,
      count: 178
    },
    language: 'en',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    isPublished: true
  },
  {
    id: '5',
    title: 'Eco-Friendly Technology',
    description: 'Discover innovative technologies that help protect our planet. From green computing to sustainable design, learn how technology can be part of the solution.',
    shortDescription: 'Explore cutting-edge eco-friendly technologies and innovations.',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    instructor: {
      id: 'instructor-5',
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
      bio: 'Green tech innovator and sustainable design expert.'
    },
    duration: 200,
    difficulty: 'advanced',
    category: ['Technology', 'Innovation'],
    tags: ['green-tech', 'innovation', 'sustainable-design', 'future'],
    price: {
      amount: 0,
      currency: 'USD',
      isFree: true
    },
    lessons: [],
    enrolledCount: 420,
    rating: {
      average: 4.5,
      count: 98
    },
    language: 'en',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    isPublished: true
  }
];

// Mock Lessons for Course 1
export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    courseId: '1',
    title: 'What is Sustainability?',
    description: 'Introduction to the concept of sustainability and why it matters.',
    content: {
      type: 'video',
      videoUrl: 'https://example.com/video1.mp4'
    },
    duration: 15,
    order: 1,
    isPreview: true,
    resources: [
      {
        id: 'res-1',
        title: 'Sustainability Guide PDF',
        type: 'pdf',
        url: 'https://example.com/guide.pdf',
        size: 1024000
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'lesson-1-2',
    courseId: '1',
    title: 'Your Carbon Footprint',
    description: 'Learn how to calculate and reduce your personal carbon footprint.',
    content: {
      type: 'mixed',
      videoUrl: 'https://example.com/video2.mp4',
      articleContent: '# Your Carbon Footprint\n\nUnderstanding your impact on the environment...'
    },
    duration: 20,
    order: 2,
    isPreview: false,
    quizId: 'quiz-1-2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'lesson-1-3',
    courseId: '1',
    title: 'Simple Daily Changes',
    description: 'Practical tips for making sustainable choices every day.',
    content: {
      type: 'article',
      articleContent: '# Simple Daily Changes\n\nHere are easy ways to be more sustainable...'
    },
    duration: 25,
    order: 3,
    isPreview: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1-2',
    lessonId: 'lesson-1-2',
    title: 'Carbon Footprint Quiz',
    description: 'Test your understanding of carbon footprints',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is a carbon footprint?',
        options: [
          'The amount of CO2 you produce',
          'Your shoe size',
          'A type of plant',
          'A measurement of water usage'
        ],
        correctAnswer: 'The amount of CO2 you produce',
        explanation: 'A carbon footprint measures the total greenhouse gas emissions caused by an individual.',
        points: 10
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Transportation is a major contributor to carbon footprints.',
        correctAnswer: 'true',
        explanation: 'Yes, transportation, especially cars and planes, significantly contribute to carbon emissions.',
        points: 10
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which activity has the smallest carbon footprint?',
        options: [
          'Driving a car',
          'Riding a bicycle',
          'Flying in an airplane',
          'Using a gas stove'
        ],
        correctAnswer: 'Riding a bicycle',
        explanation: 'Bicycles produce zero direct emissions!',
        points: 10
      }
    ],
    passingScore: 70,
    timeLimit: 10,
    attemptsAllowed: 3,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🌱',
    category: 'achievement'
  },
  {
    id: 'badge-2',
    name: 'Week Warrior',
    description: 'Learn for 7 days in a row',
    icon: '🔥',
    category: 'milestone'
  },
  {
    id: 'badge-3',
    name: 'Sustainability Expert',
    description: 'Complete 10 courses',
    icon: '🏆',
    category: 'achievement'
  },
  {
    id: 'badge-4',
    name: 'Quiz Master',
    description: 'Get perfect scores on 5 quizzes',
    icon: '⭐',
    category: 'achievement'
  },
  {
    id: 'badge-5',
    name: 'Eco Champion',
    description: 'Complete all beginner courses',
    icon: '🌍',
    category: 'special'
  }
];

// Helper function to get course by ID
export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

// Helper function to get lessons by course ID
export const getLessonsByCourseId = (courseId: string): Lesson[] => {
  return mockLessons.filter(lesson => lesson.courseId === courseId);
};

// Helper function to get quiz by ID
export const getQuizById = (id: string): Quiz | undefined => {
  return mockQuizzes.find(quiz => quiz.id === id);
};

// Helper function to get courses by category
export const getCoursesByCategory = (category: string): Course[] => {
  return mockCourses.filter(course => 
    course.category.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
};

// Helper function to get courses by difficulty
export const getCoursesByDifficulty = (difficulty: string): Course[] => {
  return mockCourses.filter(course => course.difficulty === difficulty);
};

// Helper function to search courses
export const searchCourses = (query: string): Course[] => {
  const lowerQuery = query.toLowerCase();
  return mockCourses.filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

