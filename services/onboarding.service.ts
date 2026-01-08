import { apiClient } from './api.client';
import {
  WelcomingPackageDefaultValues,
  OnboardingQuestionItem,
  UserOnboardingTaskItem,
  OnboardingProcess,
  WelcomePackageForm,
} from '@/types/backend';

export const onboardingService = {
  async getWelcomingPackageDefaultValues(
    userId: number
  ): Promise<WelcomingPackageDefaultValues | null> {
    try {
      const response = await apiClient.get<WelcomingPackageDefaultValues>(
        `/OnboardingQuestion/get-welcoming-package-default-values?UserId=${userId}`
      );
      return response.data || null;
    } catch (error) {
      console.error('Error fetching welcoming package default values:', error);
      return null;
    }
  },

  async getUserOnboardingQuestions(userId: number): Promise<OnboardingQuestionItem[]> {
    try {
      const response = await apiClient.get<OnboardingQuestionItem[]>(
        `/OnboardingQuestion/get-user-onboarding-questions?UserId=${userId}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user onboarding questions:', error);
      return [];
    }
  },

  async listUserOnboardingTasks(userId: number): Promise<UserOnboardingTaskItem[]> {
    try {
      const response = await apiClient.get<UserOnboardingTaskItem[]>(
        `/userOnboardingTask/list-userOnboardingTasks?userId=${userId}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user onboarding tasks:', error);
      return [];
    }
  },

  async getUserOnboardingProcess(userId: number): Promise<OnboardingProcess | null> {
    try {
      const response = await apiClient.get<OnboardingProcess>(
        `/userOnboardingTask/get-userOnboardingProcess?userId=${userId}`
      );
      return response.data || null;
    } catch (error) {
      console.error('Error fetching user onboarding process:', error);
      return null;
    }
  },

  async sendWelcomePackage(
    userId: number,
    formData?: WelcomePackageForm
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const requestBody = formData
        ? {
            userId,
            email: formData.email,
            startDate: formData.startDate,
            arrivalTime: formData.arrivalTime,
            arrivalAddress: formData.arrivalAddress,
            greeterUserId: formData.greeterUserId,
            managerId: formData.managerId,
            otherInstructions: formData.otherInstructions,
          }
        : { userId };

      console.log('Sending welcome package with data:', requestBody);

      const response = await apiClient.post(
        `/userOnboardingTask/send-welcome-package`,
        requestBody
      );

      if (response.succeeded) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.friendlyMessage || 'Bir hata oluştu',
        };
      }
    } catch (error: any) {
      console.error('Error sending welcome package:', error);
      return {
        success: false,
        error: error.message || 'Hoşgeldin paketi gönderilemedi',
      };
    }
  },

  async cancelOnboarding(userId: number): Promise<boolean> {
    try {
      const response = await apiClient.post(`/userOnboardingTask/cancel-onboarding`, {
        userId,
      });
      return response.succeeded || false;
    } catch (error) {
      console.error('Error cancelling onboarding:', error);
      return false;
    }
  },

  async getSteps(): Promise<any[]> {
    return [];
  },

  async getTasks(): Promise<any[]> {
    return [];
  },

  async getQuestions(): Promise<any[]> {
    return [];
  },

  async getUserOnboarding(userId: string): Promise<any> {
    return null;
  },

  async createUserOnboarding(userId: string): Promise<any> {
    return { id: userId };
  },

  async updateWelcomePackage(userOnboardingId: string, sent: boolean): Promise<void> {},

  async getUserSteps(userOnboardingId: string): Promise<any[]> {
    return [];
  },

  async initializeUserSteps(userOnboardingId: string, steps: any[]): Promise<void> {},

  async getUserTasks(userOnboardingId: string): Promise<any[]> {
    return [];
  },

  async initializeUserTasks(userOnboardingId: string, tasks: any[]): Promise<void> {},

  async completeTask(userTaskId: string): Promise<void> {},

  async getUserAnswers(userOnboardingId: string): Promise<any[]> {
    return [];
  },

  async saveAnswer(
    userOnboardingId: string,
    questionId: string,
    answer: string
  ): Promise<void> {},
};
