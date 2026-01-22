import { apiClient } from './api.client';
import type {
  ApiResponse,
  WorkingInformation,
  Position,
  UserSalary,
  UserTitle,
  ManagerUser,
  Department,
  Workplace,
  City,
} from '../types/backend';

export const employmentService = {
  async getWorkingInformation(userId: number): Promise<WorkingInformation[]> {
    try {
      const response = await apiClient.get<WorkingInformation[]>(
        `/userEmployment/get-workinginformation?userId=${userId}`
      );
      return response.data || [];
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return [];
    }
  },

  async getPositions(userId: number): Promise<Position[]> {
    try {
      const response = await apiClient.get<Position[]>(
        `/userEmployment/get-positions?userId=${userId}`
      );
      return response.data || [];
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return [];
    }
  },

  async getUserSalary(userId: number): Promise<UserSalary[]> {
    try {
      const response = await apiClient.get<UserSalary[]>(
        `/userEmployment/get-userSalary?userId=${userId}`
      );
      return response.data || [];
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return [];
    }
  },

  async getUserTitles(): Promise<UserTitle[]> {
    const response = await apiClient.get<UserTitle[]>(
      '/userEmployment/get-userTitles'
    );
    return response.data || [];
  },

  async getManagerUsers(): Promise<ManagerUser[]> {
    const response = await apiClient.get<ManagerUser[]>(
      '/userEmployment/get-managerUsers'
    );
    return response.data || [];
  },

  async getOrganizationDepartments(): Promise<Department[]> {
    const response = await apiClient.get<Department[]>(
      '/userEmployment/get-organizationdepartments'
    );
    return response.data || [];
  },

  async getWorkplaces(): Promise<Workplace[]> {
    const response = await apiClient.get<Workplace[]>(
      '/workplace/list'
    );
    return response.data || [];
  },

  async getCities(countryId: number = 1): Promise<City[]> {
    const response = await apiClient.get<City[]>(
      `/Profile/cities?countryId=${countryId}`
    );
    return response.data || [];
  },
};
