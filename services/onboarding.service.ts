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

      if (response.succeeded && response.data) {
        return response.data;
      }

      if (!response.succeeded && response.errors && response.errors.length > 0) {
        console.warn('Failed to fetch welcoming package default values:', response.errors[0]);
      }

      return null;
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

      if (response.succeeded && response.data) {
        return response.data;
      }

      return [];
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

      if (response.succeeded && response.data) {
        return response.data;
      }

      return [];
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

      if (response.succeeded && response.data) {
        return response.data;
      }

      if (!response.succeeded && response.errors && response.errors.length > 0) {
        console.warn('Failed to fetch user onboarding process:', response.errors[0]);
      }

      return null;
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
      let requestBody: any = { userId };

      if (formData) {
        let jobFirstDayDate = '';
        let jobFirstDayHour = '';

        if (formData.startDate) {
          const [day, month, year] = formData.startDate.split('/');
          jobFirstDayDate = `${year}-${month}-${day}`;
        }

        if (formData.arrivalTime) {
          const today = new Date();
          const dateStr = jobFirstDayDate || today.toISOString().split('T')[0];
          jobFirstDayHour = `${dateStr}T${formData.arrivalTime}:00.000Z`;
        }

        requestBody = {
          userId: String(userId),
          email: formData.email || '',
          jobFirstDayDate: jobFirstDayDate,
          jobFirstDayHour: jobFirstDayHour,
          address: formData.arrivalAddress || '',
          instructions: formData.otherInstructions || '',
          personToMeetId: formData.greeterUserId,
          reportsTo: formData.managerId,
        };
      }

      console.log('Sending welcome package with data:', requestBody);

      const response = await apiClient.post(
        `/OnboardingQuestion/send-welcoming-package`,
        requestBody
      );

      console.log('Welcome package response:', response);

      if (response.succeeded) {
        return { success: true };
      } else {
        const errorMessage =
          response.friendlyMessage ||
          (response.errors && response.errors.length > 0 ? response.errors[0] : 'Bir hata oluştu');
        return {
          success: false,
          error: errorMessage,
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

  async completeTask(userTaskId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post(
        `/userOnboardingTask/complete-task?userOnboardingTaskId=${userTaskId}`
      );

      if (response.succeeded) {
        return { success: true };
      } else {
        const errorMessage =
          response.friendlyMessage ||
          (response.errors && response.errors.length > 0 ? response.errors[0] : 'Bir hata oluştu');
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error: any) {
      console.error('Error completing task:', error);
      return {
        success: false,
        error: error.message || 'Görev tamamlanamadı',
      };
    }
  },

  async getUserAnswers(userOnboardingId: string): Promise<any[]> {
    return [];
  },

  async saveAnswer(
    userOnboardingId: string,
    questionId: string,
    answer: string
  ): Promise<void> {},
};
