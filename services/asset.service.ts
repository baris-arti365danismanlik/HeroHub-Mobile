import { Asset, AssetCategory, BadgeCardInfo } from '@/types/backend';
import { apiClient } from './api.client';

export const assetService = {
  async getUserAssets(userId: number): Promise<Asset[]> {
    try {
      const response = await apiClient.get<Asset[]>(`/userAsset/list-userAssets?userId=${userId}`);
      if (response.succeeded && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return [];
    }
  },

  async getAssetCategories(): Promise<AssetCategory[]> {
    try {
      const response = await apiClient.get<AssetCategory[]>('/assetCategory/list-assetCategories');
      if (response.succeeded && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      return [];
    }
  },

  async getBadgeCardInfo(userId: number): Promise<BadgeCardInfo | null> {
    try {
      const response = await apiClient.get<BadgeCardInfo>(`/user/badgecard-info?userId=${userId}`);
      if (response.succeeded && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching badge card info:', error);
      return null;
    }
  },

  async createAsset(asset: {
    userId: number;
    categoryId: number;
    serialNo: string;
    description?: string;
    deliveryDate: string;
    fileUrl?: string;
  }): Promise<Asset | null> {
    try {
      const response = await apiClient.post<Asset>('/userAsset/create-userAsset', asset);
      if (response.succeeded && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  async deleteAsset(assetId: number): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/userAsset/delete-userAsset?id=${assetId}`);
      return response.succeeded || false;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return false;
    }
  },

  async returnAsset(assetId: number, returnDate: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/userAsset/return-userAsset', {
        assetId,
        returnDate,
      });
      return response.succeeded || false;
    } catch (error) {
      console.error('Error returning asset:', error);
      return false;
    }
  },
};
