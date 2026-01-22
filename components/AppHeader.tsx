import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Menu, User as UserIcon, Mail } from 'lucide-react-native';

interface AppHeaderProps {
  onMenuPress: () => void;
  onProfilePress: () => void;
  profilePhotoUrl?: string;
  showInboxIcon?: boolean;
  inboxCount?: number;
  onInboxPress?: () => void;
}

export function AppHeader({
  onMenuPress,
  onProfilePress,
  profilePhotoUrl,
  showInboxIcon = false,
  inboxCount = 0,
  onInboxPress,
}: AppHeaderProps) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <Menu size={24} color="#1a1a1a" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/hero-primary-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightActions}>
        {showInboxIcon && onInboxPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onInboxPress}
          >
            <Mail size={20} color="#1a1a1a" />
            {inboxCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{inboxCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          {profilePhotoUrl ? (
            <Image
              source={{ uri: profilePhotoUrl }}
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
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  logoImage: {
    width: 90,
    height: 30,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  profileButton: {
    padding: 4,
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
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
