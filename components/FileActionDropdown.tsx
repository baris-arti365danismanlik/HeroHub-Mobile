import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {
  Pencil,
  Copy,
  Download,
  Trash2,
} from 'lucide-react-native';

interface FileActionDropdownProps {
  visible: boolean;
  onClose: () => void;
  fileName: string;
  fileType: 'folder' | 'file';
  position: { x: number; y: number };
  onRename: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function FileActionDropdown({
  visible,
  onClose,
  fileName,
  fileType,
  position,
  onRename,
  onCopy,
  onDownload,
  onDelete,
}: FileActionDropdownProps) {
  const menuItems = [
    {
      icon: Pencil,
      label: 'Yeniden Adlandır',
      onPress: () => {
        onClose();
        onRename();
      },
    },
    {
      icon: Copy,
      label: 'Kopyasını Oluştur',
      onPress: () => {
        onClose();
        onCopy();
      },
    },
    ...(fileType === 'file'
      ? [
          {
            icon: Download,
            label: 'İndir',
            onPress: () => {
              onClose();
              onDownload();
            },
          },
        ]
      : []),
    {
      icon: Trash2,
      label: 'Sil',
      onPress: () => {
        onClose();
        onDelete();
      },
      danger: true,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.dropdown,
            {
              top: Math.min(position.y, 500),
              left: 16,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <item.icon size={20} color={item.danger ? '#DC2626' : '#666'} />
              <Text style={[styles.menuText, item.danger && styles.menuTextDanger]}>
                {item.label}
              </Text>
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
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  menuTextDanger: {
    color: '#DC2626',
  },
});
