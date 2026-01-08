import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
  Users,
  Settings,
  Plus,
  UserIcon,
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
      label: 'Ana Sayfa',
      icon: <Home size={24} color="#4A4A4A" />,
      route: '/(tabs)',
    },
    {
      id: 'profile',
      label: 'Profilim',
      icon: <UserIcon size={24} color="#4A4A4A" />,
      route: '/(tabs)/profile',
    },
    {
      id: 'employees',
      label: 'Çalışanlar',
      icon: <Users size={24} color="#4A4A4A" />,
      route: '/(tabs)/employees',
      roles: ['Admin', 'Manager', 'HR', '365 Admin'],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <Settings size={24} color="#4A4A4A" />,
      route: '/(tabs)/admin',
      roles: ['Admin', '365 Admin'],
    },
    {
      id: 'plus-admin',
      label: 'Artı Admin',
      icon: <Plus size={24} color="#4A4A4A" />,
      route: '/(tabs)/plus-admin',
      roles: ['SuperAdmin', '365 Admin'],
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
              <Text style={styles.logoText}>
                hero<Text style={styles.logoPlusText}>+</Text>
              </Text>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 0,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoPlusText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: 'transparent',
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 17,
    color: '#333333',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
