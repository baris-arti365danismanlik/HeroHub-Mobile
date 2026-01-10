import { apiClient } from './api.client';
import type { ApiResponse } from '@/types/backend';

export interface OnboardingTaskCategory {
  id: number;
  name: string;
  onboardingTaskList: OnboardingTask[];
}

export interface OnboardingTask {
  id: number;
  name: string;
  description: string;
  daysToComplete: number;
  assignedUserId: number;
  assignedUserName: string;
  categoryId: number;
  categoryName: string;
  departmentId: number | null;
  departmentName: string | null;
  locationId: number | null;
  locationName: string | null;
  organizationId: number;
  organizationName: string | null;
}

export interface NewEmployee {
  id: number;
  fullname: string;
  jobStartDate: string;
  title: string;
  location: string;
  profilePhoto: string;
}

export interface UserTrainingStatus {
  userId: number;
  plannedCount: number;
  overdueCount: number;
}

export interface UserAgendaItem {
  userId: number;
  title: string;
  moduleId: number;
  moduleName: string | null;
  actionType: string;
  eventDate: string;
}

export const homeService = {
  async getNotificationCount(): Promise<number> {
    const response = await apiClient.get<number>('/Notification/get-notificationcount');
    return response.data || 0;
  },

  async listOnboardingTasksByCategory(): Promise<OnboardingTaskCategory[]> {
    const response = await apiClient.get<OnboardingTaskCategory[]>('/OnboardingTask/List-OnboardingTaskbyCategory');
    return response.data || [];
  },

  async listMyOnboardingTasks(): Promise<OnboardingTask[]> {
    const response = await apiClient.get<OnboardingTask[]>('/HomePage/List-MyOnboardingTasks');
    return response.data || [];
  },

  async listNewEmployees(): Promise<NewEmployee[]> {
    const response = await apiClient.get<NewEmployee[]>('/HomePage/List-NewEmployees');
    return response.data || [];
  },

  async listUpcomingDayOffs(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/HomePage/List-UpcomingDayOffs');
    return response.data || [];
  },

  async getUserTrainingStatus(): Promise<UserTrainingStatus> {
    const response = await apiClient.get<UserTrainingStatus>('/HomePage/Get-UserTrainingStatus');
    return response.data || { userId: 0, plannedCount: 0, overdueCount: 0 };
  },

  async listUserRequests(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/HomePage/List-UserRequests');
    return response.data || [];
  },

  async listUserAgenda(): Promise<UserAgendaItem[]> {
    const response = await apiClient.get<UserAgendaItem[]>('/HomePage/List-UserAgenda');
    return response.data || [];
  },
};
