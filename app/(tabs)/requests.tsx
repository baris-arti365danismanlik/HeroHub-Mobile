import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { leaveService } from '@/services/leave.service';
import { Plus, Menu } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { LeaveRequestModal, LeaveRequestData } from '@/components/LeaveRequestModal';
import { SuccessModal } from '@/components/SuccessModal';
import type { UserRequest } from '@/types/backend';

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

export default function RequestsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await userService.getUserRequests(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSubmit = async (data: LeaveRequestData) => {
    if (!user) return;

    try {
      await leaveService.createLeaveRequest({
        user_id: user.id,
        leave_type: data.leaveType,
        start_date: data.startDate,
        end_date: data.endDate,
        duration: data.duration,
        notes: data.notes,
      });

      setLeaveModalVisible(false);
      setSuccessModalVisible(true);
      loadRequests();
    } catch (error) {
      console.error('Error creating leave request:', error);
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
          <Text style={styles.headerTitle}>Taleplerim</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setLeaveModalVisible(true)}>
            <Plus size={24} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz talep kaydınız bulunmamaktadır</Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.titleText}>{request.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[request.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[request.status]}</Text>
                </View>
              </View>
              <Text style={styles.descriptionText}>{request.description}</Text>
              <Text style={styles.dateText}>
                {new Date(request.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      </View>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      <LeaveRequestModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        onSubmit={handleLeaveSubmit}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="İzin Talebi Gir"
        message="Talebiniz başarı ile iletildi."
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
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
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
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
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
