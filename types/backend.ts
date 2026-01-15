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
  backend_user_id?: number;
  organization_id?: number;
  businessEmail?: string;
  tckn?: string;
  department?: string;
  reportsToId?: number;
  userStatus?: number;
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

export interface DayOffBalanceResponse {
  userId: number;
  dayOffType: number;
  remainingDays: number;
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

export interface DayOffRecord {
  userDayOffId: number;
  userId: number;
  dayOffType: number;
  startDate: string;
  endDate: string;
  countOfDays: number;
  requesterUserId: number;
  approverUserId: number | null;
  approverMemo: string | null;
  requestedDate: string;
  status: number;
  reason: string;
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
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  serialNo: string;
  description?: string;
  deliveryDate: string;
  returnDate?: string;
  fileUrl?: string;
  status: AssetStatus;
}

export interface AssetCategory {
  id: number;
  name: string;
  organizationId: number;
}

export interface BadgeCardInfo {
  firstName: string;
  lastName: string;
  title: string;
  fullName: string;
  profilePhoto: string;
  dayOffBalance: number;
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
  sender_photo?: string;
  subject: string;
  message?: string;
  title?: string;
  location?: string;
  document_date?: string;
  attachments?: InboxAttachment[];
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface InboxAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
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

export interface WelcomingPackageDefaultValues {
  departmentId: number;
  departmentName: string;
  positionId: number;
  positionName: string;
  managerUserId: number;
  managerUserName: string;
}

export interface OnboardingQuestionItem {
  id: number;
  question: string;
  answer: string;
  isRequired: boolean;
  order: number;
}

export interface UserOnboardingTaskItem {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  category?: string;
  assignedTo?: number;
  assignedToName?: string;
}

export interface OnboardingProcess {
  id: number;
  userId: number;
  welcomePackageSent: boolean;
  welcomePackageSentAt?: string;
  welcomePackageViewed: boolean;
  welcomePackageViewedAt?: string;
  employeeInfoFilled: boolean;
  employeeInfoFilledAt?: string;
  introQuestionsAnswered: boolean;
  introQuestionsAnsweredAt?: string;
  tasksCompleted: boolean;
  tasksCompletedAt?: string;
  currentStepNumber: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BadgeCardInfo {
  firstName: string;
  lastName: string;
  title: string;
  fullName: string;
  profilePhoto: string;
  dayOffBalance: number;
}

export interface DepartmentUser {
  id: number;
  tckn: string | null;
  firstName: string;
  lastName: string;
  reportsToTckn: string | null;
  reportsToFirstName: string | null;
  reportsToLastName: string | null;
  email: string;
  gender: string;
  phoneNumber: string | null;
  title: string | null;
  workPlace: string | null;
  userShiftPlan: string | null;
  role: string | null;
  loginLink: string | null;
}

export interface DepartmentGroup {
  departmentName: string;
  departmentId: number;
  departmentUserCount: number;
  users: DepartmentUser[];
}

export interface GroupedDepartmentUsers {
  totalUserCount: number;
  departmentUsers: DepartmentGroup[];
}

export interface WelcomePackageForm {
  email: string;
  startDate: string;
  arrivalTime: string;
  arrivalAddress: string;
  greeterUserId: number | null;
  managerId: number | null;
  otherInstructions: string;
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

export interface Country {
  name: string;
  areaCode: string | null;
  code: string | null;
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

export interface PersonalInformation {
  tckn: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  birthPlace: string;
  nationality: number;
  maritalStatus: number;
  gender: number;
  personnelNumber: string;
  jobStartDate: string;
  title: string | null;
  department: string | null;
  currentShiftHours: string;
  workPlace: string | null;
  workType: number;
}

export interface DriverLicense {
  id: number;
  userId: number;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
}

export interface Education {
  educationId: number;
  level: number;
  schoolName: string;
  department: string;
  gpa: number;
  gpaSystem: number;
  language: number;
  startDate: string;
  endDate: string;
}

export interface Certificate {
  id: number;
  userId: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface UserContact {
  email: string;
  phoneNumber: string;
  businessEmail: string;
  otherEmail: string;
  businessPhone: string;
  homePhone: string;
}

export interface UserAddress {
  userId: number;
  address: string;
  districtId: number | null;
  districtName: string | null;
  cityId: number | null;
  cityName: string | null;
  countryId: number | null;
  countryName: string | null;
}

export interface UserHealth {
  height: number;
  weight: number;
  size: number;
  bloodType: number;
  allergies: string;
  drugs: string;
}

export interface UserFamily {
  id: number;
  userId: number;
  relation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber?: string;
}

export interface UserMilitary {
  militaryStatus: number;
  militaryPostpone: string | null;
  militaryNote: string;
}

export interface UserLanguage {
  id: number;
  userId: number;
  language: string;
  level: number;
}

export interface UserPassport {
  passportType: number;
  passportValidityDate: string;
  passportNumber: string | null;
}

export interface UserVisa {
  id: number;
  userId: number;
  country: string;
  visaType: string;
  issueDate: string;
  expiryDate: string;
}

export interface ModulePermission {
  moduleId: number;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

export interface Colleague {
  profilePhoto: string;
  title: string | null;
  fullName: string;
  id: number;
}

export interface UserProfileDetails {
  id: number;
  profilePhoto: string;
  organizationId: number;
  organizationName: string;
  dayOffBalance: number;
  currentTitle: string | null;
  jobStartDate: string;
  department: string | null;
  currentShiftHours: string;
  personalInformation: PersonalInformation;
  driverLicenses: DriverLicense[];
  educations: Education[];
  certificates: Certificate[];
  socialMedia: SocialMedia | null;
  userContact: UserContact;
  userAddress: UserAddress;
  userHealth: UserHealth;
  userFamilies: UserFamily[];
  userMilitary: UserMilitary;
  userLanguages: UserLanguage[];
  userPassport: UserPassport;
  userVisas: UserVisa[];
  modulePermissions: ModulePermission[];
  reportsTo: any | null;
  colleagues: Colleague[];
  dayOffs: any[];
  userStatus: number;
}

export interface WorkingInformation {
  id: number;
  userId: number;
  fullname: string;
  personnelNumber: string;
  jobStartDate: string;
  workPlaceName: string | null;
  workType: number;
  workNotes: string;
  jobEndDate: string | null;
  reasonForLeaving: string | null;
  isCurrent: boolean;
}

export interface Position {
  id: number;
  userId: number;
  positionName: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface UserSalary {
  id: number;
  userId: number;
  salary: number;
  currency: string;
  effectiveDate: string;
}

export interface UserTitle {
  id: number;
  name: string;
  organizationId: number;
}

export interface ManagerUser {
  managerUserId: number;
  managerUserName: string;
  departmentId: number;
  departmentName: string;
}

export interface Department {
  id: number;
  name: string;
  organizationId: number;
  workPlaceId: number;
}

export interface Workplace {
  id: number;
  name: string;
  organizationId: number;
}

export interface City {
  name: string;
  plateNo: string;
  phoneCode: string;
  countryId: number;
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

export interface EmployeeWorker {
  id: number;
  name: string;
  position: string | null;
  startDate: string;
  endDate: string | null;
  workPlaceName: string;
  organizationName: string;
  status: string;
  profilePhoto: string;
}

export interface GroupedEmployees {
  key: string;
  workers: EmployeeWorker[];
}

export interface TreeEmployeeAttributes {
  title: string | null;
  team: string;
}

export interface TreeEmployee {
  name: string;
  position: string | null;
  startDate: string | null;
  organizationName: string | null;
  status: string | null;
  id: number;
  attributes: TreeEmployeeAttributes;
  profilePhoto: string;
  children: TreeEmployee[];
}
