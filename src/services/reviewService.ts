import { CourseReview, ReviewStats } from '../types/review';

const STORAGE_KEY_PREFIX = 'greenkiddo_reviews_';

/**
 * Get all reviews for a course
 */
export const getCourseReviews = (courseId: string): CourseReview[] => {
  const key = `${STORAGE_KEY_PREFIX}${courseId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save reviews for a course
 */
const saveCourseReviews = (courseId: string, reviews: CourseReview[]): void => {
  const key = `${STORAGE_KEY_PREFIX}${courseId}`;
  localStorage.setItem(key, JSON.stringify(reviews));
};

/**
 * Add a new review
 */
export const addReview = (
  courseId: string,
  review: Omit<CourseReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>
): CourseReview => {
  const reviews = getCourseReviews(courseId);
  const newReview: CourseReview = {
    ...review,
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  reviews.push(newReview);
  saveCourseReviews(courseId, reviews);
  return newReview;
};

/**
 * Update a review
 */
export const updateReview = (
  courseId: string,
  reviewId: string,
  updates: Partial<Pick<CourseReview, 'rating' | 'title' | 'comment'>>
): CourseReview | null => {
  const reviews = getCourseReviews(courseId);
  const index = reviews.findIndex(r => r.id === reviewId);
  
  if (index === -1) return null;
  
  reviews[index] = {
    ...reviews[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveCourseReviews(courseId, reviews);
  return reviews[index];
};

/**
 * Delete a review
 */
export const deleteReview = (courseId: string, reviewId: string): boolean => {
  const reviews = getCourseReviews(courseId);
  const filtered = reviews.filter(r => r.id !== reviewId);
  
  if (filtered.length === reviews.length) return false;
  
  saveCourseReviews(courseId, filtered);
  return true;
};

/**
 * Mark a review as helpful
 */
export const markReviewHelpful = (courseId: string, reviewId: string): boolean => {
  const reviews = getCourseReviews(courseId);
  const review = reviews.find(r => r.id === reviewId);
  
  if (!review) return false;
  
  review.helpfulCount += 1;
  saveCourseReviews(courseId, reviews);
  return true;
};

/**
 * Get review statistics for a course
 */
export const getReviewStats = (courseId: string): ReviewStats => {
  const reviews = getCourseReviews(courseId);
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  
  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: reviews.length,
    ratingDistribution: distribution,
  };
};

/**
 * Check if user has already reviewed a course
 */
export const getUserReview = (courseId: string, userId: string): CourseReview | null => {
  const reviews = getCourseReviews(courseId);
  return reviews.find(r => r.userId === userId) || null;
};

