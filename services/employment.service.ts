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
    const response = await apiClient.get<WorkingInformation[]>(
      `/api/userEmployment/get-workinginformation?userId=${userId}`
    );
    return response.data || [];
  },

  async getPositions(userId: number): Promise<Position[]> {
    try {
      const response = await apiClient.get<Position[]>(
        `/api/userEmployment/get-positions?userId=${userId}`
      );
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  async getUserSalary(userId: number): Promise<UserSalary | null> {
    try {
      const response = await apiClient.get<UserSalary>(
        `/api/userEmployment/get-userSalary?userId=${userId}`
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  async getUserTitles(organizationId: number): Promise<UserTitle[]> {
    const response = await apiClient.get<UserTitle[]>(
      `/api/userEmployment/get-userTitles?organizationId=${organizationId}`
    );
    return response.data || [];
  },

  async getManagerUsers(): Promise<ManagerUser[]> {
    const response = await apiClient.get<ManagerUser[]>(
      '/api/userEmployment/get-managerUsers'
    );
    return response.data || [];
  },

  async getOrganizationDepartments(): Promise<Department[]> {
    const response = await apiClient.get<Department[]>(
      '/api/userEmployment/get-organizationdepartments'
    );
    return response.data || [];
  },

  async getWorkplaces(): Promise<Workplace[]> {
    const response = await apiClient.get<Workplace[]>(
      '/api/workplace/list'
    );
    return response.data || [];
  },

  async getCities(countryId: number = 1): Promise<City[]> {
    const response = await apiClient.get<City[]>(
      `/api/Profile/cities?countryId=${countryId}`
    );
    return response.data || [];
  },
};
