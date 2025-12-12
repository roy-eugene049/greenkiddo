/**
 * Bookmark Service
 * 
 * Manages video bookmarks for lessons
 */

export interface VideoBookmark {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  time: number; // in seconds
  note?: string;
  createdAt: string;
}

const STORAGE_KEY_PREFIX = 'greenkiddo_video_bookmarks_';

/**
 * Get bookmarks for a lesson
 */
export function getLessonBookmarks(userId: string, lessonId: string): number[] {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  const allBookmarks: VideoBookmark[] = JSON.parse(stored);
  return allBookmarks
    .filter(b => b.lessonId === lessonId)
    .map(b => b.time)
    .sort((a, b) => a - b);
}

/**
 * Add a bookmark
 */
export function addBookmark(
  userId: string,
  lessonId: string,
  courseId: string,
  time: number,
  note?: string
): VideoBookmark {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  const allBookmarks: VideoBookmark[] = stored ? JSON.parse(stored) : [];
  
  // Check if bookmark already exists at this time
  const existing = allBookmarks.find(
    b => b.lessonId === lessonId && Math.abs(b.time - time) < 2
  );
  
  if (existing) {
    // Update existing bookmark
    existing.note = note || existing.note;
    existing.createdAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(allBookmarks));
    return existing;
  }
  
  const bookmark: VideoBookmark = {
    id: `bookmark-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId,
    lessonId,
    courseId,
    time: Math.floor(time),
    note,
    createdAt: new Date().toISOString(),
  };
  
  allBookmarks.push(bookmark);
  localStorage.setItem(key, JSON.stringify(allBookmarks));
  
  return bookmark;
}

/**
 * Remove a bookmark
 */
export function removeBookmark(userId: string, lessonId: string, time: number): boolean {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return false;
  
  const allBookmarks: VideoBookmark[] = JSON.parse(stored);
  const filtered = allBookmarks.filter(
    b => !(b.lessonId === lessonId && Math.abs(b.time - time) < 2)
  );
  
  localStorage.setItem(key, JSON.stringify(filtered));
  return filtered.length < allBookmarks.length;
}

/**
 * Get all bookmarks for a user
 */
export function getUserBookmarks(userId: string): VideoBookmark[] {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get bookmark details
 */
export function getBookmarkDetails(
  userId: string,
  lessonId: string,
  time: number
): VideoBookmark | null {
  const allBookmarks = getUserBookmarks(userId);
  return (
    allBookmarks.find(
      b => b.lessonId === lessonId && Math.abs(b.time - time) < 2
    ) || null
  );
}

/**
 * Update bookmark note
 */
export function updateBookmarkNote(
  userId: string,
  lessonId: string,
  time: number,
  note: string
): boolean {
  const bookmark = getBookmarkDetails(userId, lessonId, time);
  if (!bookmark) return false;
  
  bookmark.note = note;
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const allBookmarks = getUserBookmarks(userId);
  const updated = allBookmarks.map(b =>
    b.id === bookmark.id ? bookmark : b
  );
  
  localStorage.setItem(key, JSON.stringify(updated));
  return true;
}

