/**
 * Media Upload Service
 * 
 * Handles file uploads with support for:
 * - Images (with optimization)
 * - Videos
 * - General files
 * - Progress tracking
 * - Validation
 */

import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/endpoints';
import { handleApiError } from './api/errorHandler';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  compress?: boolean; // for images
  quality?: number; // for image compression (0-1)
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: UploadOptions = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options; // 10MB default

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Compress image file
 */
export async function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate thumbnail for image
 */
export async function generateThumbnail(
  file: File,
  size: number = 300
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(size / img.width, size / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload file to server
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { onProgress, compress = false, quality = 0.8 } = options;

  // Validate file
  const validation = validateFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Compress image if requested
  let fileToUpload = file;
  if (compress && file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file, quality);
    } catch (error) {
      console.warn('Failed to compress image, uploading original:', error);
    }
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', fileToUpload);

  try {
    // For now, we'll use a mock implementation
    // In production, this would use the actual API
    // TODO: Replace with real API call when backend is ready
    return await mockUpload(fileToUpload, onProgress);

    // Real API upload (when backend is ready)
    // For now, use mock upload in development
    // In production, uncomment this and remove the mockUpload call above
    /*
    const response = await apiClient.post<UploadResult>(
      API_ENDPOINTS.MEDIA.UPLOAD,
      formData,
      {
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
      }
    );
    return response;
    */

    return response;
  } catch (error) {
    const { userMessage } = handleApiError(error, 'uploadFile');
    throw new Error(userMessage);
  }
}

/**
 * Mock upload for development
 * Simulates file upload with progress
 */
async function mockUpload(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Simulate upload progress
  const total = file.size;
  let loaded = 0;
  const chunkSize = total / 20; // 20 progress updates

  const progressInterval = setInterval(() => {
    loaded += chunkSize;
    if (loaded >= total) {
      loaded = total;
      clearInterval(progressInterval);
    }

    if (onProgress) {
      onProgress({
        loaded: Math.min(loaded, total),
        total,
        percentage: Math.round((Math.min(loaded, total) / total) * 100),
      });
    }
  }, 100);

  // Wait for "upload" to complete
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock URL (in production, this would be the actual uploaded file URL)
  const mockUrl = URL.createObjectURL(file);
  const thumbnailUrl = file.type.startsWith('image/')
    ? await generateThumbnail(file).catch(() => undefined)
    : undefined;

  return {
    id: `media-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    url: mockUrl,
    thumbnailUrl,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Delete uploaded file
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.MEDIA.DELETE(fileId));
  } catch (error) {
    const { userMessage } = handleApiError(error, 'deleteFile');
    throw new Error(userMessage);
  }
}

/**
 * Get file info
 */
export async function getFileInfo(fileId: string): Promise<UploadResult> {
  try {
    return await apiClient.get<UploadResult>(API_ENDPOINTS.MEDIA.BY_ID(fileId));
  } catch (error) {
    const { userMessage } = handleApiError(error, 'getFileInfo');
    throw new Error(userMessage);
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get allowed file types for different use cases
 */
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  videos: ['video/mp4', 'video/webm', 'video/ogg'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'],
} as const;

