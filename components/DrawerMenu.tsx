import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  X,
  Home,
  User,
  Users,
  Settings,
  Plus,
  Bell,
  Mail,
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
  const { user, userProfile } = useAuth();

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
      roles: ['Admin', 'Manager', 'Company Admin'],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'settings',
      route: '/(tabs)/admin',
      roles: ['Admin', 'Company Admin'],
    },
    {
      id: 'plus-admin',
      label: 'Artı Admin',
      icon: 'plus',
      route: '/(tabs)/plus-admin',
      roles: ['Admin'],
    },
  ];

  const hasAccess = (item: MenuItem): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userProfile?.role?.name) return false;
    return item.roles.includes(userProfile.role.name);
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

              <View style={styles.headerRight}>
                <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                  <X size={20} color="#666666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                  <Bell size={20} color="#666666" />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                  <Mail size={20} color="#666666" />
                  <View style={styles.mailBadge}>
                    <Text style={styles.badgeText}>12</Text>
                  </View>
                </TouchableOpacity>

                {user?.profilePictureUrl ? (
                  <Image
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatar}>
                    <User size={18} color="#7C3AED" />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item) => {
                if (!hasAccess(item)) return null;
                const active = isActive(item.route);

                if (item.id === 'home') {
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
                }

                if (item.id === 'profile') {
                  return (
                    <View key={item.id}>
                      <TouchableOpacity
                        style={[styles.menuItem, active && styles.menuItemActive]}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuItemIcon}>{getIcon(item.icon, active)}</View>
                        <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }

                const subIcon = (() => {
                  const color = '#666666';
                  const size = 18;
                  switch (item.icon) {
                    case 'users':
                      return <Users size={size} color={color} />;
                    case 'settings':
                      return <Settings size={size} color={color} />;
                    case 'plus':
                      return <Plus size={size} color={color} />;
                    default:
                      return null;
                  }
                })();

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.subMenuItem]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.subMenuItemIcon}>{subIcon}</View>
                    <Text style={styles.subMenuItemText}>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#fff',
  },
  mailBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#F3E8FF',
  },
  menuItemIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#7C3AED',
    fontWeight: '500',
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingLeft: 32,
    gap: 12,
  },
  subMenuItemIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subMenuItemText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
  },
});
