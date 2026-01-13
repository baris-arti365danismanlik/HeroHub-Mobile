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
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Shield,
  Users,
  GraduationCap,
  Award,
  MessageCircle,
  Globe,
  Plane,
  Edit2,
  ChevronDown,
  ChevronUp,
  Building2,
  Briefcase,
  Car,
  CreditCard,
  FolderOpen,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import type { UserProfileDetails } from '@/types/backend';
import { usePermissions, MODULE_IDS } from '@/hooks/usePermissions';
import { Accordion } from '@/components/Accordion';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<UserProfileDetails | null>(null);

  const permissions = usePermissions(employee?.modulePermissions);
  const canEditEmployee = permissions.canWrite(MODULE_IDS.EMPLOYEES);

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

  const handleEditSection = (sectionId: string) => {
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
            {employee.profilePhoto && employee.profilePhoto !== 'https://faz2-cdn.herotr.com' && !employee.profilePhoto.endsWith('https://faz2-cdn.herotr.com') ? (
              <Image
                source={{ uri: employee.profilePhoto.startsWith('/') ? `https://faz2-cdn.herotr.com${employee.profilePhoto}` : employee.profilePhoto }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Text style={styles.profileAvatarText}>
                  {employee.personalInformation?.firstName && employee.personalInformation?.lastName
                    ? `${employee.personalInformation.firstName[0]}${employee.personalInformation.lastName[0]}`
                    : '?'}
                </Text>
              </View>
            )}
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
          <TouchableOpacity style={styles.pinnedFilesButton}>
            <FolderOpen size={16} color="#7C3AED" />
            <Text style={styles.pinnedFilesText}>Anıtlı Dosyalar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accordionContainer}>
          <Accordion
            title="PERSONELİ BİLGİLER"
            icon={<User size={20} color="#1a1a1a" />}
            isExpandedDefault={true}
            canEdit={canEditEmployee}
            onEdit={() => handleEditSection('personal')}
          >
            {renderInfoRow('Personel No', employee.personalInformation?.tckn || '-')}
            {renderInfoRow('TC Kimlik', employee.personalInformation?.tckn || '-')}
            {renderInfoRow('Ad Soyad', employee.personalInformation?.firstName && employee.personalInformation?.lastName ? `${employee.personalInformation.firstName} ${employee.personalInformation.lastName}` : '-')}
            {renderInfoRow('Doğum Tarihi', employee.personalInformation?.birthdate ? formatDate(employee.personalInformation.birthdate) : '-')}
            {renderInfoRow('Doğum Yeri', employee.personalInformation?.birthPlace || '-')}
            {renderInfoRow('Cinsiyet', employee.personalInformation?.gender !== undefined ? getGenderText(employee.personalInformation.gender) : '-')}
            {renderInfoRow('Medeni Durum', employee.personalInformation?.maritalStatus !== undefined ? getMaritalStatusText(employee.personalInformation.maritalStatus) : '-')}
          </Accordion>

          <Accordion
            title="İLETİŞİM BİLGİLERİ"
            icon={<Phone size={20} color="#1a1a1a" />}
            canEdit={canEditEmployee}
            onEdit={() => handleEditSection('contact')}
          >
            {renderInfoRow('Şirket Telefonu', employee.userContact?.businessPhone || '-')}
            {renderInfoRow('Şahıs Telefonu', employee.userContact?.phoneNumber || '-')}
            {renderInfoRow('İş E-postası', employee.userContact?.businessEmail || '-')}
            {renderInfoRow('Şahıs E-postası', employee.userContact?.email || '-')}
            {renderInfoRow('Ev Telefonu', employee.userContact?.homePhone || '-')}
            {renderInfoRow('Diğer E-posta', employee.userContact?.otherEmail || '-')}
          </Accordion>

          <Accordion
            title="ÇALIŞMA YERİ BİLGİLERİ"
            icon={<Building2 size={20} color="#1a1a1a" />}
            canEdit={canEditEmployee}
            onEdit={() => handleEditSection('workplace')}
          >
            {renderInfoRow('Kurum', employee.organizationName || '-')}
            {renderInfoRow('Yer', employee.userAddress?.cityName || '-')}
            {renderInfoRow('Adres', employee.userAddress?.address || '-')}
            {renderInfoRow('İlçe', employee.userAddress?.districtName || '-')}
            {renderInfoRow('İl', employee.userAddress?.cityName || '-')}
            {renderInfoRow('Ülke', employee.userAddress?.countryName || '-')}
          </Accordion>

          <Accordion
            title="BANKA BİLGİLERİ"
            icon={<CreditCard size={20} color="#1a1a1a" />}
            canEdit={canEditEmployee}
            onEdit={() => handleEditSection('bank')}
          >
            {renderInfoRow('Banka Adı', '-')}
            {renderInfoRow('IBAN', '-')}
            {renderInfoRow('Hesap Sahibi', employee.personalInformation?.firstName && employee.personalInformation?.lastName ? `${employee.personalInformation.firstName} ${employee.personalInformation.lastName}` : '-')}
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
            title="İŞ BİLGİLERİ"
            icon={<Briefcase size={20} color="#1a1a1a" />}
            canEdit={canEditEmployee}
            onEdit={() => handleEditSection('work')}
          >
            {renderInfoRow('Unvan', employee.currentTitle || '-')}
            {renderInfoRow('Çalışma Şekli', employee.userEmploymentDetails?.workType !== undefined ? getWorkTypeText(employee.userEmploymentDetails.workType) : '-')}
            {renderInfoRow('İşe Başlama Tarihi', employee.userEmploymentDetails?.startDate ? formatDate(employee.userEmploymentDetails.startDate) : '-')}
          </Accordion>

          <Accordion
            title="DİL BİLGİLERİ"
            icon={<Globe size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.userLanguages && employee.userLanguages.length > 0 ? (
              employee.userLanguages.map((lang, index) => (
                <View key={lang.id} style={styles.listItem}>
                  {renderInfoRow('Dil', lang.language || '-')}
                  {renderInfoRow('Seviye', lang.level.toString())}
                  {index < employee.userLanguages.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Dil bilgisi bulunmuyor</Text>
            )}
          </Accordion>

          <Accordion
            title="PASAPORT BİLGİLERİ"
            icon={<Plane size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {renderInfoRow('Pasaport No', employee.userPassport?.passportNumber || '-')}
            {renderInfoRow('Geçerlilik Tarihi', employee.userPassport?.passportValidityDate ? formatDate(employee.userPassport.passportValidityDate) : '-')}
          </Accordion>

          <Accordion
            title="VİZE BİLGİLERİ"
            icon={<Plane size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {employee.userVisas && employee.userVisas.length > 0 ? (
              employee.userVisas.map((visa, index) => (
                <View key={visa.id} style={styles.listItem}>
                  {renderInfoRow('Ülke', visa.country || '-')}
                  {renderInfoRow('Vize Tipi', visa.visaType || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(visa.issueDate))}
                  {renderInfoRow('Geçerlilik', formatDate(visa.expiryDate))}
                  {index < employee.userVisas.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Vize bilgisi bulunmuyor</Text>
            )}
          </Accordion>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  pinnedFilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0E7FF',
    borderRadius: 8,
    marginTop: 16,
  },
  pinnedFilesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
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
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});
