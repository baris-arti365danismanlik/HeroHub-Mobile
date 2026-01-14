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
  ChevronDown,
  Building2,
  Briefcase,
  Car,
  Menu,
  Bell,
  MessageSquare,
  UserCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import type { UserProfileDetails } from '@/types/backend';
import { usePermissions, MODULE_IDS } from '@/hooks/usePermissions';
import { Accordion } from '@/components/Accordion';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { DrawerMenu } from '@/components/DrawerMenu';
import { InboxModal } from '@/components/InboxModal';
import { inboxService } from '@/services/inbox.service';
import {
  formatDate,
  formatGender,
  formatMaritalStatus,
  formatBloodType,
} from '@/utils/formatters';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [inboxVisible, setInboxVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const permissions = usePermissions(profileDetails?.modulePermissions);
  const canViewProfile = permissions.canRead(MODULE_IDS.PROFILE);
  const canEditProfile = permissions.canWrite(MODULE_IDS.PROFILE);

  useEffect(() => {
    loadProfileData();
    loadUnreadCount();
  }, [user?.backend_user_id]);

  const loadProfileData = async () => {
    if (!user?.backend_user_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getUserProfile(user.backend_user_id);
      setProfileDetails(data);
    } catch (error) {
      setProfileDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.backend_user_id) return;

    try {
      const count = await inboxService.getUnreadCount(user.backend_user_id.toString());
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleEditSection = (sectionId: string) => {
    console.log('Edit section:', sectionId);
  };

  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRowContainer}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );

  const getMilitaryStatusText = (status: number): string => {
    const statuses = ['Tamamlandı', 'Ertelenmiş', 'Muaf', 'Tabi Değil'];
    return statuses[status] || '-';
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

  if (!profileDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Profil bilgileri yüklenemedi.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuButton}>
          <Menu size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>hero</Text>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>+</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="#1a1a1a" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setInboxVisible(true)}
          >
            <MessageSquare size={20} color="#1a1a1a" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <UserCircle size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileAvatarContainer}>
            {profileDetails.profilePhoto &&
             profileDetails.profilePhoto !== 'https://faz2-cdn.herotr.com' &&
             !profileDetails.profilePhoto.endsWith('https://faz2-cdn.herotr.com') ? (
              <Image
                source={{
                  uri: profileDetails.profilePhoto.startsWith('/')
                    ? `https://faz2-cdn.herotr.com${profileDetails.profilePhoto}`
                    : profileDetails.profilePhoto
                }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Text style={styles.profileAvatarText}>
                  {profileDetails.personalInformation?.firstName &&
                   profileDetails.personalInformation?.lastName
                    ? `${profileDetails.personalInformation.firstName[0]}${profileDetails.personalInformation.lastName[0]}`
                    : '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.profileName}>
            {profileDetails.personalInformation?.firstName &&
             profileDetails.personalInformation?.lastName
              ? `${profileDetails.personalInformation.firstName} ${profileDetails.personalInformation.lastName}`
              : 'İsimsiz'}
          </Text>

          {profileDetails.currentTitle && (
            <View style={styles.profileBadge}>
              <Briefcase size={14} color="#7C3AED" />
              <Text style={styles.profileBadgeText}>{profileDetails.currentTitle}</Text>
            </View>
          )}

          {profileDetails.organizationName && (
            <View style={styles.profileBadge}>
              <Building2 size={14} color="#666" />
              <Text style={styles.profileBadgeText}>{profileDetails.organizationName}</Text>
            </View>
          )}
        </View>

        <View style={styles.dropdownSection}>
          <ProfileDropdown
            title="Profil Bilgileri"
            onSelect={(value) => console.log('Selected:', value)}
          />
        </View>

        <View style={styles.accordionContainer}>
          <Accordion
            title="KİŞİSEL BİLGİLER"
            icon={<User size={20} color="#1a1a1a" />}
            isExpandedDefault={false}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('personal')}
          >
            {renderInfoRow('TC Kimlik No', profileDetails.personalInformation?.tckn || '-')}
            {renderInfoRow('Ad', profileDetails.personalInformation?.firstName || '-')}
            {renderInfoRow('Soyad', profileDetails.personalInformation?.lastName || '-')}
            {renderInfoRow(
              'Doğum Tarihi',
              profileDetails.personalInformation?.birthdate
                ? formatDate(profileDetails.personalInformation.birthdate)
                : '-'
            )}
            {renderInfoRow('Doğum Yeri', profileDetails.personalInformation?.birthPlace || '-')}
            {renderInfoRow(
              'Cinsiyet',
              profileDetails.personalInformation?.gender !== undefined
                ? formatGender(profileDetails.personalInformation.gender)
                : '-'
            )}
            {renderInfoRow(
              'Medeni Durum',
              profileDetails.personalInformation?.maritalStatus !== undefined
                ? formatMaritalStatus(profileDetails.personalInformation.maritalStatus)
                : '-'
            )}
          </Accordion>

          <Accordion
            title="İLETİŞİM BİLGİLERİ"
            icon={<Phone size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('contact')}
          >
            {renderInfoRow('E-posta', profileDetails.userContact?.email || '-')}
            {renderInfoRow('Telefon', profileDetails.userContact?.phoneNumber || '-')}
            {renderInfoRow('İş E-postası', profileDetails.userContact?.businessEmail || '-')}
            {renderInfoRow('İş Telefonu', profileDetails.userContact?.businessPhone || '-')}
            {renderInfoRow('Ev Telefonu', profileDetails.userContact?.homePhone || '-')}
            {renderInfoRow('Diğer E-posta', profileDetails.userContact?.otherEmail || '-')}
          </Accordion>

          <Accordion
            title="ADRES BİLGİLERİ"
            icon={<MapPin size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('address')}
          >
            {renderInfoRow('Adres', profileDetails.userAddress?.address || '-')}
            {renderInfoRow('İlçe', profileDetails.userAddress?.districtName || '-')}
            {renderInfoRow('İl', profileDetails.userAddress?.cityName || '-')}
            {renderInfoRow('Ülke', profileDetails.userAddress?.countryName || '-')}
          </Accordion>

          <Accordion
            title="SAĞLIK BİLGİLERİ"
            icon={<Heart size={20} color="#1a1a1a" />}
            canEdit={canEditProfile}
            onEdit={() => handleEditSection('health')}
          >
            {renderInfoRow(
              'Boy',
              profileDetails.userHealth?.height
                ? `${profileDetails.userHealth.height} cm`
                : '-'
            )}
            {renderInfoRow(
              'Kilo',
              profileDetails.userHealth?.weight
                ? `${profileDetails.userHealth.weight} kg`
                : '-'
            )}
            {renderInfoRow(
              'Beden',
              profileDetails.userHealth?.size !== undefined
                ? profileDetails.userHealth.size.toString()
                : '-'
            )}
            {renderInfoRow(
              'Kan Grubu',
              profileDetails.userHealth?.bloodType !== undefined
                ? formatBloodType(profileDetails.userHealth.bloodType)
                : '-'
            )}
            {renderInfoRow('Alerjiler', profileDetails.userHealth?.allergies || '-')}
            {renderInfoRow('Kullandığı İlaçlar', profileDetails.userHealth?.drugs || '-')}
          </Accordion>

          <Accordion
            title="EHLİYET BİLGİLERİ"
            icon={<Car size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {profileDetails.driverLicenses && profileDetails.driverLicenses.length > 0 ? (
              profileDetails.driverLicenses.map((license, index) => (
                <View key={index} style={styles.listItem}>
                  {renderInfoRow('Ehliyet Tipi', license.licenseType || '-')}
                  {renderInfoRow('Ehliyet No', license.licenseNumber || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(license.issueDate))}
                  {renderInfoRow('Geçerlilik Tarihi', formatDate(license.expiryDate))}
                  {index < profileDetails.driverLicenses.length - 1 && (
                    <View style={styles.divider} />
                  )}
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
            {renderInfoRow(
              'Askerlik Durumu',
              profileDetails.userMilitary?.militaryStatus !== undefined
                ? getMilitaryStatusText(profileDetails.userMilitary.militaryStatus)
                : '-'
            )}
            {renderInfoRow('Tecil Durumu', profileDetails.userMilitary?.militaryPostpone || '-')}
            {renderInfoRow('Notlar', profileDetails.userMilitary?.militaryNote || '-')}
          </Accordion>

          <Accordion
            title="AİLE BİLGİLERİ"
            icon={<Users size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {profileDetails.userFamilies && profileDetails.userFamilies.length > 0 ? (
              profileDetails.userFamilies.map((family, index) => (
                <View key={family.id} style={styles.listItem}>
                  {renderInfoRow('Yakınlık', family.relation || '-')}
                  {renderInfoRow('Ad Soyad', `${family.firstName} ${family.lastName}`)}
                  {renderInfoRow('Doğum Tarihi', formatDate(family.birthDate))}
                  {renderInfoRow('Telefon', family.phoneNumber || '-')}
                  {index < profileDetails.userFamilies.length - 1 && (
                    <View style={styles.divider} />
                  )}
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
            {profileDetails.educations && profileDetails.educations.length > 0 ? (
              profileDetails.educations.map((education, index) => (
                <View key={education.educationId} style={styles.listItem}>
                  {renderInfoRow('Okul Adı', education.schoolName || '-')}
                  {renderInfoRow('Bölüm', education.department || '-')}
                  {renderInfoRow(
                    'Not Ortalaması',
                    education.gpa !== undefined && education.gpaSystem !== undefined
                      ? `${education.gpa}/${education.gpaSystem}`
                      : '-'
                  )}
                  {renderInfoRow('Başlangıç', formatDate(education.startDate))}
                  {renderInfoRow('Bitiş', formatDate(education.endDate))}
                  {index < profileDetails.educations.length - 1 && (
                    <View style={styles.divider} />
                  )}
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
            {profileDetails.certificates && profileDetails.certificates.length > 0 ? (
              profileDetails.certificates.map((cert, index) => (
                <View key={cert.id} style={styles.listItem}>
                  {renderInfoRow('Sertifika Adı', cert.name || '-')}
                  {renderInfoRow('Veren Kuruluş', cert.issuer || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(cert.issueDate))}
                  {cert.expiryDate && renderInfoRow('Geçerlilik', formatDate(cert.expiryDate))}
                  {index < profileDetails.certificates.length - 1 && (
                    <View style={styles.divider} />
                  )}
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
            {profileDetails.socialMedia ? (
              <>
                {profileDetails.socialMedia.linkedin &&
                  renderInfoRow('LinkedIn', profileDetails.socialMedia.linkedin)}
                {profileDetails.socialMedia.facebook &&
                  renderInfoRow('Facebook', profileDetails.socialMedia.facebook)}
                {profileDetails.socialMedia.instagram &&
                  renderInfoRow('Instagram', profileDetails.socialMedia.instagram)}
                {profileDetails.socialMedia.twitter &&
                  renderInfoRow('Twitter', profileDetails.socialMedia.twitter)}
                {!profileDetails.socialMedia.linkedin &&
                 !profileDetails.socialMedia.facebook &&
                 !profileDetails.socialMedia.instagram &&
                 !profileDetails.socialMedia.twitter && (
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
            {profileDetails.userLanguages && profileDetails.userLanguages.length > 0 ? (
              profileDetails.userLanguages.map((lang, index) => (
                <View key={lang.id} style={styles.listItem}>
                  {renderInfoRow('Dil', lang.language || '-')}
                  {renderInfoRow('Seviye', lang.level !== undefined ? lang.level.toString() : '-')}
                  {index < profileDetails.userLanguages.length - 1 && (
                    <View style={styles.divider} />
                  )}
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
            {renderInfoRow('Pasaport No', profileDetails.userPassport?.passportNumber || '-')}
            {renderInfoRow(
              'Geçerlilik Tarihi',
              profileDetails.userPassport?.passportValidityDate
                ? formatDate(profileDetails.userPassport.passportValidityDate)
                : '-'
            )}
          </Accordion>

          <Accordion
            title="VİZE BİLGİLERİ"
            icon={<Plane size={20} color="#1a1a1a" />}
            canEdit={false}
          >
            {profileDetails.userVisas && profileDetails.userVisas.length > 0 ? (
              profileDetails.userVisas.map((visa, index) => (
                <View key={visa.id} style={styles.listItem}>
                  {renderInfoRow('Ülke', visa.country || '-')}
                  {renderInfoRow('Vize Tipi', visa.visaType || '-')}
                  {renderInfoRow('Veriliş Tarihi', formatDate(visa.issueDate))}
                  {renderInfoRow('Geçerlilik', formatDate(visa.expiryDate))}
                  {index < profileDetails.userVisas.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Vize bilgisi bulunmuyor</Text>
            )}
          </Accordion>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      {user?.backend_user_id && (
        <InboxModal
          visible={inboxVisible}
          userId={user.backend_user_id.toString()}
          onClose={() => {
            setInboxVisible(false);
            loadUnreadCount();
          }}
        />
      )}
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
  menuButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C3AED',
  },
  logoBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
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
  dropdownSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  accordionContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
