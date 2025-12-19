/**
 * API Client for GreenKiddo LMS
 * 
 * This module provides a centralized API client with:
 * - Request/response interceptors
 * - Error handling
 * - Authentication token management
 * - Retry logic
 * - Request cancellation
 */

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL || '/api';
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Get authentication token (from Clerk or localStorage)
   */
  private getAuthToken(): string | null {
    // Try to get from Clerk session if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }
    return null;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new ApiError('Request timeout', 408, 'Request Timeout'));
      }, timeout);
    });
  }

  /**
   * Handle response and extract JSON
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        data
      );
    }

    return data;
  }

  /**
   * Retry request on failure
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number,
    retryDelay: number
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        // Don't retry on last attempt
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      params,
      headers = {},
      body,
      timeout = this.timeout,
      retries = 0,
      retryDelay = 1000,
      signal,
      ...restConfig
    } = config;

    // Cancel previous request if exists
    const requestKey = `${method}:${endpoint}`;
    const existingController = this.abortControllers.get(requestKey);
    if (existingController) {
      existingController.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    this.abortControllers.set(requestKey, abortController);

    // Combine signals if both provided
    const finalSignal = signal
      ? AbortSignal.any([signal, abortController.signal])
      : abortController.signal;

    // Get auth token
    const authToken = this.getAuthToken();
    const authHeaders: Record<string, string> = authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {};

    // Build request
    const url = this.buildURL(endpoint, params);
    
    // Handle FormData - don't stringify and don't set Content-Type
    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = isFormData
      ? {
          ...authHeaders,
          ...headers,
          // Don't set Content-Type for FormData, let browser set it with boundary
        } as HeadersInit
      : {
          ...this.defaultHeaders,
          ...authHeaders,
          ...headers,
        } as HeadersInit;

    const requestFn = async (): Promise<T> => {
      const fetchPromise = fetch(url, {
        method,
        headers: requestHeaders,
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        signal: finalSignal,
        ...restConfig,
      });

      const timeoutPromise = this.createTimeoutPromise(timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return this.handleResponse<T>(response);
    };

    try {
      // Retry logic if configured
      const result = retries > 0
        ? await this.retryRequest(requestFn, retries, retryDelay)
        : await requestFn();

      // Clean up abort controller on success
      this.abortControllers.delete(requestKey);
      return result;
    } catch (error) {
      // Clean up abort controller on error
      this.abortControllers.delete(requestKey);
      throw error;
    }
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data,
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data,
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Cancel a specific request
   */
  cancelRequest(endpoint: string, method: string = 'GET'): void {
    const requestKey = `${method}:${endpoint}`;
    const controller = this.abortControllers.get(requestKey);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestKey);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }

  /**
   * Update default headers
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

// Create default API client instance
// In production, this would use the actual API URL
// For now, we'll use a mock mode that simulates API calls
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? '/api' : '/api');

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export for testing or custom instances
export { ApiClient };

