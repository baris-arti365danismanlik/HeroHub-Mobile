import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { Calendar, Clock, FileText } from 'lucide-react-native';
import type { UserDayOffBalance, UserDayOff, UserRequest } from '@/types/backend';

export default function HomeScreen() {
  const { user } = useAuth();
  const [dayOffBalance, setDayOffBalance] = useState<UserDayOffBalance | null>(null);
  const [recentDayOffs, setRecentDayOffs] = useState<UserDayOff[]>([]);
  const [recentRequests, setRecentRequests] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [balance, dayOffs, requests] = await Promise.all([
        userService.getDayOffBalance(user.id),
        userService.getUserDayOffs(user.id),
        userService.getUserRequests(user.id),
      ]);

      setDayOffBalance(balance);
      setRecentDayOffs(dayOffs.slice(0, 3));
      setRecentRequests(requests.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Merhaba,</Text>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Calendar size={24} color="#007AFF" />
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
            <Clock size={24} color="#007AFF" />
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
            <FileText size={24} color="#007AFF" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
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
    color: '#007AFF',
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
