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
  SafeAreaView,
} from 'react-native';
import { X, Mail, ChevronLeft, Download, Send, CircleCheck as CheckCircle, Clock, Users, Briefcase, Bell, QrCode } from 'lucide-react-native';
import { notificationService } from '@/services/notification.service';
import { userService } from '@/services/user.service';
import { UserNotification, UserProfileDetails, NewEmployee, RecentActivity, NotificationDetail } from '@/types/backend';
import { normalizePhotoUrl } from '@/utils/formatters';

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
  backendUserId: number;
  userName: string;
  onNotificationRead?: () => void;
}

export function InboxModal({ visible, onClose, backendUserId, userName, onNotificationRead }: InboxModalProps) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [newEmployees, setNewEmployees] = useState<NewEmployee[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleNotificationClick = async (notificationId: number) => {
    try {
      setLoadingDetail(true);
      const detail = await notificationService.getNotificationDetail(notificationId);
      setSelectedNotification(detail);

      if (!detail.isRead) {
        await notificationService.markAsRead(notificationId);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        onNotificationRead?.();
      }
    } catch (error) {
      console.error('Error loading notification detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBackFromDetail = () => {
    setSelectedNotification(null);
  };

  const renderNotificationDetail = () => {
    if (!selectedNotification) return null;

    const senderPhotoUrl = normalizePhotoUrl(selectedNotification.senderImageUrl);
    const isSurvey = selectedNotification.inboxComponentType === 7;

    return (
      <>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBackFromDetail} style={styles.backButton}>
            <ChevronLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GELEN KUTUSU</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            {senderPhotoUrl ? (
              <Image
                source={{ uri: senderPhotoUrl }}
                style={styles.senderPhoto}
              />
            ) : (
              <View style={styles.senderPhotoPlaceholder}>
                <Text style={styles.senderInitial}>
                  {selectedNotification.senderUserFullname.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>{selectedNotification.senderUserFullname}</Text>
              <Text style={styles.notificationDate}>{formatDate(selectedNotification.updatedAt)}</Text>
            </View>
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
            <Text style={styles.detailMessage}>{selectedNotification.message}</Text>
          </View>

          {isSurvey && (
            <TouchableOpacity style={styles.surveyButton} activeOpacity={0.8}>
              <Text style={styles.surveyButtonText}>Anketi Doldur</Text>
              <QrCode size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </>
    );
  };

  const renderInboxContent = () => (
    <>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ChevronLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gelen Kutusu</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.modalHeader}>
        <View style={styles.profileSection}>
          {(() => {
            const photoUrl = normalizePhotoUrl(profileDetails?.profilePhoto);
            if (photoUrl) {
              return (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.profileImage}
                />
              );
            }
            return (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitial}>
                  {userName ? userName.charAt(0).toUpperCase() : 'K'}
                </Text>
              </View>
            );
          })()}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{userName || 'Kullanıcı'}</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Henüz Bildirim Yok</Text>
          <Text style={styles.emptyMessage}>Yeni bildirimleriniz burada görünecektir</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Bildirimler</Text>
            </View>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.notificationItemUnread
                ]}
                onPress={() => handleNotificationClick(notification.id)}
              >
                <View style={styles.notificationIconContainer}>
                  <Bell size={16} color={notification.isRead ? '#666' : '#7C3AED'} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.createdAt).toLocaleDateString('tr-TR')} {formatTime(notification.createdAt)}
                  </Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>

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
                  {(() => {
                    const photoUrl = normalizePhotoUrl(employee.profilePhoto);
                    if (photoUrl) {
                      return (
                        <Image
                          source={{ uri: photoUrl }}
                          style={styles.employeePhoto}
                        />
                      );
                    }
                    return (
                      <View style={styles.employeePhotoPlaceholder}>
                        <Text style={styles.employeeInitial}>
                          {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : 'Ç'}
                        </Text>
                      </View>
                    );
                  })()}
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
      transparent={false}
      animationType="slide"
      onRequestClose={selectedNotification ? handleBackFromDetail : onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {loadingDetail ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
        ) : selectedNotification ? (
          renderNotificationDetail()
        ) : (
          renderInboxContent()
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
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
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  notificationItemUnread: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
  },
  notificationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  senderPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  senderPhotoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailContent: {
    padding: 20,
    paddingTop: 0,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 30,
  },
  detailMessage: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  surveyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  surveyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
