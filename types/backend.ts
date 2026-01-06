export enum Gender {
  Male = 0,
  Female = 1,
}

export enum BloodType {
  APositive = 0,
  ANegative = 1,
  BPositive = 2,
  BNegative = 3,
  ABPositive = 4,
  ABNegative = 5,
  OPositive = 6,
  ONegative = 7,
}

export enum MaritalStatus {
  Single = 0,
  Married = 1,
  Divorced = 2,
  Widowed = 3,
}

export enum EducationLevel {
  PrimarySchool = 0,
  MiddleSchool = 1,
  HighSchool = 2,
  AssociateDegree = 3,
  BachelorDegree = 4,
  MasterDegree = 5,
  Doctorate = 6,
}

export enum MilitaryStatus {
  Completed = 0,
  Postponed = 1,
  Exempt = 2,
  NotApplicable = 3,
}

export enum DayOffType {
  Annual = 0,
  Sick = 1,
  Maternity = 2,
  Paternity = 3,
  Marriage = 4,
  Death = 5,
  Birthday = 6,
  Unpaid = 7,
  Other = 8,
}

export enum DayOffStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Cancelled = 3,
}

export enum RequestType {
  DayOff = 0,
  Advance = 1,
  Equipment = 2,
  Other = 3,
}

export enum RequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Cancelled = 3,
}

export enum WorkingType {
  Office = 0,
  Remote = 1,
  Hybrid = 2,
}

export enum ContractType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Internship = 3,
}

export enum AssetStatus {
  Active = 'active',
  Returned = 'returned',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  identityNumber?: string;
  birthDate?: string;
  gender?: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  educationLevel?: EducationLevel;
  militaryStatus?: MilitaryStatus;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserDayOffBalance {
  id: string;
  userId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserDayOff {
  id: string;
  userId: string;
  dayOffType: DayOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: DayOffStatus;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserEmployment {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  contractType: ContractType;
  workingType: WorkingType;
  salary?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserRequest {
  id: string;
  userId: string;
  requestType: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  requestedAmount?: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Asset {
  id: string;
  user_id: string;
  category: string;
  serial_no: string;
  description?: string;
  delivery_date: string;
  return_date?: string;
  file_url?: string;
  status: AssetStatus;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface RoleAuthorizationModule {
  id: string;
  role_id: string;
  module_id: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role_id?: string;
  full_name: string;
  created_at: string;
  updated_at?: string;
  role?: Role;
}

export interface ModulePermissions {
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface LoginResponse {
  id: number;
  email: string;
  token: string;
  tokenExpireTime: string;
  refreshToken: string;
  refreshTokenExpireTime: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePhoto: string;
  organizationId: number;
}

export interface ApiResponse<T> {
  data?: T;
  succeeded?: boolean;
  success?: boolean;
  friendlyMessage?: string;
  message?: string;
  errors?: string[] | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
