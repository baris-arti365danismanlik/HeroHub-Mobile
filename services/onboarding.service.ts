import {
  OnboardingStep,
  OnboardingTask,
  OnboardingQuestion,
  UserOnboarding,
  UserOnboardingStep,
  UserOnboardingTask,
  UserOnboardingAnswer,
} from '@/types/backend';

export const onboardingService = {
  async getSteps(): Promise<OnboardingStep[]> {
    return [];
  },

  async getTasks(): Promise<OnboardingTask[]> {
    return [];
  },

  async getQuestions(): Promise<OnboardingQuestion[]> {
    return [];
  },

  async getUserOnboarding(userId: string): Promise<UserOnboarding | null> {
    return null;
  },

  async createUserOnboarding(userId: string): Promise<UserOnboarding> {
    throw new Error('Not implemented');
  },

  async updateWelcomePackage(userOnboardingId: string, sent: boolean): Promise<void> {
  },

  async getUserSteps(userOnboardingId: string): Promise<UserOnboardingStep[]> {
    return [];
  },

  async initializeUserSteps(userOnboardingId: string, steps: OnboardingStep[]): Promise<void> {
  },

  async getUserTasks(userOnboardingId: string): Promise<UserOnboardingTask[]> {
    return [];
  },

  async initializeUserTasks(userOnboardingId: string, tasks: OnboardingTask[]): Promise<void> {
  },

  async completeTask(userTaskId: string): Promise<void> {
  },

  async getUserAnswers(userOnboardingId: string): Promise<UserOnboardingAnswer[]> {
    return [];
  },

  async saveAnswer(
    userOnboardingId: string,
    questionId: string,
    answer: string
  ): Promise<void> {
  },
};
