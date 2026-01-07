import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  X,
  Home,
  User,
  Users,
  Settings,
  Plus,
  UserIcon,
  FileText
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  roles?: string[];
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { user } = useAuth();
  const translateX = useSharedValue(-280);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 300,
      });
    } else {
      translateX.value = withTiming(-280, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 250,
      });
    }
  }, [visible]);

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Anasayfa',
      icon: <Home size={20} color="#7C3AED" />,
      route: '/(tabs)',
    },
    {
      id: 'profile',
      label: 'Profilim',
      icon: <User size={20} color="#7C3AED" />,
      route: '/(tabs)/profile',
    },
    {
      id: 'requests',
      label: 'Talepler',
      icon: <FileText size={20} color="#7C3AED" />,
      route: '/(tabs)/requests',
    },
    {
      id: 'employees',
      label: 'Çalışanlar',
      icon: <Users size={20} color="#7C3AED" />,
      route: '/(tabs)/employees',
      roles: ['Admin', 'Manager', 'HR'],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <Settings size={20} color="#7C3AED" />,
      route: '/(tabs)/admin',
      roles: ['Admin'],
    },
    {
      id: 'plus-admin',
      label: 'Artı Admin',
      icon: <Plus size={20} color="#7C3AED" />,
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
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View style={[styles.drawerContainer, drawerAnimatedStyle]}>
          <SafeAreaView style={styles.drawer}>
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
                if (!hasAccess(item)) return null;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>{item.icon}</View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
  },
  drawer: {
    flex: 1,
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
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
