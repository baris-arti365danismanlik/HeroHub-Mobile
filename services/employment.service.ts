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
      `/UserEmployment/Get-WorkingInformation?userId=${userId}`
    );
    return response.data || [];
  },

  async getPositions(userId: number): Promise<Position[]> {
    try {
      const response = await apiClient.get<Position[]>(
        `/UserEmployment/Get-Positions?userId=${userId}`
      );
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  async getUserSalary(userId: number): Promise<UserSalary | null> {
    try {
      const response = await apiClient.get<UserSalary>(
        `/UserEmployment/Get-UserSalary?userId=${userId}`
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  async getUserTitles(): Promise<UserTitle[]> {
    const response = await apiClient.get<UserTitle[]>(
      '/UserEmployment/Get-UserTitles'
    );
    return response.data || [];
  },

  async getManagerUsers(): Promise<ManagerUser[]> {
    const response = await apiClient.get<ManagerUser[]>(
      '/UserEmployment/Get-ManagerUsers'
    );
    return response.data || [];
  },

  async getOrganizationDepartments(): Promise<Department[]> {
    const response = await apiClient.get<Department[]>(
      '/UserEmployment/Get-OrganizationDepartments'
    );
    return response.data || [];
  },

  async getWorkplaces(): Promise<Workplace[]> {
    const response = await apiClient.get<Workplace[]>(
      '/Workplace/List'
    );
    return response.data || [];
  },

  async getCities(countryId: number = 1): Promise<City[]> {
    const response = await apiClient.get<City[]>(
      `/Profile/Cities?countryId=${countryId}`
    );
    return response.data || [];
  },
};
