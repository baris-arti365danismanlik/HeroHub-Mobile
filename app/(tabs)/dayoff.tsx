import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { Plus, Menu } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import type { UserDayOff } from '@/types/backend';

const STATUS_LABELS: Record<number, string> = {
  0: 'Beklemede',
  1: 'Onaylandı',
  2: 'Reddedildi',
  3: 'İptal Edildi',
};

const STATUS_COLORS: Record<number, string> = {
  0: '#FF9500',
  1: '#34C759',
  2: '#FF3B30',
  3: '#8E8E93',
};

export default function DayOffScreen() {
  const { user } = useAuth();
  const [dayOffs, setDayOffs] = useState<UserDayOff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (user) {
      loadDayOffs();
    }
  }, [user]);

  const loadDayOffs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await userService.getUserDayOffs(user.id);
      setDayOffs(data);
    } catch (error) {
      console.error('Error loading day offs:', error);
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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerVisible(true)}
          >
            <Menu size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>İzinlerim</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {dayOffs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz izin kaydınız bulunmamaktadır</Text>
          </View>
        ) : (
          dayOffs.map((dayOff) => (
            <View key={dayOff.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    {new Date(dayOff.startDate).toLocaleDateString('tr-TR')}
                  </Text>
                  <Text style={styles.separatorText}>-</Text>
                  <Text style={styles.dateText}>
                    {new Date(dayOff.endDate).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[dayOff.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[dayOff.status]}</Text>
                </View>
              </View>
              <Text style={styles.daysText}>{dayOff.totalDays} gün</Text>
              {dayOff.reason && (
                <Text style={styles.reasonText}>{dayOff.reason}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
      </View>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  separatorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  daysText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
