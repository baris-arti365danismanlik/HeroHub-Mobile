import { apiHttpClient as apiClient } from './http.client';
import { apiClient as newApiClient } from './api.client';
import { normalizePhotoUrl } from '@/utils/formatters';
import type {
  User,
  UserDayOff,
  UserDayOffBalance,
  UserEmployment,
  UserRequest,
  ApiResponse,
  PaginatedResponse,
  UserProfileDetails,
  Country,
  BadgeCardInfo,
  GroupedDepartmentUsers,
  GroupedEmployees,
  TreeEmployee
} from '@/types/backend';

class UserService {
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/User/${id}`);
    if (!response.data) {
      throw new Error('User not found');
    }
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/User/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update user');
    }
    return response.data;
  }

  async getDayOffBalance(userId: string, year?: number): Promise<UserDayOffBalance> {
    const params = year ? { year } : {};
    const response = await apiClient.get<UserDayOffBalance>(`/UserDayOffBalance/${userId}`, params);
    if (!response.data) {
      throw new Error('Day off balance not found');
    }
    return response.data;
  }

  async getUserDayOffs(userId: string, params?: { year?: number; status?: number }): Promise<UserDayOff[]> {
    const response = await apiClient.get<UserDayOff[]>(`/UserDayOff/user/${userId}`, params);
    return response.data || [];
  }

  async createDayOffRequest(data: {
    userId: string;
    dayOffType: number;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<UserDayOff> {
    const response = await apiClient.post<UserDayOff>('/UserDayOff', data);
    if (!response.data) {
      throw new Error('Failed to create day off request');
    }
    return response.data;
  }

  async getUserEmployments(userId: string): Promise<UserEmployment[]> {
    const response = await apiClient.get<UserEmployment[]>(`/UserEmployment/user/${userId}`);
    return response.data || [];
  }

  async getUserRequests(userId: string, params?: { status?: number }): Promise<UserRequest[]> {
    const response = await apiClient.get<UserRequest[]>(`/UserRequest/user/${userId}`, params);
    return response.data || [];
  }

  async createRequest(data: {
    userId: string;
    requestType: number;
    title: string;
    description: string;
    requestedAmount?: number;
  }): Promise<UserRequest> {
    const response = await apiClient.post<UserRequest>('/UserRequest', data);
    if (!response.data) {
      throw new Error('Failed to create request');
    }
    return response.data;
  }

  async getUserProfile(backendUserId: number): Promise<UserProfileDetails> {
    const response = await apiClient.get<any>(`/Profile/get-userprofile/${backendUserId}`);
    if (!response.data) {
      throw new Error('User profile not found');
    }

    const profileData = response.data;
    profileData.backendUserId = backendUserId;

    profileData.profilePhoto = normalizePhotoUrl(profileData.profilePhoto);

    if (profileData.reportsTo && profileData.reportsTo.profilePhoto) {
      profileData.reportsTo.profilePhoto = normalizePhotoUrl(profileData.reportsTo.profilePhoto);
    }

    if (profileData.colleagues && Array.isArray(profileData.colleagues)) {
      profileData.colleagues = profileData.colleagues.map((colleague: any) => ({
        ...colleague,
        profilePhoto: normalizePhotoUrl(colleague.profilePhoto)
      }));
    }

    if (profileData.socialMedia && typeof profileData.socialMedia === 'object' && profileData.socialMedia.socialMediaLinks) {
      try {
        const links = JSON.parse(profileData.socialMedia.socialMediaLinks);
        profileData.socialMedia = {
          linkedin: links.linkedinLink || '',
          facebook: links.facebookLink || '',
          instagram: links.instagramLink || '',
          twitter: links.twitterLink || links.tiktokLink || '',
        };
      } catch (error) {
        profileData.socialMedia = null;
      }
    }

    return profileData as UserProfileDetails;
  }

  async getCountries(): Promise<Country[]> {
    const response = await apiClient.get<Country[]>('/Profile/countries');
    return response.data || [];
  }

  async getBadgeCardInfo(userId: number): Promise<BadgeCardInfo | null> {
    try {
      const response = await newApiClient.get<BadgeCardInfo>(
        `/user/badgecard-info?userId=${userId}`
      );
      return response.data || null;
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return null;
    }
  }

  async getGroupedByDepartments(
    organizationId: number,
    includeHRManagers: boolean,
    stateKey: string
  ): Promise<GroupedDepartmentUsers | null> {
    try {
      const response = await newApiClient.get<GroupedDepartmentUsers>(
        `/User/grouped-by-departments?organizationId=${organizationId}&includeHRManagers=${includeHRManagers}&stateKey=${stateKey}`
      );
      return response.data || null;
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return null;
    }
  }

  async getGroupedByUsers(organizationId: number): Promise<GroupedEmployees[]> {
    const response = await newApiClient.get<GroupedEmployees[]>(
      `/user/grouped-by-users?organizationId=${organizationId}`
    );
    return response.data || [];
  }

  async getTreeByUsers(organizationId: number): Promise<TreeEmployee[]> {
    const response = await newApiClient.get<TreeEmployee[]>(
      `/user/tree-by-users?organizationId=${organizationId}`
    );
    return response.data || [];
  }

  async doesOrganizationHaveHRManager(): Promise<boolean> {
    try {
      const response = await newApiClient.get<boolean>(
        '/User/does-organization-have-hr-manager'
      );
      return response.data || false;
    } catch (error: any) {
      if (error.isAuthError) {
        throw error;
      }
      return false;
    }
  }

  async updatePersonalInformation(userId: number, data: {
    tckn?: string;
    firstName?: string;
    lastName?: string;
    birthPlace?: string;
    birthdate?: string;
    gender?: number;
    maritalStatus?: number;
    personnelNumber?: string;
  }): Promise<void> {
    const payload = {
      userId,
      tckn: data.tckn || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthPlace: data.birthPlace || '',
      birthdate: data.birthdate || null,
      gender: data.gender ?? 0,
      maritalStatus: data.maritalStatus ?? 0,
      personnelNumber: data.personnelNumber || '',
    };
    await apiClient.put('/profile/update-userpersonalinformation', payload);
  }

  async updateContactInformation(userId: number, data: {
    phoneNumber?: string;
    homePhone?: string;
    businessPhone?: string;
    email?: string;
    businessEmail?: string;
    otherEmail?: string;
  }): Promise<void> {
    const payload = {
      userId,
      phoneNumber: data.phoneNumber || '',
      homePhone: data.homePhone || '',
      businessPhone: data.businessPhone || '',
      email: data.email || '',
      businessEmail: data.businessEmail || '',
      otherEmail: data.otherEmail || '',
    };
    await apiClient.put('/profile/update-usercontact', payload);
  }

  async updateAddressInformation(userId: number, data: {
    address?: string;
    districtId?: number;
    cityId?: number;
    countryId?: number;
  }): Promise<void> {
    const payload = {
      userId,
      address: data.address || '',
      districtId: data.districtId || 0,
      cityId: data.cityId || 0,
      countryId: data.countryId || 0,
    };
    await apiClient.put('/profile/update-useraddress', payload);
  }

  async updateHealthInformation(userId: number, data: {
    height?: number;
    weight?: number;
    bloodType?: number;
    allergies?: string;
    drugs?: string;
  }): Promise<void> {
    const payload = {
      userId,
      height: data.height || 0,
      weight: data.weight || 0,
      bloodType: data.bloodType ?? 0,
      allergies: data.allergies || '',
      drugs: data.drugs || '',
    };
    await apiClient.put('/profile/update-userhealth', payload);
  }

  async updateMilitaryInformation(userId: number, data: {
    militaryStatus?: number;
    militaryPostpone?: string;
    militaryNote?: string;
  }): Promise<void> {
    const payload = {
      userId,
      militaryStatus: data.militaryStatus ?? 0,
      militaryPostpone: data.militaryPostpone || null,
      militaryNote: data.militaryNote || '',
    };
    await apiClient.put('/profile/update-usermilitary', payload);
  }

  async getCountries(): Promise<any[]> {
    const response = await apiClient.get<any>('/Profile/Countries');
    return response.data || [];
  }

  async getCities(countryId: number): Promise<any[]> {
    const response = await apiClient.get<any>(`/Profile/Cities/?CountryId=${countryId}`);
    return response.data || [];
  }

  async getBadgeCardInfo(userId: number): Promise<any> {
    const response = await apiClient.get<any>(`/user/badgecard-info?userId=${userId}`);
    return response.data || null;
  }
}

export const userService = new UserService();
