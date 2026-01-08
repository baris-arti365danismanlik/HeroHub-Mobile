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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Briefcase } from 'lucide-react-native';
import { userService } from '@/services/user.service';
import type { UserProfileDetails, Country } from '@/types/backend';
import { formatDate } from '@/utils/formatters';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileDetails | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const [profileData, countriesData] = await Promise.all([
        userService.getUserProfile(Number(id)),
        userService.getCountries(),
      ]);
      setProfile(profileData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (countryId: number | null) => {
    if (!countryId) return 'Belirtilmemiş';
    const country = countries.find((c) => c.id === countryId);
    return country?.name || 'Belirtilmemiş';
  };

  const getMaritalStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Bekar';
      case 1: return 'Evli';
      case 2: return 'Boşanmış';
      case 3: return 'Dul';
      default: return 'Belirtilmemiş';
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0: return 'Kadın';
      case 1: return 'Erkek';
      case 2: return 'Diğer';
      default: return 'Belirtilmemiş';
    }
  };

  const getEducationLevelText = (level: number) => {
    switch (level) {
      case 0: return 'İlkokul';
      case 1: return 'Ortaokul';
      case 2: return 'Lise';
      case 3: return 'Üniversite';
      case 4: return 'Yüksek Lisans';
      case 5: return 'Doktora';
      default: return 'Belirtilmemiş';
    }
  };

  const getMilitaryStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Yapılmadı';
      case 1: return 'Yapıldı';
      case 2: return 'Muaf';
      case 3: return 'Tecilli';
      default: return 'Belirtilmemiş';
    }
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

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Çalışan bilgisi bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Çalışan Detayı</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile.profilePhoto && profile.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
              <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {`${profile.personalInformation.firstName.charAt(0)}${profile.personalInformation.lastName.charAt(0)}`}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>
            {profile.personalInformation.firstName} {profile.personalInformation.lastName}
          </Text>
          {profile.currentTitle && (
            <Text style={styles.profileTitle}>{profile.currentTitle}</Text>
          )}
          {profile.organizationName && (
            <Text style={styles.profileOrganization}>{profile.organizationName}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <View style={styles.infoCard}>
            <InfoItem label="TC Kimlik No" value={profile.personalInformation.tckn} />
            <InfoItem label="Doğum Tarihi" value={formatDate(profile.personalInformation.birthdate)} />
            <InfoItem label="Doğum Yeri" value={profile.personalInformation.birthPlace} />
            <InfoItem label="Uyruk" value={getCountryName(profile.personalInformation.nationality)} />
            <InfoItem label="Medeni Durum" value={getMaritalStatusText(profile.personalInformation.maritalStatus)} />
            <InfoItem label="Cinsiyet" value={getGenderText(profile.personalInformation.gender)} />
            <InfoItem label="Personel Numarası" value={profile.personalInformation.personnelNumber} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
          <View style={styles.infoCard}>
            {profile.userContact.email && (
              <View style={styles.contactRow}>
                <Mail size={18} color="#7C3AED" />
                <Text style={styles.contactText}>{profile.userContact.email}</Text>
              </View>
            )}
            {profile.userContact.phoneNumber && (
              <View style={styles.contactRow}>
                <Phone size={18} color="#7C3AED" />
                <Text style={styles.contactText}>{profile.userContact.phoneNumber}</Text>
              </View>
            )}
            {profile.userContact.businessEmail && (
              <InfoItem label="İş E-postası" value={profile.userContact.businessEmail} />
            )}
            {profile.userContact.businessPhone && (
              <InfoItem label="İş Telefonu" value={profile.userContact.businessPhone} />
            )}
            {profile.userContact.homePhone && (
              <InfoItem label="Ev Telefonu" value={profile.userContact.homePhone} />
            )}
          </View>
        </View>

        {profile.userAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adres Bilgileri</Text>
            <View style={styles.infoCard}>
              {profile.userAddress.address && (
                <InfoItem label="Adres" value={profile.userAddress.address} />
              )}
              {profile.userAddress.districtName && (
                <InfoItem label="İlçe" value={profile.userAddress.districtName} />
              )}
              {profile.userAddress.cityName && (
                <InfoItem label="Şehir" value={profile.userAddress.cityName} />
              )}
              {profile.userAddress.countryName && (
                <InfoItem label="Ülke" value={profile.userAddress.countryName} />
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İş Bilgileri</Text>
          <View style={styles.infoCard}>
            <InfoItem label="İşe Başlama Tarihi" value={formatDate(profile.jobStartDate)} />
            {profile.currentTitle && (
              <InfoItem label="Ünvan" value={profile.currentTitle} />
            )}
            {profile.department && (
              <InfoItem label="Departman" value={profile.department} />
            )}
            {profile.personalInformation.workPlace && (
              <InfoItem label="Çalışma Yeri" value={profile.personalInformation.workPlace} />
            )}
            {profile.currentShiftHours && (
              <InfoItem label="Vardiya Saatleri" value={profile.currentShiftHours} />
            )}
          </View>
        </View>

        {profile.educations && profile.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eğitim Bilgileri</Text>
            {profile.educations.map((education, index) => (
              <View key={education.educationId} style={[styles.infoCard, index > 0 && styles.cardSpacing]}>
                <InfoItem label="Seviye" value={getEducationLevelText(education.level)} />
                <InfoItem label="Okul Adı" value={education.schoolName} />
                <InfoItem label="Bölüm" value={education.department} />
                {education.startDate && (
                  <InfoItem label="Başlangıç" value={formatDate(education.startDate)} />
                )}
                {education.endDate && (
                  <InfoItem label="Bitiş" value={formatDate(education.endDate)} />
                )}
              </View>
            ))}
          </View>
        )}

        {profile.userMilitary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Askerlik Durumu</Text>
            <View style={styles.infoCard}>
              <InfoItem label="Durum" value={getMilitaryStatusText(profile.userMilitary.militaryStatus)} />
              {profile.userMilitary.militaryPostpone && (
                <InfoItem label="Tecil Tarihi" value={formatDate(profile.userMilitary.militaryPostpone)} />
              )}
              {profile.userMilitary.militaryNote && (
                <InfoItem label="Not" value={profile.userMilitary.militaryNote} />
              )}
            </View>
          </View>
        )}

        {profile.userHealth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sağlık Bilgileri</Text>
            <View style={styles.infoCard}>
              {profile.userHealth.height > 0 && (
                <InfoItem label="Boy" value={`${profile.userHealth.height} cm`} />
              )}
              {profile.userHealth.weight > 0 && (
                <InfoItem label="Kilo" value={`${profile.userHealth.weight} kg`} />
              )}
              {profile.userHealth.bloodType > 0 && (
                <InfoItem label="Kan Grubu" value={`${profile.userHealth.bloodType}`} />
              )}
              {profile.userHealth.allergies && (
                <InfoItem label="Alerjiler" value={profile.userHealth.allergies} />
              )}
              {profile.userHealth.drugs && (
                <InfoItem label="İlaçlar" value={profile.userHealth.drugs} />
              )}
            </View>
          </View>
        )}

        {profile.reportsTo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bağlı Olduğu Kişi</Text>
            <View style={styles.infoCard}>
              <View style={styles.reportToCard}>
                <View style={styles.reportToAvatar}>
                  {profile.reportsTo.profilePhoto && profile.reportsTo.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                    <Image source={{ uri: profile.reportsTo.profilePhoto }} style={styles.reportToAvatarImage} />
                  ) : (
                    <Text style={styles.reportToAvatarText}>
                      {profile.reportsTo.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </Text>
                  )}
                </View>
                <View style={styles.reportToInfo}>
                  <Text style={styles.reportToName}>{profile.reportsTo.fullName}</Text>
                  {profile.reportsTo.title && (
                    <Text style={styles.reportToTitle}>{profile.reportsTo.title}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {profile.colleagues && profile.colleagues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İş Arkadaşları</Text>
            <View style={styles.infoCard}>
              {profile.colleagues.slice(0, 5).map((colleague) => (
                <View key={colleague.id} style={styles.colleagueCard}>
                  <View style={styles.colleagueAvatar}>
                    {colleague.profilePhoto && colleague.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                      <Image source={{ uri: colleague.profilePhoto }} style={styles.colleagueAvatarImage} />
                    ) : (
                      <Text style={styles.colleagueAvatarText}>
                        {colleague.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.colleagueInfo}>
                    <Text style={styles.colleagueName}>{colleague.fullName}</Text>
                    {colleague.title && (
                      <Text style={styles.colleagueTitle}>{colleague.title}</Text>
                    )}
                  </View>
                </View>
              ))}
              {profile.colleagues.length > 5 && (
                <Text style={styles.moreText}>
                  +{profile.colleagues.length - 5} kişi daha
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value || value === 'Belirtilmemiş') return null;

  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backIconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#7C3AED',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileOrganization: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
  },
  cardSpacing: {
    marginTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  contactText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  reportToCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  reportToAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportToAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  reportToAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  reportToInfo: {
    flex: 1,
  },
  reportToName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  reportToTitle: {
    fontSize: 13,
    color: '#666',
  },
  colleagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  colleagueAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colleagueAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colleagueAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  colleagueInfo: {
    flex: 1,
  },
  colleagueName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  colleagueTitle: {
    fontSize: 12,
    color: '#666',
  },
  moreText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '500',
    paddingVertical: 12,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
