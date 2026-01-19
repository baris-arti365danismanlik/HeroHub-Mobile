import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { User } from '@/types/backend';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://faz2-api.herotr.com/api';

const TOKEN_KEY = '@herof2_token';
const REFRESH_TOKEN_KEY = '@herof2_refresh_token';
const USER_DATA_KEY = '@herof2_user_data';

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage.getItem error:', error);
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (error) {
        console.error('localStorage.setItem error:', error);
        return;
      }
    }
    return AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (error) {
        console.error('localStorage.removeItem error:', error);
        return;
      }
    }
    return AsyncStorage.removeItem(key);
  },
  async multiRemove(keys: string[]): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        keys.forEach(key => window.localStorage.removeItem(key));
        return;
      } catch (error) {
        console.error('localStorage.multiRemove error:', error);
        return;
      }
    }
    return AsyncStorage.multiRemove(keys);
  },
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 3000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeoutMs)
    )
  ]);
};

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await withTimeout(storage.getItem(TOKEN_KEY));
    } catch (error) {
      console.error('getToken error:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await withTimeout(storage.setItem(TOKEN_KEY, token));
    } catch (error) {
      console.error('setToken error:', error);
      return;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await withTimeout(storage.getItem(REFRESH_TOKEN_KEY));
    } catch (error) {
      console.error('getRefreshToken error:', error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await withTimeout(storage.setItem(REFRESH_TOKEN_KEY, token));
    } catch (error) {
      console.error('setRefreshToken error:', error);
      return;
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      const data = await withTimeout(storage.getItem(USER_DATA_KEY));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('getUserData error:', error);
      return null;
    }
  },

  async setUserData(user: User): Promise<void> {
    try {
      await withTimeout(storage.setItem(USER_DATA_KEY, JSON.stringify(user)));
    } catch (error) {
      console.error('setUserData error:', error);
      return;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await withTimeout(storage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]));
    } catch (error) {
      console.error('clearTokens error:', error);
      return;
    }
  },
};
