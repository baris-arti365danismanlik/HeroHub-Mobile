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

export const shiftService = {
  async getUserShiftPlan(userId: number): Promise<UserShiftPlan | null> {
    try {
      const response = await apiClient.get(
        `/shift/list-usershiftplan?userId=${userId}`
      );
      return (response as any)?.data || null;
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return null;
    }
  },
};
