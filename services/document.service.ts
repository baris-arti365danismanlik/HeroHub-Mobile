import { supabase } from './supabase.client';

export interface UserDocument {
  id: string;
  user_id: string;
  name: string;
  type: 'folder' | 'file';
  parent_id: string | null;
  file_url: string | null;
  file_size: number | null;
  icon_type: string;
  item_count: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_shared: boolean;
}

export const documentService = {
  async getUserDocuments(userId: string): Promise<UserDocument[]> {
    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .is('parent_id', null)
      .order('type', { ascending: false })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getDocumentsByParent(parentId: string): Promise<UserDocument[]> {
    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('parent_id', parentId)
      .order('type', { ascending: false })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createDocument(document: Partial<UserDocument>): Promise<UserDocument> {
    const { data, error } = await supabase
      .from('user_documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: Partial<UserDocument>): Promise<UserDocument> {
    const { data, error } = await supabase
      .from('user_documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  formatFileSize(bytes: number | null): string {
    if (!bytes) return '0 B';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} kb`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} mb`;
  },
};
