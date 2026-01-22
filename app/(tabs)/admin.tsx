import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Menu,
  Settings,
  Users,
  Shield,
  Database,
  Activity,
  Bell,
  Lock,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DrawerMenu } from '@/components/DrawerMenu';
import { AppHeader } from '@/components/AppHeader';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const adminSections = [
    {
      id: 'users',
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları yönet, roller ata',
      icon: <Users size={24} color="#7C3AED" />,
    },
    {
      id: 'roles',
      title: 'Rol ve Yetki Yönetimi',
      description: 'Rolleri ve yetkileri düzenle',
      icon: <Shield size={24} color="#7C3AED" />,
    },
    {
      id: 'database',
      title: 'Veritabanı Yönetimi',
      description: 'Veritabanı işlemleri',
      icon: <Database size={24} color="#7C3AED" />,
    },
    {
      id: 'activity',
      title: 'Sistem Aktiviteleri',
      description: 'Sistem loglarını görüntüle',
      icon: <Activity size={24} color="#7C3AED" />,
    },
    {
      id: 'notifications',
      title: 'Bildirim Ayarları',
      description: 'Bildirim ayarlarını yönet',
      icon: <Bell size={24} color="#7C3AED" />,
    },
    {
      id: 'security',
      title: 'Güvenlik Ayarları',
      description: 'Güvenlik politikalarını düzenle',
      icon: <Lock size={24} color="#7C3AED" />,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        onMenuPress={() => setDrawerVisible(true)}
        onProfilePress={() => setProfileMenuVisible(true)}
        profilePhotoUrl={user?.profilePictureUrl}
      />

      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Settings size={32} color="#7C3AED" />
          <Text style={styles.welcomeTitle}>Admin Panel</Text>
          <Text style={styles.welcomeText}>
            Sistem yönetimi ve konfigürasyon işlemleri
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {adminSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              activeOpacity={0.7}
            >
              <View style={styles.sectionIcon}>{section.icon}</View>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      <ProfileMenu
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        name={user ? `${user.firstName} ${user.lastName}` : ''}
        email={user?.email || ''}
        profilePhoto={user?.profilePictureUrl}
        onLogout={async () => {
          await logout();
          router.replace('/(auth)/login');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  pageHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionsContainer: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
});
