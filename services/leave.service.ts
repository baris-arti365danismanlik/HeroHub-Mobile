import { supabase } from './api.client';
import { LeaveRequest, LeaveRequestStatus } from '@/types/backend';

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
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }

    return data || [];
  },

  async getPendingLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', LeaveRequestStatus.Pending)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending leave requests:', error);
      throw error;
    }

    return data || [];
  },

  async createLeaveRequest(requestData: CreateLeaveRequestData): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert({
        ...requestData,
        status: LeaveRequestStatus.Pending,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create leave request');
    }

    return data;
  },

  async updateLeaveRequest(
    id: string,
    updates: Partial<CreateLeaveRequestData>
  ): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from('leave_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to update leave request');
    }

    return data;
  },

  async deleteLeaveRequest(id: string): Promise<void> {
    const { error } = await supabase.from('leave_requests').delete().eq('id', id);

    if (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }
  },
};
