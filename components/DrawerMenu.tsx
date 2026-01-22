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
  UserIcon,
} from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: (color: string) => React.ReactNode;
  route: string;
  roles?: string[];
}

export function DrawerMenu({ visible, onClose, onNavigate }: DrawerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
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
      icon: (color: string) => <Home size={18} color={color} />,
      route: '/(tabs)',
    },
    {
      id: 'profile',
      label: 'Profilim',
      icon: (color: string) => <UserIcon size={18} color={color} />,
      route: '/(tabs)/profile',
    },
    {
      id: 'employees',
      label: 'Çalışanlar',
      icon: (color: string) => <Users size={18} color={color} />,
      route: '/(tabs)/employees',
    },
  ];

  const hasAccess = (item: MenuItem): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  };

  const isActive = (route: string): boolean => {
    const routePath = route.replace('/(tabs)', '');
    const normalizedPathname = pathname.replace('/(tabs)', '');

    if (routePath === '' || routePath === '/') {
      return normalizedPathname === '' || normalizedPathname === '/';
    }

    return normalizedPathname === routePath || normalizedPathname.startsWith(routePath + '/');
  };

  const handleNavigation = (route: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
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
                const active = isActive(item.route);
                const iconColor = active ? '#7C3AED' : '#333';
                const textColor = active ? '#7C3AED' : '#333';

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      active && styles.menuItemActive
                    ]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>{item.icon(iconColor)}</View>
                    <Text style={[
                      styles.menuItemText,
                      active && styles.menuItemTextActive
                    ]}>
                      {item.label}
                    </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 0,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoPlusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  menuItemActive: {
    backgroundColor: '#F3E8FF',
  },
  menuItemIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});
