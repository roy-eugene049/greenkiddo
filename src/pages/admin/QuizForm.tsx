import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Quiz, Question } from '../../types/course';
import { CourseService } from '../../services/courseService';
import { createQuiz, updateQuiz } from '../../services/adminService';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  HelpCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

const questionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['multiple-choice', 'true-false', 'fill-blank', 'short-answer']),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).optional(),
  correctAnswer: z.union([
    z.string().min(1, 'Correct answer is required'),
    z.array(z.string().min(1))
  ]),
  explanation: z.string().optional(),
  points: z.number().min(1, 'Points must be at least 1'),
});

const quizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  passingScore: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
  timeLimit: z.number().min(1).optional(),
  attemptsAllowed: z.number().min(1, 'At least 1 attempt must be allowed'),
});

type QuizFormData = z.infer<typeof quizSchema>;
type QuestionFormData = z.infer<typeof questionSchema>;

const QuizForm = () => {
  const { courseId, lessonId, quizId } = useParams<{ courseId: string; lessonId: string; quizId?: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!quizId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [],
      passingScore: 70,
      timeLimit: undefined,
      attemptsAllowed: 3,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  useEffect(() => {
    if (lessonId) {
      loadLessonData();
    }
    if (isEditMode && quizId) {
      loadQuiz();
    }
  }, [lessonId, quizId, isEditMode]);

  const loadLessonData = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const lessonData = await CourseService.getLessonById(lessonId);
      if (lessonData) {
        setLesson(lessonData);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuiz = async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const quiz = await CourseService.getQuizById(quizId);
      if (quiz) {
        setValue('title', quiz.title);
        setValue('description', quiz.description || '');
        setValue('questions', quiz.questions);
        setValue('passingScore', quiz.passingScore);
        setValue('timeLimit', quiz.timeLimit);
        setValue('attemptsAllowed', quiz.attemptsAllowed);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (type: Question['type']) => {
    const baseQuestion: QuestionFormData = {
      type,
      question: '',
      correctAnswer: '',
      points: 10,
      explanation: '',
    };

    if (type === 'multiple-choice') {
      baseQuestion.options = ['', '', '', ''];
      baseQuestion.correctAnswer = '';
    } else if (type === 'true-false') {
      baseQuestion.correctAnswer = 'true';
    }

    append(baseQuestion);
  };

  const onSubmit = async (data: QuizFormData) => {
    if (!lessonId) return;
    
    setSaving(true);
    try {
      const quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'> = {
        lessonId,
        title: data.title,
        description: data.description || undefined,
        questions: data.questions.map((q, index) => ({
          ...q,
          id: q.id || `q-${Date.now()}-${index}`,
        })) as Question[],
        passingScore: data.passingScore,
        timeLimit: data.timeLimit,
        attemptsAllowed: data.attemptsAllowed,
      };

      if (isEditMode && quizId) {
        await updateQuiz(quizId, quizData);
      } else {
        await createQuiz(quizData);
      }
      
      navigate(`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes`)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <p className="text-gray-400 text-lg">
              {lesson?.title || 'Add a new quiz to this lesson'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Quiz Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  placeholder="e.g., Carbon Footprint Quiz"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description (optional)
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                  placeholder="Describe what this quiz covers..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Passing Score (%) *
                  </label>
                  <input
                    {...register('passingScore', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                  {errors.passingScore && (
                    <p className="text-red-400 text-xs mt-1">{errors.passingScore.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    {...register('timeLimit', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Attempts Allowed *
                  </label>
                  <input
                    {...register('attemptsAllowed', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                  {errors.attemptsAllowed && (
                    <p className="text-red-400 text-xs mt-1">{errors.attemptsAllowed.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Questions</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple-choice')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('true-false')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  True/False
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('fill-blank')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Fill Blank
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('short-answer')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Short Answer
                </button>
              </div>
            </div>

            {errors.questions && (
              <p className="text-red-400 text-xs mb-4">{errors.questions.message}</p>
            )}

            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No questions yet. Add your first question above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {fields.map((field, index) => {
                  const question = watchedQuestions[index];
                  const questionType = question?.type;

                  return (
                    <div
                      key={field.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-gray-500">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold text-gray-400">
                            Question {index + 1}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-700 rounded capitalize">
                            {questionType}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Question Text *
                          </label>
                          <textarea
                            {...register(`questions.${index}.question`)}
                            rows={2}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                            placeholder="Enter your question..."
                          />
                          {errors.questions?.[index]?.question && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.questions[index]?.question?.message}
                            </p>
                          )}
                        </div>

                        {questionType === 'multiple-choice' && (
                          <>
                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Options *
                              </label>
                              {question?.options?.map((_, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2 mb-2">
                                  <input
                                    type="radio"
                                    {...register(`questions.${index}.correctAnswer`)}
                                    value={question.options?.[optionIndex] || ''}
                                    className="w-4 h-4 text-green-ecco"
                                  />
                                  <input
                                    {...register(`questions.${index}.options.${optionIndex}`)}
                                    type="text"
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {questionType === 'true-false' && (
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Correct Answer *
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  {...register(`questions.${index}.correctAnswer`)}
                                  value="true"
                                  className="w-4 h-4 text-green-ecco"
                                />
                                <span>True</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  {...register(`questions.${index}.correctAnswer`)}
                                  value="false"
                                  className="w-4 h-4 text-green-ecco"
                                />
                                <span>False</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {(questionType === 'fill-blank' || questionType === 'short-answer') && (
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Correct Answer *
                            </label>
                            <input
                              {...register(`questions.${index}.correctAnswer`)}
                              type="text"
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                              placeholder="Enter the correct answer..."
                            />
                            {errors.questions?.[index]?.correctAnswer && (
                              <p className="text-red-400 text-xs mt-1">
                                {errors.questions[index]?.correctAnswer?.message}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Points *
                            </label>
                            <input
                              {...register(`questions.${index}.points`, { valueAsNumber: true })}
                              type="number"
                              min="1"
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                            />
                            {errors.questions?.[index]?.points && (
                              <p className="text-red-400 text-xs mt-1">
                                {errors.questions[index]?.points?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Explanation (optional)
                          </label>
                          <textarea
                            {...register(`questions.${index}.explanation`)}
                            rows={2}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none"
                            placeholder="Explain why this is the correct answer..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/admin/courses/${courseId}/lessons/${lessonId}/quizzes`)}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Update Quiz' : 'Create Quiz'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default QuizForm;

