import { supabase } from './api.client';
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
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('is_active', true)
      .order('order');

    if (error) throw error;
    return data || [];
  },

  async getTasks(): Promise<OnboardingTask[]> {
    const { data, error } = await supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('is_active', true)
      .order('order');

    if (error) throw error;
    return data || [];
  },

  async getQuestions(): Promise<OnboardingQuestion[]> {
    const { data, error } = await supabase
      .from('onboarding_questions')
      .select('*')
      .eq('is_active', true)
      .order('order');

    if (error) throw error;
    return data || [];
  },

  async getUserOnboarding(userId: string): Promise<UserOnboarding | null> {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createUserOnboarding(userId: string): Promise<UserOnboarding> {
    const { data, error } = await supabase
      .from('user_onboarding')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWelcomePackage(userOnboardingId: string, sent: boolean): Promise<void> {
    const { error } = await supabase
      .from('user_onboarding')
      .update({
        welcome_package_sent: sent,
        welcome_package_sent_at: sent ? new Date().toISOString() : null,
      })
      .eq('id', userOnboardingId);

    if (error) throw error;
  },

  async getUserSteps(userOnboardingId: string): Promise<UserOnboardingStep[]> {
    const { data, error } = await supabase
      .from('user_onboarding_steps')
      .select('*, step:step_id(*)')
      .eq('user_onboarding_id', userOnboardingId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async initializeUserSteps(userOnboardingId: string, steps: OnboardingStep[]): Promise<void> {
    const userSteps = steps.map((step) => ({
      user_onboarding_id: userOnboardingId,
      step_id: step.id,
      is_completed: false,
    }));

    const { error } = await supabase
      .from('user_onboarding_steps')
      .upsert(userSteps, { onConflict: 'user_onboarding_id,step_id' });

    if (error) throw error;
  },

  async getUserTasks(userOnboardingId: string): Promise<UserOnboardingTask[]> {
    const { data, error } = await supabase
      .from('user_onboarding_tasks')
      .select('*, task:task_id(*)')
      .eq('user_onboarding_id', userOnboardingId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async initializeUserTasks(userOnboardingId: string, tasks: OnboardingTask[]): Promise<void> {
    const userTasks = tasks.map((task) => ({
      user_onboarding_id: userOnboardingId,
      task_id: task.id,
      is_completed: false,
    }));

    const { error } = await supabase
      .from('user_onboarding_tasks')
      .upsert(userTasks, { onConflict: 'user_onboarding_id,task_id' });

    if (error) throw error;
  },

  async completeTask(userTaskId: string): Promise<void> {
    const { error } = await supabase
      .from('user_onboarding_tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', userTaskId);

    if (error) throw error;
  },

  async getUserAnswers(userOnboardingId: string): Promise<UserOnboardingAnswer[]> {
    const { data, error } = await supabase
      .from('user_onboarding_answers')
      .select('*, question:question_id(*)')
      .eq('user_onboarding_id', userOnboardingId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async saveAnswer(
    userOnboardingId: string,
    questionId: string,
    answer: string
  ): Promise<void> {
    const { error } = await supabase
      .from('user_onboarding_answers')
      .upsert(
        {
          user_onboarding_id: userOnboardingId,
          question_id: questionId,
          answer,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_onboarding_id,question_id' }
      );

    if (error) throw error;
  },
};
