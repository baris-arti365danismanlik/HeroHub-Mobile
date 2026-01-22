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

export interface CreateDayOffRequestPayload {
  userId: string;
  dayOffType: number;
  startDate: string;
  endDate: string;
  reason: string;
  countOfDays: number;
}

export interface DayOffRequestResponse {
  userDayOffId: number;
  userId: number;
  dayOffType: number;
  startDate: string;
  endDate: string;
  countOfDays: number;
  requesterUserId: number;
  approverUserId: number;
  approverMemo: string | null;
  requestedDate: string;
  status: number;
  reason: string;
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

  async createDayOffRequest(payload: CreateDayOffRequestPayload): Promise<DayOffRequestResponse> {
    const response = await apiHttpClient.post<DayOffRequestResponse>(
      '/userDayOff/create-dayOffRequest',
      payload
    );
    if (!response.data) {
      throw new Error('Failed to create day off request');
    }
    return response.data;
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
    const response = await apiHttpClient.get<DayOffBalanceResponse>(
      '/userDayOffBalance/get-userDayOffBalance',
      { userId }
    );
    if (!response.data) {
      throw new Error('Failed to fetch day off balance');
    }
    return response.data;
  },

  async getPastDayOffs(userId?: number, dayOffType?: number | null, year?: number): Promise<DayOffRecord[]> {
    const params: any = {};
    if (userId) params.userId = userId;
    if (dayOffType) params.dayOffType = dayOffType;
    if (year) params.year = year;

    const response = await apiHttpClient.get<DayOffRecord[]>(
      '/userDayOff/get-pastDayOff',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response.data || [];
  },

  async getIncomingDayOffs(userId: number): Promise<DayOffRecord[]> {
    const response = await apiHttpClient.get<DayOffRecord[]>(
      '/userDayOff/get-incomingDayOff',
      { userId }
    );
    return response.data || [];
  },
};
