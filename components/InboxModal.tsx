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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, QrCode, Check, Menu, User as UserIcon } from 'lucide-react-native';
import { notificationService } from '@/services/notification.service';
import { UserNotification, NotificationDetail, LeaveRequestNotificationData, DayOffType, DayOffStatus } from '@/types/backend';
import { normalizePhotoUrl } from '@/utils/formatters';
import { SurveyModal } from './SurveyModal';
import { DrawerMenu } from './DrawerMenu';
import { ProfileMenu } from './ProfileMenu';
import { userService } from '@/services/user.service';

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
  backendUserId: number;
  userName: string;
  profilePhotoUrl?: string;
  onNotificationRead?: () => void;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
}

export function InboxModal({ visible, onClose, backendUserId, userName, profilePhotoUrl, onNotificationRead, onLogout, onNavigate }: InboxModalProps) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [surveyModalVisible, setSurveyModalVisible] = useState(false);
  const [surveyAnswerId, setSurveyAnswerId] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [requesterInfo, setRequesterInfo] = useState<{
    name: string;
    title: string;
    photo: string;
    dayOffBalance: number;
  } | null>(null);

  useEffect(() => {
    if (visible && backendUserId) {
      loadInboxData();
    }
  }, [visible, backendUserId]);

  const loadInboxData = async () => {
    try {
      setLoading(true);
      const notificationsData = await notificationService.getUserNotifications();
      setNotifications(notificationsData);
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

  const formatDateWithDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return `${dateFormatted} - ${capitalizedDay}`;
  };

  const handleNotificationClick = async (notificationId: number) => {
    try {
      setLoadingDetail(true);
      setRequesterInfo(null);
      const detail = await notificationService.getNotificationDetail(notificationId);
      setSelectedNotification(detail);

      if (detail.inboxComponentType === 1 && detail.data) {
        try {
          const leaveData = JSON.parse(detail.data) as LeaveRequestNotificationData;
          if (leaveData.RequesterUserId) {
            const badgeInfo = await userService.getBadgeCardInfo(leaveData.RequesterUserId);
            setRequesterInfo({
              name: badgeInfo.fullName || `${badgeInfo.firstName} ${badgeInfo.lastName}`,
              title: badgeInfo.title || '',
              photo: normalizePhotoUrl(badgeInfo.profilePhoto),
              dayOffBalance: badgeInfo.dayOffBalance || 0,
            });
          }
        } catch (error) {
          console.error('Error loading requester info:', error);
        }
      }

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
    setRequesterInfo(null);
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

  const getDayOffTypeName = (type?: number): string => {
    switch (type) {
      case DayOffType.Annual:
        return 'Yıllık İzin';
      case DayOffType.Sick:
        return 'Hastalık İzni';
      case DayOffType.Maternity:
        return 'Doğum İzni';
      case DayOffType.Paternity:
        return 'Babalık İzni';
      case DayOffType.Marriage:
        return 'Evlilik İzni';
      case DayOffType.Death:
        return 'Ölüm İzni';
      case DayOffType.Birthday:
        return 'Doğum Günü İzni';
      case DayOffType.Unpaid:
        return 'Ücretsiz İzin';
      case DayOffType.Other:
        return 'Diğer';
      default:
        return 'Bilinmeyen';
    }
  };

  const getDayOffStatusName = (status?: number): string => {
    switch (status) {
      case DayOffStatus.Pending:
        return 'Beklemede';
      case DayOffStatus.Approved:
        return 'Onaylandı';
      case DayOffStatus.Rejected:
        return 'Reddedildi';
      case DayOffStatus.Cancelled:
        return 'İptal Edildi';
      default:
        return 'Bilinmeyen';
    }
  };

  const getDayOffStatusColor = (status?: number): string => {
    switch (status) {
      case DayOffStatus.Pending:
        return '#F59E0B';
      case DayOffStatus.Approved:
        return '#10B981';
      case DayOffStatus.Rejected:
        return '#EF4444';
      case DayOffStatus.Cancelled:
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const renderNotificationDetail = () => {
    if (!selectedNotification) return null;

    const senderPhotoUrl = normalizePhotoUrl(selectedNotification.senderImageUrl);
    const isSurvey = selectedNotification.inboxComponentType === 7;
    const isLeaveRequest = selectedNotification.inboxComponentType === 1;

    let leaveRequestData: LeaveRequestNotificationData | null = null;
    if (isLeaveRequest && selectedNotification.data) {
      try {
        leaveRequestData = JSON.parse(selectedNotification.data) as LeaveRequestNotificationData;
      } catch (error) {
        console.error('Error parsing leave request data:', error);
      }
    }

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
              <Text style={styles.notificationDate}>
                {new Date(selectedNotification.updatedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {!isLeaveRequest && (
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
              <Text style={styles.detailMessage}>{selectedNotification.message}</Text>
            </View>
          )}

          {isLeaveRequest && leaveRequestData && (
            <>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
                <Text style={styles.detailMessage}>{selectedNotification.message}</Text>
              </View>

              {requesterInfo && (
                <View style={styles.requesterCard}>
                  {requesterInfo.photo ? (
                    <Image
                      source={{ uri: requesterInfo.photo }}
                      style={styles.requesterPhoto}
                    />
                  ) : (
                    <View style={styles.requesterPhotoPlaceholder}>
                      <Text style={styles.requesterInitial}>
                        {requesterInfo.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.requesterInfo}>
                    <Text style={styles.requesterName}>{requesterInfo.name}</Text>
                    <Text style={styles.requesterTitle}>{requesterInfo.title}</Text>
                  </View>
                  <View style={styles.balanceBadge}>
                    <Text style={styles.balanceBadgeLabel}>İZİN BAKİYESİ</Text>
                    <Text style={styles.balanceBadgeValue}>{requesterInfo.dayOffBalance} Gün</Text>
                  </View>
                </View>
              )}

              <View style={styles.leaveDetailSection}>
                <Text style={styles.leaveDetailTitle}>İZİN DETAYI</Text>

                <View style={styles.leaveDetailItem}>
                  <Text style={styles.leaveDetailLabel}>İzin Türü</Text>
                  <Text style={styles.leaveDetailValue}>
                    {getDayOffTypeName(leaveRequestData.DayOffType)}
                  </Text>
                </View>

                <View style={styles.leaveDetailItem}>
                  <Text style={styles.leaveDetailLabel}>Başlangıç Tarihi</Text>
                  <Text style={styles.leaveDetailValue}>
                    {leaveRequestData.StartDate ? formatDateWithDay(leaveRequestData.StartDate) : '-'}
                  </Text>
                </View>

                <View style={styles.leaveDetailItem}>
                  <Text style={styles.leaveDetailLabel}>Bitiş Tarihi</Text>
                  <Text style={styles.leaveDetailValue}>
                    {leaveRequestData.EndDate ? formatDateWithDay(leaveRequestData.EndDate) : '-'}
                  </Text>
                </View>

                <View style={styles.leaveDetailItem}>
                  <Text style={styles.leaveDetailLabel}>Süre</Text>
                  <Text style={styles.leaveDetailValue}>{leaveRequestData.CountOfDays} Gün</Text>
                </View>

                {leaveRequestData.Reason && (
                  <View style={styles.leaveDetailItem}>
                    <Text style={styles.leaveDetailLabel}>Not</Text>
                    <Text style={styles.leaveDetailValue}>{leaveRequestData.Reason}</Text>
                  </View>
                )}
              </View>

              {leaveRequestData.Status === DayOffStatus.Pending && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.rejectButtonText}>Vazgeç</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.approveButtonText}>Onayla</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

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
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Menu size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>hero</Text>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>+</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setProfileMenuVisible(true)}
        >
          {profilePhotoUrl ? (
            <Image
              source={{ uri: profilePhotoUrl }}
              style={styles.headerProfileImage}
            />
          ) : (
            <View style={styles.headerProfilePlaceholder}>
              <UserIcon size={20} color="#7C3AED" />
            </View>
          )}
        </TouchableOpacity>
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
          {notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                selectedNotification?.id === notification.id && styles.notificationItemSelected
              ]}
              onPress={() => handleNotificationClick(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <Text style={styles.senderName}>{notification.type || 'Sistem Bildirimi'}</Text>
                <Text style={styles.notificationDate}>
                  {new Date(notification.createdAt).toLocaleDateString('tr-TR') === new Date().toLocaleDateString('tr-TR')
                    ? `Bugün, ${formatTime(notification.createdAt)}`
                    : `${new Date(notification.createdAt).getDate()} ${new Date(notification.createdAt).toLocaleDateString('tr-TR', { month: 'long' })} ${new Date(notification.createdAt).getFullYear()}, ${formatTime(notification.createdAt)}`
                  }
                </Text>
              </View>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </TouchableOpacity>
          ))}
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
        statusBarTranslucent={false}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <StatusBar barStyle="dark-content" />
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

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigate={(route) => {
          setDrawerVisible(false);
          onClose();
          if (onNavigate) {
            onNavigate(route);
          }
        }}
      />

      <ProfileMenu
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        userName={userName}
        profilePhotoUrl={profilePhotoUrl}
        onLogout={onLogout}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -35,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 0,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerProfilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationItemSelected: {
    backgroundColor: '#F3E8FF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
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
  requesterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  requesterPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  requesterPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requesterInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  requesterInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 4,
  },
  requesterTitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  balanceBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceBadgeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#E9D5FF',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  balanceBadgeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  leaveDetailSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  leaveDetailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  leaveDetailItem: {
    marginBottom: 16,
  },
  leaveDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  leaveDetailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
