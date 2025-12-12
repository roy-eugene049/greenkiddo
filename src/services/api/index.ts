/**
 * API Service Layer - Main Export
 * 
 * Centralized export for all API-related utilities
 */

export { apiClient, ApiClient, ApiError, type ApiConfig, type RequestConfig } from './client';
export { API_ENDPOINTS, buildEndpoint } from './endpoints';
export {
  ErrorCode,
  getErrorCode,
  getUserFriendlyMessage,
  isRetryableError,
  logError,
  handleApiError,
  type ErrorResponse,
} from './errorHandler';
export { mockAdapter, setupMockRoutes } from './mockAdapter';
export {
  isMigrationComplete,
  markMigrationComplete,
  exportLocalStorageData,
  importLocalStorageData,
  clearMigrationData,
  migrateDataType,
  batchMigrate,
  type MigrationStatus,
} from './migration';

