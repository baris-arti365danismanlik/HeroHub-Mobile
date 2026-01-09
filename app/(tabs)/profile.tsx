import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import * as DocumentPicker from 'expo-document-picker';
import { User as UserIcon, Phone, Mail, MapPin, Briefcase, GraduationCap, Heart, FileText, Award, Globe, Languages, CreditCard, LogOut, Menu, Building2, Users as Users2, DollarSign, Bell, MessageSquare, Package, Download, Pencil, Umbrella, ChevronDown, Folder, File, Search, Plus, Share2, ChevronRight, FolderOpen, Calendar, X, TextAlignJustify as AlignJustify, Linkedin, Facebook, Instagram, Clock, Smartphone, Check, Upload, Users, Link } from 'lucide-react-native';
import { Accordion } from '@/components/Accordion';
import { InfoRow } from '@/components/InfoRow';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { WorkInfoCard } from '@/components/WorkInfoCard';
import { FileActionDropdown } from '@/components/FileActionDropdown';
import { OnboardingDropdown } from '@/components/OnboardingDropdown';
import { assetService } from '@/services/asset.service';
import { leaveService } from '@/services/leave.service';
import { inboxService } from '@/services/inbox.service';
import { onboardingService } from '@/services/onboarding.service';
import { pdksService } from '@/services/pdks.service';
import { shiftService } from '@/services/shift.service';
import { userService } from '@/services/user.service';
import { employmentService } from '@/services/employment.service';
import PDKSTaskModal, { PDKSTaskData } from '@/components/PDKSTaskModal';
import {
  Asset,
  AssetStatus,
  AssetCategory,
  BadgeCardInfo,
  LeaveRequest,
  OnboardingStep,
  OnboardingTask,
  OnboardingQuestion,
  UserOnboarding,
  UserOnboardingStep,
  UserOnboardingTask,
  UserOnboardingAnswer,
  AttendanceRecord,
  UserProfileDetails,
  Country,
  ModulePermission,
  WorkingInformation,
  Position,
  UserSalary,
  UserTitle,
  ManagerUser,
  Department,
  Workplace,
  City,
} from '@/types/backend';
import { DrawerMenu } from '@/components/DrawerMenu';
import { InboxModal } from '@/components/InboxModal';
import { DatePicker } from '@/components/DatePicker';
import {
  formatGender,
  formatBloodType,
  formatMaritalStatus,
  formatDate,
  formatPhone
} from '@/utils/formatters';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Özet');
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
  const { canWrite, canDelete, isAdmin } = usePermissions(modulePermissions);
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [assetForm, setAssetForm] = useState({
    categoryId: 0,
    categoryName: '',
    serialNo: '',
    description: '',
    deliveryDate: '',
    returnDate: '',
  });
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [badgeCardInfo, setBadgeCardInfo] = useState<BadgeCardInfo | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [deliveryDatePickerVisible, setDeliveryDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [selectedYearAssets, setSelectedYearAssets] = useState('2024');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [visaModalVisible, setVisaModalVisible] = useState(false);
  const [visaForm, setVisaForm] = useState({
    visaType: 'Turist/Turizm Vizesi',
    country: 'Hollanda',
    entryDate: '',
    exitDate: '',
    notes: '',
  });
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [leaveSuccessModalVisible, setLeaveSuccessModalVisible] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Yıllık İzin',
    startDate: '',
    endDate: '',
    duration: 0.5,
    notes: '',
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [fileUploadModalVisible, setFileUploadModalVisible] = useState(false);
  const [fileShareModalVisible, setFileShareModalVisible] = useState(false);
  const [fileShareSuccessVisible, setFileShareSuccessVisible] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<any>(null);
  const [selectedFilesForShare, setSelectedFilesForShare] = useState<any[]>([]);
  const [selectedShareType, setSelectedShareType] = useState<'employees' | 'email' | 'link' | null>(null);
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    fileType: 'document',
    description: '',
  });
  const [dayOffBalance, setDayOffBalance] = useState<number>(0);
  const [incomingDayOffs, setIncomingDayOffs] = useState<any[]>([]);
  const [pastDayOffs, setPastDayOffs] = useState<any[]>([]);
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [inboxVisible, setInboxVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onboardingData, setOnboardingData] = useState<{
    userOnboarding: UserOnboarding | null;
    steps: OnboardingStep[];
    tasks: OnboardingTask[];
    questions: OnboardingQuestion[];
    userSteps: UserOnboardingStep[];
    userTasks: UserOnboardingTask[];
    userAnswers: UserOnboardingAnswer[];
  }>({
    userOnboarding: null,
    steps: [],
    tasks: [],
    questions: [],
    userSteps: [],
    userTasks: [],
    userAnswers: [],
  });
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [welcomePackageModalVisible, setWelcomePackageModalVisible] = useState(false);
  const [userWorkLogs, setUserWorkLogs] = useState<any[]>([]);
  const [userShiftPlan, setUserShiftPlan] = useState<any>(null);
  const [pdksLoading, setPdksLoading] = useState(false);
  const [pdksTaskModalVisible, setPdksTaskModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fileDropdownVisible, setFileDropdownVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
    type: 'folder' | 'file';
    position: { x: number; y: number };
  } | null>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const [employmentLoading, setEmploymentLoading] = useState(false);
  const [workingInformation, setWorkingInformation] = useState<WorkingInformation[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [userSalary, setUserSalary] = useState<UserSalary | null>(null);
  const [userTitles, setUserTitles] = useState<UserTitle[]>([]);
  const [managerUsers, setManagerUsers] = useState<ManagerUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [currentShiftPlan, setCurrentShiftPlan] = useState<any>(null);

  const [profileEditModalVisible, setProfileEditModalVisible] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    personnelNo: '1203354',
    identityNo: '',
    fullName: 'Selin Yeşilce',
    birthPlace: 'Balıkesir',
    birthDate: '12.10.1982',
    gender: 'Kadın',
    maritalStatus: 'Bekar',
  });

  const [contactEditModalVisible, setContactEditModalVisible] = useState(false);
  const [contactEditForm, setContactEditForm] = useState({
    internalPhone: '0 312 754 24 07',
    mobilePhone1: '0 532 754 24 07',
    mobilePhone2: '0 212 754 24 07',
    workEmail: 'selin.yesilce@gmail.com',
    otherEmail: 'yesilce@gmail.com',
  });

  const [addressEditModalVisible, setAddressEditModalVisible] = useState(false);
  const [addressEditForm, setAddressEditForm] = useState({
    neighborhood: 'Yaşadığı Evvel Mah. Mağ... Ne İle 33/2 P1/C 34870...',
    city: 'İstanbul',
    country: 'Türkiye',
  });


  const [healthEditModalVisible, setHealthEditModalVisible] = useState(false);
  const [healthEditForm, setHealthEditForm] = useState({
    bloodType: 'A Rh+',
    chronicDiseases: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [driverLicenseEditModalVisible, setDriverLicenseEditModalVisible] = useState(false);
  const [driverLicenseEditForm, setDriverLicenseEditForm] = useState({
    licenseType: 'B',
    licenseNo: '',
    issueDate: '',
    expiryDate: '',
  });

  const [militaryEditModalVisible, setMilitaryEditModalVisible] = useState(false);
  const [militaryEditForm, setMilitaryEditForm] = useState({
    status: 'Yapıldı',
    startDate: '',
    endDate: '',
    postponementReason: '',
  });

  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 2, 1));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const leaveTypes = ['Yıllık İzin', 'Doğum Günü İzni', 'Karne Günü İzni', 'Evlilik İzni', 'Ölüm İzni', 'Hastalık İzni'];
  const durations = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

  useEffect(() => {
    const fetchProfileData = async () => {
      console.log('User object:', user);
      console.log('Backend user ID:', user?.backend_user_id);

      if (!user?.backend_user_id) {
        console.warn('Backend user ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching profile for user ID:', user.backend_user_id);

        const [profile, countriesList] = await Promise.all([
          userService.getUserProfile(user.backend_user_id),
          userService.getCountries(),
        ]);

        console.log('Profile fetched:', profile);
        setProfileDetails(profile);
        setCountries(countriesList);
        setModulePermissions(profile.modulePermissions);

        loadShiftPlan();
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.backend_user_id]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (!user?.backend_user_id) {
        return;
      }

      try {
        setLeaveLoading(true);

        const [balance, incoming, past] = await Promise.all([
          leaveService.getDayOffBalance(user.backend_user_id),
          leaveService.getIncomingDayOffs(user.backend_user_id),
          leaveService.getPastDayOffs(user.backend_user_id),
        ]);

        setDayOffBalance(balance.remainingDays);
        setIncomingDayOffs(incoming);
        setPastDayOffs(past);
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLeaveLoading(false);
      }
    };

    if (selectedSection === 'İzin Bilgileri') {
      fetchLeaveData();
    }
  }, [user?.backend_user_id, selectedSection]);

  const hasModulePermission = (moduleId: number, permission: 'read' | 'write' | 'delete'): boolean => {
    const module = modulePermissions.find(m => m.moduleId === moduleId);
    if (!module) return false;

    switch (permission) {
      case 'read':
        return module.canRead;
      case 'write':
        return module.canWrite;
      case 'delete':
        return module.canDelete;
      default:
        return false;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleEdit = (section: string) => {
    switch (section) {
      case 'profile':
        setProfileEditModalVisible(true);
        break;
      case 'contact':
        setContactEditModalVisible(true);
        break;
      case 'address':
        setAddressEditModalVisible(true);
        break;
      case 'health':
        setHealthEditModalVisible(true);
        break;
      case 'driverLicense':
        setDriverLicenseEditModalVisible(true);
        break;
      case 'military':
        setMilitaryEditModalVisible(true);
        break;
      default:
        console.log('Edit section:', section);
    }
  };

  const handleFileRename = () => {
    if (selectedFile) {
      setRenameInput(selectedFile.name);
      setRenameModalVisible(true);
    }
  };

  const handleFileCopy = () => {
    if (selectedFile) {
      console.log('Copy file:', selectedFile.name);
    }
  };

  const handleFileDownload = () => {
    if (selectedFile) {
      console.log('Download file:', selectedFile.name);
    }
  };

  const handleFileDelete = () => {
    if (selectedFile) {
      console.log('Delete file:', selectedFile.name);
    }
  };

  const confirmRename = () => {
    if (selectedFile && renameInput.trim()) {
      console.log('Rename', selectedFile.name, 'to', renameInput);
      setRenameModalVisible(false);
      setRenameInput('');
      setSelectedFile(null);
    }
  };

  const saveProfileInfo = () => {
    console.log('Save profile info:', profileEditForm);
    setProfileEditModalVisible(false);
  };

  const saveContactInfo = () => {
    console.log('Save contact info:', contactEditForm);
    setContactEditModalVisible(false);
  };

  const saveAddressInfo = () => {
    console.log('Save address info:', addressEditForm);
    setAddressEditModalVisible(false);
  };

  const saveHealthInfo = () => {
    console.log('Save health info:', healthEditForm);
    setHealthEditModalVisible(false);
  };

  const saveDriverLicenseInfo = () => {
    console.log('Save driver license info:', driverLicenseEditForm);
    setDriverLicenseEditModalVisible(false);
  };

  const saveMilitaryInfo = () => {
    console.log('Save military info:', militaryEditForm);
    setMilitaryEditModalVisible(false);
  };

  const loadEmploymentData = async () => {
    if (!user?.backend_user_id) return;

    try {
      setEmploymentLoading(true);

      const [
        workingInfo,
        positionsData,
        salaryData,
        titlesData,
        managersData,
        departmentsData,
        workplacesData,
        citiesData,
      ] = await Promise.all([
        employmentService.getWorkingInformation(user.backend_user_id),
        employmentService.getPositions(user.backend_user_id),
        employmentService.getUserSalary(user.backend_user_id),
        employmentService.getUserTitles(),
        employmentService.getManagerUsers(),
        employmentService.getOrganizationDepartments(),
        employmentService.getWorkplaces(),
        employmentService.getCities(1),
      ]);

      setWorkingInformation(workingInfo);
      setPositions(positionsData);
      setUserSalary(salaryData);
      setUserTitles(titlesData);
      setManagerUsers(managersData);
      setDepartments(departmentsData);
      setWorkplaces(workplacesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading employment data:', error);
    } finally {
      setEmploymentLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAssets();
      loadLeaveRequests();
      loadUnreadCount();
      loadOnboardingData();
      loadPDKSData();
      loadAssetCategories();
    }
  }, [user?.id, selectedMonth, selectedYear]);

  useEffect(() => {
    if (user?.backend_user_id && selectedSection === 'Çalışma Bilgileri') {
      loadEmploymentData();
    }
  }, [user?.backend_user_id, selectedSection]);

  useEffect(() => {
    if (selectedSection === 'Zimmet Bilgileri') {
      loadAssets();
      loadAssetCategories();
      loadCountries();
      loadBadgeCardInfo();
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection === 'PDKS' && user?.backend_user_id) {
      loadPDKSData();
    }
  }, [selectedSection, user?.backend_user_id]);

  const loadUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const count = await inboxService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadAssets = async () => {
    if (!user?.backend_user_id) return;

    try {
      setAssetLoading(true);
      const data = await assetService.getUserAssets(Number(user.backend_user_id));
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setAssetLoading(false);
    }
  };

  const loadAssetCategories = async () => {
    try {
      const categories = await assetService.getAssetCategories();
      setAssetCategories(categories);
      if (categories.length > 0 && !assetForm.categoryId) {
        setAssetForm(prev => ({
          ...prev,
          categoryId: categories[0].id,
          categoryName: categories[0].name,
        }));
      }
    } catch (error) {
      console.error('Error loading asset categories:', error);
    }
  };

  const loadBadgeCardInfo = async () => {
    if (!user?.backend_user_id) return;

    try {
      const info = await assetService.getBadgeCardInfo(Number(user.backend_user_id));
      setBadgeCardInfo(info);
    } catch (error) {
      console.error('Error loading badge card info:', error);
    }
  };

  const loadCountries = async () => {
    try {
      const countriesData = await userService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const hasAssetPermission = (permission: 'read' | 'write' | 'delete'): boolean => {
    if (!profileDetails?.modulePermissions) return false;

    const assetModule = profileDetails.modulePermissions.find(
      (module) => module.moduleId === 8
    );

    if (!assetModule) return false;

    switch (permission) {
      case 'read':
        return assetModule.canRead;
      case 'write':
        return assetModule.canWrite;
      case 'delete':
        return assetModule.canDelete;
      default:
        return false;
    }
  };

  const hasDocumentPermission = (permission: 'read' | 'write' | 'delete'): boolean => {
    if (!profileDetails?.modulePermissions) return false;

    const profileModule = profileDetails.modulePermissions.find(
      (module) => module.moduleId === 2
    );

    if (!profileModule) return false;

    switch (permission) {
      case 'read':
        return profileModule.canRead;
      case 'write':
        return profileModule.canWrite;
      case 'delete':
        return profileModule.canDelete;
      default:
        return false;
    }
  };

  const hasPDKSPermission = (permission: 'read' | 'write' | 'delete'): boolean => {
    if (!profileDetails?.modulePermissions) return false;

    const pdksModule = profileDetails.modulePermissions.find(
      (module) => module.moduleId === 3
    );

    if (!pdksModule) return false;

    switch (permission) {
      case 'read':
        return pdksModule.canRead;
      case 'write':
        return pdksModule.canWrite;
      case 'delete':
        return pdksModule.canDelete;
      default:
        return false;
    }
  };

  const loadLeaveRequests = async () => {
    if (!user?.id) return;

    try {
      setLeaveLoading(true);
      const data = await leaveService.getPendingLeaveRequests(user.id);
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setLeaveLoading(false);
    }
  };

  const loadOnboardingData = async () => {
    if (!user?.id) return;

    try {
      setOnboardingLoading(true);

      const [steps, tasks, questions] = await Promise.all([
        onboardingService.getSteps(),
        onboardingService.getTasks(),
        onboardingService.getQuestions(),
      ]);

      let userOnboarding = await onboardingService.getUserOnboarding(user.id);

      if (!userOnboarding) {
        userOnboarding = await onboardingService.createUserOnboarding(user.id);
      }

      const [userSteps, userTasks, userAnswers] = await Promise.all([
        onboardingService.getUserSteps(userOnboarding.id),
        onboardingService.getUserTasks(userOnboarding.id),
        onboardingService.getUserAnswers(userOnboarding.id),
      ]);

      if (userSteps.length === 0) {
        await onboardingService.initializeUserSteps(userOnboarding.id, steps);
      }

      if (userTasks.length === 0) {
        await onboardingService.initializeUserTasks(userOnboarding.id, tasks);
      }

      const refreshedUserSteps = userSteps.length === 0
        ? await onboardingService.getUserSteps(userOnboarding.id)
        : userSteps;

      const refreshedUserTasks = userTasks.length === 0
        ? await onboardingService.getUserTasks(userOnboarding.id)
        : userTasks;

      const answersMap: Record<string, string> = {};
      userAnswers.forEach((answer) => {
        if (answer.answer) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      setAnswerInputs(answersMap);

      setOnboardingData({
        userOnboarding,
        steps,
        tasks,
        questions,
        userSteps: refreshedUserSteps,
        userTasks: refreshedUserTasks,
        userAnswers,
      });
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleSubmitLeaveRequest = async () => {
    if (!user?.id || !leaveForm.startDate || !leaveForm.endDate) {
      return;
    }

    try {
      setLeaveLoading(true);

      await leaveService.createLeaveRequest({
        user_id: user.id,
        leave_type: leaveForm.leaveType,
        start_date: leaveForm.startDate,
        end_date: leaveForm.endDate,
        duration: leaveForm.duration,
        notes: leaveForm.notes,
      });

      setLeaveForm({
        leaveType: 'Yıllık İzin',
        startDate: '',
        endDate: '',
        duration: 0.5,
        notes: '',
      });

      setLeaveModalVisible(false);
      setLeaveSuccessModalVisible(true);

      await loadLeaveRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error);
    } finally {
      setLeaveLoading(false);
    }
  };

  const formatDateForBackend = (dateStr: string): string => {
    if (!dateStr) return '';

    const parts = dateStr.split('/').map(p => p.trim());
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };

  const handleAddAsset = async () => {
    console.log('=== handleAddAsset START ===');
    console.log('hasAssetPermission(write):', hasAssetPermission('write'));
    console.log('user?.backend_user_id:', user?.backend_user_id);
    console.log('assetForm:', assetForm);
    console.log('profileDetails?.modulePermissions:', profileDetails?.modulePermissions);

    if (!hasAssetPermission('write')) {
      console.error('No permission to add asset');
      return;
    }

    if (!user?.backend_user_id) {
      console.error('Missing user.backend_user_id');
      return;
    }

    if (!assetForm.categoryId) {
      console.error('Missing categoryId');
      return;
    }

    if (!assetForm.serialNo || assetForm.serialNo.trim() === '') {
      console.error('Missing serialNo');
      return;
    }

    if (!assetForm.deliveryDate) {
      console.error('Missing deliveryDate');
      return;
    }

    try {
      setAssetLoading(true);
      console.log('Loading started...');

      const formattedDeliveryDate = formatDateForBackend(assetForm.deliveryDate);
      console.log('formattedDeliveryDate:', formattedDeliveryDate);

      const payload = {
        userId: Number(user.backend_user_id),
        categoryId: assetForm.categoryId,
        serialNo: assetForm.serialNo.trim(),
        description: assetForm.description?.trim() || '',
        deliveryDate: formattedDeliveryDate,
      };

      console.log('Payload to send:', payload);

      const result = await assetService.createAsset(payload);
      console.log('Create result:', result);

      if (result) {
        console.log('Asset created successfully, resetting form...');
        setAssetForm({
          categoryId: assetCategories.length > 0 ? assetCategories[0].id : 0,
          categoryName: assetCategories.length > 0 ? assetCategories[0].name : '',
          serialNo: '',
          description: '',
          deliveryDate: '',
          returnDate: '',
        });

        setCategoryDropdownOpen(false);
        setAssetModalVisible(false);
        console.log('Reloading assets...');
        await loadAssets();
        console.log('Assets reloaded');
      } else {
        console.error('Create asset returned null/undefined');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      setAssetLoading(false);
      console.log('=== handleAddAsset END ===');
    }
  };

  const handlePickDocument = async () => {
    if (!hasDocumentPermission('write')) {
      console.error('No permission to upload documents');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFileForUpload(file);
        setUploadForm({
          ...uploadForm,
          fileName: file.name || 'Untitled',
          fileType: file.mimeType || 'document',
        });
        console.log('File selected:', file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleUploadFile = async () => {
    if (!hasDocumentPermission('write')) {
      console.error('No permission to upload documents');
      return;
    }

    if (!selectedFileForUpload || !uploadForm.fileName.trim()) {
      console.error('No file selected or filename missing');
      return;
    }

    try {
      console.log('Uploading file:', {
        file: selectedFileForUpload,
        form: uploadForm,
      });

      setFileUploadModalVisible(false);
      setSelectedFileForUpload(null);
      setUploadForm({ fileName: '', fileType: 'document', description: '' });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSelectFileForShare = (file: any) => {
    if (!hasDocumentPermission('read')) {
      console.error('No permission to share documents');
      return;
    }

    const isSelected = selectedFilesForShare.some(f => f.id === file.id);

    if (isSelected) {
      setSelectedFilesForShare(selectedFilesForShare.filter(f => f.id !== file.id));
    } else {
      setSelectedFilesForShare([...selectedFilesForShare, file]);
    }
  };

  const handleShareFiles = async () => {
    if (!hasDocumentPermission('read')) {
      console.error('No permission to share documents');
      return;
    }

    if (selectedFilesForShare.length === 0) {
      console.error('No files selected for sharing');
      return;
    }

    if (!selectedShareType) {
      console.error('No share type selected');
      return;
    }

    try {
      console.log('Sharing files:', {
        files: selectedFilesForShare,
        shareType: selectedShareType,
      });

      setFileShareModalVisible(false);
      setFileShareSuccessVisible(true);

      setTimeout(() => {
        setSelectedFilesForShare([]);
        setSelectedShareType(null);
      }, 500);
    } catch (error) {
      console.error('Error sharing files:', error);
    }
  };

  const handleSendWelcomePackage = async () => {
    if (!onboardingData.userOnboarding) return;

    try {
      await onboardingService.updateWelcomePackage(onboardingData.userOnboarding.id, true);
      setWelcomePackageModalVisible(false);
      await loadOnboardingData();
    } catch (error) {
      console.error('Error sending welcome package:', error);
    }
  };

  const handleOpenWelcomePackageModal = () => {
    setWelcomePackageModalVisible(true);
  };

  const loadShiftPlan = async () => {
    if (!user?.backend_user_id) return;

    try {
      const shiftPlan = await shiftService.getUserShiftPlan(Number(user.backend_user_id));
      setCurrentShiftPlan(shiftPlan);
    } catch (error) {
      console.error('Error loading shift plan:', error);
    }
  };

  const handleCompleteTask = async (userTaskId: string) => {
    try {
      await onboardingService.completeTask(userTaskId);
      await loadOnboardingData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleSaveAnswer = async (questionId: string, answer: string) => {
    if (!onboardingData.userOnboarding) return;

    try {
      await onboardingService.saveAnswer(onboardingData.userOnboarding.id, questionId, answer);
      setAnswerInputs((prev) => ({ ...prev, [questionId]: answer }));
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const loadPDKSData = async () => {
    if (!user?.backend_user_id) return;

    try {
      setPdksLoading(true);

      const [workLogs, shiftPlan] = await Promise.all([
        pdksService.getUserWorkLog(Number(user.backend_user_id)),
        shiftService.getUserShiftPlan(Number(user.backend_user_id)),
      ]);

      console.log('Work logs:', workLogs);
      console.log('Shift plan:', shiftPlan);

      setUserWorkLogs(workLogs);
      setUserShiftPlan(shiftPlan);
    } catch (error) {
      console.error('Error loading PDKS data:', error);
    } finally {
      setPdksLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.id) return;

    try {
      await pdksService.checkIn(user.id);
      await loadPDKSData();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.id) return;

    try {
      await pdksService.checkOut(user.id);
      await loadPDKSData();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const handleCreatePDKSTask = async (taskData: PDKSTaskData) => {
    if (!user?.backend_user_id) return;

    try {
      await pdksService.createTask({
        ...taskData,
        assignedUserId: Number(user.backend_user_id),
      });
      await loadPDKSData();
    } catch (error) {
      console.error('Error creating PDKS task:', error);
      throw error;
    }
  };

  const getOnboardingModalData = () => {
    const categoryMap = new Map<string, any>();

    onboardingData.tasks.forEach((task) => {
      const category = task.category || 'Diğer';
      const userTask = onboardingData.userTasks.find((ut) => ut.task_id === task.id);
      const isCompleted = userTask?.is_completed || false;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          id: category,
          name: category,
          tasks: [],
          isExpanded: true,
        });
      }

      categoryMap.get(category).tasks.push({
        id: task.id,
        title: task.title,
        assignedTo: task.assigned_to || '-',
        dueDate: task.due_date || new Date().toISOString(),
        isCompleted,
        userTaskId: userTask?.id,
      });
    });

    return Array.from(categoryMap.values());
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const profileSections = [
    'Özet',
    'İşe Başlama',
    'PDKS',
    'İzin Bilgileri',
    'Çalışma Bilgileri',
    'Profil Bilgileri',
    ...(hasAssetPermission('read') ? ['Zimmet Bilgileri'] : []),
    'Dosyalar',
  ];

  const renderDayOffSection = () => (
    <>
      <Accordion
        title="İZİN BİLGİLERİ"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={false}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YILLIK İZİN</Text>
          <Text style={styles.balanceValue}>{dayOffBalance} Gün</Text>
        </View>

        <TouchableOpacity
          style={styles.leaveRequestButton}
          onPress={() => setLeaveModalVisible(true)}
        >
          <Text style={styles.leaveRequestButtonText}>İzin Talebi Gir</Text>
        </TouchableOpacity>
      </Accordion>

      <Accordion
        title="PLANLANAN İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={false}
      >
        {leaveLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C3AED" />
          </View>
        ) : incomingDayOffs.length > 0 ? (
          incomingDayOffs.map((request) => {
            const getLeaveColor = (type: number) => {
              if (type === 1) return '#7C3AED';
              if (type === 6) return '#F59E0B';
              return '#10B981';
            };

            const getLeaveTypeName = (type: number) => {
              const types: Record<number, string> = {
                1: 'Yıllık İzin',
                2: 'Hastalık İzni',
                3: 'Doğum İzni',
                4: 'Babalık İzni',
                5: 'Evlilik İzni',
                6: 'Ölüm İzni',
                7: 'Doğum Günü İzni',
                8: 'Ücretsiz İzin',
              };
              return types[type] || 'Diğer';
            };

            const formatLeaveDate = (dateStr: string) => {
              const date = new Date(dateStr);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
              const dayName = days[date.getDay()];
              return `${day}.${month}.${year} ${dayName}`;
            };

            return (
              <View key={request.userDayOffId} style={styles.dayOffItem}>
                <View
                  style={[
                    styles.dayOffLeftBorder,
                    { backgroundColor: getLeaveColor(request.dayOffType) },
                  ]}
                />
                <View style={styles.dayOffContent}>
                  <View style={styles.dayOffHeader}>
                    <View style={styles.dayOffTitleRow}>
                      <Umbrella size={16} color="#666" />
                      <Text style={styles.dayOffType}>{getLeaveTypeName(request.dayOffType)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log('Edit', request.userDayOffId)}>
                      <Pencil size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayOffDays}>
                    <Text style={styles.dayOffDaysText}>{request.countOfDays} Gün</Text>
                  </View>
                  <View style={styles.dayOffDates}>
                    <Text style={styles.dayOffDateText}>
                      {formatLeaveDate(request.startDate)}
                    </Text>
                    <Text style={styles.dayOffDateText}>
                      {formatLeaveDate(request.endDate)}
                    </Text>
                  </View>
                  {request.reason && (
                    <Text style={styles.dayOffReason}>{request.reason}</Text>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Planlanan izin bulunmuyor</Text>
          </View>
        )}
      </Accordion>

      <Accordion
        title="GEÇMİŞ İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={false}
      >
        {leaveLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C3AED" />
          </View>
        ) : pastDayOffs.length > 0 ? (
          pastDayOffs.map((request) => {
            const getLeaveColor = (status: number) => {
              if (status === 1) return '#10B981';
              if (status === 2) return '#EF4444';
              return '#F59E0B';
            };

            const getLeaveTypeName = (type: number) => {
              const types: Record<number, string> = {
                1: 'Yıllık İzin',
                2: 'Hastalık İzni',
                3: 'Doğum İzni',
                4: 'Babalık İzni',
                5: 'Evlilik İzni',
                6: 'Ölüm İzni',
                7: 'Doğum Günü İzni',
                8: 'Ücretsiz İzin',
              };
              return types[type] || 'Diğer';
            };

            const formatLeaveDate = (dateStr: string) => {
              const date = new Date(dateStr);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
              const dayName = days[date.getDay()];
              return `${day}.${month}.${year} ${dayName}`;
            };

            const statusColor = getLeaveColor(request.status);

            return (
              <View key={request.userDayOffId} style={styles.dayOffItem}>
                <View
                  style={[
                    styles.dayOffLeftBorder,
                    { backgroundColor: statusColor },
                  ]}
                />
                <View style={styles.dayOffContent}>
                  <View style={styles.dayOffHeader}>
                    <View style={styles.dayOffTitleRow}>
                      <Umbrella size={16} color="#666" />
                      <Text style={styles.dayOffType}>{getLeaveTypeName(request.dayOffType)}</Text>
                    </View>
                  </View>
                  <View style={styles.dayOffDays}>
                    <Text style={[styles.dayOffDaysText, { color: statusColor }]}>
                      {request.status === 1 ? '+' : ''}{request.countOfDays} Gün
                    </Text>
                  </View>
                  <View style={styles.dayOffDates}>
                    <Text style={styles.dayOffDateText}>
                      {formatLeaveDate(request.startDate)}
                    </Text>
                    <Text style={styles.dayOffDateText}>
                      {formatLeaveDate(request.endDate)}
                    </Text>
                  </View>
                  {request.reason && (
                    <Text style={styles.dayOffReason}>{request.reason}</Text>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Geçmiş izin bulunmuyor</Text>
          </View>
        )}
      </Accordion>
    </>
  );

  const getWorkTypeName = (workType: number) => {
    const types: Record<number, string> = {
      0: 'Ofis',
      1: 'Uzaktan',
      2: 'Hibrit',
    };
    return types[workType] || 'Bilinmiyor';
  };

  const renderWorkInfoSection = () => {
    const currentWorkInfo = workingInformation.find(w => w.isCurrent);
    const currentPositions = positions.filter(p => p.isCurrent);
    const pastPositions = positions.filter(p => !p.isCurrent);

    return (
      <>
        <Accordion
          title="ÇALIŞAN BİLGİLERİ"
          icon={<UserIcon size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {employmentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          ) : currentWorkInfo ? (
            <>
              <InfoRow
                label="Personel No"
                value={currentWorkInfo.personnelNumber}
              />
              <InfoRow
                label="İşe Giriş Tarihi"
                value={formatDate(currentWorkInfo.jobStartDate)}
              />
              <InfoRow
                label="Çalışma Şekli"
                value={getWorkTypeName(currentWorkInfo.workType)}
              />
              {currentWorkInfo.workNotes && (
                <InfoRow
                  label="Notlar"
                  value={currentWorkInfo.workNotes}
                  isLast
                />
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Çalışan bilgisi bulunmuyor</Text>
            </View>
          )}
        </Accordion>

        <Accordion
          title="POZİSYON BİLGİLERİ"
          icon={<Briefcase size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {employmentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          ) : positions.length > 0 ? (
            <>
              {currentPositions.map((position) => (
                <WorkInfoCard
                  key={position.id}
                  title={position.positionName}
                  details={[
                    { label: 'Başlangıç', value: formatDate(position.startDate) },
                  ]}
                  onEdit={() => handleEdit('position-current')}
                />
              ))}
              {pastPositions.map((position) => (
                <WorkInfoCard
                  key={position.id}
                  title={position.positionName}
                  details={[
                    { label: 'Başlangıç', value: formatDate(position.startDate) },
                    { label: 'Bitiş', value: formatDate(position.endDate || '') },
                  ]}
                  onEdit={() => handleEdit('position-past')}
                  isPast
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Pozisyon bilgisi bulunmuyor</Text>
            </View>
          )}
        </Accordion>

        <Accordion
          title="MAAŞ BİLGİLERİ"
          icon={<DollarSign size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {employmentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          ) : userSalary ? (
            <WorkInfoCard
              title={`${userSalary.salary.toLocaleString('tr-TR')} ${userSalary.currency}`}
              details={[
                { label: 'Geçerlilik Tarihi', value: formatDate(userSalary.effectiveDate) },
              ]}
              onEdit={() => handleEdit('salary-current')}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Maaş bilgisi bulunmuyor</Text>
            </View>
          )}
        </Accordion>
      </>
    );
  };

  const calculateWorkDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    return `${years} yıl ${months} ay ${days} gün`;
  };

  const renderSummarySection = () => (
    <>
      <View style={styles.assetUserCard}>
        {user.profilePictureUrl ? (
          <Image
            source={{ uri: user.profilePictureUrl }}
            style={styles.assetUserImage}
          />
        ) : (
          <View style={styles.assetUserPlaceholder}>
            <UserIcon size={32} color="#7C3AED" />
          </View>
        )}
        <View style={styles.assetUserInfo}>
          <Text style={styles.assetUserName}>
            {user.firstName} {user.lastName}
          </Text>
          {profileDetails?.currentTitle && (
            <View style={styles.assetUserDetail}>
              <Briefcase size={14} color="#666" />
              <Text style={styles.assetUserDetailText}>{profileDetails.currentTitle}</Text>
            </View>
          )}
          <View style={styles.assetUserDetail}>
            <Building2 size={14} color="#666" />
            <Text style={styles.assetUserDetailText}>Art365 Danışmanlık</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
          <View style={styles.contactItem}>
            <Phone size={20} color="#333" />
            <Text style={styles.contactText}>+90 530 234 76 54</Text>
          </View>

          <View style={styles.contactItem}>
            <Smartphone size={20} color="#333" />
            <Text style={styles.contactText}>+90 530 234 76 54</Text>
          </View>

          <View style={styles.contactItem}>
            <Mail size={20} color="#333" />
            <Text style={styles.contactText}>{user.email}</Text>
          </View>

          <View style={styles.socialMediaContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Linkedin size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Facebook size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Instagram size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.workInfoSection}>
            <Text style={styles.workInfoTitle}>İşe Başlama Tarihi</Text>
            <Text style={styles.workInfoDate}>10 Eylül 2021</Text>
            <Text style={styles.workInfoDuration}>3 yıl 2 ay 6 gün</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.summaryDetailItem}>
            <Briefcase size={20} color="#333" />
            <Text style={styles.summaryDetailText}>
              {profileDetails?.currentTitle || 'Management Trainee'}
            </Text>
          </View>

          <View style={styles.summaryDetailItem}>
            <Building2 size={20} color="#333" />
            <Text style={styles.summaryDetailText}>Art365 Danışmanlık</Text>
          </View>

          <View style={styles.summaryDetailItem}>
            <Clock size={20} color="#333" />
            <Text style={styles.summaryDetailText}>Tam Zamanlı</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.managerSection}>
            <Text style={styles.sectionTitle}>Yöneticisi</Text>
            <View style={styles.personItem}>
              <View style={styles.personAvatar}>
                <UserIcon size={20} color="#7C3AED" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>Gözde Onay</Text>
                <Text style={styles.personRole}>Pazarlama ve Ürün Direktörü</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>Ekip Arkadaşları</Text>
            {[
              { name: 'Justin Press', role: 'Ürün Uzmanı' },
              { name: 'Gretchen Vaccaro', role: 'İş Analisti' },
              { name: 'Jaylon Rosser', role: 'Ürün Müdürü' },
              { name: 'Tatiana Curtis', role: 'Pazarlama Elemanı' },
              { name: 'Jaydon Dorwart', role: 'Tedarikçi' },
            ].map((member, index, array) => (
              <View key={index} style={[styles.personItem, index === array.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.personAvatar}>
                  <UserIcon size={20} color="#7C3AED" />
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{member.name}</Text>
                  <Text style={styles.personRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
    </>
  );

  const renderAssetsSection = () => {
    if (!hasAssetPermission('read')) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Bu bölümü görüntüleme izniniz bulunmamaktadır.</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.assetUserCard}>
          {user.profilePictureUrl ? (
            <Image
              source={{ uri: user.profilePictureUrl }}
              style={styles.assetUserImage}
            />
          ) : (
            <View style={styles.assetUserPlaceholder}>
              <UserIcon size={32} color="#7C3AED" />
            </View>
          )}
          <View style={styles.assetUserInfo}>
            <Text style={styles.assetUserName}>
              {user.firstName} {user.lastName}
            </Text>
            {profileDetails?.currentTitle && (
              <View style={styles.assetUserDetail}>
                <Briefcase size={14} color="#666" />
                <Text style={styles.assetUserDetailText}>{profileDetails.currentTitle}</Text>
              </View>
            )}
            <View style={styles.assetUserDetail}>
              <Building2 size={14} color="#666" />
              <Text style={styles.assetUserDetailText}>Art365 Danışmanlık</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <AlignJustify size={18} color="#1a1a1a" />
          <Text style={styles.sectionHeaderTitle}>ZİMMET BİLGİLERİ</Text>
        </View>

      <View style={styles.actionButtons}>
          {hasAssetPermission('read') && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => console.log('Download report')}
            >
              <Download size={18} color="#7C3AED" />
              <Text style={styles.downloadButtonText}>Zimmet Raporu İndir</Text>
            </TouchableOpacity>
          )}

          {hasAssetPermission('write') && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                console.log('Zimmet Ekle button clicked');
                console.log('assetCategories:', assetCategories);
                setAssetForm({
                  categoryId: assetCategories.length > 0 ? assetCategories[0].id : 0,
                  categoryName: assetCategories.length > 0 ? assetCategories[0].name : '',
                  serialNo: '',
                  description: '',
                  deliveryDate: '',
                  returnDate: '',
                });
                setCategoryDropdownOpen(false);
                loadBadgeCardInfo();
                setAssetModalVisible(true);
                console.log('Modal should be visible now');
              }}
            >
              <Text style={styles.addButtonText}>Zimmet Ekle</Text>
            </TouchableOpacity>
          )}
        </View>

        {assetLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C3AED" />
          </View>
        ) : assets.length > 0 ? (
          assets.map((asset) => (
            <View
              key={asset.id}
              style={[
                styles.assetCardNew,
                asset.status === AssetStatus.Returned && styles.assetCardInactive,
              ]}
            >
              <View style={styles.assetCardNewHeader}>
                <Text
                  style={[
                    styles.assetCardNewTitle,
                    asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                  ]}
                >
                  {asset.categoryName}
                </Text>
                {hasAssetPermission('write') && (
                  <TouchableOpacity
                    style={styles.assetEditButton}
                    onPress={() => handleEdit(`asset-${asset.id}`)}
                  >
                    <Pencil
                      size={18}
                      color={asset.status === AssetStatus.Returned ? '#CCC' : '#666'}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.assetCardBody}>
                {asset.description && (
                  <View style={styles.assetInfoRow}>
                    <Text style={styles.assetInfoLabel}>Açıklama</Text>
                    <Text
                      style={[
                        styles.assetInfoValue,
                        asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                      ]}
                    >
                      {asset.description}
                    </Text>
                  </View>
                )}

                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Seri No</Text>
                  <Text
                    style={[
                      styles.assetInfoValue,
                      asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                    ]}
                  >
                    {asset.serialNo}
                  </Text>
                </View>

                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Teslim Tarihi</Text>
                  <Text
                    style={[
                      styles.assetInfoValue,
                      asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                    ]}
                  >
                    {new Date(asset.deliveryDate).toLocaleDateString('tr-TR')}
                  </Text>
                </View>

                {asset.returnDate && (
                  <View style={styles.assetInfoRow}>
                    <Text style={styles.assetInfoLabel}>İade Tarihi</Text>
                    <Text style={[styles.assetInfoValue, styles.assetCardInactiveText]}>
                      {new Date(asset.returnDate).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Henüz zimmet kaydı bulunmuyor</Text>
          </View>
        )}
      </>
    );
  };

  const renderProfileInfoSection = () => {
    if (!profileDetails) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Profil bilgileri yükleniyor...</Text>
        </View>
      );
    }

    const { personalInformation, userContact, userAddress, userHealth, driverLicenses, userMilitary } = profileDetails;
    const canEditProfile = hasModulePermission(1, 'write');

    return (
      <>
        <Accordion
          title="PROFİL BİLGİLERİ"
          icon={<UserIcon size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('profile') : undefined}
        >
          <InfoRow label="Personel No" value={personalInformation?.personnelNumber || '-'} />
          <InfoRow label="TCKN" value={personalInformation?.tckn || '-'} />
          <InfoRow label="Adı Soyadı" value={personalInformation ? `${personalInformation.firstName} ${personalInformation.lastName}` : '-'} />
          <InfoRow label="Doğum Yeri" value={personalInformation?.birthPlace || '-'} />
          <InfoRow label="Doğum Tarihi" value={personalInformation?.birthdate ? formatDate(personalInformation.birthdate) : '-'} />
          <InfoRow label="Cinsiyet" value={personalInformation?.gender !== undefined ? formatGender(personalInformation.gender) : '-'} />
          <InfoRow label="Medeni Hal" value={personalInformation?.maritalStatus !== undefined ? formatMaritalStatus(personalInformation.maritalStatus) : '-'} isLast />
        </Accordion>

        <Accordion
          title="İLETİŞİM BİLGİLERİ"
          icon={<Phone size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('contact') : undefined}
        >
          <InfoRow label="Cep Telefonu" value={userContact?.phoneNumber ? formatPhone(userContact.phoneNumber) : '-'} />
          <InfoRow label="Ev Telefonu" value={userContact?.homePhone ? formatPhone(userContact.homePhone) : '-'} />
          <InfoRow label="İş Telefonu" value={userContact?.businessPhone ? formatPhone(userContact.businessPhone) : '-'} />
          <InfoRow label="E-Posta" value={userContact?.email || '-'} />
          <InfoRow label="İş E-Posta" value={userContact?.businessEmail || '-'} />
          <InfoRow label="Diğer E-Posta" value={userContact?.otherEmail || '-'} isLast />
        </Accordion>

        <Accordion
          title="ADRES BİLGİLERİ"
          icon={<MapPin size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('address') : undefined}
        >
          <InfoRow label="Adres" value={userAddress?.address || '-'} />
          <InfoRow label="İlçe" value={userAddress?.districtName || '-'} />
          <InfoRow label="İl" value={userAddress?.cityName || '-'} />
          <InfoRow label="Ülke" value={userAddress?.countryName || '-'} isLast />
        </Accordion>

        <Accordion
          title="SAĞLIK BİLGİLERİ"
          icon={<Heart size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('health') : undefined}
        >
          <InfoRow label="Kan Grubu" value={userHealth?.bloodType ? formatBloodType(userHealth.bloodType) : '-'} />
          <InfoRow label="Boy (cm)" value={userHealth?.height && userHealth.height > 0 ? userHealth.height.toString() : '-'} />
          <InfoRow label="Kilo (kg)" value={userHealth?.weight && userHealth.weight > 0 ? userHealth.weight.toString() : '-'} />
          <InfoRow label="Alerjiler" value={userHealth?.allergies || '-'} />
          <InfoRow label="Kullanılan İlaçlar" value={userHealth?.drugs || '-'} isLast />
        </Accordion>

        <Accordion
          title="EHLİYET BİLGİLERİ"
          icon={<CreditCard size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('driverLicense') : undefined}
        >
          {driverLicenses.length > 0 ? (
            driverLicenses.map((license, index) => (
              <View key={license.id}>
                <InfoRow label="Ehliyet Tipi" value={license.licenseType || '-'} />
                <InfoRow label="Ehliyet No" value={license.licenseNumber || '-'} />
                <InfoRow label="Veriliş Tarihi" value={formatDate(license.issueDate)} />
                <InfoRow label="Son Geçerlilik Tarihi" value={formatDate(license.expiryDate)} isLast={index === driverLicenses.length - 1} />
              </View>
            ))
          ) : (
            <InfoRow label="Ehliyet" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="ASKERLİK BİLGİLERİ"
          icon={<Award size={18} color="#7C3AED" />}
          defaultExpanded={false}
          onEdit={canEditProfile ? () => handleEdit('military') : undefined}
        >
          <InfoRow
            label="Durum"
            value={userMilitary?.militaryStatus === 0 ? 'Yapıldı' : userMilitary?.militaryStatus === 1 ? 'Ertelendi' : userMilitary?.militaryStatus === 2 ? 'Muaf' : 'Uygulanmaz'}
          />
          <InfoRow label="Erteleme Nedeni" value={userMilitary?.militaryPostpone || '-'} />
          <InfoRow label="Not" value={userMilitary?.militaryNote || '-'} isLast />
        </Accordion>

        <Accordion
          title="AİLE BİLGİLERİ"
          icon={<Users2 size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.userFamilies.length > 0 ? (
            profileDetails.userFamilies.map((family, index) => (
              <View key={family.id}>
                <InfoRow label="Ad Soyad" value={`${family.firstName} ${family.lastName}`} />
                <InfoRow label="Yakınlık" value={family.relation || '-'} />
                <InfoRow label="Doğum Tarihi" value={formatDate(family.birthDate)} />
                <InfoRow label="Telefon" value={formatPhone(family.phoneNumber) || '-'} isLast={index === profileDetails.userFamilies.length - 1} />
              </View>
            ))
          ) : (
            <InfoRow label="Aile Üyesi" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="EĞİTİM BİLGİLERİ"
          icon={<GraduationCap size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.educations.length > 0 ? (
            profileDetails.educations.map((education, index) => (
              <WorkInfoCard
                key={education.educationId}
                title={`${index + 1}. Eğitim`}
                details={[
                  { label: 'Okul', value: education.schoolName },
                  { label: 'Bölüm', value: education.department },
                  { label: 'Başlangıç', value: formatDate(education.startDate) },
                  { label: 'Bitiş', value: formatDate(education.endDate) },
                  { label: 'Not Ortalaması', value: `${education.gpa}/${education.gpaSystem}` },
                ]}
              />
            ))
          ) : (
            <InfoRow label="Eğitim" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="SOSYAL LİNKLER"
          icon={<Globe size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.socialMedia ? (
            <>
              <InfoRow label="LinkedIn" value={profileDetails.socialMedia.linkedin || '-'} />
              <InfoRow label="Twitter" value={profileDetails.socialMedia.twitter || '-'} />
              <InfoRow label="Facebook" value={profileDetails.socialMedia.facebook || '-'} />
              <InfoRow label="Instagram" value={profileDetails.socialMedia.instagram || '-'} isLast />
            </>
          ) : (
            <InfoRow label="Sosyal Medya" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="DİL BİLGİLERİ"
          icon={<Languages size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.userLanguages.length > 0 ? (
            profileDetails.userLanguages.map((lang, index) => (
              <View key={lang.id}>
                <InfoRow label="Dil" value={lang.language} />
                <InfoRow label="Seviye" value={lang.level?.toString() || '-'} isLast={index === profileDetails.userLanguages.length - 1} />
              </View>
            ))
          ) : (
            <InfoRow label="Dil" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="SERTİFİKALAR"
          icon={<Award size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.certificates.length > 0 ? (
            profileDetails.certificates.map((cert, index) => (
              <WorkInfoCard
                key={cert.id}
                title={cert.name}
                details={[
                  { label: 'Veren Kurum', value: cert.issuer },
                  { label: 'Veriliş Tarihi', value: formatDate(cert.issueDate) },
                  { label: 'Geçerlilik Tarihi', value: cert.expiryDate ? formatDate(cert.expiryDate) : 'Süresiz' },
                ]}
              />
            ))
          ) : (
            <InfoRow label="Sertifika" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="PASAPORT BİLGİLERİ"
          icon={<CreditCard size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          <InfoRow label="Pasaport Tipi" value={profileDetails.userPassport?.passportType?.toString() || '-'} />
          <InfoRow label="Pasaport No" value={profileDetails.userPassport?.passportNumber || '-'} />
          <InfoRow label="Geçerlilik Tarihi" value={profileDetails.userPassport?.passportValidityDate ? formatDate(profileDetails.userPassport.passportValidityDate) : '-'} isLast />
        </Accordion>

        <Accordion
          title="VİZE BİLGİLERİ"
          icon={<FileText size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {profileDetails.userVisas.length > 0 ? (
            profileDetails.userVisas.map((visa, index) => (
              <WorkInfoCard
                key={visa.id}
                title={`${visa.country} Vizesi`}
                details={[
                  { label: 'Vize Tipi', value: visa.visaType },
                  { label: 'Veriliş Tarihi', value: formatDate(visa.issueDate) },
                  { label: 'Geçerlilik Tarihi', value: formatDate(visa.expiryDate) },
                ]}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Henüz vize bilgisi eklenmemiş</Text>
            </View>
          )}
          {canEditProfile && (
            <TouchableOpacity
              style={styles.visaRequestButton}
              onPress={() => setVisaModalVisible(true)}
            >
              <Text style={styles.visaRequestButtonText}>Vize Başvuru Evrak Talebi</Text>
            </TouchableOpacity>
          )}
        </Accordion>
      </>
    );
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}dk`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'late':
        return 'Geç Giriş';
      case 'early_leave':
        return 'Erken Çıkış';
      case 'absent':
        return 'İzinli';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10B981';
      case 'late':
        return '#F59E0B';
      case 'early_leave':
        return '#EF4444';
      case 'absent':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateToggle = (dateStr: string) => {
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(calendarMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCalendarMonth(newMonth);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(calendarMonth);
    const monthName = calendarMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDates.has(dateStr);
      const dayOfWeek = (startingDayOfWeek + day - 1) % 7;
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
          ]}
          onPress={() => handleDateToggle(dateStr)}
        >
          <Text
            style={[
              styles.calendarDayText,
              isWeekend && styles.calendarDayWeekend,
              isSelected && styles.calendarDayTextSelected,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth('prev')}>
            <Text style={styles.calendarNavButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.calendarMonthTitle}>{formattedMonthName}</Text>
          <TouchableOpacity onPress={() => changeMonth('next')}>
            <Text style={styles.calendarNavButton}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarDayNames}>
          {dayNames.map((name, index) => (
            <Text
              key={name}
              style={[
                styles.calendarDayName,
                (index === 5 || index === 6) && styles.calendarDayNameWeekend,
              ]}
            >
              {name}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{days}</View>
      </View>
    );
  };

  const renderPDKSSection = () => {
    if (pdksLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      );
    }

    return (
      <>
        <View style={styles.pdksSection}>
          <View style={styles.pdksSectionHeader}>
            <AlignJustify size={20} color="#1a1a1a" />
            <Text style={styles.pdksSectionTitle}>VARDİYA BİLGİSİ</Text>
          </View>

          <View style={styles.pdksInfoGrid}>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Mevcut Vardiya</Text>
              <Text style={styles.pdksInfoValue}>
                {userShiftPlan?.shiftPlanName || 'Vardiya bilgisi yok'}
              </Text>
            </View>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Mevcut Tip</Text>
              <Text style={styles.pdksInfoValue}>
                {userShiftPlan?.shiftType || '-'}
              </Text>
            </View>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Çalışma Saatleri</Text>
              <Text style={styles.pdksInfoValue}>
                {userShiftPlan ? `${userShiftPlan.startTime} - ${userShiftPlan.endTime}` : '-'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pdksSection}>
          <View style={styles.pdksSectionHeader}>
            <Text style={styles.pdksSectionTitle}>VARDİYA GEÇMİŞİ</Text>
          </View>

          {userWorkLogs.length === 0 ? (
            <Text style={styles.pdksEmptyText}>Vardiya geçmişi bulunamadı</Text>
          ) : (
            userWorkLogs.map((log, index) => (
              <View key={log.id || index} style={styles.pdksHistoryCard}>
                <View style={styles.pdksHistoryHeader}>
                  <Text style={styles.pdksHistoryDate}>{formatDate(log.date)}</Text>
                  <Text style={styles.pdksHistoryTime}>
                    {log.totalWorkHours ? `${log.totalWorkHours} saat` : '-'}
                  </Text>
                </View>

                <View style={styles.pdksHistoryDetails}>
                  <View style={styles.pdksHistoryRow}>
                    <Text style={styles.pdksHistoryLabel}>Giriş</Text>
                    <Text style={styles.pdksHistoryValue}>
                      {log.checkInTime || '-'}
                    </Text>
                  </View>
                  <View style={styles.pdksHistoryRow}>
                    <Text style={styles.pdksHistoryLabel}>Çıkış</Text>
                    <Text style={styles.pdksHistoryValue}>
                      {log.checkOutTime || '-'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.pdksViewAllButton}
            onPress={() => setPdksTaskModalVisible(true)}
          >
            <Text style={styles.pdksViewAllButtonText}>Görev Tanımla</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderOnboardingSection = () => {
    if (!user?.backend_user_id) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Kullanıcı bilgisi bulunamadı</Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionsContainer}>
        <OnboardingDropdown
          userId={user.backend_user_id}
          organizationId={user.organization_id || 2}
        />

        <View style={styles.onboardingStepsContainer}>
          {onboardingData.steps.map((step, index) => {
            const userStep = onboardingData.userSteps.find((us) => us.step_id === step.id);
            const isCompleted = userStep?.is_completed || false;

            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepNumber, isCompleted && styles.stepNumberCompleted]}>
                    <Text style={[styles.stepNumberText, isCompleted && styles.stepNumberTextCompleted]}>
                      {index + 1}
                    </Text>
                  </View>
                  {index < onboardingData.steps.length - 1 && <View style={styles.stepLine} />}
                </View>
                <Text style={[styles.stepTitle, isCompleted && styles.stepTitleCompleted]}>
                  {step.title}
                </Text>
              </View>
            );
          })}
        </View>

        <Accordion
          title="İŞE BAŞLAMA GÖREVLERİ"
          icon={<AlignJustify size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          {(() => {
            const categories = getOnboardingModalData();
            return categories.map((category) => (
              <View key={category.id} style={styles.taskCategoryContainer}>
                <Text style={styles.taskCategoryHeader}>{category.name}</Text>
                {category.tasks.map((task: any) => {
                  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();

                  return (
                    <View key={task.id} style={styles.taskCard}>
                      <Text style={styles.taskTitle}>{task.title}</Text>

                      <View style={styles.taskInfo}>
                        <View style={styles.taskInfoRow}>
                          <Text style={styles.taskInfoLabel}>İlgili</Text>
                          <Text style={styles.taskInfoValue}>{task.assignedTo}</Text>
                        </View>
                        <View style={styles.taskInfoRow}>
                          <Text style={styles.taskInfoLabel}>Son Tarih</Text>
                          <Text style={[styles.taskInfoValueDate, isOverdue && styles.taskInfoValueOverdue]}>
                            {formatDate(task.dueDate)}
                          </Text>
                        </View>
                      </View>

                      {task.isCompleted ? (
                        <View style={styles.taskCompletedBadge}>
                          <Text style={styles.taskCompletedBadgeText}>Tamamlandı</Text>
                        </View>
                      ) : (
                        <View style={styles.taskActions}>
                          <TouchableOpacity
                            style={styles.completeTaskButton}
                            onPress={() => task.userTaskId && handleCompleteTask(task.userTaskId.toString())}
                          >
                            <Text style={styles.completeTaskButtonText}>Görevi Tamamla</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.checkTaskButton}
                            onPress={() => task.userTaskId && handleCompleteTask(task.userTaskId.toString())}
                          >
                            <Check size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ));
          })()}
        </Accordion>

        <Accordion
          title="SENİ TANIYALIM"
          icon={<UserIcon size={18} color="#7C3AED" />}
          defaultExpanded={false}
        >
          <View style={styles.questionsContainer}>
            <Text style={styles.questionsSubtitle}>Seni Tanıyalım Soruları</Text>
            {onboardingData.questions.map((question) => {
              const answer = answerInputs[question.id] || '';
              const userAnswer = onboardingData.userAnswers.find((ua) => ua.question_id === question.id);
              const isSaved = !!userAnswer?.answer;

              return (
                <View key={question.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    {isSaved && (
                      <View style={styles.questionCheckbox}>
                        <Check size={16} color="#7C3AED" />
                      </View>
                    )}
                    <Text style={styles.questionLabel}>
                      {question.is_required && <Text style={styles.requiredStar}>* </Text>}
                      Zorunlu Soru
                    </Text>
                  </View>
                  <Text style={styles.questionText}>{question.question}</Text>
                  <TextInput
                    style={styles.questionInput}
                    placeholder="Cevabınızı yazın..."
                    placeholderTextColor="#999"
                    value={answer}
                    onChangeText={(text) => setAnswerInputs((prev) => ({ ...prev, [question.id]: text }))}
                    multiline
                  />
                  <View style={styles.questionActions}>
                    <TouchableOpacity
                      style={styles.saveAnswerButton}
                      onPress={() => handleSaveAnswer(question.id, answer)}
                    >
                      <Text style={styles.saveAnswerButtonText}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity style={styles.addQuestionButton}>
              <Text style={styles.addQuestionButtonText}>Soru Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitAnswersButton}>
              <Text style={styles.submitAnswersButtonText}>Seni Tanıyalım E-postası Gönder</Text>
            </TouchableOpacity>
          </View>
        </Accordion>
      </View>
    );
  };

  const renderFilesSection = () => {
    const files = [
      { id: '1', name: 'Özlük Dosyaları', type: 'folder', count: 'Boş Klasör', icon: 'folder-blue' },
      { id: '2', name: 'İmzalı Belgeler', type: 'folder', count: '8 Dosya', icon: 'folder-blue' },
      { id: '3', name: 'Evrak Klasörüm', type: 'folder', count: '3 Dosya', icon: 'folder-yellow' },
      { id: '4', name: 'Lazım Olur', type: 'folder', count: 'Boş Klasör', icon: 'folder-yellow' },
      { id: '5', name: 'vize_evrak.docx', type: 'file', size: '15 kb', icon: 'doc' },
      { id: '6', name: 'vesikalik.jpeg', type: 'file', size: '423 kb', icon: 'image' },
      { id: '7', name: 'basvuru_dosya.pdf', type: 'file', size: '1.53 mb', icon: 'pdf' },
    ];

    const getFileIcon = (iconType: string) => {
      switch (iconType) {
        case 'folder-blue':
          return <FolderOpen size={24} color="#3B82F6" />;
        case 'folder-yellow':
          return <Folder size={24} color="#F59E0B" />;
        case 'doc':
          return <FileText size={24} color="#2563EB" />;
        case 'image':
          return <Package size={24} color="#10B981" />;
        case 'pdf':
          return <FileText size={24} color="#EF4444" />;
        default:
          return <File size={24} color="#666" />;
      }
    };

    return (
      <>
        <View style={styles.filesHeader}>
          <View style={styles.filesHeaderTop}>
            <View style={styles.filesTitle}>
              <Folder size={20} color="#7C3AED" />
              <Text style={styles.filesTitleText}>DOSYALAR</Text>
            </View>
            <View style={styles.filesActions}>
              {hasDocumentPermission('write') && (
                <TouchableOpacity
                  style={styles.filesActionButton}
                  onPress={() => {
                    console.log('File upload button clicked');
                    setUploadForm({ fileName: '', fileType: 'document', description: '' });
                    setSelectedFileForUpload(null);
                    setFileUploadModalVisible(true);
                  }}
                >
                  <Plus size={20} color="#7C3AED" />
                </TouchableOpacity>
              )}
              {hasDocumentPermission('read') && (
                <TouchableOpacity
                  style={styles.filesActionButton}
                  onPress={() => {
                    console.log('File share button clicked');
                    setSelectedFilesForShare([]);
                    setSelectedShareType(null);
                    setFileShareModalVisible(true);
                  }}
                >
                  <Share2 size={20} color="#7C3AED" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Belgelerin içinde ara..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.breadcrumb}>
            <TouchableOpacity>
              <Text style={styles.breadcrumbActive}>Çalışma Alanınız</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <Text style={styles.breadcrumbText}>...</Text>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.breadcrumbLink}>Yeni Klasör</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.breadcrumbText}>Son Klasör</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filesContainer}>
          {files.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.fileItem,
                index === files.length - 1 && styles.fileItemLast
              ]}
            >
              <View style={styles.fileItemLeft}>
                <TouchableOpacity
                  style={styles.fileItemDots}
                  activeOpacity={0.7}
                  onPress={(e) => {
                    const target = e.nativeEvent;
                    setSelectedFile({
                      id: item.id,
                      name: item.name,
                      type: item.type as 'folder' | 'file',
                      position: { x: target.pageX, y: target.pageY },
                    });
                    setFileDropdownVisible(true);
                  }}
                >
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </TouchableOpacity>
                <View style={styles.fileItemIcon}>
                  {getFileIcon(item.icon)}
                </View>
                <View style={styles.fileItemInfo}>
                  <Text style={styles.fileItemName}>{item.name}</Text>
                  <Text style={styles.fileItemMeta}>
                    {item.type === 'folder' ? item.count : item.size}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'Özet':
        return renderSummarySection();
      case 'İşe Başlama':
        return renderOnboardingSection();
      case 'PDKS':
        return renderPDKSSection();
      case 'İzin Bilgileri':
        return renderDayOffSection();
      case 'Çalışma Bilgileri':
        return renderWorkInfoSection();
      case 'Profil Bilgileri':
        return renderProfileInfoSection();
      case 'Zimmet Bilgileri':
        return renderAssetsSection();
      case 'Dosyalar':
        return renderFilesSection();
      default:
        return renderDayOffSection();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerVisible(true)}
          >
            <Menu size={24} color="#1a1a1a" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>hero</Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>+</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color="#1a1a1a" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setInboxVisible(true)}
            >
              <MessageSquare size={20} color="#1a1a1a" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton}>
              {user.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.headerProfileImage}
                />
              ) : (
                <View style={styles.headerProfilePlaceholder}>
                  <UserIcon size={20} color="#7C3AED" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              {user.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <UserIcon size={48} color="#7C3AED" />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user.firstName} {user.lastName}
              </Text>

              <View style={styles.profileDetails}>
                {profileDetails?.currentTitle && (
                  <View style={styles.profileDetailRow}>
                    <Award size={16} color="#7C3AED" />
                    <Text style={[styles.profileDetailText, { color: '#7C3AED', fontWeight: '600' }]}>
                      {profileDetails.currentTitle}
                    </Text>
                  </View>
                )}
                <View style={styles.profileDetailRow}>
                  <Briefcase size={16} color="#666" />
                  <Text style={styles.profileDetailText}>
                    {user.position || 'Management Trainee'}
                  </Text>
                </View>
                {profileDetails?.organizationName && (
                  <View style={styles.profileDetailRow}>
                    <Building2 size={16} color="#666" />
                    <Text style={styles.profileDetailText}>{profileDetails.organizationName}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <ProfileDropdown
            options={profileSections}
            selectedOption={selectedSection}
            onSelect={setSelectedSection}
          />

          <View style={styles.sectionsContainer}>
            {renderSectionContent()}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      <Modal
        visible={assetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAssetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Zimmet Ekle</Text>
              <TouchableOpacity
                onPress={() => setAssetModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalUserCard}>
                {badgeCardInfo?.profilePhoto ? (
                  <Image
                    source={{ uri: `https://faz2-api.herotr.com${badgeCardInfo.profilePhoto}` }}
                    style={styles.modalUserImage}
                  />
                ) : (
                  <View style={styles.modalUserPlaceholder}>
                    <UserIcon size={24} color="#7C3AED" />
                  </View>
                )}
                <View style={styles.modalUserInfo}>
                  <Text style={styles.modalUserName}>{badgeCardInfo?.fullName || `${user.firstName} ${user.lastName}`}</Text>
                  <Text style={styles.modalUserRole}>{badgeCardInfo?.title || '—'}</Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kategori</Text>
                <TouchableOpacity
                  style={styles.formDropdownTrigger}
                  onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                  <Text style={[styles.formDropdownText, !assetForm.categoryName && styles.placeholderText]}>
                    {assetForm.categoryName || 'Kategori seçin'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>

                {categoryDropdownOpen && (
                  <View style={styles.formDropdownList}>
                    {assetCategories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOptionItem,
                          assetForm.categoryId === category.id && styles.categoryOptionItemSelected,
                        ]}
                        onPress={() => {
                          setAssetForm({
                            ...assetForm,
                            categoryId: category.id,
                            categoryName: category.name,
                          });
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.categoryOptionItemText,
                          assetForm.categoryId === category.id && styles.categoryOptionItemTextSelected,
                        ]}>
                          {category.name}
                        </Text>
                        {assetForm.categoryId === category.id && (
                          <Check size={16} color="#7C3AED" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Seri No</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="123131637ABJ1"
                  value={assetForm.serialNo}
                  onChangeText={(text) => setAssetForm({...assetForm, serialNo: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Zimmet Açıklaması</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="M3 Macbook Pro 2023"
                  multiline
                  numberOfLines={4}
                  value={assetForm.description}
                  onChangeText={(text) => setAssetForm({...assetForm, description: text})}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Teslim Tarihi</Text>
                <View style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={assetForm.deliveryDate}
                    onChangeText={(text) => setAssetForm({...assetForm, deliveryDate: text})}
                    editable={true}
                  />
                  <TouchableOpacity onPress={() => setDeliveryDatePickerVisible(true)}>
                    <Calendar size={20} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İade Tarihi</Text>
                <View style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={assetForm.returnDate}
                    onChangeText={(text) => setAssetForm({...assetForm, returnDate: text})}
                    editable={true}
                  />
                  <TouchableOpacity onPress={() => setReturnDatePickerVisible(true)}>
                    <Calendar size={20} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setAssetModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (assetLoading || !hasAssetPermission('write')) && styles.modalSubmitButtonDisabled
                ]}
                onPress={() => {
                  console.log('Devam Et button clicked');
                  console.log('Button disabled?', assetLoading || !hasAssetPermission('write'));
                  console.log('assetLoading:', assetLoading);
                  console.log('hasAssetPermission(write):', hasAssetPermission('write'));
                  handleAddAsset();
                }}
                disabled={assetLoading || !hasAssetPermission('write')}
              >
                {assetLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Devam Et</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        visible={deliveryDatePickerVisible}
        onClose={() => setDeliveryDatePickerVisible(false)}
        onSelectDate={(date) => {
          setAssetForm({...assetForm, deliveryDate: date});
        }}
        initialDate={assetForm.deliveryDate}
      />

      <DatePicker
        visible={returnDatePickerVisible}
        onClose={() => setReturnDatePickerVisible(false)}
        onSelectDate={(date) => {
          setAssetForm({...assetForm, returnDate: date});
        }}
        initialDate={assetForm.returnDate}
      />

      <Modal
        visible={visaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vize Başvuru Evrak Talebi</Text>
              <TouchableOpacity
                onPress={() => setVisaModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Vize Türü</Text>
                <TouchableOpacity style={styles.formDropdown}>
                  <Text style={styles.formDropdownText}>{visaForm.visaType}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Başvurulacak Ülke</Text>
                <TouchableOpacity style={styles.formDropdown}>
                  <Text style={styles.formDropdownText}>{visaForm.country}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Giriş Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={visaForm.entryDate}
                    onChangeText={(text) => setVisaForm({...visaForm, entryDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Çıkış Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={visaForm.exitDate}
                    onChangeText={(text) => setVisaForm({...visaForm, exitDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Not</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Varsa iletmek istediği detayları çalışan bu alandan gönderebilir."
                  multiline
                  numberOfLines={4}
                  value={visaForm.notes}
                  onChangeText={(text) => setVisaForm({...visaForm, notes: text})}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setVisaModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={() => {
                  console.log('Vize başvurusu:', visaForm);
                  setVisaModalVisible(false);
                }}
              >
                <Text style={styles.modalSubmitText}>Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={leaveModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLeaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İzin Talebi Gir</Text>
              <TouchableOpacity
                onPress={() => setLeaveModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.leaveUserCard}>
                {user.profilePictureUrl ? (
                  <Image
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.leaveUserImage}
                  />
                ) : (
                  <View style={styles.leaveUserPlaceholder}>
                    <UserIcon size={24} color="#7C3AED" />
                  </View>
                )}
                <View style={styles.leaveUserInfo}>
                  <Text style={styles.leaveUserName}>{user.firstName} {user.lastName}</Text>
                  <Text style={styles.leaveUserRole}>{profileDetails?.currentTitle || 'Management Trainee'}</Text>
                </View>
                <View style={styles.leaveBalanceBox}>
                  <Text style={styles.leaveBalanceLabel}>İZİN BAKİYESİ</Text>
                  <Text style={styles.leaveBalanceValue}>125,5 Gün</Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İzin Türü</Text>
                <TouchableOpacity
                  style={styles.formDropdown}
                  onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
                >
                  <Text style={styles.formDropdownText}>{leaveForm.leaveType}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {showLeaveTypeDropdown && (
                  <View style={styles.dropdownList}>
                    {leaveTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setLeaveForm({ ...leaveForm, leaveType: type });
                          setShowLeaveTypeDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Başlangıç Tarihi</Text>
                <View style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="YYYY-MM-DD"
                    value={leaveForm.startDate}
                    onChangeText={(text) => setLeaveForm({ ...leaveForm, startDate: text })}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bitiş Tarihi</Text>
                <View style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="YYYY-MM-DD"
                    value={leaveForm.endDate}
                    onChangeText={(text) => setLeaveForm({ ...leaveForm, endDate: text })}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Süre</Text>
                <TouchableOpacity
                  style={styles.formDropdown}
                  onPress={() => setShowDurationDropdown(!showDurationDropdown)}
                >
                  <Text style={styles.formDropdownText}>{leaveForm.duration} Gün</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {showDurationDropdown && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {durations.map((dur) => (
                        <TouchableOpacity
                          key={dur}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setLeaveForm({ ...leaveForm, duration: dur });
                            setShowDurationDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{dur} Gün</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Not</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Varsa iletmek istediği detayları çalışan bu alandan gönderebilir."
                  multiline
                  numberOfLines={4}
                  value={leaveForm.notes}
                  onChangeText={(text) => setLeaveForm({...leaveForm, notes: text})}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setLeaveModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSubmitLeaveRequest}
                disabled={leaveLoading}
              >
                {leaveLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Devam Et</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={leaveSuccessModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLeaveSuccessModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContainer}>
            <Text style={styles.successTitle}>İzin Talebi Gir</Text>
            <View style={styles.successIconContainer}>
              <Check size={70} color="#34C759" strokeWidth={4} />
            </View>
            <Text style={styles.successMessage}>Talebiniz başarı ile iletildi.</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setLeaveSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={welcomePackageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWelcomePackageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.welcomePackageModalContainer}>
            <View style={styles.welcomePackageModalHeader}>
              <Package size={18} color="#7C3AED" />
              <Text style={styles.welcomePackageModalTitle}>İŞE BAŞLAMA (ONBOARDING)</Text>
            </View>

            <View style={styles.welcomePackageModalActions}>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendWelcomePackage}
              >
                <Text style={styles.resendButtonText}>Tekrar Gönder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setWelcomePackageModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>İptal Et</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.welcomePackageModalContent}>
              {onboardingData.steps.map((step, index) => {
                const userStep = onboardingData.userSteps.find((us) => us.step_id === step.id);
                const isCompleted = userStep?.is_completed || (index === 0 && onboardingData.userOnboarding?.welcome_package_sent);

                return (
                  <View key={step.id} style={styles.welcomePackageStepItem}>
                    <View style={styles.welcomePackageStepIndicator}>
                      <View style={[styles.welcomePackageStepNumber, isCompleted && styles.welcomePackageStepNumberCompleted]}>
                        {isCompleted ? (
                          <Check size={16} color="#fff" />
                        ) : (
                          <Text style={styles.welcomePackageStepNumberText}>{index + 1}</Text>
                        )}
                      </View>
                      {index < onboardingData.steps.length - 1 && (
                        <View style={styles.welcomePackageStepLine} />
                      )}
                    </View>
                    <View style={styles.welcomePackageStepContent}>
                      <Text style={[styles.welcomePackageStepTitle, isCompleted && styles.welcomePackageStepTitleCompleted]}>
                        {step.title}
                      </Text>
                      {index === 0 && isCompleted && onboardingData.userOnboarding?.welcome_package_sent_at && (
                        <Text style={styles.welcomePackageStepDate}>
                          {formatDate(onboardingData.userOnboarding.welcome_package_sent_at)}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <PDKSTaskModal
        visible={pdksTaskModalVisible}
        onClose={() => setPdksTaskModalVisible(false)}
        onSubmit={handleCreatePDKSTask}
      />

      {user && (
        <InboxModal
          visible={inboxVisible}
          onClose={() => setInboxVisible(false)}
          userId={user.id}
          onUnreadCountChange={setUnreadCount}
        />
      )}

      {selectedFile && (
        <FileActionDropdown
          visible={fileDropdownVisible}
          onClose={() => {
            setFileDropdownVisible(false);
            setSelectedFile(null);
          }}
          fileName={selectedFile.name}
          fileType={selectedFile.type}
          position={selectedFile.position}
          onRename={handleFileRename}
          onCopy={handleFileCopy}
          onDownload={handleFileDownload}
          onDelete={handleFileDelete}
        />
      )}

      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.renameModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeniden Adlandır</Text>
              <TouchableOpacity
                onPress={() => {
                  setRenameModalVisible(false);
                  setRenameInput('');
                }}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.renameModalContent}>
              <Text style={styles.formLabel}>Yeni İsim</Text>
              <TextInput
                style={styles.formInput}
                value={renameInput}
                onChangeText={setRenameInput}
                placeholder="Dosya adı girin..."
                autoFocus
              />

              <View style={styles.renameModalButtons}>
                <TouchableOpacity
                  style={styles.renameCancelButton}
                  onPress={() => {
                    setRenameModalVisible(false);
                    setRenameInput('');
                  }}
                >
                  <Text style={styles.renameCancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.renameConfirmButton}
                  onPress={confirmRename}
                >
                  <Text style={styles.renameConfirmButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={fileUploadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFileUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dosya Yükle</Text>
              <TouchableOpacity
                onPress={() => setFileUploadModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Dosya Adı</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Örn: Özlük Dosyası.pdf"
                  value={uploadForm.fileName}
                  onChangeText={(text) => setUploadForm({...uploadForm, fileName: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Dosya Türü</Text>
                <TouchableOpacity style={styles.formDropdownTrigger}>
                  <Text style={styles.formDropdownText}>{uploadForm.fileType}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Açıklama (Opsiyonel)</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Dosya hakkında not ekleyin..."
                  multiline
                  numberOfLines={4}
                  value={uploadForm.description}
                  onChangeText={(text) => setUploadForm({...uploadForm, description: text})}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickDocument}
              >
                <Upload size={20} color="#7C3AED" />
                <Text style={styles.uploadButtonText}>
                  {selectedFileForUpload ? 'Farklı Dosya Seç' : 'Dosya Seç'}
                </Text>
              </TouchableOpacity>

              {selectedFileForUpload && (
                <View style={styles.selectedFilePreview}>
                  <FileText size={20} color="#7C3AED" />
                  <View style={styles.selectedFileInfo}>
                    <Text style={styles.selectedFileName}>{selectedFileForUpload.name}</Text>
                    <Text style={styles.selectedFileSize}>
                      {(selectedFileForUpload.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedFileForUpload(null)}>
                    <X size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setFileUploadModalVisible(false);
                  setSelectedFileForUpload(null);
                  setUploadForm({ fileName: '', fileType: 'document', description: '' });
                }}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (!uploadForm.fileName || !selectedFileForUpload) && styles.modalSubmitButtonDisabled
                ]}
                onPress={handleUploadFile}
                disabled={!uploadForm.fileName || !selectedFileForUpload}
              >
                <Text style={styles.modalSubmitText}>Yükle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={fileShareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFileShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dosya Paylaş</Text>
              <TouchableOpacity
                onPress={() => setFileShareModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>Paylaşılacak Dosyalar</Text>
              <View style={styles.selectedFilesContainer}>
                {selectedFilesForShare.length > 0 ? (
                  selectedFilesForShare.map((file) => (
                    <View key={file.id} style={styles.selectedFileItem}>
                      <FileText size={24} color="#7C3AED" />
                      <View style={styles.selectedFileInfo}>
                        <Text style={styles.selectedFileName}>{file.name}</Text>
                        <Text style={styles.selectedFileSize}>{file.size}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleSelectFileForShare(file)}>
                        <X size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.selectedFileItem}>
                    <FileText size={24} color="#999" />
                    <View style={styles.selectedFileInfo}>
                      <Text style={styles.selectedFileName}>Seçili dosya yok</Text>
                      <Text style={styles.selectedFileSize}>Aşağıdan dosya seçin</Text>
                    </View>
                  </View>
                )}
              </View>

              <Text style={styles.sectionLabel}>Mevcut Dosyalar</Text>
              <View style={styles.availableFilesContainer}>
                {[
                  { id: '1', name: 'Özlük Dosyaları', type: 'folder', count: 'Boş Klasör', icon: 'folder-blue' },
                  { id: '2', name: 'Sözleşme Dosyaları', type: 'folder', count: '5 Dosya', icon: 'folder-yellow' },
                  { id: '3', name: 'İş Akdi.docx', type: 'file', size: '250 kb', icon: 'doc' },
                  { id: '4', name: 'Gizlilik Sözleşmesi.pdf', type: 'file', size: '1.2 mb', icon: 'pdf' },
                ].map((file) => {
                  const isSelected = selectedFilesForShare.some(f => f.id === file.id);
                  return (
                    <TouchableOpacity
                      key={file.id}
                      style={[
                        styles.fileListItem,
                        isSelected && styles.fileListItemSelected
                      ]}
                      onPress={() => {
                        if (file.type === 'file') {
                          handleSelectFileForShare(file);
                        }
                      }}
                      disabled={file.type === 'folder'}
                    >
                      <View style={styles.fileListItemLeft}>
                        {file.icon === 'folder-blue' && <FolderOpen size={20} color="#3B82F6" />}
                        {file.icon === 'folder-yellow' && <Folder size={20} color="#F59E0B" />}
                        {file.icon === 'doc' && <FileText size={20} color="#2563EB" />}
                        {file.icon === 'pdf' && <FileText size={20} color="#EF4444" />}
                        <View style={styles.fileListItemInfo}>
                          <Text style={styles.fileListItemName}>{file.name}</Text>
                          <Text style={styles.fileListItemMeta}>
                            {file.type === 'folder' ? file.count : file.size}
                          </Text>
                        </View>
                      </View>
                      {file.type === 'file' && isSelected && (
                        <Check size={20} color="#7C3AED" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.sectionLabel}>Paylaşım Türü</Text>
              <View style={styles.shareOptions}>
                <TouchableOpacity
                  style={[
                    styles.shareOption,
                    selectedShareType === 'employees' && styles.shareOptionSelected
                  ]}
                  onPress={() => setSelectedShareType('employees')}
                >
                  <Users size={20} color={selectedShareType === 'employees' ? '#7C3AED' : '#666'} />
                  <Text style={[
                    styles.shareOptionText,
                    selectedShareType === 'employees' && styles.shareOptionTextSelected
                  ]}>
                    Çalışanlarla Paylaş
                  </Text>
                  {selectedShareType === 'employees' && (
                    <Check size={20} color="#7C3AED" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.shareOption,
                    selectedShareType === 'email' && styles.shareOptionSelected
                  ]}
                  onPress={() => setSelectedShareType('email')}
                >
                  <Mail size={20} color={selectedShareType === 'email' ? '#7C3AED' : '#666'} />
                  <Text style={[
                    styles.shareOptionText,
                    selectedShareType === 'email' && styles.shareOptionTextSelected
                  ]}>
                    E-posta ile Paylaş
                  </Text>
                  {selectedShareType === 'email' && (
                    <Check size={20} color="#7C3AED" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.shareOption,
                    selectedShareType === 'link' && styles.shareOptionSelected
                  ]}
                  onPress={() => setSelectedShareType('link')}
                >
                  <Link size={20} color={selectedShareType === 'link' ? '#7C3AED' : '#666'} />
                  <Text style={[
                    styles.shareOptionText,
                    selectedShareType === 'link' && styles.shareOptionTextSelected
                  ]}>
                    Link Oluştur
                  </Text>
                  {selectedShareType === 'link' && (
                    <Check size={20} color="#7C3AED" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setFileShareModalVisible(false);
                  setSelectedFilesForShare([]);
                  setSelectedShareType(null);
                }}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (selectedFilesForShare.length === 0 || !selectedShareType) && styles.modalSubmitButtonDisabled
                ]}
                onPress={handleShareFiles}
                disabled={selectedFilesForShare.length === 0 || !selectedShareType}
              >
                <Text style={styles.modalSubmitText}>Paylaş</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={fileShareSuccessVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFileShareSuccessVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContainer}>
            <Text style={styles.successTitle}>Dosya Paylaşıldı</Text>
            <View style={styles.successIconContainer}>
              <Check size={70} color="#34C759" strokeWidth={4} />
            </View>
            <Text style={styles.successMessage}>
              {selectedFilesForShare.length > 1
                ? `${selectedFilesForShare.length} dosya başarıyla paylaşıldı.`
                : 'Dosya başarıyla paylaşıldı.'}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setFileShareSuccessVisible(false)}
            >
              <Text style={styles.successButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={profileEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profil Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setProfileEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Personel No</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.personnelNo}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, personnelNo: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TCKN</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.identityNo}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, identityNo: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Adı Soyadı</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.fullName}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, fullName: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Doğum Yeri</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.birthPlace}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, birthPlace: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Doğum Tarihi</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.birthDate}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, birthDate: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cinsiyet</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.gender}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, gender: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Medeni Hal</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileEditForm.maritalStatus}
                  onChangeText={(text) => setProfileEditForm({ ...profileEditForm, maritalStatus: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfileInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={contactEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İletişim Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setContactEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İç Hat Telefon</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactEditForm.internalPhone}
                  onChangeText={(text) => setContactEditForm({ ...contactEditForm, internalPhone: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cep Telefonu 1</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactEditForm.mobilePhone1}
                  onChangeText={(text) => setContactEditForm({ ...contactEditForm, mobilePhone1: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cep Telefonu 2</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactEditForm.mobilePhone2}
                  onChangeText={(text) => setContactEditForm({ ...contactEditForm, mobilePhone2: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İş E-Posta</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactEditForm.workEmail}
                  onChangeText={(text) => setContactEditForm({ ...contactEditForm, workEmail: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Diğer E-Posta</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactEditForm.otherEmail}
                  onChangeText={(text) => setContactEditForm({ ...contactEditForm, otherEmail: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveContactInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={addressEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adres Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setAddressEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mahalle</Text>
                <TextInput
                  style={styles.formInput}
                  value={addressEditForm.neighborhood}
                  onChangeText={(text) => setAddressEditForm({ ...addressEditForm, neighborhood: text })}
                  multiline
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İkamet</Text>
                <TextInput
                  style={styles.formInput}
                  value={addressEditForm.city}
                  onChangeText={(text) => setAddressEditForm({ ...addressEditForm, city: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ülke</Text>
                <TextInput
                  style={styles.formInput}
                  value={addressEditForm.country}
                  onChangeText={(text) => setAddressEditForm({ ...addressEditForm, country: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveAddressInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={healthEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sağlık Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setHealthEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kan Grubu</Text>
                <TextInput
                  style={styles.formInput}
                  value={healthEditForm.bloodType}
                  onChangeText={(text) => setHealthEditForm({ ...healthEditForm, bloodType: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kronik Hastalıklar</Text>
                <TextInput
                  style={styles.formInput}
                  value={healthEditForm.chronicDiseases}
                  onChangeText={(text) => setHealthEditForm({ ...healthEditForm, chronicDiseases: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Alerjiler</Text>
                <TextInput
                  style={styles.formInput}
                  value={healthEditForm.allergies}
                  onChangeText={(text) => setHealthEditForm({ ...healthEditForm, allergies: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Acil Durum İletişim</Text>
                <TextInput
                  style={styles.formInput}
                  value={healthEditForm.emergencyContactName}
                  onChangeText={(text) => setHealthEditForm({ ...healthEditForm, emergencyContactName: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Acil Durum Telefon</Text>
                <TextInput
                  style={styles.formInput}
                  value={healthEditForm.emergencyContactPhone}
                  onChangeText={(text) => setHealthEditForm({ ...healthEditForm, emergencyContactPhone: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveHealthInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={driverLicenseEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ehliyet Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setDriverLicenseEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ehliyet Tipi</Text>
                <TextInput
                  style={styles.formInput}
                  value={driverLicenseEditForm.licenseType}
                  onChangeText={(text) => setDriverLicenseEditForm({ ...driverLicenseEditForm, licenseType: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ehliyet No</Text>
                <TextInput
                  style={styles.formInput}
                  value={driverLicenseEditForm.licenseNo}
                  onChangeText={(text) => setDriverLicenseEditForm({ ...driverLicenseEditForm, licenseNo: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Veriliş Tarihi</Text>
                <TextInput
                  style={styles.formInput}
                  value={driverLicenseEditForm.issueDate}
                  onChangeText={(text) => setDriverLicenseEditForm({ ...driverLicenseEditForm, issueDate: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Son Geçerlilik Tarihi</Text>
                <TextInput
                  style={styles.formInput}
                  value={driverLicenseEditForm.expiryDate}
                  onChangeText={(text) => setDriverLicenseEditForm({ ...driverLicenseEditForm, expiryDate: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveDriverLicenseInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={militaryEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Askerlik Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setMilitaryEditModalVisible(false)} style={styles.modalCloseButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Durum</Text>
                <TextInput
                  style={styles.formInput}
                  value={militaryEditForm.status}
                  onChangeText={(text) => setMilitaryEditForm({ ...militaryEditForm, status: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Başlangıç Tarihi</Text>
                <TextInput
                  style={styles.formInput}
                  value={militaryEditForm.startDate}
                  onChangeText={(text) => setMilitaryEditForm({ ...militaryEditForm, startDate: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bitiş Tarihi</Text>
                <TextInput
                  style={styles.formInput}
                  value={militaryEditForm.endDate}
                  onChangeText={(text) => setMilitaryEditForm({ ...militaryEditForm, endDate: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tecil Nedeni</Text>
                <TextInput
                  style={styles.formInput}
                  value={militaryEditForm.postponementReason}
                  onChangeText={(text) => setMilitaryEditForm({ ...militaryEditForm, postponementReason: text })}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={saveMilitaryInfo}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -35,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 4,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerProfilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 6,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#666',
  },
  sectionsContainer: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  assetCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  assetCardInactive: {
    opacity: 0.6,
  },
  assetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  assetCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  assetCardNew: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  assetCardNewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assetCardNewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  assetCardBody: {
    paddingHorizontal: 16,
  },
  assetCardInactiveText: {
    color: '#CCC',
  },
  assetEditButton: {
    padding: 4,
  },
  assetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  assetInfoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  assetInfoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  balanceCard: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  requestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  dayOffItem: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dayOffLeftBorder: {
    width: 4,
  },
  dayOffContent: {
    flex: 1,
    padding: 12,
  },
  dayOffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayOffTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayOffType: {
    fontSize: 14,
    color: '#666',
  },
  dayOffDays: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dayOffDaysText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  dayOffDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayOffDateText: {
    fontSize: 13,
    color: '#666',
  },
  dayOffReason: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  filesHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filesHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filesTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  filesActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filesActionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 4,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  breadcrumbActive: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#7C3AED',
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#666',
  },
  breadcrumbSeparator: {
    fontSize: 13,
    color: '#CCC',
  },
  filesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fileItemLast: {
    borderBottomWidth: 0,
  },
  fileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileItemDots: {
    gap: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  fileItemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileItemInfo: {
    flex: 1,
  },
  fileItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  fileItemMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  modalUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalUserPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modalUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  modalUserRole: {
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formDropdownText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTextarea: {
    minHeight: 100,
    paddingTop: 14,
  },
  formDatePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formDateInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 10,
    backgroundColor: 'transparent',
  },
  addFileButton: {
    marginBottom: 20,
  },
  addFileText: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  assetUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assetUserImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 16,
  },
  assetUserPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  assetUserInfo: {
    flex: 1,
  },
  assetUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  assetUserDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  assetUserDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  summaryContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  workInfoSection: {
    paddingVertical: 8,
  },
  workInfoTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 6,
  },
  workInfoDate: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  workInfoDuration: {
    fontSize: 13,
    color: '#666',
  },
  summaryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryDetailText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  managerSection: {
    paddingTop: 8,
  },
  teamSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 12,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 2,
  },
  personRole: {
    fontSize: 13,
    color: '#666',
  },
  visaRequestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  visaRequestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  leaveRequestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveRequestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  leaveUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  leaveUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  leaveUserPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  leaveUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  leaveUserRole: {
    fontSize: 14,
    color: '#666',
  },
  leaveBalanceBox: {
    alignItems: 'flex-end',
  },
  leaveBalanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  leaveBalanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemActive: {
    backgroundColor: '#F5F3FF',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  dropdownItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 32,
    textAlign: 'center',
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successMessage: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  onboardingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  onboardingHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  welcomePackageButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  welcomePackageButtonSent: {
    backgroundColor: '#E0E0E0',
  },
  welcomePackageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  onboardingStepsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberCompleted: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  stepNumberTextCompleted: {
    color: '#fff',
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  stepTitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingTop: 6,
    flex: 1,
  },
  stepTitleCompleted: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
  taskCategoryContainer: {
    marginBottom: 16,
  },
  taskCategoryHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7C3AED',
    marginBottom: 12,
  },
  taskCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  taskCompletedBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    backgroundColor: '#fff',
  },
  taskCompletedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  taskInfo: {
    marginBottom: 16,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskInfoValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  taskInfoValueDate: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  taskInfoValueOverdue: {
    color: '#DC2626',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  completeTaskButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTaskButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  checkTaskButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionsContainer: {
    paddingTop: 8,
  },
  questionsSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  questionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  requiredStar: {
    color: '#EF4444',
  },
  questionText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  questionInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveAnswerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveAnswerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  addQuestionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  addQuestionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  submitAnswersButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitAnswersButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  welcomePackageModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  welcomePackageModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomePackageModalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  welcomePackageModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resendButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  welcomePackageModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomePackageStepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  welcomePackageStepIndicator: {
    alignItems: 'center',
  },
  welcomePackageStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomePackageStepNumberCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  welcomePackageStepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  welcomePackageStepLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  welcomePackageStepContent: {
    flex: 1,
    paddingTop: 4,
  },
  welcomePackageStepTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  welcomePackageStepTitleCompleted: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
  welcomePackageStepDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pdksSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pdksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pdksSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  pdksInfoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  pdksInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdksInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  pdksInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  pdksHistoryCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 16,
  },
  pdksHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pdksHistoryDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  pdksHistoryTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  pdksHistoryTimeNormal: {
    color: '#666',
  },
  pdksHistoryTimeWarning: {
    color: '#FF3B30',
  },
  pdksHistoryDetails: {
    gap: 8,
  },
  pdksHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdksHistoryLabel: {
    fontSize: 14,
    color: '#666',
  },
  pdksHistoryValue: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  pdksViewAllButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#7C3AED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdksViewAllButtonText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  pdksEmptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingVertical: 20,
  },
  shiftChangeModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  shiftChangeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  shiftChangeModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  shiftChangeModalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  shiftChangeCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  shiftChangeCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  shiftChangeSaveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  shiftChangeSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  calendarContainer: {
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  calendarNavButton: {
    fontSize: 24,
    color: '#7C3AED',
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  calendarDayNames: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  calendarDayName: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarDayNameWeekend: {
    color: '#FF3B30',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  calendarDaySelected: {
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  calendarDayWeekend: {
    color: '#FF3B30',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  renameModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
  },
  renameModalContent: {
    padding: 24,
  },
  renameModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  renameCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  renameCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  renameConfirmButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  renameConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  formDropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  formDropdownList: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
  },
  categoryOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryOptionItemSelected: {
    backgroundColor: '#f5f3ff',
  },
  categoryOptionItemText: {
    fontSize: 15,
    color: '#333',
  },
  categoryOptionItemTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  placeholderText: {
    color: '#999',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7C3AED',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  selectedFilesContainer: {
    marginBottom: 20,
  },
  selectedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFileInfo: {
    flex: 1,
  },
  selectedFileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedFileSize: {
    fontSize: 13,
    color: '#6B7280',
  },
  shareOptions: {
    gap: 12,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  shareOptionSelected: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  shareOptionTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  selectedFilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  availableFilesContainer: {
    gap: 8,
    marginBottom: 20,
  },
  fileListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileListItemSelected: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  fileListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileListItemInfo: {
    flex: 1,
  },
  fileListItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  fileListItemMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
});
