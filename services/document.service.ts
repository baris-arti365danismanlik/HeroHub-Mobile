import { apiHttpClient } from './http.client';

export interface UserFolder {
  id: number;
  name: string;
  parentId: number | null;
  userId: number;
  subFolderCount: number;
  fileCount: number;
}

export interface UserFile {
  id: number;
  name: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  createdBy: string;
  folderId: number;
  folderName: string | null;
  path: string | null;
  url: string;
}

export interface WorkspaceResponse {
  parentFolderId: number | null;
  userFolders: UserFolder[];
  userFiles: UserFile[];
}

export interface UserDocument {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  count?: string;
  size?: string;
  url?: string;
  fileType?: string;
}

export const documentService = {
  async getUserDocuments(userId: number, parentFolderId?: number): Promise<UserDocument[]> {
    const params = new URLSearchParams({
      userId: userId.toString(),
    });

    if (parentFolderId !== undefined && parentFolderId !== null) {
      params.append('userFolderId', parentFolderId.toString());
    }

    const response = await apiHttpClient.get<WorkspaceResponse>(
      `/Workspace/get-workspace?${params.toString()}`
    );

    if (!response.data) {
      return [];
    }

    const folders: UserDocument[] = response.data.userFolders.map(folder => ({
      id: folder.id.toString(),
      name: folder.name,
      type: 'folder' as const,
      icon: folder.subFolderCount > 0 ? 'folder-blue' : 'folder-yellow',
      count: folder.fileCount > 0
        ? `${folder.fileCount} Dosya`
        : 'Boş Klasör'
    }));

    const files: UserDocument[] = response.data.userFiles.map(file => ({
      id: file.id.toString(),
      name: file.name,
      type: 'file' as const,
      icon: this.getFileIcon(file.fileType),
      size: this.formatFileSize(file.fileSize),
      url: file.url,
      fileType: file.fileType
    }));

    return [...folders, ...files];
  },

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'doc';
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'excel';
    return 'file';
  },

  formatFileSize(bytes: number | null): string {
    if (!bytes) return '0 B';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} kb`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} mb`;
  },
};
