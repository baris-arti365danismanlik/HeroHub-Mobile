import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import * as DocumentPicker from 'expo-document-picker';
import { User as UserIcon, Phone, Mail, MapPin, Briefcase, GraduationCap, Heart, HeartPulse, FileText, Award, Globe, Languages, CreditCard, LogOut, Menu, Building2, Users as Users2, DollarSign, Bell, MessageSquare, Package, Download, Pencil, Umbrella, ChevronDown, ChevronUp, Folder, File, Search, Plus, Share2, ChevronRight, FolderOpen, Calendar, X, TextAlignJustify as AlignJustify, Linkedin, Facebook, Instagram, Clock, Smartphone, Check, Upload, Users, Link } from 'lucide-react-native';
import { Accordion } from '@/components/Accordion';
import { InfoRow } from '@/components/InfoRow';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { WorkInfoCard } from '@/components/WorkInfoCard';
import { FileActionDropdown } from '@/components/FileActionDropdown';
import { OnboardingDropdown } from '@/components/OnboardingDropdown';
import { AddEducationModal, EducationFormData } from '@/components/AddEducationModal';
import { AddCertificateModal, CertificateData } from '@/components/AddCertificateModal';
import { AddLanguageModal, LanguageData } from '@/components/AddLanguageModal';
import { AddVisaModal, VisaData } from '@/components/AddVisaModal';
import { AddDriverLicenseModal, DriverLicenseData } from '@/components/AddDriverLicenseModal';
import { assetService } from '@/services/asset.service';
import { leaveService } from '@/services/leave.service';
import { inboxService } from '@/services/inbox.service';
import { onboardingService } from '@/services/onboarding.service';
import { pdksService } from '@/services/pdks.service';
import { shiftService } from '@/services/shift.service';
import { userService } from '@/services/user.service';
import { employmentService } from '@/services/employment.service';
import PDKSTaskModal, { PDKSTaskData } from '@/components/PDKSTaskModal';
import { normalizePhotoUrl } from '@/utils/formatters';
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
import { ProfileMenu } from '@/components/ProfileMenu';
import { WelcomePackageModal } from '@/components/WelcomePackageModal';
import { SuccessModal } from '@/components/SuccessModal';
import { VisaRequestModal, type VisaRequestData } from '@/components/VisaRequestModal';
import { VisaPreviewModal } from '@/components/VisaPreviewModal';
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
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Özet');
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [workingInfo, setWorkingInfo] = useState<WorkingInformation | null>(null);
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
  const [visaPreviewVisible, setVisaPreviewVisible] = useState(false);
  const [visaSuccessVisible, setVisaSuccessVisible] = useState(false);
  const [visaRequestData, setVisaRequestData] = useState<VisaRequestData | null>(null);
  const [addCertificateModalVisible, setAddCertificateModalVisible] = useState(false);
  const [addLanguageModalVisible, setAddLanguageModalVisible] = useState(false);
  const [addVisaModalVisible, setAddVisaModalVisible] = useState(false);
  const [addDriverLicenseModalVisible, setAddDriverLicenseModalVisible] = useState(false);
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
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
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
  const [onboardingProcess, setOnboardingProcess] = useState<any>(null);
  const [onboardingTasks, setOnboardingTasks] = useState<any[]>([]);
  const [onboardingQuestions, setOnboardingQuestions] = useState<any[]>([]);
  const [onboardingTasksExpanded, setOnboardingTasksExpanded] = useState(true);
  const [onboardingQuestionsExpanded, setOnboardingQuestionsExpanded] = useState(true);
  const [welcomePackageModalVisible, setWelcomePackageModalVisible] = useState(false);
  const [welcomePackageSuccessModalVisible, setWelcomePackageSuccessModalVisible] = useState(false);
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

  const [addEducationModalVisible, setAddEducationModalVisible] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 2, 1));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [maritalStatusDropdownOpen, setMaritalStatusDropdownOpen] = useState(false);
  const [bloodTypeDropdownOpen, setBloodTypeDropdownOpen] = useState(false);
  const [militaryStatusDropdownOpen, setMilitaryStatusDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const leaveTypes = ['Yıllık İzin', 'Doğum Günü İzni', 'Karne Günü İzni', 'Evlilik İzni', 'Ölüm İzni', 'Hastalık İzni'];
  const durations = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
  const genders = ['Erkek', 'Kadın'];
  const maritalStatuses = ['Bekar', 'Evli', 'Boşanmış', 'Dul'];
  const bloodTypes = ['A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'];
  const militaryStatuses = ['Yapıldı', 'Ertelendi', 'Muaf', 'Uygulanmaz'];

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.backend_user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [profile, countriesList, workingInformation] = await Promise.all([
          userService.getUserProfile(user.backend_user_id),
          userService.getCountries(),
          employmentService.getWorkingInformation(user.backend_user_id),
        ]);

        setProfileDetails(profile);
        setCountries(countriesList);
        setModulePermissions(profile.modulePermissions);

        const currentWorkInfo = workingInformation.find(w => w.isCurrent);
        if (currentWorkInfo) {
          setWorkingInfo(currentWorkInfo);
        }

        loadShiftPlan();
        loadBadgeCardInfo();
      } catch (error) {
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
      } finally {
        setLeaveLoading(false);
      }
    };

    if (selectedSection === 'İzin Bilgileri') {
      fetchLeaveData();
    }
  }, [user?.backend_user_id, selectedSection]);

  const calculateWorkDuration = (startDate: string): string => {
    if (!startDate) return '-';

    const start = new Date(startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} yıl ${months} ay ${days} gün`;
  };

  const formatWorkType = (workType?: number): string => {
    if (!workType) return 'Tam Zamanlı';
    switch (workType) {
      case 1:
        return 'Tam Zamanlı';
      case 2:
        return 'Yarı Zamanlı';
      case 3:
        return 'Freelance';
      case 4:
        return 'Stajyer';
      default:
        return 'Tam Zamanlı';
    }
  };

  const formatJobStartDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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

  const handleEdit = (section: string) => {
    if (!profileDetails) return;

    switch (section) {
      case 'profile':
        setProfileEditForm({
          personnelNo: profileDetails.personalInformation?.personnelNumber || '',
          identityNo: profileDetails.personalInformation?.tckn || '',
          fullName: profileDetails.personalInformation
            ? `${profileDetails.personalInformation.firstName} ${profileDetails.personalInformation.lastName}`
            : '',
          birthPlace: profileDetails.personalInformation?.birthPlace || '',
          birthDate: profileDetails.personalInformation?.birthdate
            ? formatDate(profileDetails.personalInformation.birthdate)
            : '',
          gender: profileDetails.personalInformation?.gender !== undefined
            ? formatGender(profileDetails.personalInformation.gender)
            : '',
          maritalStatus: profileDetails.personalInformation?.maritalStatus !== undefined
            ? formatMaritalStatus(profileDetails.personalInformation.maritalStatus)
            : '',
        });
        setProfileEditModalVisible(true);
        break;
      case 'contact':
        setContactEditForm({
          internalPhone: profileDetails.userContact?.businessPhone || '',
          mobilePhone1: profileDetails.userContact?.phoneNumber || '',
          mobilePhone2: profileDetails.userContact?.homePhone || '',
          workEmail: profileDetails.userContact?.businessEmail || '',
          otherEmail: profileDetails.userContact?.otherEmail || '',
        });
        setContactEditModalVisible(true);
        break;
      case 'address':
        setAddressEditForm({
          neighborhood: profileDetails.userAddress?.address || '',
          city: profileDetails.userAddress?.cityName || '',
          country: profileDetails.userAddress?.countryName || '',
        });
        setAddressEditModalVisible(true);
        break;
      case 'health':
        setHealthEditForm({
          bloodType: profileDetails.userHealth?.bloodType !== undefined
            ? formatBloodType(profileDetails.userHealth.bloodType)
            : '',
          chronicDiseases: '',
          allergies: profileDetails.userHealth?.allergies || '',
          emergencyContactName: '',
          emergencyContactPhone: '',
        });
        setHealthEditModalVisible(true);
        break;
      case 'driverLicense':
        if (profileDetails.driverLicenses.length > 0) {
          const license = profileDetails.driverLicenses[0];
          setDriverLicenseEditForm({
            licenseType: license.licenseType || '',
            licenseNo: license.licenseNumber || '',
            issueDate: formatDate(license.issueDate),
            expiryDate: formatDate(license.expiryDate),
          });
        }
        setDriverLicenseEditModalVisible(true);
        break;
      case 'military':
        setMilitaryEditForm({
          status: profileDetails.userMilitary?.militaryStatus === 0
            ? 'Yapıldı'
            : profileDetails.userMilitary?.militaryStatus === 1
            ? 'Ertelendi'
            : profileDetails.userMilitary?.militaryStatus === 2
            ? 'Muaf'
            : 'Uygulanmaz',
          startDate: '',
          endDate: '',
          postponementReason: profileDetails.userMilitary?.militaryPostpone || '',
        });
        setMilitaryEditModalVisible(true);
        break;
      default:
        break;
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
    }
  };

  const handleFileDownload = () => {
    if (selectedFile) {
    }
  };

  const handleFileDelete = () => {
    if (selectedFile) {
    }
  };

  const confirmRename = () => {
    if (selectedFile && renameInput.trim()) {
      setRenameModalVisible(false);
      setRenameInput('');
      setSelectedFile(null);
    }
  };

  const saveProfileInfo = async () => {
    if (!user?.backend_user_id || !profileDetails) return;

    try {
      setLoading(true);
      const [firstName, ...lastNameParts] = profileEditForm.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const genderMap: Record<string, number> = { 'Erkek': 0, 'Kadın': 1 };
      const maritalStatusMap: Record<string, number> = {
        'Bekar': 0,
        'Evli': 1,
        'Boşanmış': 2,
        'Dul': 3
      };

      await userService.updatePersonalInformation(user.backend_user_id, {
        tckn: profileEditForm.identityNo,
        firstName,
        lastName,
        birthPlace: profileEditForm.birthPlace,
        birthdate: profileEditForm.birthDate,
        gender: genderMap[profileEditForm.gender],
        maritalStatus: maritalStatusMap[profileEditForm.maritalStatus],
        personnelNumber: profileEditForm.personnelNo,
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);
      setProfileEditModalVisible(false);
    } catch (error) {
      alert('Profil bilgileri güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveContactInfo = async () => {
    if (!user?.backend_user_id) return;

    try {
      setLoading(true);
      await userService.updateContactInformation(user.backend_user_id, {
        businessPhone: contactEditForm.internalPhone,
        phoneNumber: contactEditForm.mobilePhone1,
        homePhone: contactEditForm.mobilePhone2,
        businessEmail: contactEditForm.workEmail,
        otherEmail: contactEditForm.otherEmail,
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);
      setContactEditModalVisible(false);
    } catch (error) {
      alert('İletişim bilgileri güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveAddressInfo = async () => {
    if (!user?.backend_user_id || !profileDetails) return;

    try {
      setLoading(true);
      await userService.updateAddressInformation(user.backend_user_id, {
        address: addressEditForm.neighborhood,
        cityId: profileDetails.userAddress?.cityId || undefined,
        countryId: profileDetails.userAddress?.countryId || undefined,
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);
      setAddressEditModalVisible(false);
    } catch (error) {
      alert('Adres bilgileri güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveHealthInfo = async () => {
    if (!user?.backend_user_id || !profileDetails) return;

    try {
      setLoading(true);
      const bloodTypeMap: Record<string, number> = {
        'A Rh+': 0,
        'A Rh-': 1,
        'B Rh+': 2,
        'B Rh-': 3,
        'AB Rh+': 4,
        'AB Rh-': 5,
        '0 Rh+': 6,
        '0 Rh-': 7,
      };

      await userService.updateHealthInformation(user.backend_user_id, {
        bloodType: bloodTypeMap[healthEditForm.bloodType] ?? profileDetails.userHealth?.bloodType,
        allergies: healthEditForm.allergies,
        height: profileDetails.userHealth?.height,
        weight: profileDetails.userHealth?.weight,
        drugs: profileDetails.userHealth?.drugs,
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);
      setHealthEditModalVisible(false);
    } catch (error) {
      alert('Sağlık bilgileri güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveDriverLicenseInfo = () => {
    setDriverLicenseEditModalVisible(false);
  };

  const saveMilitaryInfo = async () => {
    if (!user?.backend_user_id) return;

    try {
      setLoading(true);
      const militaryStatusMap: Record<string, number> = {
        'Yapıldı': 0,
        'Ertelendi': 1,
        'Muaf': 2,
        'Uygulanmaz': 3,
      };

      await userService.updateMilitaryInformation(user.backend_user_id, {
        militaryStatus: militaryStatusMap[militaryEditForm.status],
        militaryPostpone: militaryEditForm.postponementReason,
        militaryNote: '',
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);
      setMilitaryEditModalVisible(false);
    } catch (error) {
      alert('Askerlik bilgileri güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = async (data: EducationFormData) => {
    if (!user?.backend_user_id) return;

    try {
      setLoading(true);

      await userService.createUserEducation({
        userId: user.backend_user_id,
        level: data.level,
        schoolName: data.schoolName,
        department: data.department,
        gpa: data.gpa,
        gpaSystem: data.gpaSystem,
        language: data.language,
        startDate: data.startDate,
        endDate: data.endDate,
      });

      const updatedProfile = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(updatedProfile);

      alert('Eğitim bilgisi başarıyla eklendi');
      setAddEducationModalVisible(false);
    } catch (error: any) {
      alert(error.message || 'Eğitim bilgisi eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
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
    } finally {
      setEmploymentLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAssets();
      loadLeaveRequests();
      loadUnreadCount();
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

  useEffect(() => {
    if (selectedSection === 'İşe Başlama' && user?.backend_user_id) {
      loadOnboardingData();
    }
  }, [selectedSection, user?.backend_user_id]);

  const loadUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const count = await inboxService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
    }
  };

  const loadAssets = async () => {
    if (!user?.backend_user_id) return;

    try {
      setAssetLoading(true);
      const data = await assetService.getUserAssets(Number(user.backend_user_id));
      setAssets(data);
    } catch (error) {
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
    }
  };

  const loadBadgeCardInfo = async () => {
    if (!user?.backend_user_id) return;

    try {
      const info = await userService.getBadgeCardInfo(Number(user.backend_user_id));
      setBadgeCardInfo(info);
    } catch (error) {
    }
  };

  const loadCountries = async () => {
    try {
      const countriesData = await userService.getCountries();
      setCountries(countriesData);
    } catch (error) {
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
    } finally {
      setLeaveLoading(false);
    }
  };

  const loadOnboardingData = async () => {
    if (!user?.backend_user_id) return;

    try {
      setOnboardingLoading(true);

      const [process, userTasks, questions] = await Promise.all([
        onboardingService.getUserOnboardingProcess(user.backend_user_id),
        onboardingService.listUserOnboardingTasks(user.backend_user_id),
        onboardingService.getUserOnboardingQuestions(user.backend_user_id),
      ]);

      setOnboardingProcess(process);
      setOnboardingQuestions(questions);

      if (userTasks.length === 0 && isAdmin) {
        const allTasksData = await onboardingService.listAllOnboardingTasks();

        const allTasks: any[] = [];
        allTasksData.forEach((categoryGroup: any) => {
          categoryGroup.onboardingTaskList.forEach((task: any) => {
            allTasks.push({
              id: task.id.toString(),
              title: task.name,
              description: task.description || '',
              dueDate: '',
              isCompleted: false,
              completedAt: null,
              category: task.categoryName,
              assignedTo: null,
              assignedToName: task.assignedUserName,
            });
          });
        });

        setOnboardingTasks(allTasks);
      } else {
        setOnboardingTasks(userTasks);
      }
    } catch (error) {
    } finally {
      setOnboardingLoading(false);
    }
  };

  const getLeaveTypeNumber = (leaveType: string): number => {
    const leaveTypeMap: Record<string, number> = {
      'Yıllık İzin': 1,
      'Doğum Günü İzni': 2,
      'Karne Günü İzni': 3,
      'Evlilik İzni': 4,
      'Ölüm İzni': 5,
      'Hastalık İzni': 6,
    };
    return leaveTypeMap[leaveType] || 1;
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/').map(p => p.trim());
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return dateStr;
  };

  const getVisaTypeText = (visaType: number | string): string => {
    if (typeof visaType === 'string') return visaType;
    const types = [
      '',
      'Turist Vizesi',
      'İş Vizesi',
      'Öğrenci Vizesi',
      'Transit Vize',
      'Çalışma Vizesi',
      'Aile Vizesi',
      'Geçici Vize',
      'Daimi Vize',
      'Ticari Vize',
      'Diplomatik Vize',
      'Sağlık Vizesi',
      'Kültürel Vize',
      'Gazeteci Vizesi',
      'Göçmen Vizesi',
      'Din Görevlisi Vizesi',
    ];
    return types[visaType] || '-';
  };

  const getVisaStatusText = (status: number): string => {
    const statuses = ['Beklemede', 'Onaylandı', 'Reddedildi', 'Geçersiz'];
    return statuses[status] || '-';
  };

  const formatDateForApi = (dateStr: string): Date => {
    if (!dateStr) return new Date();

    if (dateStr.includes('/')) {
      const parts = dateStr.split('/').map(p => p.trim());
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }

    if (dateStr.includes('-')) {
      return new Date(dateStr);
    }

    return new Date();
  };

  const handleSubmitLeaveRequest = async () => {
    if (!user?.backend_user_id || !leaveForm.startDate || !leaveForm.endDate) {
      return;
    }

    try {
      setLeaveLoading(true);

      const startDate = formatDateForApi(leaveForm.startDate);
      const endDate = formatDateForApi(leaveForm.endDate);

      startDate.setHours(21, 0, 0, 0);
      endDate.setHours(21, 0, 0, 0);

      await leaveService.createDayOffRequest({
        userId: String(user.backend_user_id),
        dayOffType: getLeaveTypeNumber(leaveForm.leaveType),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reason: leaveForm.notes || '',
        countOfDays: leaveForm.duration,
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
      await loadBadgeCardInfo();
    } catch (error) {
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleSubmitCertificate = async (data: CertificateData) => {
    if (!user?.backend_user_id) {
      alert('Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const parts = dateStr.split('/').map((p: string) => p.trim());
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      await userService.createUserCertificate({
        userId: user.backend_user_id,
        name: data.name,
        issuer: data.issuer,
        issueDate: formatDate(data.issueDate),
        expiryDate: data.expiryDate ? formatDate(data.expiryDate) : undefined,
      });

      alert('Sertifika başarıyla eklendi');
      await loadUserProfile();
    } catch (error: any) {
      alert(error.message || 'Sertifika eklenirken bir hata oluştu');
    }
  };

  const handleSubmitLanguage = async (data: LanguageData) => {
    if (!user?.backend_user_id) {
      alert('Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      await userService.createUserLanguage({
        userId: user.backend_user_id,
        languageId: data.languageId,
        languageLevel: data.languageLevel,
      });

      alert('Dil bilgisi başarıyla eklendi');
      await loadUserProfile();
    } catch (error: any) {
      alert(error.message || 'Dil bilgisi eklenirken bir hata oluştu');
    }
  };

  const handleSubmitVisa = async (data: VisaData) => {
    if (!user?.backend_user_id) {
      alert('Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const parts = dateStr.split('/').map((p: string) => p.trim());
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      await userService.createUserVisa({
        userId: user.backend_user_id,
        visaType: data.visaType,
        countryId: data.countryId,
        visaStartDate: formatDate(data.visaStartDate),
        visaEndDate: formatDate(data.visaEndDate),
        note: data.note,
      });

      alert('Vize bilgisi başarıyla eklendi');
      await loadUserProfile();
    } catch (error: any) {
      alert(error.message || 'Vize bilgisi eklenirken bir hata oluştu');
    }
  };

  const handleSubmitDriverLicense = async (data: DriverLicenseData) => {
    if (!user?.backend_user_id) {
      alert('Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const parts = dateStr.split('/').map((p: string) => p.trim());
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      await userService.createUserDriverLicense({
        userId: user.backend_user_id,
        licenseType: data.licenseType,
        licenseNumber: data.licenseNumber,
        issueDate: formatDate(data.issueDate),
        expiryDate: formatDate(data.expiryDate),
      });

      alert('Ehliyet bilgisi başarıyla eklendi');
      await loadUserProfile();
    } catch (error: any) {
      alert(error.message || 'Ehliyet bilgisi eklenirken bir hata oluştu');
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
    if (!hasAssetPermission('write')) {
      return;
    }

    if (!user?.backend_user_id) {
      return;
    }

    if (!assetForm.categoryId) {
      return;
    }

    if (!assetForm.serialNo || assetForm.serialNo.trim() === '') {
      return;
    }

    if (!assetForm.deliveryDate) {
      return;
    }

    try {
      setAssetLoading(true);

      const formattedDeliveryDate = formatDateForBackend(assetForm.deliveryDate);

      const payload = {
        userId: Number(user.backend_user_id),
        categoryId: assetForm.categoryId,
        serialNo: assetForm.serialNo.trim(),
        description: assetForm.description?.trim() || '',
        deliveryDate: formattedDeliveryDate,
      };

      const result = await assetService.createAsset(payload);

      if (result) {
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
        await loadAssets();
      }
    } catch (error) {
    } finally {
      setAssetLoading(false);
    }
  };

  const handlePickDocument = async () => {
    if (!hasDocumentPermission('write')) {
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFileForUpload(file);
        setUploadForm({
          ...uploadForm,
          fileName: file.name || 'Untitled',
          fileType: file.mimeType || 'document',
        });
      }
    } catch (error) {
    }
  };

  const handleUploadFile = async () => {
    if (!hasDocumentPermission('write')) {
      return;
    }

    if (!selectedFileForUpload || !uploadForm.fileName.trim()) {
      return;
    }

    try {
      setFileUploadModalVisible(false);
      setSelectedFileForUpload(null);
      setUploadForm({ fileName: '', fileType: 'document', description: '' });
    } catch (error) {
    }
  };

  const handleSelectFileForShare = (file: any) => {
    if (!hasDocumentPermission('read')) {
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
      return;
    }

    if (selectedFilesForShare.length === 0) {
      return;
    }

    if (!selectedShareType) {
      return;
    }

    try {
      setFileShareModalVisible(false);
      setFileShareSuccessVisible(true);

      setTimeout(() => {
        setSelectedFilesForShare([]);
        setSelectedShareType(null);
      }, 500);
    } catch (error) {
    }
  };

  const handleSendWelcomePackage = async (formData: any) => {
    if (!user?.backend_user_id) return { success: false, error: 'Kullanıcı bilgisi bulunamadı' };

    try {
      const result = await onboardingService.sendWelcomePackage(user.backend_user_id, formData);
      if (result.success) {
        await loadOnboardingData();
        return { success: true };
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Hoşgeldin paketi gönderilemedi' };
    }
  };

  const handleOpenWelcomePackageModal = () => {
    setWelcomePackageModalVisible(true);
  };

  const handleVisaRequest = async (data: VisaRequestData) => {
    if (!user?.backend_user_id) return;

    try {
      setLoading(true);

      const formatDateToISO = (dateStr: string) => {
        const parts = dateStr.split('/').map(p => p.trim());
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
          return date.toISOString();
        }
        return new Date(dateStr).toISOString();
      };

      const payload = {
        userId: user.backend_user_id,
        visaType: data.visaTypeId,
        countryId: data.countryId,
        visaStartDate: formatDateToISO(data.entryDate),
        visaEndDate: formatDateToISO(data.exitDate),
        note: data.notes || '',
      };

      console.log('Creating visa with payload:', payload);

      const result = await userService.createUserVisa(payload);

      console.log('Visa creation result:', result);

      setVisaModalVisible(false);
      setVisaSuccessVisible(true);

      if (profileDetails) {
        const updatedProfile = await userService.getUserProfile(user.backend_user_id);
        setProfileDetails(updatedProfile);
      }
    } catch (error: any) {
      console.error('Visa creation error:', error);
      const errorMessage = error?.message || error?.response?.data?.friendlyMessage || 'Vize oluşturulurken bir hata oluştu';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVisa = async () => {
    if (!visaRequestData || !profileDetails) return;

    try {
      await userService.sendVisaRequest({
        userName: profileDetails.fullName || 'Artı 365',
        userTitle: profileDetails.title || '-Bilinmiyor-',
        visaType: visaRequestData.visaType,
        countryName: visaRequestData.countryName,
        cityName: visaRequestData.cityName,
        entryDate: visaRequestData.entryDate,
        exitDate: visaRequestData.exitDate,
        notes: visaRequestData.notes,
      });

      setVisaPreviewVisible(false);
      setVisaSuccessVisible(true);
    } catch (error: any) {
      console.error('Vize talebi gönderilemedi:', error);
      alert(error.message || 'Vize talebi gönderilemedi');
    }
  };

  const loadShiftPlan = async () => {
    if (!user?.backend_user_id) return;

    try {
      const shiftPlan = await shiftService.getUserShiftPlan(Number(user.backend_user_id));
      setCurrentShiftPlan(shiftPlan);
    } catch (error) {
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const result = await onboardingService.completeTask(taskId);
      if (result.success) {
        await loadOnboardingData();
      }
    } catch (error) {
    }
  };

  const handleSaveAnswer = async (questionId: string, answer: string) => {
    if (!user?.backend_user_id) return;

    try {
      const result = await onboardingService.saveAnswer(user.backend_user_id, questionId, answer);
      if (result.success) {
        setAnswerInputs((prev) => ({ ...prev, [questionId]: answer }));
      }
    } catch (error) {
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

      setUserWorkLogs(workLogs);
      setUserShiftPlan(shiftPlan);
    } catch (error) {
    } finally {
      setPdksLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.id) return;

    try {
    } catch (error) {
    }
  };

  const handleCheckOut = async () => {
    if (!user?.id) return;

    try {
    } catch (error) {
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
      throw error;
    }
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
        icon={<Umbrella size={18} color="#1a1a1a" />}
        isExpandedDefault={false}
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
        icon={<Umbrella size={18} color="#1a1a1a" />}
        isExpandedDefault={false}
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
                    <TouchableOpacity onPress={() => {}}>
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
        icon={<Umbrella size={18} color="#1a1a1a" />}
        isExpandedDefault={false}
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
          icon={<UserIcon size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
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
          icon={<Briefcase size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
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
          icon={<DollarSign size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
        >
          {employmentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          ) : userSalary && userSalary.salary ? (
            <WorkInfoCard
              title={`${userSalary.salary.toLocaleString('tr-TR')} ${userSalary.currency || 'TL'}`}
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

  const renderSummarySection = () => {
    const contactInfo = profileDetails?.userContact;
    const socialMedia = profileDetails?.socialMedia;
    const manager = profileDetails?.reportsTo;
    const colleagues = profileDetails?.colleagues || [];

    return (
      <>
        <View style={styles.summaryContainer}>
          {contactInfo?.phoneNumber && (
            <View style={styles.contactItem}>
              <Phone size={20} color="#333" />
              <Text style={styles.contactText}>{contactInfo.phoneNumber}</Text>
            </View>
          )}

          {contactInfo?.homePhone && (
            <View style={styles.contactItem}>
              <Smartphone size={20} color="#333" />
              <Text style={styles.contactText}>{contactInfo.homePhone}</Text>
            </View>
          )}

          {contactInfo?.businessPhone && (
            <View style={styles.contactItem}>
              <Smartphone size={20} color="#333" />
              <Text style={styles.contactText}>{contactInfo.businessPhone}</Text>
            </View>
          )}

          {contactInfo?.email && (
            <View style={styles.contactItem}>
              <Mail size={20} color="#333" />
              <Text style={styles.contactText}>{contactInfo.email}</Text>
            </View>
          )}

          {socialMedia && (socialMedia.linkedin || socialMedia.facebook || socialMedia.instagram) && (
            <View style={styles.socialMediaContainer}>
              {socialMedia.linkedin && (
                <TouchableOpacity style={styles.socialIcon} onPress={() => {}}>
                  <Linkedin size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {socialMedia.facebook && (
                <TouchableOpacity style={styles.socialIcon} onPress={() => {}}>
                  <Facebook size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {socialMedia.instagram && (
                <TouchableOpacity style={styles.socialIcon} onPress={() => {}}>
                  <Instagram size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.dividerLine} />

          <View style={styles.workInfoSection}>
            <Text style={styles.workInfoTitle}>İşe Başlama Tarihi</Text>
            <Text style={styles.workInfoDate}>
              {profileDetails?.jobStartDate ? formatJobStartDate(profileDetails.jobStartDate) : '-'}
            </Text>
            <Text style={styles.workInfoDuration}>
              {profileDetails?.jobStartDate ? calculateWorkDuration(profileDetails.jobStartDate) : '-'}
            </Text>
          </View>

          <View style={styles.dividerLine} />

          {profileDetails?.currentTitle && (
            <View style={styles.summaryDetailItem}>
              <Briefcase size={20} color="#333" />
              <Text style={styles.summaryDetailText}>{profileDetails.currentTitle}</Text>
            </View>
          )}

          {profileDetails?.organizationName && (
            <View style={styles.summaryDetailItem}>
              <Building2 size={20} color="#333" />
              <Text style={styles.summaryDetailText}>{profileDetails.organizationName}</Text>
            </View>
          )}

          {workingInfo?.workType && (
            <View style={styles.summaryDetailItem}>
              <Clock size={20} color="#333" />
              <Text style={styles.summaryDetailText}>{formatWorkType(workingInfo.workType)}</Text>
            </View>
          )}

          <View style={styles.dividerLine} />

          {manager && (
            <View style={styles.managerSection}>
              <Text style={styles.sectionTitle}>Yöneticisi</Text>
              <View style={styles.personItem}>
                {manager.profilePhoto ? (
                  <Image
                    source={{ uri: manager.profilePhoto }}
                    style={styles.personAvatarImage}
                  />
                ) : (
                  <View style={styles.personAvatar}>
                    <UserIcon size={20} color="#7C3AED" />
                  </View>
                )}
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{manager.fullName || '-'}</Text>
                  <Text style={styles.personRole}>{manager.title || '-'}</Text>
                </View>
              </View>
            </View>
          )}

          {colleagues.length > 0 && (
            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>Ekip Arkadaşları</Text>
              {colleagues.map((colleague, index) => (
                <View key={colleague.id} style={[styles.personItem, index === colleagues.length - 1 && { marginBottom: 0 }]}>
                  {colleague.profilePhoto ? (
                    <Image
                      source={{ uri: colleague.profilePhoto }}
                      style={styles.personAvatarImage}
                    />
                  ) : (
                    <View style={styles.personAvatar}>
                      <UserIcon size={20} color="#7C3AED" />
                    </View>
                  )}
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{colleague.fullName}</Text>
                    <Text style={styles.personRole}>{colleague.title || '-'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </>
    );
  };

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
        <View style={styles.sectionHeader}>
          <AlignJustify size={18} color="#1a1a1a" />
          <Text style={styles.sectionHeaderTitle}>ZİMMET BİLGİLERİ</Text>
        </View>

      <View style={styles.actionButtons}>
          {hasAssetPermission('read') && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {}}
            >
              <Download size={18} color="#7C3AED" />
              <Text style={styles.downloadButtonText}>Zimmet Raporu İndir</Text>
            </TouchableOpacity>
          )}

          {hasAssetPermission('write') && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
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
        <View style={styles.profileSectionCard}>
          <TouchableOpacity
            style={styles.profileSectionHeader}
            onPress={() => toggleSection('personal')}
          >
            <View style={styles.profileSectionLeft}>
              <UserIcon size={18} color="#1a1a1a" />
              <Text style={styles.profileSectionTitle}>KİŞİSEL BİLGİLER</Text>
            </View>
            <View style={styles.profileSectionRight}>
              {canEditProfile && (
                <TouchableOpacity onPress={() => handleEdit('profile')} style={styles.profileEditIcon}>
                  <Pencil size={18} color="#666" />
                </TouchableOpacity>
              )}
              {expandedSections['personal'] ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSections['personal'] && (
            <View style={styles.profileSectionContent}>
              <View style={[styles.infoRow, styles.infoRowWithBorder, styles.personnelStatusRow]}>
                <View style={styles.personnelBadge}>
                  <Text style={styles.personnelNoLabel}>Personel No: </Text>
                  <Text style={styles.personnelNoValue}>{personalInformation?.personnelNumber || '-'}</Text>
                </View>
                <View style={[styles.statusBadge, profileDetails?.userStatus === 1 ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                  <Text style={[styles.statusBadgeText, profileDetails?.userStatus === 1 ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                    {profileDetails?.userStatus === 1 ? 'Aktif' : 'Pasif'}
                  </Text>
                </View>
              </View>
              <InfoRow label="TCKN" value={personalInformation?.tckn || '-'} />
              <InfoRow label="Adı Soyadı" value={personalInformation ? `${personalInformation.firstName} ${personalInformation.lastName}` : '-'} />
              <InfoRow label="Doğum Yeri" value={personalInformation?.birthPlace || '-'} />
              <InfoRow label="Uyruk" value={personalInformation?.nationality !== undefined && countries.length > 0 ? (countries.find(c => c.id === personalInformation.nationality)?.name || '-') : '-'} />
              <InfoRow label="Doğum Tarihi" value={personalInformation?.birthdate ? formatDate(personalInformation.birthdate) : '-'} />
              <InfoRow label="Cinsiyet" value={personalInformation?.gender !== undefined ? formatGender(personalInformation.gender) : '-'} />
              <InfoRow label="Medeni Hal" value={personalInformation?.maritalStatus !== undefined ? formatMaritalStatus(personalInformation.maritalStatus) : '-'} isLast />
            </View>
          )}
        </View>

        <View style={styles.profileSectionCard}>
          <TouchableOpacity
            style={styles.profileSectionHeader}
            onPress={() => toggleSection('contact')}
          >
            <View style={styles.profileSectionLeft}>
              <Briefcase size={18} color="#1a1a1a" />
              <Text style={styles.profileSectionTitle}>İLETİŞİM BİLGİLERİ</Text>
            </View>
            <View style={styles.profileSectionRight}>
              {canEditProfile && (
                <TouchableOpacity onPress={() => handleEdit('contact')} style={styles.profileEditIcon}>
                  <Pencil size={18} color="#666" />
                </TouchableOpacity>
              )}
              {expandedSections['contact'] ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSections['contact'] && (
            <View style={styles.profileSectionContent}>
              <InfoRow label="İş Telefonu" value={userContact?.businessPhone ? formatPhone(userContact.businessPhone) : '-'} />
              <InfoRow label="Şahsi Telefon" value={userContact?.phoneNumber ? formatPhone(userContact.phoneNumber) : '-'} />
              <InfoRow label="Ev Telefonu" value={userContact?.homePhone ? formatPhone(userContact.homePhone) : '-'} />
              <InfoRow label="İş E-Postası" value={userContact?.businessEmail || '-'} />
              <InfoRow label="Şahsi E-Posta" value={userContact?.email || '-'} />
              <InfoRow label="Diğer E-Posta" value={userContact?.otherEmail || '-'} isLast />
            </View>
          )}
        </View>

        <View style={styles.profileSectionCard}>
          <TouchableOpacity
            style={styles.profileSectionHeader}
            onPress={() => toggleSection('address')}
          >
            <View style={styles.profileSectionLeft}>
              <MapPin size={18} color="#1a1a1a" />
              <Text style={styles.profileSectionTitle}>ADRES BİLGİLERİ</Text>
            </View>
            <View style={styles.profileSectionRight}>
              {canEditProfile && (
                <TouchableOpacity onPress={() => handleEdit('address')} style={styles.profileEditIcon}>
                  <Pencil size={18} color="#666" />
                </TouchableOpacity>
              )}
              {expandedSections['address'] ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSections['address'] && (
            <View style={styles.profileSectionContent}>
              <InfoRow value={userAddress?.address || '-'} fullWidth />
              <InfoRow label="İlçe" value={userAddress?.districtName || '-'} />
              <InfoRow label="İl" value={userAddress?.cityName || '-'} />
              <InfoRow label="Ülke" value={userAddress?.countryName || '-'} isLast />
            </View>
          )}
        </View>

        <View style={styles.profileSectionCard}>
          <TouchableOpacity
            style={styles.profileSectionHeader}
            onPress={() => toggleSection('health')}
          >
            <View style={styles.profileSectionLeft}>
              <HeartPulse size={18} color="#1a1a1a" />
              <Text style={styles.profileSectionTitle}>SAĞLIK BİLGİLERİ</Text>
            </View>
            <View style={styles.profileSectionRight}>
              {canEditProfile && (
                <TouchableOpacity onPress={() => handleEdit('health')} style={styles.profileEditIcon}>
                  <Pencil size={18} color="#666" />
                </TouchableOpacity>
              )}
              {expandedSections['health'] ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSections['health'] && (
            <View style={styles.profileSectionContent}>
              <InfoRow label="Kan Grubu" value={userHealth?.bloodType ? formatBloodType(userHealth.bloodType) : '-'} />
              <InfoRow label="Boy (cm)" value={userHealth?.height && userHealth.height > 0 ? userHealth.height.toString() : '-'} />
              <InfoRow label="Kilo (kg)" value={userHealth?.weight && userHealth.weight > 0 ? userHealth.weight.toString() : '-'} />
              <InfoRow label="Alerjiler" value={userHealth?.allergies || '-'} />
              <InfoRow label="Kullanılan İlaçlar" value={userHealth?.drugs || '-'} isLast />
            </View>
          )}
        </View>

        <Accordion
          title="EHLİYET BİLGİLERİ"
          icon={<CreditCard size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
          actionButton={
            <TouchableOpacity style={styles.addIconButton} onPress={() => setAddDriverLicenseModalVisible(true)}>
              <Plus size={18} color="#7C3AED" />
            </TouchableOpacity>
          }
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

        <View style={styles.profileSectionCard}>
          <TouchableOpacity
            style={styles.profileSectionHeader}
            onPress={() => toggleSection('military')}
          >
            <View style={styles.profileSectionLeft}>
              <Building2 size={18} color="#1a1a1a" />
              <Text style={styles.profileSectionTitle}>ASKERLİK BİLGİLERİ</Text>
            </View>
            <View style={styles.profileSectionRight}>
              {canEditProfile && (
                <TouchableOpacity onPress={() => handleEdit('military')} style={styles.profileEditIcon}>
                  <Pencil size={18} color="#666" />
                </TouchableOpacity>
              )}
              {expandedSections['military'] ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSections['military'] && (
            <View style={styles.profileSectionContent}>
              <InfoRow
                label="Askerlik Durumu"
                value={userMilitary?.militaryStatus === 0 ? 'Yapıldı' : userMilitary?.militaryStatus === 1 ? 'Ertelendi' : userMilitary?.militaryStatus === 2 ? 'Muaf' : 'Uygulanmaz'}
                isLast
              />
            </View>
          )}
        </View>

        <Accordion
          title="AİLE BİLGİLERİ"
          icon={<Users2 size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
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
          icon={<GraduationCap size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
          actionButton={
            <TouchableOpacity style={styles.addIconButton} onPress={() => setAddEducationModalVisible(true)}>
              <Plus size={18} color="#7C3AED" />
            </TouchableOpacity>
          }
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
          icon={<Globe size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
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
          title="SERTİFİKALAR"
          icon={<Award size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
          actionButton={
            <TouchableOpacity style={styles.addIconButton} onPress={() => setAddCertificateModalVisible(true)}>
              <Plus size={18} color="#7C3AED" />
            </TouchableOpacity>
          }
        >
          {profileDetails.certificates.length > 0 ? (
            profileDetails.certificates.map((cert, index) => (
              <View key={cert.id}>
                <InfoRow label="Sertifika Adı" value={cert.name} />
                <InfoRow label="Veren Kuruluş" value={cert.issuer} />
                <InfoRow label="Veriliş Tarihi" value={formatDate(cert.issueDate)} />
                {cert.expiryDate && (
                  <InfoRow label="Geçerlilik Tarihi" value={formatDate(cert.expiryDate)} />
                )}
                <InfoRow label="" value="" isLast={index === profileDetails.certificates.length - 1} />
              </View>
            ))
          ) : (
            <InfoRow label="Sertifika" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="DİL BİLGİLERİ"
          icon={<Languages size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
          actionButton={
            <TouchableOpacity style={styles.addIconButton} onPress={() => setAddLanguageModalVisible(true)}>
              <Plus size={18} color="#7C3AED" />
            </TouchableOpacity>
          }
        >
          {profileDetails.userLanguages.length > 0 ? (
            profileDetails.userLanguages.map((lang, index) => (
              <View key={lang.userLanguageId}>
                <InfoRow label="Dil" value={lang.languageName} />
                <InfoRow label="Seviye" value={lang.languageLevel === 0 ? 'Başlangıç' : lang.languageLevel === 1 ? 'Orta' : lang.languageLevel === 2 ? 'İleri' : 'Anadil'} isLast={index === profileDetails.userLanguages.length - 1} />
              </View>
            ))
          ) : (
            <InfoRow label="Yabancı Dil" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="PASAPORT BİLGİLERİ"
          icon={<FileText size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
        >
          {profileDetails.userPassport && profileDetails.userPassport.passportNumber ? (
            <>
              <InfoRow label="Pasaport No" value={profileDetails.userPassport.passportNumber} />
              <InfoRow label="Pasaport Tipi" value={profileDetails.userPassport.passportType === 0 ? 'Genel' : profileDetails.userPassport.passportType === 1 ? 'Hususi' : 'Hizmet'} />
              <InfoRow label="Geçerlilik Tarihi" value={formatDate(profileDetails.userPassport.passportValidityDate)} isLast />
            </>
          ) : (
            <InfoRow label="Pasaport" value="Bilgi yok" isLast />
          )}
        </Accordion>

        <Accordion
          title="VİZE BİLGİLERİ"
          icon={<Globe size={18} color="#1a1a1a" />}
          isExpandedDefault={false}
          actionButton={
            <TouchableOpacity style={styles.addIconButton} onPress={() => setAddVisaModalVisible(true)}>
              <Plus size={18} color="#7C3AED" />
            </TouchableOpacity>
          }
        >
          {isAdmin && (
            <TouchableOpacity
              style={styles.visaRequestButton}
              activeOpacity={0.7}
              onPress={() => setVisaModalVisible(true)}
            >
              <Text style={styles.visaRequestButtonText}>Vize Evrakı Talep Et</Text>
            </TouchableOpacity>
          )}

          {profileDetails.userVisas.length > 0 ? (
            <View style={{ marginTop: 16 }}>
              {profileDetails.userVisas.map((visa: any, index: number) => (
                <View key={visa.id || index} style={styles.visaCard}>
                  <View style={styles.visaCardHeader}>
                    <Text style={styles.visaCardCountry}>{visa.country || visa.countryName || '-'}</Text>
                    {isAdmin && (
                      <View style={styles.visaCardActions}>
                        <TouchableOpacity
                          style={styles.visaCardActionButton}
                          activeOpacity={0.7}
                        >
                          <Pencil size={18} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.visaCardActionButton}
                          activeOpacity={0.7}
                        >
                          <X size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.visaCardContent}>
                    <View style={styles.visaCardRow}>
                      <Text style={styles.visaCardLabel}>Vize Türü</Text>
                      <Text style={styles.visaCardValue}>{getVisaTypeText(visa.visaType)}</Text>
                    </View>
                    <View style={styles.visaCardRow}>
                      <Text style={styles.visaCardLabel}>Alındığı Tarih</Text>
                      <Text style={styles.visaCardValue}>{(visa.issueDate || visa.visaStartDate) ? formatDate(visa.issueDate || visa.visaStartDate) : '-'}</Text>
                    </View>
                    <View style={styles.visaCardRow}>
                      <Text style={styles.visaCardLabel}>Bitiş Tarihi</Text>
                      <Text style={styles.visaCardValue}>{(visa.expiryDate || visa.visaEndDate) ? formatDate(visa.expiryDate || visa.visaEndDate) : '-'}</Text>
                    </View>
                    <View style={[styles.visaCardRow, { borderBottomWidth: 0 }]}>
                      <Text style={styles.visaCardLabel}>Durum</Text>
                      <Text style={styles.visaCardValue}>
                        {visa.status !== undefined ? getVisaStatusText(visa.status) : ((visa.expiryDate || visa.visaEndDate) && new Date(visa.expiryDate || visa.visaEndDate || '') > new Date() ? 'Geçerli' : 'Geçersiz')}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.visaEmptyText}>Vize bilgisi bulunmamaktadır.</Text>
          )}
        </Accordion>
      </>
    );
  };

  const renderOnboardingSection = () => {
    const hasProcess = onboardingProcess !== null;
    const hasTasks = onboardingTasks && onboardingTasks.length > 0;
    const hasQuestions = onboardingQuestions && onboardingQuestions.length > 0;

    const userName = profileDetails?.personalInformation
      ? `${profileDetails.personalInformation.firstName} ${profileDetails.personalInformation.lastName}`
      : user?.full_name || 'Kullanıcı';

    const userPosition = profileDetails?.workingInformation?.position?.name || 'Pozisyon';
    const userOrganization = profileDetails?.workingInformation?.workplace?.name || 'Organizasyon';

    const onboardingSteps = [
      { id: 1, label: 'Hoşgeldin Paketi Gönderildi', completed: onboardingProcess?.welcomePackageSent },
      { id: 2, label: 'Hoşgeldin Paketi Görüntülendi', completed: onboardingProcess?.welcomePackageViewed },
      { id: 3, label: 'Yeni Çalışan Bilgileri Dolduruldu', completed: onboardingProcess?.employeeInfoFilled },
      { id: 4, label: 'Tanışma Soruları Cevaplandı', completed: onboardingProcess?.introQuestionsAnswered },
      { id: 5, label: 'İşe Başlama Görevleri Tamamlandı', completed: onboardingProcess?.tasksCompleted },
      { id: 6, label: 'Hoşgeldin Görevleri Tamamlandı', completed: false },
    ];

    const groupTasksByCategory = () => {
      const grouped: Record<string, any[]> = {};
      onboardingTasks.forEach((task) => {
        const category = task.category || 'Genel';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(task);
      });
      return grouped;
    };

    const groupedTasks = hasTasks ? groupTasksByCategory() : {};

    const isOverdue = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      return due < today;
    };

    const hasAnyData = hasProcess || hasTasks || hasQuestions;

    return (
      <ScrollView style={styles.onboardingContainer}>
        {onboardingLoading ? (
          <View style={styles.onboardingEmptyContainer}>
            <Briefcase size={80} color="#E5E7EB" strokeWidth={1} />
            <Text style={styles.onboardingEmptyText}>İşe başlama bilgileri yükleniyor...</Text>
          </View>
        ) : !hasAnyData ? (
          <View style={styles.onboardingEmptyContainer}>
            <Briefcase size={80} color="#E5E7EB" strokeWidth={1} />
            <Text style={styles.onboardingEmptyText}>İşe başlama bilgileri yükleniyor...</Text>
          </View>
        ) : (
          <>
            <View style={styles.onboardingHeader}>
              <Briefcase size={18} color="#1a1a1a" />
              <Text style={styles.onboardingSectionTitle}>İŞE BAŞLAMA (ONBOARDING)</Text>
            </View>

            <TouchableOpacity
              style={styles.welcomePackageButtonMain}
              onPress={() => setWelcomePackageModalVisible(true)}
            >
              <Text style={styles.welcomePackageButtonMainText}>Hoşgeldin Paketi Gönder</Text>
            </TouchableOpacity>

        <View style={styles.onboardingStepsContainer}>
          {onboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.onboardingStepWrapper}>
              <View style={styles.onboardingStepLeftColumn}>
                <View style={[
                  styles.onboardingStepNumber,
                  step.completed && styles.onboardingStepNumberCompleted
                ]}>
                  <Text style={[
                    styles.onboardingStepNumberText,
                    step.completed && styles.onboardingStepNumberTextCompleted
                  ]}>
                    {step.id}
                  </Text>
                </View>
                {index < onboardingSteps.length - 1 && (
                  <View style={styles.onboardingStepConnector} />
                )}
              </View>
              <Text style={[
                styles.onboardingStepLabel,
                step.completed && styles.onboardingStepLabelCompleted
              ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {hasTasks && (
          <View style={styles.onboardingSection}>
            <TouchableOpacity
              style={styles.onboardingSectionHeader}
              onPress={() => setOnboardingTasksExpanded(!onboardingTasksExpanded)}
            >
              <View style={styles.onboardingSectionHeaderLeft}>
                <AlignJustify size={18} color="#1a1a1a" />
                <Text style={styles.onboardingSectionHeaderText}>İŞE BAŞLAMA GÖREVLERİ</Text>
              </View>
              {onboardingTasksExpanded ? (
                <ChevronUp size={20} color="#1a1a1a" />
              ) : (
                <ChevronDown size={20} color="#1a1a1a" />
              )}
            </TouchableOpacity>

            {onboardingTasksExpanded && (
              <View style={styles.onboardingTasksList}>
                {Object.entries(groupedTasks).map(([category, tasks]) => (
                  <View key={category} style={styles.taskCategory}>
                    <View style={styles.taskCategoryTitleContainer}>
                      <Text style={styles.taskCategoryTitle}>{category}</Text>
                    </View>
                    {tasks.map((task: any) => (
                      <View key={task.id} style={styles.taskItem}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.assignedToName && (
                          <View style={styles.taskInfoRow}>
                            <Text style={styles.taskInfoLabel}>İlgili</Text>
                            <Text style={styles.taskInfoValue}>{task.assignedToName}</Text>
                          </View>
                        )}
                        <View style={styles.taskInfoRow}>
                          <Text style={styles.taskInfoLabel}>Son Tarih</Text>
                          <Text style={[
                            styles.taskInfoValue,
                            !task.isCompleted && isOverdue(task.dueDate) && styles.taskInfoValueOverdue
                          ]}>
                            {formatDate(task.dueDate)}
                          </Text>
                        </View>
                        {task.isCompleted ? (
                          <View style={styles.taskCompletedBadge}>
                            <Text style={styles.taskCompletedText}>Tamamlandı</Text>
                          </View>
                        ) : task.dueDate ? (
                          <View style={styles.taskButtonsRow}>
                            <TouchableOpacity
                              style={styles.taskCompleteButton}
                              onPress={() => handleCompleteTask(Number(task.id))}
                            >
                              <Text style={styles.taskCompleteButtonText}>Görevi Tamamla</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.taskArrowButton}>
                              <ChevronRight size={20} color="#fff" strokeWidth={3} />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.taskInfoBadge}>
                            <Text style={styles.taskInfoBadgeText}>Görev Tanımı</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {hasQuestions && (
          <View style={styles.onboardingSection}>
            <TouchableOpacity
              style={styles.onboardingSectionHeader}
              onPress={() => setOnboardingQuestionsExpanded(!onboardingQuestionsExpanded)}
            >
              <View style={styles.onboardingSectionHeaderLeft}>
                <Users size={18} color="#1a1a1a" />
                <Text style={styles.onboardingSectionHeaderText}>SENİ TANIYALIM</Text>
              </View>
              {onboardingQuestionsExpanded ? (
                <ChevronUp size={20} color="#1a1a1a" />
              ) : (
                <ChevronDown size={20} color="#1a1a1a" />
              )}
            </TouchableOpacity>

            {onboardingQuestionsExpanded && (
              <View style={styles.onboardingQuestionsList}>
                <Text style={styles.questionsSubtitle}>Seni Tanıyalım Soruları</Text>
                {onboardingQuestions.map((question: any) => (
                  <View key={question.id} style={styles.questionItem}>
                    <View style={styles.questionHeader}>
                      <Text style={styles.questionText}>{question.question}</Text>
                      <TouchableOpacity style={styles.questionDeleteButton}>
                        <Text style={styles.questionDeleteText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                    {question.isRequired && (
                      <View style={styles.questionRequiredRow}>
                        <View style={styles.questionCheckbox}>
                          <Check size={12} color="#fff" strokeWidth={3} />
                        </View>
                        <Text style={styles.questionRequiredText}>Zorunlu Soru</Text>
                      </View>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={styles.addQuestionButton}>
                  <Text style={styles.addQuestionButtonText}>Soru Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendIntroEmailButton}>
                  <Text style={styles.sendIntroEmailButtonText}>Seni Tanıyalım E-postası Gönder</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
          </>
        )}
      </ScrollView>
    );
  };

  const renderPDKSSection = () => {
    if (pdksLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.emptyText}>PDKS bilgileri yükleniyor...</Text>
        </View>
      );
    }

    const hasShiftPlan = userShiftPlan !== null;
    const hasWorkLogs = userWorkLogs && userWorkLogs.length > 0;

    if (!hasShiftPlan && !hasWorkLogs) {
      return (
        <View style={styles.emptyState}>
          <Clock size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>PDKS bilgileri bulunmuyor.</Text>
        </View>
      );
    }

    return (
      <View style={styles.pdksSection}>
        {hasShiftPlan && (
          <View style={styles.pdksInfoGrid}>
            <Text style={styles.pdksSectionTitle}>Vardiya Planı</Text>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Vardiya Adı:</Text>
              <Text style={styles.pdksInfoValue}>{userShiftPlan.shiftPlanName || 'Belirtilmemiş'}</Text>
            </View>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Vardiya Tipi:</Text>
              <Text style={styles.pdksInfoValue}>{userShiftPlan.shiftType || 'Belirtilmemiş'}</Text>
            </View>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Başlangıç:</Text>
              <Text style={styles.pdksInfoValue}>{userShiftPlan.startTime || '-'}</Text>
            </View>
            <View style={styles.pdksInfoRow}>
              <Text style={styles.pdksInfoLabel}>Bitiş:</Text>
              <Text style={styles.pdksInfoValue}>{userShiftPlan.endTime || '-'}</Text>
            </View>
            {userShiftPlan.workDays && (
              <View style={styles.pdksInfoRow}>
                <Text style={styles.pdksInfoLabel}>Çalışma Günleri:</Text>
                <Text style={styles.pdksInfoValue}>{userShiftPlan.workDays}</Text>
              </View>
            )}
          </View>
        )}

        {hasWorkLogs && (
          <View style={{ marginTop: hasShiftPlan ? 24 : 0 }}>
            <Text style={styles.pdksSectionTitle}>Çalışma Kayıtları</Text>
            {userWorkLogs.slice(0, 5).map((log: any, index: number) => (
              <View key={index} style={styles.pdksHistoryCard}>
                <View style={styles.pdksHistoryHeader}>
                  <Text style={styles.pdksHistoryDate}>{formatDate(log.date)}</Text>
                </View>
                <View style={styles.pdksHistoryDetails}>
                  <View style={styles.pdksHistoryRow}>
                    <Text style={styles.pdksHistoryLabel}>Giriş:</Text>
                    <Text style={styles.pdksHistoryValue}>{log.checkInTime || '-'}</Text>
                  </View>
                  <View style={styles.pdksHistoryRow}>
                    <Text style={styles.pdksHistoryLabel}>Çıkış:</Text>
                    <Text style={styles.pdksHistoryValue}>{log.checkOutTime || '-'}</Text>
                  </View>
                  <View style={styles.pdksHistoryRow}>
                    <Text style={styles.pdksHistoryLabel}>Toplam Saat:</Text>
                    <Text style={styles.pdksHistoryValue}>{log.totalWorkHours || 0} saat</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {!hasWorkLogs && hasShiftPlan && (
          <View style={styles.emptyState}>
            <Text style={styles.pdksEmptyText}>Henüz çalışma kaydı bulunmuyor.</Text>
          </View>
        )}
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

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setProfileMenuVisible(true)}
            >
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

          <View style={styles.dropdownContainer}>
            <ProfileDropdown
              options={profileSections}
              selectedOption={selectedSection}
              onSelect={setSelectedSection}
            />
          </View>

          <View style={styles.sectionsContainer}>
            {renderSectionContent()}
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
                {(() => {
                  const photoUrl = normalizePhotoUrl(badgeCardInfo?.profilePhoto);
                  if (photoUrl) {
                    return (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.modalUserImage}
                      />
                    );
                  }
                  return (
                    <View style={styles.modalUserPlaceholder}>
                      <UserIcon size={24} color="#7C3AED" />
                    </View>
                  );
                })()}
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
                {(() => {
                  const photoUrl = normalizePhotoUrl(badgeCardInfo?.profilePhoto);
                  if (photoUrl) {
                    return (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.leaveUserImage}
                      />
                    );
                  }
                  return (
                    <View style={styles.leaveUserPlaceholder}>
                      <UserIcon size={24} color="#7C3AED" />
                    </View>
                  );
                })()}
                <View style={styles.leaveUserInfo}>
                  <Text style={styles.leaveUserName}>{badgeCardInfo?.fullName || `${user.firstName} ${user.lastName}`}</Text>
                  <Text style={styles.leaveUserRole}>{badgeCardInfo?.title || profileDetails?.currentTitle || '—'}</Text>
                </View>
                <View style={styles.leaveBalanceBox}>
                  <Text style={styles.leaveBalanceLabel}>İZİN BAKİYESİ</Text>
                  <Text style={styles.leaveBalanceValue}>{badgeCardInfo?.dayOffBalance ?? dayOffBalance} Gün</Text>
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
                <TouchableOpacity
                  style={styles.formDatePicker}
                  onPress={() => setStartDatePickerVisible(true)}
                >
                  <Text style={[styles.formDateInput, { color: leaveForm.startDate ? '#1a1a1a' : '#999' }]}>
                    {formatDateForDisplay(leaveForm.startDate) || 'YYYY-MM-DD'}
                  </Text>
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bitiş Tarihi</Text>
                <TouchableOpacity
                  style={styles.formDatePicker}
                  onPress={() => setEndDatePickerVisible(true)}
                >
                  <Text style={[styles.formDateInput, { color: leaveForm.endDate ? '#1a1a1a' : '#999' }]}>
                    {formatDateForDisplay(leaveForm.endDate) || 'YYYY-MM-DD'}
                  </Text>
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
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

      {user && user.backend_user_id && user.organization_id && (
        <WelcomePackageModal
          visible={welcomePackageModalVisible}
          onClose={() => setWelcomePackageModalVisible(false)}
          userId={user.backend_user_id}
          organizationId={user.organization_id}
          onSubmit={handleSendWelcomePackage}
          onSuccess={() => setWelcomePackageSuccessModalVisible(true)}
        />
      )}

      <SuccessModal
        visible={welcomePackageSuccessModalVisible}
        onClose={() => {
          setWelcomePackageSuccessModalVisible(false);
          loadOnboardingData();
        }}
        title="Hoşgeldin Paketi Gönderildi"
        message="Hoşgeldin paketi başarıyla gönderildi."
      />

      <PDKSTaskModal
        visible={pdksTaskModalVisible}
        onClose={() => setPdksTaskModalVisible(false)}
        onSubmit={handleCreatePDKSTask}
      />

      <ProfileMenu
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        profilePhoto={normalizePhotoUrl(user?.profilePictureUrl)}
        email={user?.email || ''}
        name={user ? `${user.firstName} ${user.lastName}` : ''}
        onLogout={async () => {
          setProfileMenuVisible(false);
          await logout();
          router.replace('/(auth)/login');
        }}
      />

      {user && user.backend_user_id && (
        <InboxModal
          visible={inboxVisible}
          onClose={() => setInboxVisible(false)}
          backendUserId={user.backend_user_id}
          userName={`${user.firstName} ${user.lastName}`}
        />
      )}

      {user && user.backend_user_id && (
        <VisaRequestModal
          visible={visaModalVisible}
          onClose={() => setVisaModalVisible(false)}
          userId={user.backend_user_id}
          onSubmit={handleVisaRequest}
        />
      )}

      {visaRequestData && profileDetails && (
        <VisaPreviewModal
          visible={visaPreviewVisible}
          onClose={() => {
            setVisaPreviewVisible(false);
            setVisaModalVisible(true);
          }}
          onSend={handleSendVisa}
          data={{
            userName: profileDetails.fullName || 'Artı 365',
            userTitle: profileDetails.title || '-Bilinmiyor-',
            visaType: visaRequestData.visaType,
            countryName: visaRequestData.countryName,
            cityName: visaRequestData.cityName,
            entryDate: visaRequestData.entryDate,
            exitDate: visaRequestData.exitDate,
            notes: visaRequestData.notes,
          }}
        />
      )}

      <SuccessModal
        visible={visaSuccessVisible}
        onClose={() => {
          setVisaSuccessVisible(false);
          setVisaRequestData(null);
        }}
        title="Vize bilgisi başarıyla eklendi"
        message="Vize bilgisi başarıyla kaydedildi."
      />

      <DatePicker
        visible={startDatePickerVisible}
        onClose={() => setStartDatePickerVisible(false)}
        onSelectDate={(date) => {
          setLeaveForm({ ...leaveForm, startDate: date });
          setStartDatePickerVisible(false);
        }}
        initialDate={leaveForm.startDate}
      />

      <DatePicker
        visible={endDatePickerVisible}
        onClose={() => setEndDatePickerVisible(false)}
        onSelectDate={(date) => {
          setLeaveForm({ ...leaveForm, endDate: date });
          setEndDatePickerVisible(false);
        }}
        initialDate={leaveForm.endDate}
      />

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
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setGenderDropdownOpen(!genderDropdownOpen)}
                >
                  <Text style={styles.dropdownButtonText}>{profileEditForm.gender || 'Seçiniz'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {genderDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {genders.map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setProfileEditForm({ ...profileEditForm, gender });
                          setGenderDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{gender}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Medeni Hal</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setMaritalStatusDropdownOpen(!maritalStatusDropdownOpen)}
                >
                  <Text style={styles.dropdownButtonText}>{profileEditForm.maritalStatus || 'Seçiniz'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {maritalStatusDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {maritalStatuses.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setProfileEditForm({ ...profileEditForm, maritalStatus: status });
                          setMaritalStatusDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setBloodTypeDropdownOpen(!bloodTypeDropdownOpen)}
                >
                  <Text style={styles.dropdownButtonText}>{healthEditForm.bloodType || 'Seçiniz'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {bloodTypeDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {bloodTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setHealthEditForm({ ...healthEditForm, bloodType: type });
                          setBloodTypeDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setMilitaryStatusDropdownOpen(!militaryStatusDropdownOpen)}
                >
                  <Text style={styles.dropdownButtonText}>{militaryEditForm.status || 'Seçiniz'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                {militaryStatusDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {militaryStatuses.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setMilitaryEditForm({ ...militaryEditForm, status });
                          setMilitaryStatusDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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

      <AddEducationModal
        visible={addEducationModalVisible}
        onClose={() => setAddEducationModalVisible(false)}
        onSubmit={handleAddEducation}
      />

      <AddCertificateModal
        visible={addCertificateModalVisible}
        onClose={() => setAddCertificateModalVisible(false)}
        onSubmit={handleSubmitCertificate}
      />

      <AddLanguageModal
        visible={addLanguageModalVisible}
        onClose={() => setAddLanguageModalVisible(false)}
        onSubmit={handleSubmitLanguage}
      />

      <AddVisaModal
        visible={addVisaModalVisible}
        onClose={() => setAddVisaModalVisible(false)}
        onSubmit={handleSubmitVisa}
      />

      <AddDriverLicenseModal
        visible={addDriverLicenseModalVisible}
        onClose={() => setAddDriverLicenseModalVisible(false)}
        onSubmit={handleSubmitDriverLicense}
      />

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 0,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  dropdownContainer: {
    marginTop: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  profileDetails: {
    gap: 8,
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
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#7C3AED',
    marginRight: 16,
  },
  assetUserPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#7C3AED',
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
    backgroundColor: '#7C3AED',
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
  personAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownButtonText: {
    fontSize: 15,
    color: '#1a1a1a',
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
  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  taskCompletedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskCompletedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  taskInfo: {
    gap: 8,
    marginBottom: 12,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskInfoValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  taskInfoValueDate: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  completeTaskButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeTaskButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
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
  profileInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileInfoImageContainer: {
    marginRight: 12,
  },
  profileInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  profileInfoImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoDetails: {
    flex: 1,
  },
  profileInfoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  profileInfoText: {
    fontSize: 13,
    color: '#666',
  },
  profileSectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  profileSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileSectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileEditIcon: {
    padding: 4,
  },
  profileSectionContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  onboardingUserCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  onboardingAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  onboardingUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  onboardingUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  onboardingUserInfoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  onboardingDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 16,
  },
  onboardingDropdownText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  onboardingEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  onboardingEmptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  onboardingLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  onboardingLogoutButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  onboardingLogoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  onboardingHeader: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onboardingSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  welcomePackageButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomePackageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  welcomePackageButtonMain: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomePackageButtonMainText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  onboardingStepsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  onboardingStepWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  onboardingStepLeftColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  onboardingStepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
    minHeight: 20,
  },
  onboardingStepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  onboardingStepIndicatorCompleted: {
    backgroundColor: '#7C3AED',
  },
  onboardingStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  onboardingStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingStepNumberCompleted: {
    backgroundColor: '#7C3AED',
  },
  onboardingStepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  onboardingStepNumberTextCompleted: {
    color: '#fff',
  },
  onboardingStepLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    paddingTop: 4,
    paddingBottom: 12,
  },
  onboardingStepLabelCompleted: {
    color: '#6B7280',
    fontWeight: '400',
  },
  onboardingSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  onboardingSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  onboardingSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onboardingSectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  onboardingTasksList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  taskCategory: {
    marginBottom: 16,
  },
  taskCategoryTitleContainer: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  taskCategoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 10,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskInfoValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  taskInfoValueOverdue: {
    color: '#DC2626',
  },
  taskCompletedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  taskCompletedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#065F46',
  },
  taskInfoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  taskInfoBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3730A3',
  },
  taskButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  taskCompleteButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCompleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  taskArrowButton: {
    backgroundColor: '#7C3AED',
    width: 42,
    height: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskGoButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#7C3AED',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 8,
  },
  taskGoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  onboardingQuestionsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  questionsSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  questionDeleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 6,
  },
  questionDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  questionRequiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  questionCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionRequiredText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  sendIntroEmailButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  sendIntroEmailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyStateContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyStateLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyStateLogoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  visaRequestButton: {
    alignSelf: 'center',
    minWidth: 200,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  visaRequestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  visaCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  visaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visaCardCountry: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  visaCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  visaCardActionButton: {
    padding: 4,
  },
  visaCardContent: {
    gap: 0,
  },
  visaCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  visaCardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  visaCardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  visaEmptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoRowWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLabel: {
    fontSize: 14,
    color: '#666',
  },
  personnelStatusRow: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  personnelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  personnelNoLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1a1a1a',
  },
  personnelNoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  statusBadgeInactive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadgeTextActive: {
    color: '#FFFFFF',
  },
  statusBadgeTextInactive: {
    color: '#DC2626',
  },
  addIconButton: {
    padding: 4,
  },
});
