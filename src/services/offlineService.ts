/**
 * Offline Service
 * 
 * Handles offline course access and data synchronization
 */

import { Course } from '../types/course';
import { Lesson } from '../types/course';
import { CourseService } from './courseService';

const OFFLINE_CACHE_KEY = 'greenkiddo_offline_courses';
const OFFLINE_SYNC_QUEUE = 'greenkiddo_sync_queue';

export interface OfflineCourse {
  course: Course;
  lessons: Lesson[];
  cachedAt: string;
}

export interface SyncAction {
  id: string;
  type: 'progress' | 'note' | 'bookmark' | 'completion';
  data: any;
  timestamp: string;
}

/**
 * Cache course for offline access
 */
export async function cacheCourseForOffline(courseId: string): Promise<boolean> {
  try {
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      return false;
    }

    const lessons = await CourseService.getLessonsByCourseId(courseId);
    
    const offlineCourse: OfflineCourse = {
      course,
      lessons,
      cachedAt: new Date().toISOString(),
    };

    const cached = getCachedCourses();
    cached[courseId] = offlineCourse;
    
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cached));
    
    return true;
  } catch (error) {
    console.error('Error caching course for offline:', error);
    return false;
  }
}

/**
 * Get cached course
 */
export function getCachedCourse(courseId: string): OfflineCourse | null {
  const cached = getCachedCourses();
  return cached[courseId] || null;
}

/**
 * Get all cached courses
 */
export function getCachedCourses(): Record<string, OfflineCourse> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(OFFLINE_CACHE_KEY);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Remove cached course
 */
export function removeCachedCourse(courseId: string): void {
  const cached = getCachedCourses();
  delete cached[courseId];
  localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cached));
}

/**
 * Check if course is cached
 */
export function isCourseCached(courseId: string): boolean {
  return courseId in getCachedCourses();
}

/**
 * Get cache size (approximate)
 */
export function getCacheSize(): number {
  const cached = getCachedCourses();
  const data = JSON.stringify(cached);
  return new Blob([data]).size;
}

/**
 * Clear all cached courses
 */
export function clearCache(): void {
  localStorage.removeItem(OFFLINE_CACHE_KEY);
}

/**
 * Add action to sync queue
 */
export function addToSyncQueue(action: Omit<SyncAction, 'id' | 'timestamp'>): void {
  const queue = getSyncQueue();
  const syncAction: SyncAction = {
    ...action,
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: new Date().toISOString(),
  };
  
  queue.push(syncAction);
  localStorage.setItem(OFFLINE_SYNC_QUEUE, JSON.stringify(queue));
}

/**
 * Get sync queue
 */
export function getSyncQueue(): SyncAction[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(OFFLINE_SYNC_QUEUE);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Clear sync queue
 */
export function clearSyncQueue(): void {
  localStorage.removeItem(OFFLINE_SYNC_QUEUE);
}

/**
 * Process sync queue (when back online)
 */
export async function processSyncQueue(): Promise<number> {
  const queue = getSyncQueue();
  if (queue.length === 0) {
    return 0;
  }

  let processed = 0;
  const failed: SyncAction[] = [];

  for (const action of queue) {
    try {
      // In a real app, this would call the backend API
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 100));
      processed++;
    } catch (error) {
      console.error('Error syncing action:', error);
      failed.push(action);
    }
  }

  // Keep failed actions for retry
  localStorage.setItem(OFFLINE_SYNC_QUEUE, JSON.stringify(failed));
  
  return processed;
}

/**
 * Get offline status
 */
export function getOfflineStatus(): {
  isOnline: boolean;
  cachedCourses: number;
  pendingSync: number;
  cacheSize: number;
} {
  return {
    isOnline: navigator.onLine,
    cachedCourses: Object.keys(getCachedCourses()).length,
    pendingSync: getSyncQueue().length,
    cacheSize: getCacheSize(),
  };
}

