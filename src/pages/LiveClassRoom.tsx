import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  getLiveClassById,
  recordAttendance,
  getClassQuestions,
  submitQuestion,
  answerQuestion,
  upvoteQuestion,
  getClassAttendance,
} from '../services/liveClassService';
import { LiveClass, LiveClassQuestion } from '../types/liveClass';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Send,
  Users,
  Clock,
  Share2,
  Settings,
  X,
  ThumbsUp,
} from 'lucide-react';
import { format } from 'date-fns';

const LiveClassRoom = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [questions, setQuestions] = useState<LiveClassQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [showQnA, setShowQnA] = useState(true);
  const [micMuted, setMicMuted] = useState(true);
  const [videoOff, setVideoOff] = useState(true);
  const [attended, setAttended] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      loadClassData();
    }
  }, [classId]);

  useEffect(() => {
    if (liveClass && user && !attended && liveClass.status === 'live') {
      recordAttendance(liveClass.id, user.id);
      setAttended(true);
    }
  }, [liveClass, user, attended]);

  const loadClassData = () => {
    if (!classId) return;

    setLoading(true);
    const classData = getLiveClassById(classId);
    setLiveClass(classData);

    if (classData) {
      const classQuestions = getClassQuestions(classId);
      setQuestions(classQuestions);
    }

    setLoading(false);
  };

  const handleSubmitQuestion = () => {
    if (!classId || !user || !newQuestion.trim()) return;

    const question = submitQuestion(
      classId,
      user.id,
      user.fullName || user.firstName || 'User',
      user.imageUrl,
      newQuestion.trim()
    );
    setQuestions([...questions, question]);
    setNewQuestion('');
  };

  const handleUpvote = (questionId: string) => {
    upvoteQuestion(questionId);
    loadClassData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!liveClass) {
    return (
      <DashboardLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Class not found</h2>
            <button
              onClick={() => navigate('/dashboard/live-classes')}
              className="text-green-ecco hover:text-green-300"
            >
              Back to Live Classes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{liveClass.title}</h1>
              <p className="text-sm text-gray-400">
                {liveClass.instructor.name} • {liveClass.currentParticipants} participants
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/dashboard/live-classes')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Video Area */}
            <div className="flex-1 flex flex-col bg-gray-950">
              {/* Main Video */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                {liveClass.status === 'live' ? (
                  <div className="text-center">
                    <Video className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Live class in progress</p>
                    <p className="text-sm text-gray-500">
                      {liveClass.meetingUrl ? (
                        <a
                          href={liveClass.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-ecco hover:text-green-300"
                        >
                          Join via {liveClass.platform === 'zoom' ? 'Zoom' : liveClass.platform === 'google-meet' ? 'Google Meet' : 'WebRTC'}
                        </a>
                      ) : (
                        'Meeting link will be available when class starts'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Clock className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      Class scheduled for {format(new Date(liveClass.scheduledAt), 'MMM dd, yyyy • h:mm a')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {liveClass.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              {liveClass.status === 'live' && (
                <div className="bg-gray-900 border-t border-gray-800 p-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setMicMuted(!micMuted)}
                      className={`p-3 rounded-full transition-colors ${
                        micMuted ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setVideoOff(!videoOff)}
                      className={`p-3 rounded-full transition-colors ${
                        videoOff ? 'bg-gray-800 hover:bg-gray-700' : 'bg-green-ecco hover:bg-green-300'
                      }`}
                    >
                      {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>
                    <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                      Leave Class
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Q&A Sidebar */}
            {showQnA && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col"
              >
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Q&A
                  </h2>
                  <button
                    onClick={() => setShowQnA(false)}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Questions List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No questions yet</p>
                      <p className="text-sm">Be the first to ask!</p>
                    </div>
                  ) : (
                    questions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg ${
                          question.answered ? 'bg-gray-800/50' : 'bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-ecco/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-green-ecco">
                              {question.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold mb-1">{question.userName}</p>
                            <p className="text-sm text-gray-300">{question.question}</p>
                            {question.answered && question.answer && (
                              <div className="mt-2 p-2 bg-green-ecco/10 border-l-2 border-green-ecco rounded">
                                <p className="text-xs text-green-ecco font-semibold mb-1">
                                  Answer from {question.answeredBy}:
                                </p>
                                <p className="text-sm text-gray-300">{question.answer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => handleUpvote(question.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-ecco transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {question.upvotes}
                          </button>
                          {question.answered && (
                            <span className="text-xs text-green-ecco">✓ Answered</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Ask Question */}
                {liveClass.status === 'live' && liveClass.settings.allowQnA && (
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmitQuestion();
                          }
                        }}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                      />
                      <button
                        onClick={handleSubmitQuestion}
                        className="p-2 bg-green-ecco hover:bg-green-300 text-black rounded-lg transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Show Q&A Button */}
            {!showQnA && liveClass.settings.allowQnA && (
              <button
                onClick={() => setShowQnA(true)}
                className="absolute bottom-4 right-4 p-3 bg-green-ecco hover:bg-green-300 text-black rounded-full shadow-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveClassRoom;

