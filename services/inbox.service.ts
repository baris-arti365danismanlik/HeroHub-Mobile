import { InboxMessage } from '@/types/backend';

export const inboxService = {
  async getUserMessages(userId: string): Promise<InboxMessage[]> {
    return [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    return 0;
  },

  async markAsRead(messageId: string): Promise<void> {
  },

  async markAllAsRead(userId: string): Promise<void> {
  },
};
