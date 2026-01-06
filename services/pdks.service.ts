import { supabase } from './api.client';
import { AttendanceRecord } from '@/types/backend';

export const pdksService = {
  async getAttendanceRecords(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    let query = supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async checkIn(userId: string): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance_records')
      .upsert(
        {
          user_id: userId,
          date: today,
          check_in_time: now,
          status: 'normal',
          updated_at: now,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkOut(userId: string): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data: record } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (!record || !record.check_in_time) {
      throw new Error('Önce giriş yapmalısınız');
    }

    const checkInTime = new Date(record.check_in_time);
    const checkOutTime = new Date(now);
    const duration = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));

    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        check_out_time: now,
        work_duration: duration,
        updated_at: now,
      })
      .eq('id', record.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTodayRecord(userId: string): Promise<AttendanceRecord | null> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getMonthlyStats(userId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const records = data || [];
    const totalWorkDuration = records.reduce((sum, r) => sum + (r.work_duration || 0), 0);
    const totalDays = records.length;
    const lateDays = records.filter((r) => r.status === 'late').length;
    const earlyLeaveDays = records.filter((r) => r.status === 'early_leave').length;

    return {
      records,
      totalWorkDuration,
      totalDays,
      lateDays,
      earlyLeaveDays,
      averageWorkDuration: totalDays > 0 ? Math.floor(totalWorkDuration / totalDays) : 0,
    };
  },
};
