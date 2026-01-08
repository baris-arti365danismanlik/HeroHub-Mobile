import { apiClient } from './api.client';
import type { ApiResponse, UserProfileDetails } from '@/types/backend';

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
  async getUserInformation(): Promise<UserProfileDetails> {
    const response = await apiClient.get<UserProfileDetails>('/Home/get-information');
    if (!response.data) {
      throw new Error('Failed to load user information');
    }
    return response.data;
  },

  async getNotificationCount(): Promise<number> {
    const response = await apiClient.get<number>('/Notification/get-notificationcount');
    return response.data || 0;
  },

  async listOnboardingTasksByCategory(): Promise<OnboardingTaskCategory[]> {
    const response = await apiClient.get<OnboardingTaskCategory[]>('/onboardingTask/list-onboardingTaskbyCategory');
    return response.data || [];
  },

  async listMyOnboardingTasks(): Promise<OnboardingTask[]> {
    const response = await apiClient.get<OnboardingTask[]>('/homePage/list-myOnboardingTasks');
    return response.data || [];
  },

  async listNewEmployees(): Promise<NewEmployee[]> {
    const response = await apiClient.get<NewEmployee[]>('/homePage/list-newEmployees');
    return response.data || [];
  },

  async listUpcomingDayOffs(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/homePage/list-upcomingDayOffs');
    return response.data || [];
  },

  async getUserTrainingStatus(): Promise<UserTrainingStatus> {
    const response = await apiClient.get<UserTrainingStatus>('/homePage/get-userTrainingStatus');
    return response.data || { userId: 0, plannedCount: 0, overdueCount: 0 };
  },

  async listUserRequests(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/homePage/list-userRequests');
    return response.data || [];
  },

  async listUserAgenda(): Promise<UserAgendaItem[]> {
    const response = await apiClient.get<UserAgendaItem[]>('/homePage/list-userAgenda');
    return response.data || [];
  },
};
