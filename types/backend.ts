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
  role?: string;
  position?: string;
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

export enum LeaveRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  notes?: string;
  status: LeaveRequestStatus;
  created_at: string;
  updated_at?: string;
}

export interface InboxMessage {
  id: string;
  user_id: string;
  sender_name: string;
  subject: string;
  message?: string;
  is_read: boolean;
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
  position?: string;
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

export interface OnboardingStep {
  id: string;
  title: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  is_required: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserOnboarding {
  id: string;
  user_id: string;
  welcome_package_sent: boolean;
  welcome_package_sent_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserOnboardingStep {
  id: string;
  user_onboarding_id: string;
  step_id: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  step?: OnboardingStep;
}

export interface UserOnboardingTask {
  id: string;
  user_onboarding_id: string;
  task_id: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  task?: OnboardingTask;
}

export interface UserOnboardingAnswer {
  id: string;
  user_onboarding_id: string;
  question_id: string;
  answer?: string;
  created_at: string;
  updated_at?: string;
  question?: OnboardingQuestion;
}

export enum AttendanceStatus {
  Normal = 'normal',
  Late = 'late',
  EarlyLeave = 'early_leave',
  Absent = 'absent',
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  work_duration: number;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
