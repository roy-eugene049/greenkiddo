import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Star, ThumbsUp, Edit, Trash2, Send } from 'lucide-react';
import { CourseReview, ReviewStats } from '../../types/review';
import {
  getCourseReviews,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getReviewStats,
  getUserReview,
} from '../../services/reviewService';
import { useUserDisplay } from '../../hooks/useUserDisplay';
import { Avatar } from '../common/Avatar';

interface ReviewsSectionProps {
  courseId: string;
}

const ReviewsSection = ({ courseId }: ReviewsSectionProps) => {
  const { user } = useUser();
  const { displayName, displayAvatar } = useUserDisplay();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<CourseReview | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = () => {
    const courseReviews = getCourseReviews(courseId);
    setReviews(courseReviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setStats(getReviewStats(courseId));
    
    // Check if user has a review
    if (user) {
      const userReview = getUserReview(courseId, user.id);
      if (userReview) {
        setEditingReview(userReview);
        setRating(userReview.rating);
        setTitle(userReview.title || '');
        setComment(userReview.comment);
        setShowReviewForm(true);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !comment.trim()) return;

    setLoading(true);
    try {
      if (editingReview) {
        // Update existing review
        const updated = updateReview(courseId, editingReview.id, {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
        if (updated) {
          setEditingReview(updated);
        }
      } else {
        // Add new review
        addReview(courseId, {
          courseId,
          userId: user.id,
          userName: displayName,
          userAvatar: displayAvatar.type === 'url' ? displayAvatar.value : undefined,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
        setShowReviewForm(false);
        setTitle('');
        setComment('');
        setRating(5);
      }
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = () => {
    if (!editingReview || !confirm('Are you sure you want to delete your review?')) return;
    
    deleteReview(courseId, editingReview.id);
    setEditingReview(null);
    setShowReviewForm(false);
    setTitle('');
    setComment('');
    setRating(5);
    loadReviews();
  };

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(courseId, reviewId);
    loadReviews();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (ratingValue: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= ratingValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      {/* Review Stats */}
      {stats && stats.totalReviews > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-ecco">{stats.averageRating}</div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stats.totalReviews} reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution[star as keyof typeof stats.ratingDistribution];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm">{star}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-ecco h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Review Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6"
        >
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-3 px-4 bg-green-ecco/20 text-green-ecco rounded-lg hover:bg-green-ecco/30 transition-colors font-semibold"
            >
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                {renderStars(rating, true, setRating)}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your review"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={loading || !comment.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {editingReview && (
                  <button
                    onClick={handleDeleteReview}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    if (!editingReview) {
                      setTitle('');
                      setComment('');
                      setRating(5);
                    }
                  }}
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No reviews yet. Be the first to review this course!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <Avatar
                  avatar={review.userAvatar}
                  name={review.userName}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-400 ml-2">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    {user && user.id === review.userId && (
                      <button
                        onClick={() => {
                          setEditingReview(review);
                          setRating(review.rating);
                          setTitle(review.title || '');
                          setComment(review.comment);
                          setShowReviewForm(true);
                        }}
                        className="text-gray-400 hover:text-green-ecco transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {review.title && (
                    <h5 className="font-semibold mb-2">{review.title}</h5>
                  )}
                  <p className="text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-green-ecco transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;

