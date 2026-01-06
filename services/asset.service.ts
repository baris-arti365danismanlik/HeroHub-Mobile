import { supabase } from './api.client';
import { Asset } from '@/types/backend';

export const assetService = {
  async getUserAssets(userId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert([asset])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAsset(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async returnAsset(id: string, returnDate: string): Promise<Asset> {
    return this.updateAsset(id, {
      status: 'returned' as any,
      return_date: returnDate,
    });
  },
};
