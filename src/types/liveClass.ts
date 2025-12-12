/**
 * Live Class Types
 */

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  courseId?: string;
  scheduledAt: string;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingUrl?: string;
  meetingId?: string;
  recordingUrl?: string;
  recordingId?: string;
  platform: 'zoom' | 'google-meet' | 'webrtc' | 'custom';
  settings: {
    allowScreenShare: boolean;
    allowChat: boolean;
    allowQnA: boolean;
    allowBreakoutRooms: boolean;
    requireRegistration: boolean;
    isRecorded: boolean;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassRegistration {
  id: string;
  classId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
  attendanceTime?: string;
  leftAt?: string;
}

export interface LiveClassAttendance {
  id: string;
  classId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
  duration: number; // in minutes
  participationScore?: number;
}

export interface LiveClassQuestion {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  question: string;
  answered: boolean;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  upvotes: number;
  createdAt: string;
}

export interface LiveClassRecording {
  id: string;
  classId: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration: number; // in minutes
  fileSize: number; // in bytes
  format: 'mp4' | 'webm' | 'm3u8';
  quality: '720p' | '1080p' | '4k';
  createdAt: string;
}

export interface BreakoutRoom {
  id: string;
  classId: string;
  name: string;
  participants: string[]; // User IDs
  createdAt: string;
}

