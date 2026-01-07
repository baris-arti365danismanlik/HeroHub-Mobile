import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Mail,
  FileText,
  Package,
  Settings,
  LogOut,
} from 'lucide-react-native';

interface EmployeeDropdownProps {
  visible: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
  position: { x: number; y: number };
}

export function EmployeeDropdown({
  visible,
  onClose,
  employeeId,
  employeeName,
  position,
}: EmployeeDropdownProps) {
  const router = useRouter();

  const handleSendWelcomePackage = () => {
    onClose();
    router.push(`/onboarding/${employeeId}` as any);
  };

  const menuItems = [
    {
      icon: Package,
      label: 'Hoşgeldin Paketi Gönder',
      onPress: handleSendWelcomePackage,
    },
    {
      icon: User,
      label: 'Profili Görüntüle',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: FileText,
      label: 'Dosyaları Görüntüle',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: Mail,
      label: 'E-posta Gönder',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: Settings,
      label: 'Ayarlar',
      onPress: () => {
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.dropdown,
            {
              top: position.y,
              right: 16,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>{employeeName}</Text>
          </View>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <item.icon size={20} color="#666" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
});
