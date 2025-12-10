import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CourseService } from '../services/courseService';
import { Quiz, Question } from '../types/course';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Clock,
  AlertCircle
} from 'lucide-react';

type AnswerState = {
  [questionId: string]: string | string[];
};

type QuestionResult = {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
};

const QuizView = () => {
  const { courseId, lessonId, quizId } = useParams<{ courseId: string; lessonId: string; quizId?: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!lessonId) return;

      setLoading(true);
      try {
        // Get quiz ID from lesson or URL
        const lesson = await CourseService.getLessonById(lessonId);
        const quizIdToLoad = quizId || lesson?.quizId;
        
        if (quizIdToLoad) {
          const quizData = await CourseService.getQuizById(quizIdToLoad);
          if (quizData) {
            setQuiz(quizData);
            
            // Initialize timer if time limit exists
            if (quizData.timeLimit) {
              setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
            }
          }
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId, quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user || !courseId || !lessonId) return;

    setSubmitting(true);
    try {
      const submissionResults = await CourseService.submitQuiz(
        user.id,
        quiz.id,
        answers
      );

      // Calculate detailed results
      const questionResults: QuestionResult[] = quiz.questions.map((question) => {
        const userAnswer = answers[question.id] || '';
        const isCorrect = Array.isArray(question.correctAnswer)
          ? Array.isArray(userAnswer) &&
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every((ans) => question.correctAnswer.includes(ans))
          : userAnswer === question.correctAnswer;

        return {
          questionId: question.id,
          isCorrect,
          userAnswer,
          correctAnswer: question.correctAnswer,
        };
      });

      setResults(questionResults);
      setScore(submissionResults.score);
      setShowResults(true);
      setTimeRemaining(null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading quiz...</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  // Early return if no quiz or current question
  if (!quiz || !currentQuestion) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Quiz not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Quiz not found</h2>
            <Link
              to={`/courses/${courseId}/lessons/${lessonId}`}
              className="text-green-ecco hover:text-green-300"
            >
              Back to lesson
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (showResults) {
    const percentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;
    const passed = percentage >= quiz.passingScore;
    const resultColor = passed ? 'text-green-ecco' : 'text-red-500';

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`text-6xl mb-4 ${resultColor}`}>
              {passed ? <Trophy className="w-16 h-16 mx-auto" /> : <AlertCircle className="w-16 h-16 mx-auto" />}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${resultColor}`}>
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            <p className="text-gray-400 text-lg">
              {passed
                ? 'You passed the quiz! Great job!'
                : `You scored ${score}/${quiz.questions.length}. You need ${quiz.passingScore}% to pass.`}
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Your Score</span>
              <span className={`text-3xl font-bold ${resultColor}`}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
              <motion.div
                className={`h-3 rounded-full ${passed ? 'bg-green-ecco' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{score} correct out of {quiz.questions.length}</span>
              <span>Passing Score: {quiz.passingScore}%</span>
            </div>
          </motion.div>

          {/* Question Results */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
            {quiz.questions.map((question, index) => {
              const result = results.find((r) => r.questionId === question.id);
              const isCorrect = result?.isCorrect || false;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-6 ${
                    isCorrect ? 'border-green-ecco/50 bg-green-ecco/10' : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-ecco flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-400">
                          Question {index + 1}
                        </span>
                        <span className={`text-sm font-semibold ${isCorrect ? 'text-green-ecco' : 'text-red-500'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-lg font-semibold mb-4">{question.question}</p>
                    </div>
                  </div>

                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2 ml-9">
                      {question.options.map((option) => {
                        const isSelected = result?.userAnswer === option;
                        const isCorrectAnswer = question.correctAnswer === option;

                        return (
                          <div
                            key={option}
                            className={`
                              p-3 rounded-lg border
                              ${
                                isCorrectAnswer
                                  ? 'border-green-ecco bg-green-ecco/20'
                                  : isSelected && !isCorrectAnswer
                                  ? 'border-red-500 bg-red-500/20'
                                  : 'border-gray-700 bg-gray-800'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <CheckCircle2 className="w-5 h-5 text-green-ecco" />
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className={isCorrectAnswer ? 'text-green-ecco font-semibold' : ''}>
                                {option}
                              </span>
                              {isCorrectAnswer && <span className="text-xs text-gray-400 ml-auto">Correct Answer</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="ml-9 space-y-2">
                      <div
                        className={`p-3 rounded-lg border ${
                          question.correctAnswer === 'true'
                            ? 'border-green-ecco bg-green-ecco/20'
                            : 'border-gray-700'
                        }`}
                      >
                        <span className={question.correctAnswer === 'true' ? 'text-green-ecco font-semibold' : ''}>
                          True {question.correctAnswer === 'true' && '✓ Correct Answer'}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${
                          question.correctAnswer === 'false'
                            ? 'border-green-ecco bg-green-ecco/20'
                            : 'border-gray-700'
                        }`}
                      >
                        <span className={question.correctAnswer === 'false' ? 'text-green-ecco font-semibold' : ''}>
                          False {question.correctAnswer === 'false' && '✓ Correct Answer'}
                        </span>
                      </div>
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-4 ml-9 p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold">Explanation: </span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${courseId}/lessons/${lessonId}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Lesson
            </Link>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setResults([]);
                setScore(0);
                if (quiz.timeLimit) {
                  setTimeRemaining(quiz.timeLimit * 60);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <Link
            to={`/courses/${courseId}/lessons/${lessonId}`}
            className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lesson
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-gray-400">{quiz.description}</p>
              )}
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="font-mono font-bold text-red-500">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-green-ecco h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8 mb-6"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-ecco/20 text-green-ecco rounded-full text-sm font-semibold">
                    {currentQuestion.type === 'multiple-choice' && 'Multiple Choice'}
                    {currentQuestion.type === 'true-false' && 'True/False'}
                    {currentQuestion.type === 'fill-blank' && 'Fill in the Blank'}
                    {currentQuestion.type === 'short-answer' && 'Short Answer'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
              </div>

              {/* Multiple Choice */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border cursor-pointer
                        transition-all
                        ${
                          answers[currentQuestion.id] === option
                            ? 'border-green-ecco bg-green-ecco/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-5 h-5 text-green-ecco"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False */}
              {currentQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  {['true', 'false'].map((option) => (
                    <label
                      key={option}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border cursor-pointer
                        transition-all
                        ${
                          answers[currentQuestion.id] === option
                            ? 'border-green-ecco bg-green-ecco/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-5 h-5 text-green-ecco"
                      />
                      <span className="flex-1 capitalize font-semibold">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Fill in the Blank / Short Answer */}
              {(currentQuestion.type === 'fill-blank' || currentQuestion.type === 'short-answer') && (
                <textarea
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco min-h-32"
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg
              transition-colors
              ${
                currentQuestionIndex === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-white hover:bg-gray-800 bg-gray-900'
              }
            `}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered || submitting}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                transition-colors
                ${
                  !allAnswered || submitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-green-ecco text-black hover:bg-green-300'
                }
              `}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
            >
              Next
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizView;

