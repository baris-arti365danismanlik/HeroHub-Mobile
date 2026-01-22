import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, User, Phone, Mail, MapPin, Heart, FileText, Shield, Users, GraduationCap, Award, MessageCircle, Globe, Plane, ChevronDown, ChevronUp, Building2, Briefcase, Car, Plus, Pencil, Trash2, Smartphone, Clock, Linkedin, Facebook, Instagram } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import type { UserProfileDetails } from '@/types/backend';
import { usePermissions, MODULE_IDS } from '@/hooks/usePermissions';
import { Accordion } from '@/components/Accordion';
import { normalizePhotoUrl } from '@/utils/formatters';
import EditSectionModal from '@/components/EditSectionModal';
import { VisaRequestModal, type VisaRequestData } from '@/components/VisaRequestModal';
import { AddEducationModal, EducationFormData } from '@/components/AddEducationModal';
import { SuccessModal } from '@/components/SuccessModal';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<UserProfileDetails | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editSectionType, setEditSectionType] = useState<'personal' | 'contact' | 'address' | 'health' | 'military' | null>(null);
  const [visaRequestModalVisible, setVisaRequestModalVisible] = useState(false);
  const [addEducationModalVisible, setAddEducationModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [successTitle, setSuccessTitle] = useState<string>('Başarılı');

  const permissions = usePermissions(employee?.modulePermissions);
  const canViewProfile = permissions.canRead(MODULE_IDS.PROFILE);
  const isOwnProfile = employee?.backendUserId === user?.backendUserId;
  const canEditProfile = isOwnProfile && permissions.canWrite(MODULE_IDS.PROFILE);

  useEffect(() => {
    loadEmployeeData();
    loadCountries();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const employeeId = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);

      const data = await userService.getUserProfile(employeeId);
      setEmployee(data);
    } catch (error) {
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const countriesData = await userService.getCountries();
      setCountries(countriesData);
    } catch (error) {
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === '0001-01-01T00:00:00' || dateString === '0001-01-01T08:00:00Z') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatJobStartDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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

  const getGenderText = (gender: number): string => {
    switch (gender) {
      case 0: return 'Erkek';
      case 1: return 'Kadın';
      default: return '-';
    }
  };

  const getMaritalStatusText = (status: number): string => {
    switch (status) {
      case 0: return 'Bekar';
      case 1: return 'Evli';
      case 2: return 'Boşanmış';
      default: return '-';
    }
  };

  const getBloodTypeText = (bloodType: number): string => {
    const types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];
    return types[bloodType] || '-';
  };

  const getMilitaryStatusText = (status: number): string => {
    const statuses = ['Tamamlandı', 'Ertelenmiş', 'Muaf', 'Tabi Değil'];
    return statuses[status] || '-';
  };

  const getWorkTypeText = (workType: number): string => {
    const types = ['Ofis', 'Uzaktan', 'Hibrit', '', 'Sözleşmeli'];
    return types[workType] || '-';
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

  const handleEditSection = (sectionId: 'personal' | 'contact' | 'address' | 'health' | 'military') => {
    setEditSectionType(sectionId);
    setEditModalVisible(true);
  };

  const handleSaveSection = async () => {
    await loadEmployeeData();
  };

  const handleVisaRequest = async (data: VisaRequestData) => {
    const employeeId = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);
    if (!employeeId) return;

    try {
      setLoading(true);

      const convertDateToISO = (dateStr: string): string => {
        if (!dateStr) return '';
        const parts = dateStr.split('/').map(p => p.trim());
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const date = new Date(`${year}-${month}-${day}`);
          return date.toISOString();
        }
        return '';
      };

      await userService.createUserVisa({
        userId: employeeId,
        visaType: data.visaTypeId,
        countryId: data.countryId,
        visaStartDate: convertDateToISO(data.entryDate),
        visaEndDate: convertDateToISO(data.exitDate),
        note: data.notes,
      });

      await loadEmployeeData();

      setVisaRequestModalVisible(false);
      setSuccessTitle('Başarılı');
      setSuccessMessage('Vize bilgisi başarıyla eklendi');
      setSuccessModalVisible(true);
    } catch (error: any) {
      alert(error.message || 'Vize bilgisi eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = async (data: EducationFormData) => {
    const employeeId = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);
    if (!employeeId) return;

    try {
      setLoading(true);

      await userService.createUserEducation({
        userId: employeeId,
        level: data.level,
        schoolName: data.schoolName,
        department: data.department,
        gpa: data.gpa,
        gpaSystem: data.gpaSystem,
        language: data.language,
        startDate: data.startDate,
        endDate: data.endDate,
      });

      await loadEmployeeData();

      setAddEducationModalVisible(false);
      setSuccessTitle('Başarılı');
      setSuccessMessage('Eğitim bilgisi başarıyla eklendi');
      setSuccessModalVisible(true);
    } catch (error: any) {
      alert(error.message || 'Eğitim bilgisi eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderInfoRow = (label: string | null, value: string) => {
    if (!label) {
      return (
        <View style={styles.infoRowContainer}>
          <Text style={styles.infoRowFullWidth}>{value}</Text>
        </View>
      );
    }

    return (
      <View style={styles.infoRowContainer}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  if (!employee) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Bilgileri</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Çalışan bulunamadı.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const contactInfo = employee?.userContact;
  const socialMedia = employee?.socialMedia;
  const manager = employee?.reportsTo;
  const colleagues = employee?.colleagues || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Bilgileri</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {(() => {
              const photoUrl = normalizePhotoUrl(employee?.personalInformation?.profilePhoto);
              if (photoUrl) {
                return <Image source={{ uri: photoUrl }} style={styles.profileImage} />;
              }
              return (
                <View style={styles.profileImagePlaceholder}>
                  <User size={48} color="#7C3AED" />
                </View>
              );
            })()}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {employee.personalInformation?.firstName} {employee.personalInformation?.lastName}
            </Text>

            <View style={styles.profileDetails}>
              {employee.currentTitle && (
                <View style={styles.profileDetailRow}>
                  <Award size={16} color="#7C3AED" />
                  <Text style={[styles.profileDetailText, { color: '#7C3AED', fontWeight: '600' }]}>
                    {employee.currentTitle}
                  </Text>
                </View>
              )}
              <View style={styles.profileDetailRow}>
                <Briefcase size={16} color="#666" />
                <Text style={styles.profileDetailText}>
                  {employee.personalInformation?.position || '-'}
                </Text>
              </View>
              {employee.organizationName && (
                <View style={styles.profileDetailRow}>
                  <Building2 size={16} color="#666" />
                  <Text style={styles.profileDetailText}>{employee.organizationName}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
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
                  <TouchableOpacity style={styles.socialIcon}>
                    <Linkedin size={20} color="#fff" />
                  </TouchableOpacity>
                )}
                {socialMedia.facebook && (
                  <TouchableOpacity style={styles.socialIcon}>
                    <Facebook size={20} color="#fff" />
                  </TouchableOpacity>
                )}
                {socialMedia.instagram && (
                  <TouchableOpacity style={styles.socialIcon}>
                    <Instagram size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.dividerLine} />

            <View style={styles.workInfoSection}>
              <Text style={styles.workInfoTitle}>İşe Başlama Tarihi</Text>
              <Text style={styles.workInfoDate}>
                {employee?.jobStartDate ? formatJobStartDate(employee.jobStartDate) : '-'}
              </Text>
              <Text style={styles.workInfoDuration}>
                {employee?.jobStartDate ? calculateWorkDuration(employee.jobStartDate) : '-'}
              </Text>
            </View>

            <View style={styles.dividerLine} />

            {employee?.currentTitle && (
              <View style={styles.summaryDetailItem}>
                <Briefcase size={20} color="#333" />
                <Text style={styles.summaryDetailText}>{employee.currentTitle}</Text>
              </View>
            )}

            {employee?.organizationName && (
              <View style={styles.summaryDetailItem}>
                <Building2 size={20} color="#333" />
                <Text style={styles.summaryDetailText}>{employee.organizationName}</Text>
              </View>
            )}

            <View style={styles.dividerLine} />

            {manager && (
              <View style={styles.managerSection}>
                <Text style={styles.sectionTitle}>Yöneticisi</Text>
                <View style={styles.personItem}>
                  {manager.profilePhoto ? (
                    <Image
                      source={{ uri: normalizePhotoUrl(manager.profilePhoto) || '' }}
                      style={styles.personAvatarImage}
                    />
                  ) : (
                    <View style={styles.personAvatar}>
                      <User size={20} color="#7C3AED" />
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
                        source={{ uri: normalizePhotoUrl(colleague.profilePhoto) || '' }}
                        style={styles.personAvatarImage}
                      />
                    ) : (
                      <View style={styles.personAvatar}>
                        <User size={20} color="#7C3AED" />
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
        </View>

        <View style={styles.accordionContainer}>
          <Accordion
            title="KİŞİSEL BİLGİLER"
            icon={<User size={20} color="#1a1a1a" />}
            isExpandedDefault={true}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('personal')}
          >
            <View style={[styles.infoRowContainer, styles.personnelStatusRow]}>
              <View style={styles.personnelBadge}>
                <Text style={styles.personnelNoLabel}>Personel No: </Text>
                <Text style={styles.personnelNoValue}>{employee.personalInformation?.personnelNumber || '-'}</Text>
              </View>
              <View style={[styles.statusBadge, employee.userStatus === 1 ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                <Text style={[styles.statusBadgeText, employee.userStatus === 1 ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                  {employee.userStatus === 1 ? 'Aktif' : 'Pasif'}
                </Text>
              </View>
            </View>
            {renderInfoRow('TC Kimlik No', employee.personalInformation?.tckn || '-')}
            {renderInfoRow('Ad', employee.personalInformation?.firstName || '-')}
            {renderInfoRow('Soyad', employee.personalInformation?.lastName || '-')}
            {renderInfoRow('Doğum Tarihi', employee.personalInformation?.birthdate ? formatDate(employee.personalInformation.birthdate) : '-')}
            {renderInfoRow('Doğum Yeri', employee.personalInformation?.birthPlace || '-')}
            {renderInfoRow('Uyruk', employee.personalInformation?.nationality !== undefined && countries.length > 0 ? (countries.find((c: any) => c.id === employee.personalInformation?.nationality)?.name || '-') : '-')}
            {renderInfoRow('Cinsiyet', employee.personalInformation?.gender !== undefined ? getGenderText(employee.personalInformation.gender) : '-')}
            {renderInfoRow('Medeni Durum', employee.personalInformation?.maritalStatus !== undefined ? getMaritalStatusText(employee.personalInformation.maritalStatus) : '-')}
          </Accordion>

          <Accordion
            title="İLETİŞİM BİLGİLERİ"
            icon={<Phone size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('contact')}
          >
            {renderInfoRow('İş Telefonu', employee.userContact?.businessPhone || '-')}
            {renderInfoRow('Şahsi Telefon', employee.userContact?.phoneNumber || '-')}
            {renderInfoRow('Ev Telefonu', employee.userContact?.homePhone || '-')}
            {renderInfoRow('İş E-Postası', employee.userContact?.businessEmail || '-')}
            {renderInfoRow('Şahsi E-Posta', employee.userContact?.email || '-')}
            {renderInfoRow('Diğer E-Posta', employee.userContact?.otherEmail || '-')}
          </Accordion>

          <Accordion
            title="ADRES BİLGİLERİ"
            icon={<MapPin size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('address')}
          >
            {renderInfoRow(null, employee.userAddress?.address || '-')}
            {renderInfoRow('İlçe', employee.userAddress?.districtName || '-')}
            {renderInfoRow('İl', employee.userAddress?.cityName || '-')}
            {renderInfoRow('Ülke', employee.userAddress?.countryName || '-')}
          </Accordion>

          <Accordion
            title="SAĞLIK BİLGİLERİ"
            icon={<Heart size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('health')}
          >
            {renderInfoRow('Boy', employee.userHealth?.height ? `${employee.userHealth.height} cm` : '-')}
            {renderInfoRow('Kilo', employee.userHealth?.weight ? `${employee.userHealth.weight} kg` : '-')}
            {renderInfoRow('Beden', employee.userHealth?.size ? employee.userHealth.size.toString() : '-')}
            {renderInfoRow('Kan Grubu', employee.userHealth?.bloodType !== undefined ? getBloodTypeText(employee.userHealth.bloodType) : '-')}
            {renderInfoRow('Alerjiler', employee.userHealth?.allergies || '-')}
            {renderInfoRow('Kullandığı İlaçlar', employee.userHealth?.drugs || '-')}
          </Accordion>

          <Accordion
            title="EHLİYET BİLGİLERİ"
            icon={<Car size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.driverLicenses && employee.driverLicenses.length > 0 ? (
              employee.driverLicenses.map((license, index) => (
                <View key={index} style={styles.listItem}>
                  {renderInfoRow('Ehliyet Tipi', license.licenseType || '-')}
                  {renderInfoRow('Ehliyet No', license.licenseNumber || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(license.issueDate))}
                  {renderInfoRow('Geçerlilik Tarihi', formatDate(license.expiryDate))}
                  {index < employee.driverLicenses.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Ehliyet bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="ASKERLİK BİLGİLERİ"
            icon={<Shield size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('military')}
          >
            {renderInfoRow('Askerlik Durumu', employee.userMilitary?.militaryStatus !== undefined ? getMilitaryStatusText(employee.userMilitary.militaryStatus) : '-')}
            {renderInfoRow('Tecil Durumu', employee.userMilitary?.militaryPostpone || '-')}
            {renderInfoRow('Notlar', employee.userMilitary?.militaryNote || '-')}
          </Accordion>

          <Accordion
            title="AİLE BİLGİLERİ"
            icon={<Users size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.userFamilies && employee.userFamilies.length > 0 ? (
              employee.userFamilies.map((family, index) => (
                <View key={family.id} style={styles.listItem}>
                  {renderInfoRow('Yakınlık', family.relation || '-')}
                  {renderInfoRow('Ad Soyad', `${family.firstName} ${family.lastName}`)}
                  {renderInfoRow('Doğum Tarihi', formatDate(family.birthDate))}
                  {renderInfoRow('Telefon', family.phoneNumber || '-')}
                  {index < employee.userFamilies.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aile bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="EĞİTİM BİLGİLERİ"
            icon={<GraduationCap size={20} color="#1a1a1a" />}
            canEdit={false}
            actionButton={
              canEditProfile ? (
                <TouchableOpacity
                  onPress={() => setAddEducationModalVisible(true)}
                  style={{ padding: 4 }}
                >
                  <Plus size={20} color="#7C3AED" />
                </TouchableOpacity>
              ) : undefined
            }
          >
            {employee.educations && employee.educations.length > 0 ? (
              employee.educations.map((education, index) => (
                <View key={education.educationId} style={styles.listItem}>
                  {renderInfoRow('Okul Adı', education.schoolName || '-')}
                  {renderInfoRow('Bölüm', education.department || '-')}
                  {renderInfoRow('Not Ortalaması', education.gpa ? `${education.gpa}/${education.gpaSystem}` : '-')}
                  {renderInfoRow('Başlangıç', formatDate(education.startDate))}
                  {renderInfoRow('Bitiş', formatDate(education.endDate))}
                  {index < employee.educations.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Eğitim bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="SERTİFİKALAR"
            icon={<Award size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.certificates && employee.certificates.length > 0 ? (
              employee.certificates.map((cert, index) => (
                <View key={cert.id} style={styles.listItem}>
                  {renderInfoRow('Sertifika Adı', cert.name || '-')}
                  {renderInfoRow('Veren Kuruluş', cert.issuer || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(cert.issueDate))}
                  {cert.expiryDate && renderInfoRow('Geçerlilik', formatDate(cert.expiryDate))}
                  {index < employee.certificates.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Sertifika bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="SOSYAL LİNKLER"
            icon={<MessageCircle size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.socialMedia ? (
              <>
                {employee.socialMedia.linkedin && renderInfoRow('LinkedIn', employee.socialMedia.linkedin)}
                {employee.socialMedia.facebook && renderInfoRow('Facebook', employee.socialMedia.facebook)}
                {employee.socialMedia.instagram && renderInfoRow('Instagram', employee.socialMedia.instagram)}
                {employee.socialMedia.twitter && renderInfoRow('Twitter', employee.socialMedia.twitter)}
                {!employee.socialMedia.linkedin && !employee.socialMedia.facebook &&
                 !employee.socialMedia.instagram && !employee.socialMedia.twitter && (
                  <Text style={styles.emptyText}>Sosyal medya bilgisi bulunmuyor</Text>
                )}
              </>
            ) : (
              <Text style={styles.emptyText}>Sosyal medya bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="DİL BİLGİLERİ"
            icon={<Globe size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.userLanguages && employee.userLanguages.length > 0 ? (
              employee.userLanguages.map((lang, index) => (
                <View key={lang.userLanguageId} style={styles.listItem}>
                  {renderInfoRow('Dil', lang.languageName || '-')}
                  {renderInfoRow('Seviye', lang.languageLevel?.toString() || '-')}
                  {index < employee.userLanguages.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Dil bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="PASAPORT BİLGİLERİ"
            icon={<FileText size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {renderInfoRow('Pasaport No', employee.userPassport?.passportNumber || '-')}
            {renderInfoRow('Geçerlilik Tarihi', employee.userPassport?.passportValidityDate ? formatDate(employee.userPassport.passportValidityDate) : '-')}
          </Accordion>

          <Accordion
            title="VİZE BİLGİLERİ"
            icon={<Plane size={20} color="#1a1a1a" />}
            canEdit={false}
            subtitle={employee.userVisas && employee.userVisas.length > 0 ? undefined : 'Bilgi yok'}
            actionButton={
              canEditProfile ? (
                <TouchableOpacity
                  onPress={() => setVisaRequestModalVisible(true)}
                  style={{ padding: 4 }}
                >
                  <Plus size={20} color="#7C3AED" />
                </TouchableOpacity>
              ) : undefined
            }
          >
            {employee.userVisas && employee.userVisas.length > 0 ? (
              <View style={{ marginTop: 16, gap: 12 }}>
                {employee.userVisas.map((visa: any, index: number) => (
                  <View key={visa.id || index} style={styles.visaCard}>
                    <View style={styles.visaCardHeader}>
                      <Text style={styles.visaCountryText}>{visa.country || visa.countryName || '-'}</Text>
                      {canEditProfile && (
                        <View style={styles.visaCardActions}>
                          <TouchableOpacity style={styles.visaCardActionButton}>
                            <Pencil size={18} color="#7C3AED" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.visaCardActionButton}>
                            <Trash2 size={18} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <View style={styles.visaCardBody}>
                      {renderInfoRow('Vize Türü', getVisaTypeText(visa.visaType))}
                      {renderInfoRow('Alındığı Tarih', (visa.issueDate || visa.visaStartDate) ? formatDate(visa.issueDate || visa.visaStartDate || '') : '-')}
                      {renderInfoRow('Bitiş Tarihi', (visa.expiryDate || visa.visaEndDate) ? formatDate(visa.expiryDate || visa.visaEndDate || '') : '-')}
                      {visa.status !== undefined && renderInfoRow('Durum', getVisaStatusText(visa.status))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>ⓘ</Text>
                </View>
                <Text style={styles.emptyText}>Vize Bilgisi Bulunmamaktadır.</Text>
              </View>
            )}
          </Accordion>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <EditSectionModal
        visible={editModalVisible}
        sectionType={editSectionType}
        employee={employee}
        onClose={() => {
          setEditModalVisible(false);
          setEditSectionType(null);
        }}
        onSave={handleSaveSection}
      />

      <VisaRequestModal
        visible={visaRequestModalVisible}
        onClose={() => setVisaRequestModalVisible(false)}
        userId={employee?.backendUserId || employee?.id || 0}
        onSubmit={handleVisaRequest}
      />

      <AddEducationModal
        visible={addEducationModalVisible}
        onClose={() => setAddEducationModalVisible(false)}
        onSubmit={handleAddEducation}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={successTitle}
        message={successMessage}
      />
    </SafeAreaView>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
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
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  accordionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  infoRowContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoRowValue: {
    fontSize: 15,
    color: '#999',
  },
  infoRowFullWidth: {
    fontSize: 15,
    color: '#999',
  },
  listItem: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 28,
    color: '#9CA3AF',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  visaCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  visaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  visaCountryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  visaCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  visaCardActionButton: {
    padding: 4,
  },
  visaCardBody: {
    gap: 4,
  },
  personnelStatusRow: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
});
