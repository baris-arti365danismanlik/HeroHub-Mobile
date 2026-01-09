import { apiClient } from './api.client';

export interface UserShiftPlan {
  id: number;
  userId: number;
  shiftPlanId: number;
  shiftPlanName: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  workDays: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
}

export interface ShiftChangeRequest {
  userId: number;
  newShiftPlanId: number;
  startDate: string;
  reason: string;
}

export const shiftService = {
  async getUserShiftPlan(userId: number): Promise<UserShiftPlan | null> {
    try {
      const response = await apiClient.get(
        `/shift/list-usershiftplan?userId=${userId}`
      );
      return (response as any) || null;
    } catch (error) {
      console.error('Error fetching user shift plan:', error);
      return null;
    }
  },

  async requestShiftChange(data: ShiftChangeRequest): Promise<void> {
    try {
      await apiClient.post('/shift/change-request', data);
    } catch (error) {
      console.error('Error requesting shift change:', error);
      throw error;
    }
  },

  async getShiftHistory(userId: number): Promise<UserShiftPlan[]> {
    try {
      const response = await apiClient.get(
        `/shift/history?userId=${userId}`
      );
      return (response as any) || [];
    } catch (error) {
      console.error('Error fetching shift history:', error);
      return [];
    }
  },
};
