import { apiClient } from './api.client';
import type { ApiResponse, UserProfileDetails, Country, City } from '@/types/backend';

interface District {
  name: string;
  cityId: number;
  id: number;
  unique: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string | null;
  createdBy: string;
  deletedBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
}

class ProfileService {
  async getUserProfile(userId: number): Promise<UserProfileDetails | null> {
    const response = await apiClient.get<ApiResponse<UserProfileDetails>>(
      `/Profile/get-userprofile/${userId}`
    );
    return response.data || null;
  }

  async getCountries(): Promise<Country[]> {
    const response = await apiClient.get<ApiResponse<Country[]>>('/Profile/countries');
    return response.data || [];
  }

  async getCities(countryId: number): Promise<City[]> {
    const response = await apiClient.get<ApiResponse<City[]>>(
      `/Profile/cities?countryId=${countryId}`
    );
    return response.data || [];
  }

  async getDistricts(cityId: number): Promise<District[]> {
    const response = await apiClient.get<ApiResponse<District[]>>(
      `/Profile/districts?cityId=${cityId}`
    );
    return response.data || [];
  }
}

export const profileService = new ProfileService();
