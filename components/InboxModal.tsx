import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { X, Mail, ChevronLeft, Download, Send, CheckCircle, Clock, Users, Briefcase } from 'lucide-react-native';
import { notificationService } from '@/services/notification.service';
import { userService } from '@/services/user.service';
import { UserNotification, UserProfileDetails, NewEmployee, RecentActivity } from '@/types/backend';

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
  backendUserId: number;
  userName: string;
}

export function InboxModal({ visible, onClose, backendUserId, userName }: InboxModalProps) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [newEmployees, setNewEmployees] = useState<NewEmployee[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (visible && backendUserId) {
      loadInboxData();
    }
  }, [visible, backendUserId]);

  const loadInboxData = async () => {
    try {
      setLoading(true);
      const [notificationsData, profileData] = await Promise.all([
        notificationService.getUserNotifications(),
        userService.getUserProfile(backendUserId),
      ]);

      setNotifications(notificationsData);
      setProfileDetails(profileData);

      if (profileData.colleagues && profileData.colleagues.length > 0) {
        const employees: NewEmployee[] = profileData.colleagues
          .slice(0, 5)
          .map(colleague => ({
            id: colleague.id,
            fullName: colleague.fullName,
            title: colleague.title || 'Çalışan',
            profilePhoto: colleague.profilePhoto,
          }));
        setNewEmployees(employees);
      }

      const activities: RecentActivity[] = [
        {
          id: 1,
          message: 'Maaş bilgileri güncelleme talebiniz yöneticinize gönderildi.',
          timestamp: new Date().toISOString(),
          icon: 'clock',
        },
        {
          id: 2,
          message: 'Maaş bilgileri güncelleme talebiniz yöneticinize gönderildi.',
          timestamp: new Date().toISOString(),
          icon: 'clock',
        },
      ];
      setRecentActivities(activities);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderInboxContent = () => (
    <>
      <View style={styles.modalHeader}>
        <View style={styles.profileSection}>
          {profileDetails?.profilePhoto && profileDetails.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
            <Image
              source={{ uri: profileDetails.profilePhoto }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {userName ? userName.charAt(0).toUpperCase() : 'K'}
              </Text>
            </View>
          )}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{userName || 'Kullanıcı'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.trainingStatusCard}>
            <View style={styles.cardHeader}>
              <Briefcase size={20} color="#7C3AED" />
              <Text style={styles.cardTitle}>Eğitim Durumu</Text>
            </View>
            <View style={styles.trainingStatusRow}>
              <View style={styles.trainingStatusItem}>
                <View style={styles.statusIconContainer}>
                  <CheckCircle size={24} color="#10B981" />
                </View>
                <Text style={styles.statusCount}>0</Text>
                <Text style={styles.statusLabel}>Planlanmış</Text>
              </View>
              <View style={styles.trainingStatusDivider} />
              <View style={styles.trainingStatusItem}>
                <View style={styles.statusIconContainer}>
                  <Clock size={24} color="#EF4444" />
                </View>
                <Text style={styles.statusCount}>0</Text>
                <Text style={styles.statusLabel}>Gecikmış</Text>
              </View>
            </View>
          </View>

          {newEmployees.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color="#7C3AED" />
                <Text style={styles.sectionTitle}>Yeni Çalışanlar</Text>
              </View>
              {newEmployees.map((employee) => (
                <View key={employee.id} style={styles.employeeItem}>
                  {employee.profilePhoto && employee.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                    <Image
                      source={{ uri: employee.profilePhoto }}
                      style={styles.employeePhoto}
                    />
                  ) : (
                    <View style={styles.employeePhotoPlaceholder}>
                      <Text style={styles.employeeInitial}>
                        {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : 'Ç'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{employee.fullName || 'Çalışan'}</Text>
                    <Text style={styles.employeeTitle}>{employee.title || 'Pozisyon'}</Text>
                  </View>
                  {employee.daysRemaining !== undefined && (
                    <Text style={styles.daysRemaining}>{employee.daysRemaining} Kas</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {recentActivities.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#7C3AED" />
                <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
              </View>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Clock size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTime}>
                      {new Date(activity.timestamp).getDate()} Kas {formatTime(activity.timestamp)}
                    </Text>
                    <Text style={styles.activityMessage}>{activity.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {renderInboxContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0D4F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C3AED',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  trainingStatusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  trainingStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trainingStatusItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  trainingStatusDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  employeePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  employeePhotoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0D4F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employeeInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  employeeTitle: {
    fontSize: 12,
    color: '#666',
  },
  daysRemaining: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityMessage: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
});
