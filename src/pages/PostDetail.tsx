import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ForumService } from '../services/forumService';
import { ForumPost, ForumComment } from '../types/forum';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Eye,
  Pin,
  CheckCircle2,
  Send,
  Reply
} from 'lucide-react';
import { useUserDisplay } from '../hooks/useUserDisplay';
import { Avatar } from '../components/common/Avatar';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { displayName, displayAvatar } = useUserDisplay();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!postId) return;
      
      setLoading(true);
      try {
        const [postData, commentsData] = await Promise.all([
          ForumService.getPostById(postId),
          ForumService.getComments(postId)
        ]);
        
        if (postData) {
          setPost(postData);
          // Increment views
          const updatedPost = { ...postData, views: postData.views + 1 };
          setPost(updatedPost);
        }
        
        // Organize comments into nested structure
        const organizedComments = organizeComments(commentsData);
        setComments(organizedComments);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  const organizeComments = (commentsList: ForumComment[]): ForumComment[] => {
    const commentMap = new Map<string, ForumComment & { replies: ForumComment[] }>();
    const rootComments: (ForumComment & { replies: ForumComment[] })[] = [];

    // First pass: create map of all comments
    commentsList.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    commentsList.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmitComment = async () => {
    if (!postId || !newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const comment = await ForumService.createComment({
        postId,
        content: newComment,
        author: {
          id: user.id,
          name: displayName,
          avatar: displayAvatar.value,
          badges: []
        }
      });

      setComments([...comments, { ...comment, replies: [] }]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!postId || !replyContent.trim() || !user) return;

    setSubmitting(true);
    try {
      const comment = await ForumService.createComment({
        postId,
        parentId,
        content: replyContent,
        author: {
          id: user.id,
          name: displayName,
          avatar: displayAvatar.value,
          badges: []
        }
      });

      // Update comments to include the new reply
      const updateComments = (commentsList: ForumComment[]): ForumComment[] => {
        return commentsList.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), { ...comment, replies: [] }]
            };
          }
          if (comment.replies) {
            return { ...comment, replies: updateComments(comment.replies) };
          }
          return comment;
        });
      };

      setComments(updateComments(comments));
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: ForumComment & { replies?: ForumComment[] }; depth?: number }) => {
    return (
      <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-800 pl-4' : ''}`}>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Avatar
              avatar={comment.author.avatar}
              name={comment.author.name}
              size="md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">{comment.author.name}</span>
                {comment.isAccepted && (
                  <CheckCircle2 size={16} className="text-green-ecco" fill="currentColor" />
                )}
                {comment.author.badges && comment.author.badges.length > 0 && (
                  <div className="flex gap-1">
                    {comment.author.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-xs px-2 py-0.5 bg-green-ecco/20 text-green-ecco rounded"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
              </div>
              <p className="text-gray-300 mb-3 whitespace-pre-wrap">{comment.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => ForumService.voteComment(comment.id, user?.id || '', 'upvote')}
                  className="flex items-center gap-1 text-gray-400 hover:text-green-ecco transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span>{comment.upvotes}</span>
                </button>
                <button
                  onClick={() => ForumService.voteComment(comment.id, user?.id || '', 'downvote')}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ThumbsDown size={16} />
                  <span>{comment.downvotes}</span>
                </button>
                {depth < 2 && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-green-ecco transition-colors"
                  >
                    <Reply size={16} />
                    Reply
                  </button>
                )}
              </div>
              {replyingTo === comment.id && (
                <div className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={submitting || !replyContent.trim()}
                      className="px-4 py-2 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={16} />
                      Post Reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isLoaded || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-green-ecco">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
            <Link to="/community" className="text-green-ecco hover:underline">
              Back to Forum
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Forum
        </button>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black border border-gray-800 rounded-lg p-8 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <button
                onClick={() => ForumService.votePost(post.id, user?.id || '', 'upvote')}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <ThumbsUp size={24} className="text-gray-400 hover:text-green-ecco" />
              </button>
              <span className="text-white font-bold text-xl">{post.upvotes - post.downvotes}</span>
              <button
                onClick={() => ForumService.votePost(post.id, user?.id || '', 'downvote')}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <ThumbsDown size={24} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                {post.isPinned && (
                  <Pin size={20} className="text-green-ecco" fill="currentColor" />
                )}
                <h1 className="text-3xl font-bold text-white">{post.title}</h1>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {formatTimeAgo(post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {post.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  {post.commentCount} comments
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-900 text-gray-300 text-sm rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-800">
                <Avatar
                  avatar={post.author.avatar}
                  name={post.author.name}
                  size="lg"
                />
                <div>
                  <div className="font-semibold text-white">{post.author.name}</div>
                  {post.author.badges && post.author.badges.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {post.author.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-xs px-2 py-0.5 bg-green-ecco/20 text-green-ecco rounded"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="bg-black border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
          </h2>

          {/* New Comment Form */}
          {user && (
            <div className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco mb-3"
                rows={4}
              />
              <button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2 bg-green-ecco text-black rounded-lg hover:bg-green-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                Post Comment
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetail;

