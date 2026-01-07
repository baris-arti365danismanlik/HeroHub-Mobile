import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { pdksService } from '@/services/pdks.service';
import { roleService } from '@/services/role.service';
import { Menu, ChevronDown, Clock } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import type { AttendanceRecord, UserProfile } from '@/types/backend';

export default function PDKSScreen() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentMonth]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [profile, stats] = await Promise.all([
        roleService.getUserProfile(user.id),
        pdksService.getMonthlyStats(
          user.id,
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1
        ),
      ]);

      setUserProfile(profile);
      setMonthlyStats(stats);
      setAttendanceRecords(stats.records);
    } catch (error) {
      console.error('Error loading PDKS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getWorkHours = (duration: number | null) => {
    if (!duration) return '00:00 - 00:00';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {userProfile && (
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: user?.profilePictureUrl || 'https://via.placeholder.com/80',
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.full_name}</Text>
                <View style={styles.profileDetail}>
                  <Text style={styles.profileDetailText}>
                    {userProfile.position || 'Çalışan'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>PDKS</Text>
            <ChevronDown
              size={20}
              color="#666"
              style={{
                transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#1a1a1a" />
              <Text style={styles.sectionTitle}>VARDİYA BİLGİSİ</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mevcut Vardiya</Text>
                <Text style={styles.infoValue}>Vardiya Grup-1</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mevcut Tip</Text>
                <Text style={styles.infoValue}>Sabah Vardiyası</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Çalışma Saatleri</Text>
                <Text style={styles.infoValue}>08:00 - 19:00</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.changeShiftButton}>
              <Text style={styles.changeShiftButtonText}>Vardiya Değiştir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>VARDİYA GEÇMİŞİ</Text>
            </View>

            {attendanceRecords.length === 0 ? (
              <Text style={styles.emptyText}>Vardiya geçmişi bulunamadı</Text>
            ) : (
              attendanceRecords.map((record) => (
                <View key={record.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                    <Text
                      style={[
                        styles.historyTime,
                        record.work_duration
                          ? styles.historyTimeNormal
                          : styles.historyTimeWarning,
                      ]}
                    >
                      {record.work_duration
                        ? getWorkHours(record.work_duration)
                        : '08:00 - 16:00'}
                    </Text>
                  </View>

                  <View style={styles.historyDetails}>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Giriş</Text>
                      <Text style={styles.historyValue}>
                        {formatTime(record.check_in_time)}
                      </Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Çıkış</Text>
                      <Text style={styles.historyValue}>
                        {formatTime(record.check_out_time)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>Görevi Tamamla</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
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
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#666',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  changeShiftButton: {
    backgroundColor: '#7C3AED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeShiftButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  historyTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyTimeNormal: {
    color: '#666',
  },
  historyTimeWarning: {
    color: '#FF3B30',
  },
  historyDetails: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 14,
    color: '#666',
  },
  historyValue: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  viewAllButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#7C3AED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingVertical: 20,
  },
});
