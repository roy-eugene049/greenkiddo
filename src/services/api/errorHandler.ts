/**
 * API Error Handling Utilities
 * 
 * Provides standardized error handling and user-friendly error messages
 */

import { ApiError } from './client';

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Error codes enum
 */
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Get error code from status
 */
export function getErrorCode(status: number): ErrorCode {
  if (status === 0) return ErrorCode.NETWORK_ERROR;
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 408) return ErrorCode.TIMEOUT;
  if (status === 422) return ErrorCode.VALIDATION_ERROR;
  if (status === 429) return ErrorCode.RATE_LIMIT;
  if (status >= 500) return ErrorCode.SERVER_ERROR;
  return ErrorCode.UNKNOWN;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiError | Error): string {
  if (error instanceof ApiError) {
    const code = getErrorCode(error.status);

    switch (code) {
      case ErrorCode.NETWORK_ERROR:
        return 'Unable to connect to the server. Please check your internet connection.';
      case ErrorCode.TIMEOUT:
        return 'The request took too long. Please try again.';
      case ErrorCode.UNAUTHORIZED:
        return 'You need to be logged in to perform this action.';
      case ErrorCode.FORBIDDEN:
        return 'You do not have permission to perform this action.';
      case ErrorCode.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorCode.VALIDATION_ERROR:
        return error.data?.message || 'Please check your input and try again.';
      case ErrorCode.RATE_LIMIT:
        return 'Too many requests. Please wait a moment and try again.';
      case ErrorCode.SERVER_ERROR:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return error.message || 'An unexpected error occurred.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError | Error): boolean {
  if (!(error instanceof ApiError)) return false;

  const code = getErrorCode(error.status);
  
  // Retry on network errors, timeouts, and server errors
  return (
    code === ErrorCode.NETWORK_ERROR ||
    code === ErrorCode.TIMEOUT ||
    code === ErrorCode.SERVER_ERROR ||
    code === ErrorCode.RATE_LIMIT
  );
}

/**
 * Log error for debugging
 */
export function logError(error: ApiError | Error, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[API Error]${context ? ` [${context}]` : ''}:`, {
      message: error.message,
      ...(error instanceof ApiError && {
        status: error.status,
        statusText: error.statusText,
        data: error.data,
      }),
      stack: error.stack,
    });
  }

  // In production, you might want to send to error tracking service (e.g., Sentry)
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { contexts: { api: { context } } });
  // }
}

/**
 * Handle API error with logging and user notification
 */
export function handleApiError(
  error: ApiError | Error,
  context?: string,
  showNotification: boolean = true
): {
  code: ErrorCode;
  message: string;
  userMessage: string;
} {
  logError(error, context);

  const code = getErrorCode(error instanceof ApiError ? error.status : 0);
  const userMessage = getUserFriendlyMessage(error);

  if (showNotification && typeof window !== 'undefined') {
    // You can integrate with your notification system here
    // For now, we'll just log it
    console.warn('User notification:', userMessage);
  }

  return {
    code,
    message: error.message,
    userMessage,
  };
}

