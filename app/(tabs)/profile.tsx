import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profile.service';
import { usePermissions, MODULE_IDS } from '@/hooks/usePermissions';
import type { UserProfileDetails } from '@/types/backend';
import { Accordion } from '@/components/Accordion';
import { InfoRow } from '@/components/InfoRow';
import {
  User,
  Phone,
  MapPin,
  Heart,
  CreditCard,
  Shield,
  Users,
  GraduationCap,
  Award,
  Link,
  Globe,
  FileText,
  Plane,
  Menu,
  Bell,
  MessageSquare,
  Building2,
  Briefcase,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Profil Bilgileri');

  const permissions = usePermissions(profile?.modulePermissions);
  const canEdit = permissions.canWrite(MODULE_IDS.PROFILE);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.backend_user_id) return;

    try {
      setLoading(true);
      const data = await profileService.getUserProfile(user.backend_user_id);
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getGenderText = (gender: number) => {
    return gender === 0 ? 'Erkek' : 'Kadın';
  };

  const getMaritalStatusText = (status: number) => {
    const statuses = ['Bekar', 'Evli', 'Boşanmış', 'Dul'];
    return statuses[status] || '-';
  };

  const getBloodTypeText = (bloodType: number) => {
    const types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];
    return types[bloodType] || '-';
  };

  const getEducationLevelText = (level: number) => {
    const levels = ['İlkokul', 'Ortaokul', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
    return levels[level] || '-';
  };

  const getMilitaryStatusText = (status: number) => {
    const statuses = ['Tamamlandı', 'Ertelendi', 'Muaf', 'Yok'];
    return statuses[status] || '-';
  };

  const getLanguageLevelText = (level: number) => {
    const levels = ['Başlangıç', 'Orta', 'İyi', 'Çok İyi', 'Akıcı'];
    return levels[level] || '-';
  };

  const getSocialMediaLinks = () => {
    if (!profile?.socialMedia) return null;
    try {
      if (typeof profile.socialMedia === 'object' && 'socialMediaLinks' in profile.socialMedia) {
        return JSON.parse(profile.socialMedia.socialMediaLinks as string);
      }
      return profile.socialMedia;
    } catch {
      return null;
    }
  };

  const handleEdit = (section: string) => {
    console.log('Edit section:', section);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profil bilgileri yüklenemedi</Text>
      </View>
    );
  }

  const socialLinks = getSocialMediaLinks();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
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

          <TouchableOpacity style={styles.iconButton}>
            <MessageSquare size={20} color="#1a1a1a" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>12</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileIconButton}>
            {profile.profilePhoto ? (
              <Image
                source={{ uri: profile.profilePhoto }}
                style={styles.headerProfileImage}
              />
            ) : (
              <View style={styles.headerProfilePlaceholder}>
                <User size={20} color="#7C3AED" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {profile.profilePhoto ? (
              <Image
                source={{ uri: profile.profilePhoto }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                <User size={48} color="#7C3AED" />
              </View>
            )}
          </View>

          <Text style={styles.profileName}>
            {profile.personalInformation.firstName} {profile.personalInformation.lastName}
          </Text>

          <View style={styles.profileDetails}>
            {profile.currentTitle && (
              <View style={styles.profileDetailRow}>
                <Briefcase size={14} color="#7C3AED" />
                <Text style={styles.profileDetailText}>{profile.currentTitle}</Text>
              </View>
            )}
            {profile.organizationName && (
              <View style={styles.profileDetailRow}>
                <Building2 size={14} color="#666" />
                <Text style={[styles.profileDetailText, { color: '#666' }]}>
                  {profile.organizationName}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionSelector}>
          <TouchableOpacity style={styles.sectionButton}>
            <Text style={styles.sectionButtonText}>{selectedSection}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accordionContainer}>
          <Accordion
            title="KİŞİSEL BİLGİLER"
            icon={<User size={18} color="#1a1a1a" />}
            canEdit={canEdit}
            onEdit={() => handleEdit('personal')}
            isExpandedDefault={false}
          >
            <InfoRow label="Personel No" value={profile.personalInformation?.personnelNumber || '-'} />
            <InfoRow label="TCKN" value={profile.personalInformation?.tckn || '-'} />
            <InfoRow label="Doğum Tarihi" value={formatDate(profile.personalInformation?.birthdate)} />
            <InfoRow label="Doğum Yeri" value={profile.personalInformation?.birthPlace || '-'} />
            <InfoRow label="Cinsiyet" value={getGenderText(profile.personalInformation?.gender)} />
            <InfoRow label="Medeni Durum" value={getMaritalStatusText(profile.personalInformation?.maritalStatus)} />
          </Accordion>

          <Accordion
            title="İLETİŞİM BİLGİLERİ"
            icon={<Phone size={18} color="#1a1a1a" />}
            canEdit={canEdit}
            onEdit={() => handleEdit('contact')}
            isExpandedDefault={false}
          >
            <InfoRow label="Cep Telefonu" value={profile.userContact?.phoneNumber || '-'} />
            <InfoRow label="İş E-postası" value={profile.userContact?.businessEmail || '-'} />
            <InfoRow label="Kişisel E-posta" value={profile.userContact?.email || '-'} />
            {profile.userContact?.businessPhone && (
              <InfoRow label="İş Telefonu" value={profile.userContact.businessPhone} />
            )}
            {profile.userContact?.homePhone && (
              <InfoRow label="Ev Telefonu" value={profile.userContact.homePhone} />
            )}
          </Accordion>

          <Accordion
            title="ADRES BİLGİLERİ"
            icon={<MapPin size={18} color="#1a1a1a" />}
            canEdit={canEdit}
            onEdit={() => handleEdit('address')}
            isExpandedDefault={false}
          >
            <InfoRow label="Adres" value={profile.userAddress?.address || '-'} />
            <InfoRow label="İlçe" value={profile.userAddress?.districtName || '-'} />
            <InfoRow label="Şehir" value={profile.userAddress?.cityName || '-'} />
            <InfoRow label="Ülke" value={profile.userAddress?.countryName || '-'} />
          </Accordion>

          <Accordion
            title="SAĞLIK BİLGİLERİ"
            icon={<Heart size={18} color="#1a1a1a" />}
            canEdit={canEdit}
            onEdit={() => handleEdit('health')}
            isExpandedDefault={false}
          >
            <InfoRow label="Kan Grubu" value={getBloodTypeText(profile.userHealth?.bloodType)} />
            <InfoRow label="Boy (cm)" value={profile.userHealth?.height?.toString() || '-'} />
            <InfoRow label="Kilo (kg)" value={profile.userHealth?.weight?.toString() || '-'} />
            {profile.userHealth?.allergies && (
              <InfoRow label="Alerjiler" value={profile.userHealth.allergies} />
            )}
          </Accordion>

          <Accordion
            title="EHLİYET BİLGİLERİ"
            icon={<CreditCard size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.driverLicenses && profile.driverLicenses.length > 0 ? (
              profile.driverLicenses.map((license, index) => (
                <View key={license.driverLicenseId}>
                  <InfoRow label="Sınıf" value={`Sınıf ${license.class}`} />
                  <InfoRow label="Başlangıç" value={formatDate(license.startDate)} />
                  <InfoRow label="Bitiş" value={formatDate(license.endDate)} />
                  {index < profile.driverLicenses.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Ehliyet bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="ASKERLİK BİLGİLERİ"
            icon={<Shield size={18} color="#1a1a1a" />}
            canEdit={canEdit}
            onEdit={() => handleEdit('military')}
            isExpandedDefault={false}
          >
            <InfoRow
              label="Durum"
              value={getMilitaryStatusText(profile.userMilitary?.militaryStatus)}
            />
            {profile.userMilitary?.militaryNote && (
              <InfoRow label="Not" value={profile.userMilitary.militaryNote} />
            )}
          </Accordion>

          <Accordion
            title="AİLE BİLGİLERİ"
            icon={<Users size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.userFamilies && profile.userFamilies.length > 0 ? (
              profile.userFamilies.map((family, index) => (
                <View key={family.id}>
                  <InfoRow
                    label={family.relation}
                    value={`${family.firstName} ${family.lastName}`}
                  />
                  <InfoRow label="Doğum Tarihi" value={formatDate(family.birthDate)} />
                  {family.phoneNumber && (
                    <InfoRow label="Telefon" value={family.phoneNumber} />
                  )}
                  {index < profile.userFamilies.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aile bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="EĞİTİM BİLGİLERİ"
            icon={<GraduationCap size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.educations && profile.educations.length > 0 ? (
              profile.educations.map((edu, index) => (
                <View key={edu.educationId}>
                  <Text style={styles.itemTitle}>{edu.schoolName}</Text>
                  <InfoRow label="Bölüm" value={edu.department} />
                  <InfoRow label="Seviye" value={getEducationLevelText(edu.level)} />
                  <InfoRow
                    label="Not Ortalaması"
                    value={`${edu.gpa} / ${edu.gpaSystem === 0 ? '4.0' : '100'}`}
                  />
                  <InfoRow
                    label="Tarih"
                    value={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                  />
                  {index < profile.educations.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Eğitim bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="SERTİFİKALAR"
            icon={<Award size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.certificates && profile.certificates.length > 0 ? (
              profile.certificates.map((cert, index) => (
                <View key={cert.certificateId}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <InfoRow label="Kurum" value={cert.institution} />
                  <InfoRow label="Tarih" value={formatDate(cert.givenDate)} />
                  {index < profile.certificates.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Sertifika bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="SOSYAL LİNKLER"
            icon={<Link size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {socialLinks ? (
              <>
                {socialLinks.linkedinLink && (
                  <InfoRow label="LinkedIn" value={socialLinks.linkedinLink} />
                )}
                {socialLinks.facebookLink && (
                  <InfoRow label="Facebook" value={socialLinks.facebookLink} />
                )}
                {socialLinks.instagramLink && (
                  <InfoRow label="Instagram" value={socialLinks.instagramLink} />
                )}
                {socialLinks.tiktokLink && (
                  <InfoRow label="TikTok" value={socialLinks.tiktokLink} />
                )}
              </>
            ) : (
              <Text style={styles.emptyText}>Sosyal medya bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="DİL BİLGİLERİ"
            icon={<Globe size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.userLanguages && profile.userLanguages.length > 0 ? (
              profile.userLanguages.map((lang, index) => (
                <View key={lang.userLanguageId}>
                  <InfoRow
                    label={lang.languageName}
                    value={getLanguageLevelText(lang.languageLevel)}
                  />
                  {index < profile.userLanguages.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Dil bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="PASAPORT BİLGİLERİ"
            icon={<FileText size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.userPassport?.passportNumber ? (
              <>
                <InfoRow label="Pasaport No" value={profile.userPassport.passportNumber} />
                <InfoRow
                  label="Geçerlilik Tarihi"
                  value={formatDate(profile.userPassport.passportValidityDate)}
                />
              </>
            ) : (
              <Text style={styles.emptyText}>Pasaport bilgisi bulunamadı</Text>
            )}
          </Accordion>

          <Accordion
            title="VİZE BİLGİLERİ"
            icon={<Plane size={18} color="#1a1a1a" />}
            isExpandedDefault={false}
          >
            {profile.userVisas && profile.userVisas.length > 0 ? (
              profile.userVisas.map((visa, index) => (
                <View key={visa.id}>
                  <InfoRow label="Ülke" value={visa.country} />
                  <InfoRow label="Vize Tipi" value={visa.visaType} />
                  <InfoRow label="Başlangıç" value={formatDate(visa.issueDate)} />
                  <InfoRow label="Bitiş" value={formatDate(visa.expiryDate)} />
                  {index < profile.userVisas.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Vize bilgisi bulunamadı</Text>
            )}
          </Accordion>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
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
    marginLeft: 2,
  },
  logoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  profileIconButton: {
    padding: 4,
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
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#7C3AED',
  },
  profileImagePlaceholder: {
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  profileDetails: {
    alignItems: 'center',
    gap: 6,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  sectionSelector: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  sectionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  accordionContainer: {
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
