import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { inboxService } from '@/services/inbox.service';
import { homeService } from '@/services/home.service';
import { notificationService } from '@/services/notification.service';
import type {
  OnboardingTaskCategory,
  NewEmployee,
  UserAgendaItem,
  UserTrainingStatus,
} from '@/services/home.service';
import { Calendar, Clock, FileText, Menu, Mail, MessageSquare, User as UserIcon, Users, BookOpen, TrendingUp, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { InboxModal } from '@/components/InboxModal';
import { ProfileMenu } from '@/components/ProfileMenu';
import type { UserDayOffBalance, UserProfileDetails } from '@/types/backend';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [dayOffBalance, setDayOffBalance] = useState<UserDayOffBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [inboxVisible, setInboxVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newEmployees, setNewEmployees] = useState<NewEmployee[]>([]);
  const [userAgenda, setUserAgenda] = useState<UserAgendaItem[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<UserTrainingStatus | null>(null);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTaskCategory[]>([]);
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);

  useEffect(() => {
    if (user?.backend_user_id) {
      loadDashboardData();
    }
  }, [user?.backend_user_id]);

  const loadDashboardData = async () => {
    if (!user?.backend_user_id || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [
        balance,
        notifications,
        unread,
        employees,
        agenda,
        training,
        tasks,
        profile,
      ] = await Promise.all([
        userService.getDayOffBalance(user.backend_user_id.toString()).catch(() => null),
        notificationService.getUnreadCount().catch(() => 0),
        inboxService.getUnreadCount(user.id).catch(() => 0),
        homeService.listNewEmployees().catch(() => []),
        homeService.listUserAgenda().catch(() => []),
        homeService.getUserTrainingStatus().catch(() => null),
        homeService.listOnboardingTasksByCategory().catch(() => []),
        userService.getUserProfile(user.backend_user_id).catch(() => null),
      ]);

      setDayOffBalance(balance);
      setNotificationCount(notifications);
      setUnreadCount(unread);
      setNewEmployees(employees.slice(0, 3));
      setUserAgenda(agenda.slice(0, 5));
      setTrainingStatus(training);
      setOnboardingTasks(tasks);
      setProfileDetails(profile);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    setProfileMenuVisible(false);
    await logout();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
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

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setInboxVisible(true)}
              >
                <Mail size={20} color="#1a1a1a" />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => setProfileMenuVisible(true)}
              >
                {(() => {
                  const photoUrl = profileDetails?.profilePhoto || user?.profilePictureUrl;

                  if (photoUrl) {
                    return (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.headerProfileImage}
                      />
                    );
                  }
                  return (
                    <View style={styles.headerProfilePlaceholder}>
                      <UserIcon size={20} color="#7C3AED" />
                    </View>
                  );
                })()}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
          }
        >
          {dayOffBalance && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Calendar size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>İzin Bakiyesi</Text>
              </View>
              <View style={styles.balanceContainer}>
                <View style={styles.balanceItem}>
                  <Text style={[styles.balanceValue, styles.balanceValueHighlight]}>
                    {dayOffBalance.remainingDays || 0}
                  </Text>
                  <Text style={styles.balanceLabel}>Kalan Gün</Text>
                </View>
              </View>
            </View>
          )}

          {trainingStatus && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <BookOpen size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Eğitim Durumu</Text>
              </View>
              <View style={styles.trainingContainer}>
                <View style={styles.trainingItem}>
                  <View style={styles.trainingIcon}>
                    <CheckCircle size={20} color="#10B981" />
                  </View>
                  <View style={styles.trainingInfo}>
                    <Text style={styles.trainingValue}>{trainingStatus.plannedCount}</Text>
                    <Text style={styles.trainingLabel}>Planlanmış</Text>
                  </View>
                </View>
                <View style={styles.trainingDivider} />
                <View style={styles.trainingItem}>
                  <View style={styles.trainingIcon}>
                    <AlertCircle size={20} color="#EF4444" />
                  </View>
                  <View style={styles.trainingInfo}>
                    <Text style={styles.trainingValue}>{trainingStatus.overdueCount}</Text>
                    <Text style={styles.trainingLabel}>Gecikmiş</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {newEmployees.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Users size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Yeni Çalışanlar</Text>
              </View>
              {newEmployees.map((employee) => (
                <View key={employee.id} style={styles.employeeItem}>
                  <View style={styles.employeeLeft}>
                    {employee.profilePhoto ? (
                      <Image source={{ uri: employee.profilePhoto }} style={styles.employeeImage} />
                    ) : (
                      <View style={styles.employeePlaceholder}>
                        <UserIcon size={20} color="#7C3AED" />
                      </View>
                    )}
                    <View style={styles.employeeInfo}>
                      <Text style={styles.employeeName}>{employee.fullname}</Text>
                      <Text style={styles.employeeTitle}>{employee.title || 'Pozisyon belirtilmemiş'}</Text>
                    </View>
                  </View>
                  <Text style={styles.employeeDate}>
                    {new Date(employee.jobStartDate).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {userAgenda.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TrendingUp size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Son Aktiviteler</Text>
              </View>
              {userAgenda.map((item, index) => (
                <View key={index} style={styles.agendaItem}>
                  <View style={styles.agendaIcon}>
                    <FileText size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.agendaContent}>
                    <Text style={styles.agendaTitle}>{item.title}</Text>
                    <Text style={styles.agendaDate}>
                      {new Date(item.eventDate).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {onboardingTasks.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Clock size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Oryantasyon Görevleri</Text>
              </View>
              {onboardingTasks.map((category) => (
                <View key={category.id} style={styles.taskCategory}>
                  <Text style={styles.taskCategoryTitle}>{category.name}</Text>
                  <Text style={styles.taskCount}>{category.onboardingTaskList.length} görev</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {user && user.backend_user_id && (
        <InboxModal
          visible={inboxVisible}
          onClose={() => setInboxVisible(false)}
          backendUserId={user.backend_user_id}
          userName={`${user.firstName} ${user.lastName}`}
          onNotificationRead={async () => {
            const count = await notificationService.getUnreadCount().catch(() => 0);
            setNotificationCount(count);
          }}
        />
      )}

      <ProfileMenu
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        profilePhoto={profileDetails?.profilePhoto || user?.profilePictureUrl}
        email={user?.email || ''}
        name={user ? `${user.firstName} ${user.lastName}` : ''}
        onLogout={handleLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 4,
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
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  balanceValueHighlight: {
    color: '#7C3AED',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  trainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trainingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainingInfo: {
    flex: 1,
  },
  trainingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  trainingLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  trainingDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  employeeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  employeeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  employeePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  employeeTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  employeeDate: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  agendaItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  agendaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agendaContent: {
    flex: 1,
  },
  agendaTitle: {
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  agendaDate: {
    fontSize: 13,
    color: '#666',
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskCategoryTitle: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  taskCount: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 24,
  },
});
