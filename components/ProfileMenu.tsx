import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { LogOut } from 'lucide-react-native';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
  profilePhoto?: string;
  email: string;
  name?: string;
  onLogout: () => void;
}

export function ProfileMenu({
  visible,
  onClose,
  profilePhoto,
  email,
  name,
  onLogout,
}: ProfileMenuProps) {
  const getInitials = () => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'AR';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.profileSection}>
            {profilePhoto ? (
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profileImage}
                />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>365</Text>
                </View>
              </View>
            ) : (
              <View style={styles.avatarContainer}>
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.initialsText}>{getInitials()}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>365</Text>
                </View>
              </View>
            )}
            <Text style={styles.emailText}>{email || 'E-posta bilgisi yok'}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
});
