import React from 'react';
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
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (route: string) => {
    if (route === '/(tabs)' && pathname === '/') return true;
    if (route === '/(tabs)/profile' && pathname === '/profile') return true;
    if (route === '/(tabs)/employees' && pathname === '/employees') return true;
    if (route === '/(tabs)/admin' && pathname === '/admin') return true;
    if (route === '/(tabs)/plus-admin' && pathname === '/plus-admin') return true;
    return pathname === route;
  };

  const getIcon = (iconName: string, isActive: boolean) => {
    const color = isActive ? '#7C3AED' : '#1a1a1a';
    const size = 20;

    switch (iconName) {
      case 'home':
        return <Home size={size} color={color} />;
      case 'user':
        return <User size={size} color={color} />;
      case 'users':
        return <Users size={size} color={color} />;
      case 'settings':
        return <Settings size={size} color={color} />;
      case 'plus':
        return <Plus size={size} color={color} />;
      default:
        return null;
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Anasayfa',
      icon: 'home',
      route: '/(tabs)',
    },
    {
      id: 'profile',
      label: 'Profilim',
      icon: 'user',
      route: '/(tabs)/profile',
    },
    {
      id: 'employees',
      label: 'Çalışanlar',
      icon: 'users',
      route: '/(tabs)/employees',
      roles: ['Admin', 'Manager', 'HR'],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'settings',
      route: '/(tabs)/admin',
      roles: ['Admin'],
    },
    {
      id: 'plus-admin',
      label: 'Artı Admin',
      icon: 'plus',
      route: '/(tabs)/plus-admin',
      roles: ['SuperAdmin'],
    },
  ];

  const hasAccess = (item: MenuItem): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  };

  const handleNavigation = (route: string) => {
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
              {menuItems.map((item) => {
                if (!hasAccess(item)) return null;
                const active = isActive(item.route);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, active && styles.menuItemActive]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>{getIcon(item.icon, active)}</View>
                    <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>
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
    width: 280,
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
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
});
