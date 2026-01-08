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
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Building2,
  Clock,
  Users,
  MapPin,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import type { UserProfileDetails } from '@/types/backend';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<UserProfileDetails | null>(null);

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
      console.error('Error loading employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkDuration = (startDate: string): string => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0 && months > 0) {
      return `${years} yıl ${months} ay`;
    } else if (years > 0) {
      return `${years} yıl`;
    } else {
      return `${months} ay`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const openUrl = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const openPhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      openUrl(`tel:${phoneNumber}`);
    }
  };

  const openEmail = (email: string) => {
    if (email) {
      openUrl(`mailto:${email}`);
    }
  };

  const getSocialMediaLinks = () => {
    if (!employee?.socialMedia) return [];

    const links: { platform: string; url: string; icon: string }[] = [];

    if (employee.socialMedia.linkedin) {
      links.push({ platform: 'LinkedIn', url: employee.socialMedia.linkedin, icon: 'linkedin' });
    }
    if (employee.socialMedia.facebook) {
      links.push({ platform: 'Facebook', url: employee.socialMedia.facebook, icon: 'facebook' });
    }
    if (employee.socialMedia.instagram) {
      links.push({ platform: 'Instagram', url: employee.socialMedia.instagram, icon: 'instagram' });
    }
    if (employee.socialMedia.twitter) {
      links.push({ platform: 'Twitter', url: employee.socialMedia.twitter, icon: 'twitter' });
    }

    return links;
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
          <Text style={styles.headerTitle}>Çalışan Detayı</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Çalışan bulunamadı.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const socialLinks = getSocialMediaLinks();
  const workDuration = employee.jobStartDate ? calculateWorkDuration(employee.jobStartDate) : '-';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Çalışan Detayı</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            {employee.profilePhoto && employee.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
              <Image source={{ uri: employee.profilePhoto }} style={styles.avatarLargeImage} />
            ) : (
              <Text style={styles.avatarLargeText}>
                {`${employee.personalInformation.firstName[0]}${employee.personalInformation.lastName[0]}`}
              </Text>
            )}
          </View>
          <Text style={styles.employeeName}>
            {`${employee.personalInformation.firstName} ${employee.personalInformation.lastName}`}
          </Text>
          {employee.currentTitle && (
            <Text style={styles.employeeTitle}>{employee.currentTitle}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
          <View style={styles.card}>
            {employee.userContact.phoneNumber && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => openPhoneCall(employee.userContact.phoneNumber)}
              >
                <View style={styles.contactIconContainer}>
                  <Phone size={20} color="#7C3AED" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Telefon</Text>
                  <Text style={styles.contactValue}>{employee.userContact.phoneNumber}</Text>
                </View>
              </TouchableOpacity>
            )}
            {employee.userContact.businessPhone && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => openPhoneCall(employee.userContact.businessPhone)}
              >
                <View style={styles.contactIconContainer}>
                  <Phone size={20} color="#7C3AED" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>İş Telefonu</Text>
                  <Text style={styles.contactValue}>{employee.userContact.businessPhone}</Text>
                </View>
              </TouchableOpacity>
            )}
            {employee.userContact.email && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => openEmail(employee.userContact.email)}
              >
                <View style={styles.contactIconContainer}>
                  <Mail size={20} color="#7C3AED" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>E-posta</Text>
                  <Text style={styles.contactValue}>{employee.userContact.email}</Text>
                </View>
              </TouchableOpacity>
            )}
            {employee.userContact.businessEmail && (
              <TouchableOpacity
                style={[styles.contactRow, styles.contactRowLast]}
                onPress={() => openEmail(employee.userContact.businessEmail)}
              >
                <View style={styles.contactIconContainer}>
                  <Mail size={20} color="#7C3AED" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>İş E-postası</Text>
                  <Text style={styles.contactValue}>{employee.userContact.businessEmail}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {socialLinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sosyal Medya</Text>
            <View style={styles.card}>
              {socialLinks.map((link, index) => (
                <TouchableOpacity
                  key={link.platform}
                  style={[styles.socialRow, index === socialLinks.length - 1 && styles.contactRowLast]}
                  onPress={() => openUrl(link.url)}
                >
                  <Text style={styles.socialPlatform}>{link.platform}</Text>
                  <Text style={styles.socialLink}>Profili Görüntüle</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İş Bilgileri</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color="#7C3AED" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>İşe Başlama Tarihi</Text>
                <Text style={styles.infoValue}>
                  {employee.jobStartDate ? formatDate(employee.jobStartDate) : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Clock size={20} color="#7C3AED" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Çalışma Süresi</Text>
                <Text style={styles.infoValue}>{workDuration}</Text>
              </View>
            </View>
            {employee.currentTitle && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Briefcase size={20} color="#7C3AED" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Pozisyon</Text>
                  <Text style={styles.infoValue}>{employee.currentTitle}</Text>
                </View>
              </View>
            )}
            {employee.department && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Building2 size={20} color="#7C3AED" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Departman</Text>
                  <Text style={styles.infoValue}>{employee.department}</Text>
                </View>
              </View>
            )}
            {employee.personalInformation.workPlace && (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoIconContainer}>
                  <MapPin size={20} color="#7C3AED" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Çalışma Yeri</Text>
                  <Text style={styles.infoValue}>{employee.personalInformation.workPlace}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {employee.reportsTo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yönetici</Text>
            <View style={styles.card}>
              <View style={styles.managerRow}>
                <View style={styles.managerAvatar}>
                  {employee.reportsTo.profilePhoto && employee.reportsTo.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                    <Image source={{ uri: employee.reportsTo.profilePhoto }} style={styles.managerAvatarImage} />
                  ) : (
                    <Text style={styles.managerAvatarText}>
                      {employee.reportsTo.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'YN'}
                    </Text>
                  )}
                </View>
                <View style={styles.managerInfo}>
                  <Text style={styles.managerName}>{employee.reportsTo.fullName}</Text>
                  {employee.reportsTo.title && (
                    <Text style={styles.managerTitle}>{employee.reportsTo.title}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {employee.colleagues && employee.colleagues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Çalışma Arkadaşları</Text>
            <View style={styles.card}>
              {employee.colleagues.map((colleague, index) => (
                <View
                  key={colleague.id}
                  style={[
                    styles.colleagueRow,
                    index === employee.colleagues.length - 1 && styles.colleagueRowLast
                  ]}
                >
                  <View style={styles.colleagueAvatar}>
                    {colleague.profilePhoto && colleague.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                      <Image source={{ uri: colleague.profilePhoto }} style={styles.colleagueAvatarImage} />
                    ) : (
                      <Text style={styles.colleagueAvatarText}>
                        {colleague.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '600',
    color: '#7C3AED',
  },
  employeeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  employeeTitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  socialPlatform: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  socialLink: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  managerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  managerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  managerAvatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  managerAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },
  managerInfo: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  managerTitle: {
    fontSize: 14,
    color: '#666',
  },
  colleagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  colleagueRowLast: {
    borderBottomWidth: 0,
  },
  colleagueAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  colleagueAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colleagueAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  colleagueInfo: {
    flex: 1,
  },
  colleagueName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  colleagueTitle: {
    fontSize: 13,
    color: '#666',
  },
});
