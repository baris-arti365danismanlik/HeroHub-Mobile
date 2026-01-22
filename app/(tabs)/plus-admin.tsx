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
  Crown,
  Server,
  Code,
  Terminal,
  FileCode,
  Cpu,
  HardDrive,
  Network,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DrawerMenu } from '@/components/DrawerMenu';
import { AppHeader } from '@/components/AppHeader';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function PlusAdminScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const superAdminSections = [
    {
      id: 'server',
      title: 'Sunucu Yönetimi',
      description: 'Sunucu ayarları ve konfigürasyon',
      icon: <Server size={24} color="#7C3AED" />,
    },
    {
      id: 'api',
      title: 'API Yönetimi',
      description: 'API endpoint ve servisler',
      icon: <Code size={24} color="#7C3AED" />,
    },
    {
      id: 'console',
      title: 'Sistem Konsolu',
      description: 'Terminal ve komut satırı',
      icon: <Terminal size={24} color="#7C3AED" />,
    },
    {
      id: 'migrations',
      title: 'Veritabanı Migration',
      description: 'Schema ve migration yönetimi',
      icon: <FileCode size={24} color="#7C3AED" />,
    },
    {
      id: 'performance',
      title: 'Performans İzleme',
      description: 'Sistem performansı ve metrikler',
      icon: <Cpu size={24} color="#7C3AED" />,
    },
    {
      id: 'storage',
      title: 'Depolama Yönetimi',
      description: 'Dosya ve medya yönetimi',
      icon: <HardDrive size={24} color="#7C3AED" />,
    },
    {
      id: 'network',
      title: 'Ağ Yapılandırması',
      description: 'Ağ ayarları ve güvenlik',
      icon: <Network size={24} color="#7C3AED" />,
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
        <Text style={styles.headerTitle}>Artı Admin</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Crown size={32} color="#7C3AED" />
          <Text style={styles.welcomeTitle}>Süper Admin Panel</Text>
          <Text style={styles.welcomeText}>
            Sistem seviyesi yönetim ve gelişmiş konfigürasyon
          </Text>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ Bu bölümdeki işlemler sistem genelini etkiler. Dikkatli olun.
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {superAdminSections.map((section) => (
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
    marginBottom: 16,
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
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
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
