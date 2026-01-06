import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  X,
  Home,
  User,
  Users,
  Settings,
  Plus,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [activeRoute, setActiveRoute] = useState('/(tabs)/profile');

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <SafeAreaView style={styles.drawerContainer}>
          <View style={styles.drawer}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>hero</Text>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoBadgeText}>+</Text>
                </View>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              {[
                { id: 'home', label: 'Anasayfa', icon: Home, route: '/(tabs)' },
                { id: 'profile', label: 'Profilim', icon: User, route: '/(tabs)/profile' },
                { id: 'employees', label: 'Çalışanlar', icon: Users, route: '/(tabs)/employees', roles: ['Admin', 'Manager', 'HR'] },
                { id: 'admin', label: 'Admin', icon: Settings, route: '/(tabs)/admin', roles: ['Admin'] },
                { id: 'plus-admin', label: 'Artı Admin', icon: Plus, route: '/(tabs)/plus-admin', roles: ['SuperAdmin'] },
              ].map((item) => {
                if (item.roles && (!user?.role || !item.roles.includes(user.role))) return null;
                const isActive = activeRoute === item.route;
                const IconComponent = item.icon;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>
                      <IconComponent size={20} color={isActive ? '#7C3AED' : '#666'} />
                    </View>
                    <Text
                      style={[
                        styles.menuItemText,
                        isActive && styles.menuItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: '60%',
    maxWidth: 280,
    backgroundColor: '#fff',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#E9D5FF',
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});
