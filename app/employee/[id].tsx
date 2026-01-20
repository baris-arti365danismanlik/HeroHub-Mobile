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
import { ArrowLeft, User, Phone, Mail, MapPin, Heart, FileText, Shield, Users, GraduationCap, Award, MessageCircle, Globe, Plane, CreditCard as Edit2, ChevronDown, ChevronUp, Building2, Briefcase, Car, Plus } from 'lucide-react-native';
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editSectionType, setEditSectionType] = useState<'personal' | 'contact' | 'address' | 'health' | 'military' | null>(null);
  const [visaRequestModalVisible, setVisaRequestModalVisible] = useState(false);
  const [addEducationModalVisible, setAddEducationModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const permissions = usePermissions(employee?.modulePermissions);
  const canViewProfile = permissions.canRead(MODULE_IDS.PROFILE);
  const canEditProfile = permissions.canWrite(MODULE_IDS.PROFILE);

  useEffect(() => {
    loadEmployeeData();
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

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === '0001-01-01T00:00:00' || dateString === '0001-01-01T08:00:00Z') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
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

      alert('Eğitim bilgisi başarıyla eklendi');
      setAddEducationModalVisible(false);
    } catch (error: any) {
      alert(error.message || 'Eğitim bilgisi eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRowContainer}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );

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
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileAvatarContainer}>
            {(() => {
              const photoUrl = normalizePhotoUrl(employee.profilePhoto);
              if (photoUrl) {
                return (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.profileAvatar}
                  />
                );
              }
              return (
                <View style={styles.profileAvatarPlaceholder}>
                  <Text style={styles.profileAvatarText}>
                    {employee.personalInformation?.firstName && employee.personalInformation?.lastName
                      ? `${employee.personalInformation.firstName[0]}${employee.personalInformation.lastName[0]}`
                      : '?'}
                  </Text>
                </View>
              );
            })()}
          </View>
          <Text style={styles.profileName}>
            {employee.personalInformation?.firstName && employee.personalInformation?.lastName
              ? `${employee.personalInformation.firstName} ${employee.personalInformation.lastName}`
              : 'İsimsiz'}
          </Text>
          {employee.currentTitle && (
            <View style={styles.profileBadge}>
              <Briefcase size={14} color="#7C3AED" />
              <Text style={styles.profileBadgeText}>{employee.currentTitle}</Text>
            </View>
          )}
          {employee.organizationName && (
            <View style={styles.profileBadge}>
              <Building2 size={14} color="#666" />
              <Text style={styles.profileBadgeText}>{employee.organizationName}</Text>
            </View>
          )}
        </View>

        <View style={styles.accordionContainer}>
          <Accordion
            title="KİŞİSEL BİLGİLER"
            icon={<User size={20} color="#1a1a1a" />}
            isExpandedDefault={true}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('personal')}
          >
            {renderInfoRow('TC Kimlik No', employee.personalInformation?.tckn || '-')}
            {renderInfoRow('Ad', employee.personalInformation?.firstName || '-')}
            {renderInfoRow('Soyad', employee.personalInformation?.lastName || '-')}
            {renderInfoRow('Doğum Tarihi', employee.personalInformation?.birthdate ? formatDate(employee.personalInformation.birthdate) : '-')}
            {renderInfoRow('Doğum Yeri', employee.personalInformation?.birthPlace || '-')}
            {renderInfoRow('Cinsiyet', employee.personalInformation?.gender !== undefined ? getGenderText(employee.personalInformation.gender) : '-')}
            {renderInfoRow('Medeni Durum', employee.personalInformation?.maritalStatus !== undefined ? getMaritalStatusText(employee.personalInformation.maritalStatus) : '-')}
          </Accordion>

          <Accordion
            title="İLETİŞİM BİLGİLERİ"
            icon={<Phone size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('contact')}
          >
            {renderInfoRow('E-posta', employee.userContact?.email || '-')}
            {renderInfoRow('Telefon', employee.userContact?.phoneNumber || '-')}
            {renderInfoRow('İş E-postası', employee.userContact?.businessEmail || '-')}
            {renderInfoRow('İş Telefonu', employee.userContact?.businessPhone || '-')}
            {renderInfoRow('Ev Telefonu', employee.userContact?.homePhone || '-')}
            {renderInfoRow('Diğer E-posta', employee.userContact?.otherEmail || '-')}
          </Accordion>

          <Accordion
            title="ADRES BİLGİLERİ"
            icon={<MapPin size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('address')}
          >
            {renderInfoRow('Adres', employee.userAddress?.address || '-')}
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
              <TouchableOpacity
                onPress={() => setAddEducationModalVisible(true)}
                style={{ padding: 4 }}
              >
                <Plus size={20} color="#7C3AED" />
              </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => setVisaRequestModalVisible(true)}
                style={{ padding: 4 }}
              >
                <Plus size={20} color="#7C3AED" />
              </TouchableOpacity>
            }
          >
            <TouchableOpacity
              style={styles.visaRequestButton}
              onPress={() => setVisaRequestModalVisible(true)}
            >
              <Text style={styles.visaRequestButtonText}>Vize Evrakı Talep Et</Text>
            </TouchableOpacity>

            {employee.userVisas && employee.userVisas.length > 0 ? (
              <View style={{ marginTop: 16 }}>
                {employee.userVisas.map((visa, index) => (
                  <View key={visa.id} style={styles.listItem}>
                    {renderInfoRow('Ülke', visa.country || '-')}
                    {renderInfoRow('Vize Tipi', visa.visaType || '-')}
                    {renderInfoRow('Veriliş Tarihi', formatDate(visa.issueDate))}
                    {renderInfoRow('Geçerlilik', formatDate(visa.expiryDate))}
                    {index < employee.userVisas.length - 1 && <View style={styles.divider} />}
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

            <TouchableOpacity style={styles.visaAddButton}>
              <Text style={styles.visaAddButtonText}>Ekle</Text>
            </TouchableOpacity>
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
        title="Başarılı"
        message="Vize bilgisi başarıyla eklendi"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  profileHeaderCard: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileAvatarContainer: {
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#7C3AED',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginTop: 6,
  },
  profileBadgeText: {
    fontSize: 14,
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
    color: '#999',
    marginBottom: 4,
  },
  infoRowValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  listItem: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
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
  visaAddButton: {
    alignSelf: 'center',
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  visaAddButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7C3AED',
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
});
