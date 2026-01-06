import { supabase } from './api.client';
import { InboxMessage } from '@/types/backend';

export const inboxService = {
  async getUserMessages(userId: string): Promise<InboxMessage[]> {
    const { data, error } = await supabase
      .from('inbox_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inbox messages:', error);
      throw error;
    }

    return data || [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('inbox_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  },

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('inbox_messages')
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('inbox_messages')
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  },
};
