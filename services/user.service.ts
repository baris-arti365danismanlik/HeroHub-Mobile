import { apiClient } from './api.client';
import type { User, UserDayOff, UserDayOffBalance, UserEmployment, UserRequest, ApiResponse, PaginatedResponse } from '@/types/backend';

class UserService {
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/api/User/${id}`);
    if (!response.data) {
      throw new Error('User not found');
    }
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/api/User/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update user');
    }
    return response.data;
  }

  async getDayOffBalance(userId: string, year?: number): Promise<UserDayOffBalance> {
    const params = year ? { year } : {};
    const response = await apiClient.get<UserDayOffBalance>(`/api/UserDayOffBalance/${userId}`, params);
    if (!response.data) {
      throw new Error('Day off balance not found');
    }
    return response.data;
  }

  async getUserDayOffs(userId: string, params?: { year?: number; status?: number }): Promise<UserDayOff[]> {
    const response = await apiClient.get<UserDayOff[]>(`/api/UserDayOff/user/${userId}`, params);
    return response.data || [];
  }

  async createDayOffRequest(data: {
    userId: string;
    dayOffType: number;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<UserDayOff> {
    const response = await apiClient.post<UserDayOff>('/api/UserDayOff', data);
    if (!response.data) {
      throw new Error('Failed to create day off request');
    }
    return response.data;
  }

  async getUserEmployments(userId: string): Promise<UserEmployment[]> {
    const response = await apiClient.get<UserEmployment[]>(`/api/UserEmployment/user/${userId}`);
    return response.data || [];
  }

  async getUserRequests(userId: string, params?: { status?: number }): Promise<UserRequest[]> {
    const response = await apiClient.get<UserRequest[]>(`/api/UserRequest/user/${userId}`, params);
    return response.data || [];
  }

  async createRequest(data: {
    userId: string;
    requestType: number;
    title: string;
    description: string;
    requestedAmount?: number;
  }): Promise<UserRequest> {
    const response = await apiClient.post<UserRequest>('/api/UserRequest', data);
    if (!response.data) {
      throw new Error('Failed to create request');
    }
    return response.data;
  }
}

export const userService = new UserService();
