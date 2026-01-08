import { AttendanceRecord } from '@/types/backend';

export const pdksService = {
  async getAttendanceRecords(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    return [];
  },

  async checkIn(userId: string): Promise<AttendanceRecord> {
    throw new Error('Not implemented');
  },

  async checkOut(userId: string): Promise<AttendanceRecord> {
    throw new Error('Not implemented');
  },

  async getTodayRecord(userId: string): Promise<AttendanceRecord | null> {
    return null;
  },

  async getMonthlyStats(userId: string, year: number, month: number) {
    return {
      records: [],
      totalWorkDuration: 0,
      totalDays: 0,
      lateDays: 0,
      earlyLeaveDays: 0,
      averageWorkDuration: 0,
    };
  },
};
