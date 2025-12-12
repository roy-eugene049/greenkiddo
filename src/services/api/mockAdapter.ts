/**
 * Mock API Adapter
 * 
 * This adapter allows the API client to work with mock data
 * during development. It intercepts requests and returns mock responses.
 * 
 * In production, this would be removed or disabled.
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { ApiError } from './client';

/**
 * Mock response interface
 */
interface MockResponse {
  data: any;
  delay?: number;
  status?: number;
}

/**
 * Mock route handler
 */
type MockHandler = (params: any, body?: any) => MockResponse | Promise<MockResponse>;

/**
 * Mock route configuration
 */
interface MockRoute {
  method: string;
  pattern: RegExp | string;
  handler: MockHandler;
}

class MockAdapter {
  private routes: MockRoute[] = [];
  private enabled: boolean = true;

  /**
   * Enable/disable mock adapter
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if mock adapter is enabled
   */
  isEnabled(): boolean {
    return this.enabled && import.meta.env.DEV;
  }

  /**
   * Register a mock route
   */
  register(method: string, pattern: string | RegExp, handler: MockHandler): void {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: typeof pattern === 'string' ? new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`) : pattern,
      handler,
    });
  }

  /**
   * Match a request to a mock route
   */
  private matchRoute(method: string, url: string): MockRoute | null {
    const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    
    for (const route of this.routes) {
      if (route.method === method.toUpperCase()) {
        if (route.pattern instanceof RegExp) {
          if (route.pattern.test(path)) {
            return route;
          }
        } else if (route.pattern === path) {
          return route;
        }
      }
    }
    
    return null;
  }

  /**
   * Extract parameters from URL
   */
  private extractParams(pattern: RegExp, url: string): Record<string, string> {
    const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    const match = path.match(pattern);
    if (!match) return {};
    
    // Extract named parameters (this is simplified - in real implementation,
    // you'd need to track parameter names)
    const params: Record<string, string> = {};
    match.slice(1).forEach((value, index) => {
      params[`param${index}`] = value;
    });
    
    return params;
  }

  /**
   * Handle mock request
   */
  async handleRequest(method: string, url: string, body?: any): Promise<any> {
    if (!this.isEnabled()) {
      throw new Error('Mock adapter is disabled');
    }

    const route = this.matchRoute(method, url);
    if (!route) {
      // If no mock route found, simulate a 404
      throw new ApiError('Not Found', 404, 'Not Found', { message: 'Mock route not found' });
    }

    const params = route.pattern instanceof RegExp 
      ? this.extractParams(route.pattern, url)
      : {};

    const response = await route.handler(params, body);
    const delay = response.delay || 200;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));

    if (response.status && response.status >= 400) {
      throw new ApiError(
        response.data?.message || 'Error',
        response.status,
        'Error',
        response.data
      );
    }

    return response.data;
  }
}

// Create singleton instance
export const mockAdapter = new MockAdapter();

/**
 * Helper to register common mock routes
 */
export function setupMockRoutes(): void {
  // Example: Mock courses endpoint
  // mockAdapter.register('GET', API_ENDPOINTS.COURSES.BASE, async () => {
  //   return {
  //     data: mockCourses,
  //     delay: 300,
  //   };
  // });

  // You can add more mock routes here as needed
}

// Auto-setup in development
if (import.meta.env.DEV) {
  setupMockRoutes();
}

