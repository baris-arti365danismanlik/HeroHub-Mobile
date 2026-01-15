import { apiClient } from './api.client';
import { supabase } from './supabase.client';
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

      return null;
    } catch (error) {
      return null;
    }
  },

  async getUserOnboardingQuestions(backendUserId: number): Promise<OnboardingQuestionItem[]> {
    try {
      const { data: userOnboarding } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('backend_user_id', backendUserId)
        .maybeSingle();

      if (!userOnboarding) {
        return [];
      }

      const { data: answers } = await supabase
        .from('user_onboarding_answers')
        .select(`
          *,
          question:onboarding_questions(*)
        `)
        .eq('user_onboarding_id', userOnboarding.id);

      if (!answers) {
        return [];
      }

      return answers.map((answer: any) => ({
        id: answer.question.id,
        question: answer.question.question,
        answer: answer.answer || '',
        isRequired: answer.question.is_required,
        order: answer.question.order,
      }));
    } catch (error: any) {
      return [];
    }
  },

  async listUserOnboardingTasks(backendUserId: number): Promise<UserOnboardingTaskItem[]> {
    try {
      const response = await apiClient.get<any>(
        '/homePage/list-myOnboardingTasks'
      );

      if (!response.succeeded || !response.data) {
        return [];
      }

      const tasks: UserOnboardingTaskItem[] = [];

      response.data.forEach((categoryGroup: any) => {
        categoryGroup.tasks.forEach((task: any) => {
          task.targetUsers.forEach((targetUser: any) => {
            tasks.push({
              id: targetUser.id.toString(),
              title: task.taskName,
              description: '',
              dueDate: targetUser.dueDate,
              isCompleted: targetUser.isCompleted,
              completedAt: targetUser.completedAt,
              category: task.taskCategory,
              assignedTo: null,
              assignedToName: task.assignedUser,
            });
          });
        });
      });

      return tasks;
    } catch (error: any) {
      return [];
    }
  },

  async listAllOnboardingTasks(): Promise<any[]> {
    try {
      const response = await apiClient.get<any>(
        '/onboardingTask/list-onboardingTaskbyCategory'
      );

      if (!response.succeeded || !response.data) {
        return [];
      }

      return response.data;
    } catch (error: any) {
      return [];
    }
  },

  async getUserOnboardingProcess(backendUserId: number): Promise<OnboardingProcess | null> {
    try {
      const { data: userOnboarding } = await supabase
        .from('user_onboarding')
        .select(`
          *,
          steps:user_onboarding_steps(
            *,
            step:onboarding_steps(*)
          )
        `)
        .eq('backend_user_id', backendUserId)
        .maybeSingle();

      if (!userOnboarding) {
        return null;
      }

      const steps = userOnboarding.steps || [];
      const getStepCompleted = (title: string) => {
        const step = steps.find((s: any) => s.step?.title === title);
        return step?.is_completed || false;
      };

      return {
        id: 0,
        userId: 0,
        welcomePackageSent: userOnboarding.welcome_package_sent,
        welcomePackageSentAt: userOnboarding.welcome_package_sent_at,
        welcomePackageViewed: getStepCompleted('Hoşgeldin Paketi Görüntülendi'),
        welcomePackageViewedAt: undefined,
        employeeInfoFilled: getStepCompleted('Yeni Çalışan Bilgileri Dolduruldu'),
        employeeInfoFilledAt: undefined,
        introQuestionsAnswered: getStepCompleted('Tanışma Soruları Cevaplandı'),
        introQuestionsAnsweredAt: undefined,
        tasksCompleted: getStepCompleted('İşe Başlama Görevleri Tamamlandı'),
        tasksCompletedAt: undefined,
      };
    } catch (error: any) {
      return null;
    }
  },

  async sendWelcomePackage(
    backendUserId: number,
    formData?: WelcomePackageForm
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!formData) {
        return {
          success: false,
          error: 'Form verileri eksik',
        };
      }

      const jobFirstDayDate = formData.startDate
        ? formData.startDate.split('/').reverse().join('-')
        : new Date().toISOString().split('T')[0];

      const jobFirstDayHour = formData.arrivalTime
        ? `${jobFirstDayDate}T${formData.arrivalTime}:00.000Z`
        : new Date().toISOString();

      const requestBody = {
        userId: backendUserId.toString(),
        email: formData.email || '',
        jobFirstDayDate: jobFirstDayDate,
        jobFirstDayHour: jobFirstDayHour,
        address: formData.arrivalAddress || '',
        instructions: formData.otherInstructions || '',
        personToMeetId: formData.greeterUserId || null,
        reportsTo: formData.managerId || null,
      };

      const response = await apiClient.post<boolean>(
        '/OnboardingQuestion/send-welcoming-package',
        requestBody
      );

      if (!response.succeeded) {
        return {
          success: false,
          error: response.errors?.join(', ') || 'Hoşgeldin paketi gönderilemedi',
        };
      }

      const { data: existingOnboarding } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('backend_user_id', backendUserId)
        .maybeSingle();

      let userOnboardingId = existingOnboarding?.id;

      if (!userOnboardingId) {
        const { data: newOnboarding, error: onboardingError } = await supabase
          .from('user_onboarding')
          .insert({
            backend_user_id: backendUserId,
            welcome_package_sent: true,
            welcome_package_sent_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (onboardingError || !newOnboarding) {
          return {
            success: false,
            error: 'Onboarding kaydı oluşturulamadı',
          };
        }

        userOnboardingId = newOnboarding.id;

        const { data: allSteps } = await supabase
          .from('onboarding_steps')
          .select('id')
          .eq('is_active', true)
          .order('order');

        if (allSteps && allSteps.length > 0) {
          const stepsToInsert = allSteps.map((step) => ({
            user_onboarding_id: userOnboardingId,
            step_id: step.id,
            is_completed: false,
          }));

          await supabase.from('user_onboarding_steps').insert(stepsToInsert);
        }

        const { data: allTasks } = await supabase
          .from('onboarding_tasks')
          .select('id')
          .eq('is_active', true)
          .order('order');

        if (allTasks && allTasks.length > 0) {
          const tasksToInsert = allTasks.map((task) => ({
            user_onboarding_id: userOnboardingId,
            task_id: task.id,
            is_completed: false,
          }));

          await supabase.from('user_onboarding_tasks').insert(tasksToInsert);
        }

        const { data: allQuestions } = await supabase
          .from('onboarding_questions')
          .select('id')
          .eq('is_active', true)
          .order('order');

        if (allQuestions && allQuestions.length > 0) {
          const answersToInsert = allQuestions.map((question) => ({
            user_onboarding_id: userOnboardingId,
            question_id: question.id,
            answer: '',
          }));

          await supabase.from('user_onboarding_answers').insert(answersToInsert);
        }
      } else {
        await supabase
          .from('user_onboarding')
          .update({
            welcome_package_sent: true,
            welcome_package_sent_at: new Date().toISOString(),
          })
          .eq('id', userOnboardingId);
      }

      return { success: true };
    } catch (error: any) {
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
      return false;
    }
  },

  async completeTask(taskId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post<any>(
        `/userOnboardingTask/complete-task/${taskId}`,
        {}
      );

      if (response.succeeded) {
        return { success: true };
      }

      return { success: false, error: 'Görev tamamlanamadı' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Görev tamamlanamadı',
      };
    }
  },

  async saveAnswer(
    backendUserId: number,
    questionId: string,
    answer: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userOnboarding } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('backend_user_id', backendUserId)
        .maybeSingle();

      if (!userOnboarding) {
        return { success: false, error: 'Onboarding kaydı bulunamadı' };
      }

      const { error } = await supabase
        .from('user_onboarding_answers')
        .update({
          answer: answer,
          updated_at: new Date().toISOString(),
        })
        .eq('user_onboarding_id', userOnboarding.id)
        .eq('question_id', questionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Cevap kaydedilemedi',
      };
    }
  },
};
