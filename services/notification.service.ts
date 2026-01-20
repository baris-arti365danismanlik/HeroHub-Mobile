import { apiClient } from './api.client';
import { UserNotification, NotificationDetail } from '@/types/backend';

export const notificationService = {
  async getUserNotifications(): Promise<UserNotification[]> {
    const response = await apiClient.get<UserNotification[]>(
      '/Notification/get-usernotifications'
    );
    return response.data || [];
  },

  async getNotificationDetail(notificationId: number): Promise<NotificationDetail> {
    const response = await apiClient.get<NotificationDetail>(
      `/Notification/get-notification?Id=${notificationId}`
    );
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<number>(
      '/Notification/get-notificationcount'
    );
    return response.data || 0;
  },

  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.post(`/Notification/mark-as-read/${notificationId}`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/Notification/mark-all-as-read');
  },
};
