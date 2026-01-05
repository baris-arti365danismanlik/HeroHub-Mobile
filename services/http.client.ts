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
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = config.headers || {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'tr',
    };
  }

  private async getHeaders(includeAuth = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      ...this.defaultHeaders,
    };

    if (includeAuth) {
      const token = await tokenStorage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh?refreshToken=${refreshToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data: ApiResponse<{ token: string; refreshToken: string }> = await response.json();

      const isSuccess = data.success || data.succeeded;

      if (isSuccess && data.data) {
        await tokenStorage.setToken(data.data.token);
        await tokenStorage.setRefreshToken(data.data.refreshToken);
        return data.data.token;
      }

      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('Refresh token error:', error);
      await tokenStorage.clearTokens();
      return null;
    }
  }

  private async handleResponse<T>(response: Response, retryRequest?: () => Promise<Response>): Promise<ApiResponse<T>> {
    if (response.status === 401 && retryRequest) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.addRefreshSubscriber(async (token: string) => {
            try {
              const newResponse = await retryRequest();
              const data = await newResponse.json();
              resolve(data as ApiResponse<T>);
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshToken();
        if (newToken) {
          this.isRefreshing = false;
          this.onRefreshed(newToken);
          const newResponse = await retryRequest();
          return await newResponse.json() as ApiResponse<T>;
        } else {
          throw new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        }
      } catch (error) {
        this.isRefreshing = false;
        await tokenStorage.clearTokens();
        throw error;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
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
      return await this.handleResponse<T>(response, includeAuth ? makeRequest : undefined);
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

      console.log(`curl -X POST -H 'Content-Type: application/json' ${includeAuth && await tokenStorage.getToken() ? `-H 'Authorization: Bearer ${(await tokenStorage.getToken())?.substring(0, 20)}...' ` : ''}-d '${JSON.stringify(body)}' '${url}'`);

      return fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    };

    try {
      const response = await makeRequest();
      return await this.handleResponse<T>(response, includeAuth ? makeRequest : undefined);
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
      return await this.handleResponse<T>(response, includeAuth ? makeRequest : undefined);
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
      return await this.handleResponse<T>(response, includeAuth ? makeRequest : undefined);
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
