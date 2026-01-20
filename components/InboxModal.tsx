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
import { ChevronLeft, Bell, QrCode, Check } from 'lucide-react-native';
import { notificationService } from '@/services/notification.service';
import { userService } from '@/services/user.service';
import { UserNotification, UserProfileDetails, NotificationDetail } from '@/types/backend';
import { normalizePhotoUrl } from '@/utils/formatters';
import { SurveyModal } from './SurveyModal';

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
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [surveyModalVisible, setSurveyModalVisible] = useState(false);
  const [surveyAnswerId, setSurveyAnswerId] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const handleOpenSurvey = () => {
    if (!selectedNotification || !selectedNotification.data) return;

    try {
      const surveyData = JSON.parse(selectedNotification.data);
      setSurveyAnswerId(surveyData.SurveyAnswerId);
      setSurveyModalVisible(true);
    } catch (error) {
      console.error('Error parsing survey data:', error);
    }
  };

  const handleSurveySuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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
            <TouchableOpacity style={styles.surveyButton} activeOpacity={0.8} onPress={handleOpenSurvey}>
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
        </ScrollView>
      )}
    </>
  );

  return (
    <>
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

          {showSuccessMessage && (
            <View style={styles.successMessageContainer}>
              <View style={styles.successMessage}>
                <View style={styles.successIconContainer}>
                  <Check size={20} color="#10B981" />
                </View>
                <Text style={styles.successMessageText}>Anket başarıyla cevaplandı.</Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {surveyAnswerId && (
        <SurveyModal
          visible={surveyModalVisible}
          onClose={() => setSurveyModalVisible(false)}
          surveyAnswerId={surveyAnswerId}
          onSuccess={handleSurveySuccess}
        />
      )}
    </>
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
  successMessageContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  successIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessageText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
});
