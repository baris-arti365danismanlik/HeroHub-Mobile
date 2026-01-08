import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  X,
  Phone,
  Mail,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Linkedin,
  Facebook,
  Instagram,
} from 'lucide-react-native';
import { userService } from '@/services/user.service';
import type { UserProfileDetails } from '@/types/backend';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<UserProfileDetails | null>(null);

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserProfile(parseInt(id));
      setEmployee(data);
    } catch (error) {
      console.error('Error loading employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
    }
  };

  const handleEmailPress = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleSocialPress = (url: string | null | undefined) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateWorkDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

    if (diffYears > 0) {
      return `${diffYears} yıl ${diffMonths} ay ${diffDays} gün`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ay ${diffDays} gün`;
    } else {
      return `${diffDays} gün`;
    }
  };

  const getWorkTypeLabel = (workType: number) => {
    switch (workType) {
      case 0:
        return 'Ofis';
      case 1:
        return 'Uzaktan';
      case 2:
        return 'Hibrit';
      default:
        return '-';
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Tam Zamanlı';
      default:
        return '-';
    }
  };

  const parseSocialMedia = (socialMediaJson: string | null) => {
    if (!socialMediaJson) return null;
    try {
      return JSON.parse(socialMediaJson);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Çalışan Detayı</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Çalışan bilgisi bulunamadı</Text>
        </View>
      </View>
    );
  }

  const socialMedia = employee.socialMedia
    ? parseSocialMedia(employee.socialMedia.socialMediaLinks)
    : null;
  const fullName = `${employee.personalInformation.firstName} ${employee.personalInformation.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Çalışan Detayı</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {employee.profilePhoto ? (
              <Image
                source={{
                  uri: employee.profilePhoto.startsWith('http')
                    ? employee.profilePhoto
                    : `https://faz2-api.herotr.com${employee.profilePhoto}`,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.employeeName}>{fullName}</Text>
          {employee.currentTitle && (
            <Text style={styles.employeeTitle}>{employee.currentTitle}</Text>
          )}
        </View>

        <View style={styles.contactSection}>
          {employee.userContact.phoneNumber && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handlePhonePress(employee.userContact.phoneNumber)}
            >
              <Phone size={20} color="#666" />
              <Text style={styles.contactText}>{employee.userContact.phoneNumber}</Text>
            </TouchableOpacity>
          )}

          {employee.userContact.businessPhone && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handlePhonePress(employee.userContact.businessPhone)}
            >
              <Phone size={20} color="#666" />
              <Text style={styles.contactText}>{employee.userContact.businessPhone}</Text>
            </TouchableOpacity>
          )}

          {employee.userContact.email && (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handleEmailPress(employee.userContact.email)}
            >
              <Mail size={20} color="#666" />
              <Text style={styles.contactText}>{employee.userContact.email}</Text>
            </TouchableOpacity>
          )}

          {socialMedia && (
            <View style={styles.socialRow}>
              {socialMedia.linkedinLink && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(socialMedia.linkedinLink)}
                >
                  <Linkedin size={24} color="#0077B5" />
                </TouchableOpacity>
              )}
              {socialMedia.facebookLink && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(socialMedia.facebookLink)}
                >
                  <Facebook size={24} color="#1877F2" />
                </TouchableOpacity>
              )}
              {socialMedia.instagramLink && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(socialMedia.instagramLink)}
                >
                  <Instagram size={24} color="#E4405F" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>İşe Başlama Tarihi</Text>
          <Text style={styles.dateText}>
            {formatDate(employee.personalInformation.jobStartDate)}
          </Text>
          <Text style={styles.durationText}>
            {calculateWorkDuration(employee.personalInformation.jobStartDate)}
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          {employee.currentTitle && (
            <View style={styles.detailCard}>
              <View style={styles.detailIconWrapper}>
                <Briefcase size={20} color="#7C3AED" />
              </View>
              <Text style={styles.detailLabel}>Ürün ve Pazarlama Direktörlüğü</Text>
            </View>
          )}

          {employee.department && (
            <View style={styles.detailCard}>
              <View style={styles.detailIconWrapper}>
                <Building2 size={20} color="#7C3AED" />
              </View>
              <Text style={styles.detailLabel}>{employee.department}</Text>
            </View>
          )}

          <View style={styles.detailCard}>
            <View style={styles.detailIconWrapper}>
              <Building2 size={20} color="#7C3AED" />
            </View>
            <Text style={styles.detailLabel}>
              {employee.personalInformation.workPlace || 'Artı365 Danışmanlık'}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconWrapper}>
              <Clock size={20} color="#7C3AED" />
            </View>
            <Text style={styles.detailLabel}>
              {getStatusLabel(employee.userStatus)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
          <Text style={styles.profileButtonText}>Profile Git</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeFooterButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.closeFooterButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 60,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#7C3AED',
  },
  employeeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  employeeTitle: {
    fontSize: 15,
    color: '#666',
  },
  contactSection: {
    paddingHorizontal: 24,
    gap: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
  },
  socialButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 13,
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  detailsGrid: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  profileButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeFooterButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7C3AED',
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
});
