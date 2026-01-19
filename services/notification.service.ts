import { apiClient } from './api.client';
import { UserNotification } from '@/types/backend';

export const notificationService = {
  async getUserNotifications(): Promise<UserNotification[]> {
    const response = await apiClient.get<UserNotification[]>(
      '/Notification/get-usernotifications'
    );
    return response.data || [];
  },

  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.post(`/Notification/mark-as-read/${notificationId}`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/Notification/mark-all-as-read');
  },
};
