import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ContentReport, ModerationAction, ForumPost } from '../../types/forum';
import { ModerationService } from '../../services/moderationService';
import { ForumService } from '../../services/forumService';
import { useUser } from '@clerk/clerk-react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  Pin,
  Eye,
  Clock,
  User,
} from 'lucide-react';

type TabType = 'reports' | 'history' | 'queue';

const ContentModeration = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('reports');
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [history, setHistory] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [selectedContent, setSelectedContent] = useState<ForumPost | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'dismiss' | 'delete' | 'lock' | 'unlock' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'reports') {
        const pendingReports = await ModerationService.getPendingReports();
        setReports(pendingReports);
      } else if (activeTab === 'history') {
        const moderationHistory = await ModerationService.getModerationHistory();
        setHistory(moderationHistory);
      }
    } catch (error) {
      console.error('Error loading moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = async (report: ContentReport) => {
    setSelectedReport(report);
    if (report.contentType === 'post') {
      const content = await ModerationService.getReportedContent(report.contentId, 'post');
      setSelectedContent(content as ForumPost);
    }
    setShowActionModal(true);
  };

  const handleAction = async (action: 'approve' | 'reject' | 'dismiss' | 'delete' | 'lock' | 'unlock') => {
    if (!selectedReport || !user) return;

    setProcessing(true);
    try {
      if (action === 'approve' || action === 'reject' || action === 'dismiss') {
        await ModerationService.reviewReport(
          selectedReport.id,
          action,
          user.id,
          user.fullName || user.emailAddresses[0]?.emailAddress || 'Admin'
        );
      } else {
        await ModerationService.performAction(
          selectedReport.contentId,
          selectedReport.contentType,
          action,
          user.id,
          user.fullName || user.emailAddresses[0]?.emailAddress || 'Admin',
          `Moderated: ${action}`
        );
      }
      await loadData();
      setShowActionModal(false);
      setSelectedReport(null);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to perform action. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: 'Spam',
      inappropriate: 'Inappropriate Content',
      harassment: 'Harassment',
      misinformation: 'Misinformation',
      copyright: 'Copyright Violation',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve':
      case 'unlock':
      case 'unpin':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'reject':
      case 'delete':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'lock':
        return <Lock className="w-4 h-4 text-yellow-400" />;
      case 'pin':
        return <Pin className="w-4 h-4 text-blue-400" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Content Moderation</h1>
          <p className="text-gray-400 text-lg">
            Review and manage reported content, posts, and comments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {(['reports', 'history', 'queue'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 font-semibold transition-colors relative
                ${
                  activeTab === tab
                    ? 'text-green-ecco'
                    : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-ecco"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : activeTab === 'reports' ? (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-bold mb-2">No Pending Reports</h2>
                <p className="text-gray-400">
                  All reported content has been reviewed
                </p>
              </div>
            ) : (
              reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h3 className="font-semibold text-lg">
                          Reported {report.contentType === 'post' ? 'Post' : 'Comment'}
                        </h3>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                          {getReasonLabel(report.reason)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        <strong>Content ID:</strong> {report.contentId}
                      </p>
                      {report.description && (
                        <p className="text-sm text-gray-300 mb-4 bg-gray-800 p-3 rounded">
                          {report.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Reported by {report.reportedBy.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewContent(report)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="View Content"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : activeTab === 'history' ? (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-bold mb-2">No Moderation History</h2>
                <p className="text-gray-400">
                  Moderation actions will appear here
                </p>
              </div>
            ) : (
              history.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getActionIcon(action.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold capitalize">
                            {action.action} {action.contentType}
                          </h3>
                          <span className="px-2 py-1 bg-gray-800 text-xs rounded">
                            {action.contentId}
                          </span>
                        </div>
                        {action.reason && (
                          <p className="text-sm text-gray-400 mb-2">{action.reason}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>By {action.moderatedBy.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(action.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-lg">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">Moderation Queue</h2>
            <p className="text-gray-400">
              Content awaiting review will appear here
            </p>
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && selectedReport && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Review Content</h3>
              
              {selectedContent && selectedReport.contentType === 'post' && (
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">{selectedContent.title}</h4>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {selectedContent.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span>By {selectedContent.author.name}</span>
                    <span>•</span>
                    <span>{selectedContent.upvotes} upvotes</span>
                    <span>•</span>
                    <span>{selectedContent.commentCount} comments</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Report Details</h4>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-sm mb-2">
                    <strong>Reason:</strong> {getReasonLabel(selectedReport.reason)}
                  </p>
                  {selectedReport.description && (
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> {selectedReport.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleAction('approve')}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Report
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Content
                </button>
                {selectedContent && (
                  <>
                    <button
                      onClick={() => handleAction(selectedContent.isLocked ? 'unlock' : 'lock')}
                      disabled={processing}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {selectedContent.isLocked ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Lock
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(selectedContent.isPinned ? 'unpin' : 'pin')}
                      disabled={processing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {selectedContent.isPinned ? (
                        <>
                          <Pin className="w-4 h-4" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin className="w-4 h-4" />
                          Pin
                        </>
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleAction('dismiss')}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  Dismiss
                </button>
              </div>

              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedReport(null);
                  setSelectedContent(null);
                }}
                className="mt-4 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentModeration;

