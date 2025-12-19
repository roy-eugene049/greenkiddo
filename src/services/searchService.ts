import { SearchResult, SearchOptions } from '../types/search';
import { CourseService } from './courseService';
import { Course, Lesson } from '../types/course';
import { ForumService } from './forumService';

// Mock blog posts for search
const mockBlogPosts = [
  {
    id: 'blog-1',
    title: '10 Sustainable Living Tips for Kids',
    content: 'Teaching children about sustainability is crucial for our planet\'s future...',
    author: 'GreenKiddo Team',
    date: '2024-01-15',
    tags: ['sustainability', 'kids', 'tips'],
    category: 'Lifestyle'
  },
  {
    id: 'blog-2',
    title: 'Understanding Climate Change: A Beginner\'s Guide',
    content: 'Climate change is one of the most pressing issues of our time...',
    author: 'Dr. Sarah Green',
    date: '2024-01-10',
    tags: ['climate', 'education', 'beginner'],
    category: 'Education'
  },
  {
    id: 'blog-3',
    title: 'Renewable Energy: The Future is Now',
    content: 'Renewable energy sources are becoming more accessible and affordable...',
    author: 'Eco Expert',
    date: '2024-01-05',
    tags: ['energy', 'renewable', 'technology'],
    category: 'Technology'
  }
];

/**
 * Calculate relevance score for search results
 */
const calculateRelevance = (query: string, text: string, title: string): number => {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const lowerTitle = title.toLowerCase();

  let score = 0;

  // Exact title match gets highest score
  if (lowerTitle === lowerQuery) {
    score += 100;
  } else if (lowerTitle.includes(lowerQuery)) {
    score += 50;
  }

  // Title word matches
  const queryWords = lowerQuery.split(' ');
  queryWords.forEach(word => {
    if (lowerTitle.includes(word)) {
      score += 20;
    }
    if (lowerText.includes(word)) {
      score += 10;
    }
  });

  // Description/content matches
  if (lowerText.includes(lowerQuery)) {
    score += 15;
  }

  return score;
};

/**
 * Search courses
 */
