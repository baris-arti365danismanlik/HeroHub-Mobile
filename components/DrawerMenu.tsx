import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  X,
  Home,
  User,
  Users,
  Settings,
  Plus,
  UserIcon,
  FileText,
  Briefcase,
  Shield,
  ShieldCheck,
  Building,
  Clock,
  Mail,
} from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  moduleName: string;
  label: string;
  icon: React.ComponentType<any>;
  route: string;
}

const MODULE_CONFIG: Record<string, Omit<MenuItem, 'moduleName'>> = {
  Home: {
    label: 'Anasayfa',
    icon: Home,
    route: '/(tabs)',
  },
  Profile: {
    label: 'Profilim',
    icon: User,
    route: '/(tabs)/profile',
  },
  Requests: {
    label: 'Talepler',
    icon: FileText,
    route: '/(tabs)/requests',
  },
  Employees: {
    label: 'Çalışanlar',
    icon: Users,
    route: '/(tabs)/employees',
  },
  Assets: {
    label: 'Zimmetler',
    icon: Briefcase,
    route: '/(tabs)/assets',
  },
  Leaves: {
    label: 'İzinler',
    icon: Clock,
    route: '/(tabs)/leaves',
  },
  Inbox: {
    label: 'Gelen Kutusu',
    icon: Mail,
    route: '/(tabs)/inbox',
  },
  Admin: {
    label: 'Admin',
    icon: Settings,
    route: '/(tabs)/admin',
  },
  SuperAdmin: {
    label: 'Süper Admin',
    icon: ShieldCheck,
    route: '/(tabs)/super-admin',
  },
  Roles: {
    label: 'Roller',
    icon: Shield,
    route: '/(tabs)/roles',
  },
  Organization: {
    label: 'Organizasyon',
    icon: Building,
    route: '/(tabs)/organization',
  },
};

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { permissions, isAuthenticated, user } = useAuth();

  const menuItems = useMemo(() => {
    if (!isAuthenticated) return [];

    const items: MenuItem[] = [];

    Object.entries(permissions).forEach(([moduleName, modulePermissions]) => {
      if (modulePermissions.can_read && MODULE_CONFIG[moduleName]) {
        items.push({
          moduleName,
          ...MODULE_CONFIG[moduleName],
        });
      }
    });

    return items;
  }, [permissions, isAuthenticated]);

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  if (!isAuthenticated) return null;

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

              <View style={styles.headerRight}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>

                {user?.profilePictureUrl ? (
                  <Image
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <UserIcon size={20} color="#7C3AED" />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.route;

                return (
                  <TouchableOpacity
                    key={item.moduleName}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>
                      <IconComponent size={20} color={isActive ? '#7C3AED' : '#666'} />
                    </View>
                    <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItemActive: {
    backgroundColor: '#F5F0FF',
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#7C3AED',
    fontWeight: '500',
  },
});
