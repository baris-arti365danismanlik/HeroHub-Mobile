import { apiClient } from './api.client';

export interface UserShiftPlan {
  id: number;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
}

export interface WorkLog {
  id: number;
  userId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInDoor: string | null;
  checkOutDoor: string | null;
  duration: string | null;
  shiftStartTime: string;
  shiftEndTime: string;
}

export const pdksService = {
  async getUserShiftPlan(userId: number): Promise<UserShiftPlan | null> {
    try {
      const response = await apiClient.get<UserShiftPlan>(
        `/shift/list-usershiftplan?userId=${userId}`
      );
      return response || null;
    } catch (error) {
      console.error('Error fetching user shift plan:', error);
      return null;
    }
  },

  async getUserWorkLog(userId: number): Promise<WorkLog[]> {
    try {
      const response = await apiClient.get<WorkLog[]>(
        `/employeeLog/get-userworklog?userId=${userId}`
      );
      return response || [];
    } catch (error) {
      console.error('Error fetching user work log:', error);
      return [];
    }
  },
};
