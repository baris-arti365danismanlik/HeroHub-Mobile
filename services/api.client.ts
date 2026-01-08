import { apiConfig, tokenStorage } from './api.config';
import type { ApiResponse } from '@/types/backend';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      ...apiConfig.headers,
    };

    const token = await tokenStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        await tokenStorage.clearTokens();
        throw new Error('Unauthorized - Please login again');
      }

      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}));
        console.error('404 Error - Endpoint not found:', response.url);
        throw new Error(errorData.message || 'Endpoint bulunamadı. Backend geliştiricisiyle iletişime geçin.');
      }

      const errorData = await response.json().catch(() => ({}));
      console.error('Error data:', errorData);
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const headers = await this.getHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('POST Request:', url);
      console.log('Body:', JSON.stringify(body, null, 2));
      console.log('Headers:', headers);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      console.log('Response status:', response.status);

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('POST Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      }

      if (error.message === 'Failed to fetch' || error.message.includes('Network request failed')) {
        throw new Error('Network error - Cannot connect to server. Please check your internet connection.');
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const apiClient = new ApiClient();
