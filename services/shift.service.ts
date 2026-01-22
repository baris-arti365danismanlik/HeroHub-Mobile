import { apiClient } from './api.client';
import { supabase } from './supabase.client';

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
  id: string;
  user_id: string;
  current_shift_type: string;
  requested_shift_type: string;
  reason?: string;
  effective_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface CreateShiftChangeRequest {
  current_shift_type: string;
  requested_shift_type: string;
  reason?: string;
  effective_date: string;
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

  async createShiftChangeRequest(data: CreateShiftChangeRequest): Promise<ShiftChangeRequest> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data: result, error } = await supabase
      .from('shift_change_requests')
      .insert({
        user_id: sessionData.session.user.id,
        current_shift_type: data.current_shift_type,
        requested_shift_type: data.requested_shift_type,
        reason: data.reason,
        effective_date: data.effective_date,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  },

  async getUserShiftChangeRequests(): Promise<ShiftChangeRequest[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('shift_change_requests')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  async cancelShiftChangeRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('shift_change_requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      throw error;
    }
  },
};