const searchCourses = async (query: string): Promise<SearchResult[]> => {
  const courses = await CourseService.getAllCourses();
  const results: SearchResult[] = [];

  courses.forEach(course => {
    const score = calculateRelevance(query, course.description, course.title);
    
    if (score > 0 || query.length === 0) {
      results.push({
        id: course.id,
        type: 'course',
        title: course.title,
        description: course.shortDescription || course.description,
        url: `/courses/${course.id}`,
        thumbnail: course.thumbnail,
        metadata: {
          category: course.category[0],
          difficulty: course.difficulty,
          instructor: course.instructor.name,
          rating: course.rating.average,
          enrolledCount: course.enrolledCount,
          tags: course.tags,
        },
        relevanceScore: score,
      });
    }
  });

  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

/**
 * Search lessons
 */
const searchLessons = async (query: string): Promise<SearchResult[]> => {
  const courses = await CourseService.getAllCourses();
  const results: SearchResult[] = [];

  for (const course of courses) {
    const lessons = await CourseService.getLessonsByCourseId(course.id);
    
    lessons.forEach(lesson => {
      const score = calculateRelevance(query, lesson.description, lesson.title);
      
      if (score > 0 || query.length === 0) {
        results.push({
          id: lesson.id,
          type: 'lesson',
          title: lesson.title,
          description: lesson.description,
          url: `/courses/${course.id}/lessons/${lesson.id}`,
          metadata: {
            courseTitle: course.title,
            courseId: course.id,
            duration: lesson.duration,
            order: lesson.order,
          },
          relevanceScore: score,
        });
      }
    });
  }

  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

/**
 * Search blog posts
 */
const searchBlogPosts = (query: string): SearchResult[] => {
  const results: SearchResult[] = [];

  mockBlogPosts.forEach(post => {
    const score = calculateRelevance(query, post.content, post.title);
    
    if (score > 0 || query.length === 0) {
      results.push({
        id: post.id,
        type: 'blog',
        title: post.title,
        description: post.content.substring(0, 150) + '...',
        url: `/blog/${post.id}`,
        metadata: {
          author: post.author,
          date: post.date,
          category: post.category,
          tags: post.tags,
        },
        relevanceScore: score,
      });
    }
  });

  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

/**
 * Search forum posts
 */
const searchForumPosts = async (query: string): Promise<SearchResult[]> => {
  const posts = await ForumService.getPosts();
  const results: SearchResult[] = [];

  posts.forEach(post => {
    const score = calculateRelevance(query, post.content, post.title);
    
    if (score > 0 || query.length === 0) {
      results.push({
        id: post.id,
        type: 'forum',
        title: post.title,
        description: post.content.substring(0, 150) + '...',
        url: `/dashboard/community/posts/${post.id}`,
        metadata: {
          author: post.author.name,
          category: post.categoryId,
          upvotes: post.upvotes,
          commentCount: post.commentCount,
          tags: post.tags,
          date: post.createdAt,
        },
        relevanceScore: score,
      });
    }
  });

  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

/**
 * Global search across all content types
 */
export const globalSearch = async (options: SearchOptions): Promise<SearchResult[]> => {
  const { query, filters, limit = 50 } = options;
  
  if (!query || query.trim().length === 0) {
    return [];
  }

  const trimmedQuery = query.trim();
  const allResults: SearchResult[] = [];

  // Search courses
  if (!filters?.type || filters.type.includes('course')) {
    const courses = await searchCourses(trimmedQuery);
    allResults.push(...courses);
  }

  // Search lessons
  if (!filters?.type || filters.type.includes('lesson')) {
    const lessons = await searchLessons(trimmedQuery);
    allResults.push(...lessons);
  }

  // Search blog posts
  if (!filters?.type || filters.type.includes('blog')) {
    const blogPosts = searchBlogPosts(trimmedQuery);
    allResults.push(...blogPosts);
  }

  // Search forum posts
  if (!filters?.type || filters.type.includes('forum')) {
    const forumPosts = await searchForumPosts(trimmedQuery);
    allResults.push(...forumPosts);
  }

  // Apply filters
  let filteredResults = allResults;
  
  if (filters) {
    if (filters.category && filters.category.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const category = result.metadata?.category?.toLowerCase();
        return category && filters.category?.some(f => f.toLowerCase() === category);
      });
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const difficulty = result.metadata?.difficulty?.toLowerCase();
        return difficulty && filters.difficulty?.some(f => f.toLowerCase() === difficulty);
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredResults = filteredResults.filter(result => {
        const tags = result.metadata?.tags || [];
        return filters.tags?.some(tag => 
          tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        );
      });
    }

    // Date range filter
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      filteredResults = filteredResults.filter(result => {
        const resultDate = result.metadata?.date;
        if (!resultDate) return false;
        
        const date = new Date(resultDate);
        if (filters.dateRange?.from && date < new Date(filters.dateRange.from)) {
          return false;
        }
        if (filters.dateRange?.to && date > new Date(filters.dateRange.to)) {
          return false;
        }
        return true;
      });
    }

    // Duration filter (for courses and lessons)
    if (filters.duration) {
      filteredResults = filteredResults.filter(result => {
        if (result.type !== 'course' && result.type !== 'lesson') return true;
        
        const duration = result.metadata?.duration as number | undefined;
        if (!duration) return false;
        
        if (filters.duration?.min && duration < filters.duration.min) {
          return false;
        }
        if (filters.duration?.max && duration > filters.duration.max) {
          return false;
        }
        return true;
      });
    }
  }

  // Sort results
  if (options.sortBy === 'date') {
    filteredResults.sort((a, b) => {
      const dateA = new Date(a.metadata?.date || 0).getTime();
      const dateB = new Date(b.metadata?.date || 0).getTime();
      return dateB - dateA;
    });
  } else if (options.sortBy === 'popularity') {
    filteredResults.sort((a, b) => {
      const popA = (a.metadata?.upvotes as number) || (a.metadata?.enrolledCount as number) || 0;
      const popB = (b.metadata?.upvotes as number) || (b.metadata?.enrolledCount as number) || 0;
      return popB - popA;
    });
  } else {
    // Sort by relevance (default)
    filteredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // Apply limit
  return filteredResults.slice(0, limit);
};

/**
 * Quick search for autocomplete (returns top 5 results)
 */
export const quickSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = await globalSearch({
    query: query.trim(),
    limit: 5,
    sortBy: 'relevance',
  });

  return results;
};

