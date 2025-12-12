/**
 * Live Class Service
 * 
 * Manages live classes, scheduling, attendance, and recordings
 */

import { LiveClass, LiveClassRegistration, LiveClassAttendance, LiveClassQuestion, LiveClassRecording, BreakoutRoom } from '../types/liveClass';

const STORAGE_KEY_CLASSES = 'greenkiddo_live_classes';
const STORAGE_KEY_REGISTRATIONS = 'greenkiddo_live_class_registrations';
const STORAGE_KEY_ATTENDANCE = 'greenkiddo_live_class_attendance';
const STORAGE_KEY_QUESTIONS = 'greenkiddo_live_class_questions';
const STORAGE_KEY_RECORDINGS = 'greenkiddo_live_class_recordings';

/**
 * Get all live classes
 */
export function getAllLiveClasses(): LiveClass[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_CLASSES);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get live class by ID
 */
export function getLiveClassById(classId: string): LiveClass | null {
  const classes = getAllLiveClasses();
  return classes.find(c => c.id === classId) || null;
}

/**
 * Get upcoming live classes
 */
export function getUpcomingLiveClasses(): LiveClass[] {
  const now = new Date();
  return getAllLiveClasses()
    .filter(c => {
      const scheduledDate = new Date(c.scheduledAt);
      return scheduledDate > now && c.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}

/**
 * Get live classes by status
 */
export function getLiveClassesByStatus(status: LiveClass['status']): LiveClass[] {
  return getAllLiveClasses()
    .filter(c => c.status === status)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
}

/**
 * Create a live class
 */
export function createLiveClass(classData: Omit<LiveClass, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>): LiveClass {
  if (typeof window === 'undefined') {
    throw new Error('Cannot create live class in non-browser environment');
  }

  const newClass: LiveClass = {
    ...classData,
    id: `live-class-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    currentParticipants: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const classes = getAllLiveClasses();
  classes.push(newClass);
  localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));

  return newClass;
}

/**
 * Update live class
 */
export function updateLiveClass(classId: string, updates: Partial<LiveClass>): LiveClass | null {
  const classes = getAllLiveClasses();
  const index = classes.findIndex(c => c.id === classId);
  
  if (index === -1) return null;

  classes[index] = {
    ...classes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  return classes[index];
}

/**
 * Delete live class
 */
export function deleteLiveClass(classId: string): boolean {
  const classes = getAllLiveClasses();
  const filtered = classes.filter(c => c.id !== classId);
  
  if (filtered.length < classes.length) {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

/**
 * Register for live class
 */
export function registerForLiveClass(classId: string, userId: string): LiveClassRegistration {
  if (typeof window === 'undefined') {
    throw new Error('Cannot register in non-browser environment');
  }

  const registration: LiveClassRegistration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    classId,
    userId,
    registeredAt: new Date().toISOString(),
    attended: false,
  };

  const registrations = getRegistrations();
  registrations.push(registration);
  localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations));

  // Update participant count
  const liveClass = getLiveClassById(classId);
  if (liveClass) {
    updateLiveClass(classId, {
      currentParticipants: liveClass.currentParticipants + 1,
    });
  }

  return registration;
}

/**
 * Get registrations
 */
export function getRegistrations(): LiveClassRegistration[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Check if user is registered
 */
export function isUserRegistered(classId: string, userId: string): boolean {
  const registrations = getRegistrations();
  return registrations.some(r => r.classId === classId && r.userId === userId);
}

/**
 * Record attendance
 */
export function recordAttendance(classId: string, userId: string): LiveClassAttendance {
  if (typeof window === 'undefined') {
    throw new Error('Cannot record attendance in non-browser environment');
  }

  const attendance: LiveClassAttendance = {
    id: `attendance-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    classId,
    userId,
    joinedAt: new Date().toISOString(),
    duration: 0,
  };

  const attendances = getAttendances();
  attendances.push(attendance);
  localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendances));

  // Update registration
  const registrations = getRegistrations();
  const registration = registrations.find(r => r.classId === classId && r.userId === userId);
  if (registration) {
    registration.attended = true;
    registration.attendanceTime = attendance.joinedAt;
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations));
  }

  return attendance;
}

