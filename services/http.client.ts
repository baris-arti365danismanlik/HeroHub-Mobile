import { tokenStorage } from './api.config';
import type { ApiResponse } from '@/types/backend';

interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: HeadersInit;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: HeadersInit;

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = config.headers || {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'tr',
    };
  }

  private async getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      ...(this.defaultHeaders as Record<string, string>),
    };

    if (includeAuth) {
      const token = await tokenStorage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.status === 401) {
      await tokenStorage.clearTokens();

      const error: any = new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
      error.isAuthError = true;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 400) {
        const errorMessage = errorData.friendlyMessage ||
                           errorData.message ||
                           errorData.title ||
                           (errorData.errors && typeof errorData.errors === 'object'
                             ? Object.values(errorData.errors).flat().join(', ')
                             : 'Geçersiz istek. Lütfen tekrar deneyin.');
        throw new Error(errorMessage);
      }

      if (response.status === 404) {
        return {
          data: null,
          success: false,
          succeeded: false,
          message: 'Kaynak bulunamadı'
        } as ApiResponse<T>;
      }

      return {
        data: null,
        success: false,
        succeeded: false,
        message: errorData.message || `HTTP Error: ${response.status}`
      } as ApiResponse<T>;
    }

    const data = await response.json().catch(() => ({ data: null }));
    return data as ApiResponse<T>;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, includeAuth = true): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const makeRequest = async () => {
      const headers = await this.getHeaders(includeAuth);
      return fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
    };

    try {
      const response = await makeRequest();
      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, body?: any, includeAuth = true): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const makeRequest = async () => {
      const headers = await this.getHeaders(includeAuth);
      const url = `${this.baseURL}${endpoint}`;

      return fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    };

    try {
      const response = await makeRequest();
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T>(endpoint: string, body?: any, includeAuth = true): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const makeRequest = async () => {
      const headers = await this.getHeaders(includeAuth);
      return fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    };

    try {
      const response = await makeRequest();
      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const makeRequest = async () => {
      const headers = await this.getHeaders(includeAuth);
      return fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers,
        signal: controller.signal,
      });
    };

    try {
      const response = await makeRequest();
      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL || 'https://faz2-api.herotr.com/api';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://faz2-api.herotr.com/api';

export const authHttpClient = new HttpClient({
  baseURL: AUTH_API_URL,
  timeout: 30000,
});

export const apiHttpClient = new HttpClient({
  baseURL: API_URL,
  timeout: 30000,
});
