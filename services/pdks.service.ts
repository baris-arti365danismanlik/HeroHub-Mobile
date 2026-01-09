import { apiClient } from './api.client';
import { AttendanceRecord } from '@/types/backend';

export interface UserWorkLog {
  id: number;
  userId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  totalWorkHours: number;
}

export const pdksService = {
  async getUserWorkLog(userId: number): Promise<UserWorkLog[]> {
    try {
      const response = await apiClient.get(
        `/employeeLog/get-userworklog?userId=${userId}`
      );
      return (response as any) || [];
    } catch (error) {
      console.error('Error fetching user work log:', error);
      return [];
    }
  },
};
