import { apiHttpClient } from './http.client';
import type {
  LeaveRequest,
  LeaveRequestStatus,
  DayOffBalanceResponse,
  DayOffRecord
} from '@/types/backend';

export interface CreateLeaveRequestData {
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  notes?: string;
}

export const leaveService = {
  async getUserLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    return [];
  },

  async getPendingLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    return [];
  },

  async createLeaveRequest(requestData: CreateLeaveRequestData): Promise<LeaveRequest> {
    throw new Error('Not implemented');
  },

  async updateLeaveRequest(
    id: string,
    updates: Partial<CreateLeaveRequestData>
  ): Promise<LeaveRequest> {
    throw new Error('Not implemented');
  },

  async deleteLeaveRequest(id: string): Promise<void> {
  },

  async getDayOffBalance(userId: number): Promise<DayOffBalanceResponse> {
    console.log('getDayOffBalance - Requesting with userId:', userId);
    const response = await apiHttpClient.get<DayOffBalanceResponse>(
      '/UserDayOffBalance/Get-UserDayOffBalance',
      { userId }
    );
    console.log('getDayOffBalance - Response:', response);
    if (!response.data) {
      throw new Error('Failed to fetch day off balance');
    }
    return response.data;
  },

  async getPastDayOffs(userId?: number): Promise<DayOffRecord[]> {
    const params = userId ? { userId } : undefined;
    console.log('getPastDayOffs - Requesting with userId:', userId, 'params:', params);
    const response = await apiHttpClient.get<DayOffRecord[]>(
      '/UserDayOff/Get-PastDayOff',
      params
    );
    console.log('getPastDayOffs - Response:', response);
    return response.data || [];
  },

  async getIncomingDayOffs(userId: number): Promise<DayOffRecord[]> {
    console.log('getIncomingDayOffs - Requesting with userId:', userId);
    const response = await apiHttpClient.get<DayOffRecord[]>(
      '/UserDayOff/Get-IncomingDayOff',
      { userId }
    );
    console.log('getIncomingDayOffs - Response:', response);
    return response.data || [];
  },
};
