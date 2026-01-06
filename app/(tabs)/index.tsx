import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { inboxService } from '@/services/inbox.service';
import { Calendar, Clock, FileText, Menu, Bell, MessageSquare, User as UserIcon } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { InboxModal } from '@/components/InboxModal';
import type { UserDayOffBalance, UserDayOff, UserRequest } from '@/types/backend';

export default function HomeScreen() {
  const { user } = useAuth();
  const [dayOffBalance, setDayOffBalance] = useState<UserDayOffBalance | null>(null);
  const [recentDayOffs, setRecentDayOffs] = useState<UserDayOff[]>([]);
  const [recentRequests, setRecentRequests] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [inboxVisible, setInboxVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [balance, dayOffs, requests, unread] = await Promise.all([
        userService.getDayOffBalance(user.id),
        userService.getUserDayOffs(user.id),
        userService.getUserRequests(user.id),
        inboxService.getUnreadCount(user.id),
      ]);

      setDayOffBalance(balance);
      setRecentDayOffs(dayOffs.slice(0, 3));
      setRecentRequests(requests.slice(0, 3));
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={20} color="#1a1a1a" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setInboxVisible(true)}
              >
                <MessageSquare size={20} color="#1a1a1a" />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.profileButton}>
                {user?.profilePictureUrl ? (
                  <Image
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.headerProfileImage}
                  />
                ) : (
                  <View style={styles.headerProfilePlaceholder}>
                    <UserIcon size={20} color="#7C3AED" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar size={24} color="#7C3AED" />
              <Text style={styles.cardTitle}>İzin Bakiyesi</Text>
            </View>
        {dayOffBalance ? (
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceValue}>{dayOffBalance.totalDays}</Text>
              <Text style={styles.balanceLabel}>Toplam Gün</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceValue}>{dayOffBalance.usedDays}</Text>
              <Text style={styles.balanceLabel}>Kullanılan</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={[styles.balanceValue, styles.balanceValueHighlight]}>
                {dayOffBalance.remainingDays}
              </Text>
              <Text style={styles.balanceLabel}>Kalan</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>İzin bakiyesi bulunamadı</Text>
        )}
      </View>

          {recentDayOffs.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Clock size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Son İzinler</Text>
              </View>
          {recentDayOffs.map((dayOff) => (
            <View key={dayOff.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>
                {new Date(dayOff.startDate).toLocaleDateString('tr-TR')}
              </Text>
              <Text style={styles.listItemSubtitle}>{dayOff.totalDays} gün</Text>
            </View>
          ))}
        </View>
      )}

          {recentRequests.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FileText size={24} color="#7C3AED" />
                <Text style={styles.cardTitle}>Son Talepler</Text>
              </View>
          {recentRequests.map((request) => (
            <View key={request.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{request.title}</Text>
              <Text style={styles.listItemSubtitle}>{request.description}</Text>
            </View>
          ))}
        </View>
      )}
        </ScrollView>
      </View>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      {user && (
        <InboxModal
          visible={inboxVisible}
          onClose={() => setInboxVisible(false)}
          userId={user.id}
          onUnreadCountChange={setUnreadCount}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  balanceValueHighlight: {
    color: '#7C3AED',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
