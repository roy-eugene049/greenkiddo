/**
 * Example: How to use the API Client
 * 
 * This file demonstrates how to migrate existing services to use the API client.
 * It shows both the current localStorage approach and the new API approach.
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errorHandler';
import { BlogPost } from '../../types/blog';

/**
 * Example: Blog Service using API Client
 * 
 * This is an example of how to refactor BlogService to use the API client.
 * The actual BlogService still uses localStorage for now, but this shows
 * the pattern for migration.
 */

export class BlogServiceAPI {
  /**
   * Get all blog posts
   */
  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      return await apiClient.get<BlogPost[]>(API_ENDPOINTS.BLOG.BASE);
    } catch (error) {
      const { userMessage } = handleApiError(error, 'getAllPosts');
      throw new Error(userMessage);
    }
  }

  /**
   * Get blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      return await apiClient.get<BlogPost>(API_ENDPOINTS.BLOG.BY_SLUG(slug));
    } catch (error) {
      if (error instanceof Error && 'status' in error && (error as any).status === 404) {
        return null;
      }
      const { userMessage } = handleApiError(error, 'getPostBySlug');
      throw new Error(userMessage);
    }
  }

  /**
   * Get blog post by ID
   */
  static async getPostById(id: string): Promise<BlogPost | null> {
    try {
      return await apiClient.get<BlogPost>(API_ENDPOINTS.BLOG.BY_ID(id));
    } catch (error) {
      if (error instanceof Error && 'status' in error && (error as any).status === 404) {
        return null;
      }
      const { userMessage } = handleApiError(error, 'getPostById');
      throw new Error(userMessage);
    }
  }

  /**
   * Create a new blog post
   */
  static async createPost(post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'views' | 'likes' | 'readTime'>): Promise<BlogPost> {
    try {
      return await apiClient.post<BlogPost>(API_ENDPOINTS.ADMIN.BLOG.BASE, post);
    } catch (error) {
      const { userMessage } = handleApiError(error, 'createPost');
      throw new Error(userMessage);
    }
  }

  /**
   * Update a blog post
   */
  static async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    try {
      return await apiClient.put<BlogPost>(API_ENDPOINTS.ADMIN.BLOG.BY_ID(id), post);
    } catch (error) {
      const { userMessage } = handleApiError(error, 'updatePost');
      throw new Error(userMessage);
    }
  }

  /**
   * Delete a blog post
   */
  static async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.ADMIN.BLOG.BY_ID(id));
    } catch (error) {
      const { userMessage } = handleApiError(error, 'deletePost');
      throw new Error(userMessage);
    }
  }

  /**
   * Search blog posts
   */
  static async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      return await apiClient.get<BlogPost[]>(API_ENDPOINTS.BLOG.SEARCH, {
        params: { q: query },
      });
    } catch (error) {
      const { userMessage } = handleApiError(error, 'searchPosts');
      throw new Error(userMessage);
    }
  }
}

/**
 * Migration Strategy:
 * 
 * 1. Keep existing localStorage-based services working
 * 2. Create new API-based services alongside (e.g., BlogServiceAPI)
 * 3. Add feature flag to switch between implementations
 * 4. Gradually migrate components to use API services
 * 5. Once fully migrated, remove localStorage services
 * 
 * Example feature flag:
 * 
 * const USE_API = import.meta.env.VITE_USE_API === 'true';
 * export const BlogService = USE_API ? BlogServiceAPI : BlogServiceLocal;
 */

