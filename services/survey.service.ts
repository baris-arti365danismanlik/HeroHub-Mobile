import { apiClient } from './api.client';

export interface AnswerSurveyRequest {
  enpsAnswerId: number;
  feedback: string;
  score: number;
}

export const surveyService = {
  async answerSurvey(data: AnswerSurveyRequest): Promise<void> {
    await apiClient.post('/EnspSurvey/answer-survey', data);
  },
};
