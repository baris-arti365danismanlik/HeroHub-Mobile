import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import {
  Plus,
  Menu,
  Bell,
  MessageSquare,
  User as UserIcon,
  Briefcase,
  Building2,
  Umbrella,
  ChevronDown,
} from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Accordion } from '@/components/Accordion';
import { DayOffCard } from '@/components/DayOffCard';
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
  const [selectedSection, setSelectedSection] = useState('İzin Bilgileri');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedType, setSelectedType] = useState('Tümü');

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

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const sections = ['İzin Bilgileri'];

  const renderDayOffInfoSection = () => (
    <>
      <Accordion
        title="İZİN BİLGİLERİ"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YILLIK İZİN</Text>
          <Text style={styles.balanceValue}>-4 Gün</Text>
        </View>

        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>İzin Talebi Gir</Text>
        </TouchableOpacity>
      </Accordion>

      <Accordion
        title="PLANLANAN İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <DayOffCard
          type="Yıllık İzin"
          days={5}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          onEdit={() => console.log('Edit')}
        />

        <DayOffCard
          type="Doğum Günü İzni"
          days={1}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          onEdit={() => console.log('Edit')}
        />

        <DayOffCard
          type="Karne Günü İzni"
          days={0.5}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          onEdit={() => console.log('Edit')}
        />

        <DayOffCard
          type="Yıllık İzin"
          days={5}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          onEdit={() => console.log('Edit')}
        />
      </Accordion>

      <Accordion
        title="GEÇMİŞ İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.filtersRow}>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>İzin Türü</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterDropdownText}>{selectedType}</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Yıl</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterDropdownText}>{selectedYear}</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <DayOffCard
          type="Yıllık İzin"
          days={-5}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          isPast
          onEdit={() => console.log('Edit')}
        />

        <DayOffCard
          type="Yıllık İzin"
          days={-3}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          isPast
          onEdit={() => console.log('Edit')}
        />

        <DayOffCard
          type="Yıllık İzin"
          days={14}
          startDate="05.09.2021 Pzt"
          endDate="26.10.2024 Pzt"
          isPast
          onEdit={() => console.log('Edit')}
        />
      </Accordion>
    </>
  );

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

            <TouchableOpacity style={styles.iconButton}>
              <MessageSquare size={20} color="#1a1a1a" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>12</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton}>
              {user.profilePictureUrl ? (
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              {user.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <UserIcon size={48} color="#7C3AED" />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user.firstName} {user.lastName}
              </Text>

              <View style={styles.profileDetails}>
                <View style={styles.profileDetailRow}>
                  <Briefcase size={16} color="#666" />
                  <Text style={styles.profileDetailText}>
                    {user.position || 'Management Trainee'}
                  </Text>
                </View>
                <View style={styles.profileDetailRow}>
                  <Building2 size={16} color="#666" />
                  <Text style={styles.profileDetailText}>Art365 Danışmanlık</Text>
                </View>
              </View>
            </View>
          </View>

          <ProfileDropdown
            options={sections}
            selectedOption={selectedSection}
            onSelect={setSelectedSection}
          />

          <View style={styles.sectionsContainer}>
            {renderDayOffInfoSection()}
          </View>
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
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 6,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#666',
  },
  sectionsContainer: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  requestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
});