/**
 * Update attendance (when user leaves)
 */
export function updateAttendance(attendanceId: string, leftAt: string, duration: number): void {
  const attendances = getAttendances();
  const attendance = attendances.find(a => a.id === attendanceId);
  
  if (attendance) {
    attendance.leftAt = leftAt;
    attendance.duration = duration;
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendances));
  }
}

/**
 * Get attendances
 */
export function getAttendances(): LiveClassAttendance[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get attendance for a class
 */
export function getClassAttendance(classId: string): LiveClassAttendance[] {
  return getAttendances().filter(a => a.classId === classId);
}

/**
 * Submit a question
 */
export function submitQuestion(classId: string, userId: string, userName: string, userAvatar: string | undefined, question: string): LiveClassQuestion {
  if (typeof window === 'undefined') {
    throw new Error('Cannot submit question in non-browser environment');
  }

  const liveQuestion: LiveClassQuestion = {
    id: `question-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    classId,
    userId,
    userName,
    userAvatar,
    question,
    answered: false,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  const questions = getQuestions();
  questions.push(liveQuestion);
  localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));

  return liveQuestion;
}

/**
 * Answer a question
 */
export function answerQuestion(questionId: string, answer: string, answeredBy: string): void {
  const questions = getQuestions();
  const question = questions.find(q => q.id === questionId);
  
  if (question) {
    question.answered = true;
    question.answer = answer;
    question.answeredBy = answeredBy;
    question.answeredAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }
}

/**
 * Upvote a question
 */
export function upvoteQuestion(questionId: string): void {
  const questions = getQuestions();
  const question = questions.find(q => q.id === questionId);
  
  if (question) {
    question.upvotes += 1;
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }
}

/**
 * Get questions
 */
export function getQuestions(): LiveClassQuestion[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_QUESTIONS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get questions for a class
 */
export function getClassQuestions(classId: string): LiveClassQuestion[] {
  return getQuestions()
    .filter(q => q.classId === classId)
    .sort((a, b) => {
      // Sort by answered status, then by upvotes
      if (a.answered !== b.answered) {
        return a.answered ? 1 : -1;
      }
      return b.upvotes - a.upvotes;
    });
}

/**
 * Add recording
 */
export function addRecording(classId: string, recordingData: Omit<LiveClassRecording, 'id' | 'classId' | 'createdAt'>): LiveClassRecording {
  if (typeof window === 'undefined') {
    throw new Error('Cannot add recording in non-browser environment');
  }

  const recording: LiveClassRecording = {
    ...recordingData,
    id: `recording-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    classId,
    createdAt: new Date().toISOString(),
  };

  const recordings = getRecordings();
  recordings.push(recording);
  localStorage.setItem(STORAGE_KEY_RECORDINGS, JSON.stringify(recordings));

  // Update class with recording URL
  updateLiveClass(classId, {
    recordingUrl: recording.url,
    recordingId: recording.id,
  });

  return recording;
}

/**
 * Get recordings
 */
export function getRecordings(): LiveClassRecording[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_RECORDINGS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get recordings for a class
 */
export function getClassRecordings(classId: string): LiveClassRecording[] {
  return getRecordings()
    .filter(r => r.classId === classId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Delete recording
 */
export function deleteRecording(recordingId: string): boolean {
  const recordings = getRecordings();
  const filtered = recordings.filter(r => r.id !== recordingId);
  
  if (filtered.length < recordings.length) {
    localStorage.setItem(STORAGE_KEY_RECORDINGS, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

/**
 * Start live class (change status to live)
 */
export function startLiveClass(classId: string, meetingUrl: string, meetingId: string): LiveClass | null {
  return updateLiveClass(classId, {
    status: 'live',
    meetingUrl,
    meetingId,
  });
}

/**
 * End live class (change status to completed)
 */
export function endLiveClass(classId: string): LiveClass | null {
  return updateLiveClass(classId, {
    status: 'completed',
  });
}

