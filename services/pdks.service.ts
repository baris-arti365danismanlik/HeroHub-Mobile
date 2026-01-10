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

export interface PDKSTask {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedUserId?: number;
}

export const pdksService = {
  async getUserWorkLog(userId: number): Promise<UserWorkLog[]> {
    try {
      const response = await apiClient.get(
        `/EmployeeLog/Get-UserWorkLog?userId=${userId}`
      );
      return (response as any)?.data || [];
    } catch (error) {
      console.error('Error fetching user work log:', error);
      return [];
    }
  },

  async createTask(taskData: PDKSTask): Promise<any> {
    try {
      const response = await apiClient.post('/Pdks/Create-Task', taskData);
      return (response as any)?.data || null;
    } catch (error) {
      console.error('Error creating PDKS task:', error);
      throw error;
    }
  },
};
