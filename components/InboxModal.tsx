import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Mail } from 'lucide-react-native';
import { inboxService } from '@/services/inbox.service';
import { InboxMessage } from '@/types/backend';

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onUnreadCountChange?: (count: number) => void;
}

export function InboxModal({ visible, onClose, userId, onUnreadCountChange }: InboxModalProps) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      loadMessages();
    }
  }, [visible, userId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await inboxService.getUserMessages(userId);
      setMessages(data);

      const unreadCount = data.filter(m => !m.is_read).length;
      onUnreadCountChange?.(unreadCount);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessagePress = async (message: InboxMessage) => {
    if (!message.is_read) {
      try {
        await inboxService.markAsRead(message.id);
        await loadMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Bugün, ${hours}:${minutes}`;
    }

    const day = date.getDate();
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Mail size={20} color="#1a1a1a" />
              <Text style={styles.modalTitle}>GELEN KUTUSU</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          ) : (
            <ScrollView style={styles.messageList}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <TouchableOpacity
                    key={message.id}
                    style={[
                      styles.messageItem,
                      !message.is_read && styles.unreadMessage,
                    ]}
                    onPress={() => handleMessagePress(message)}
                  >
                    <View style={styles.messageContent}>
                      <View style={styles.messageHeader}>
                        <Text style={styles.senderName}>{message.sender_name}</Text>
                        <Text style={styles.messageDate}>{formatDate(message.created_at)}</Text>
                      </View>
                      <Text
                        style={[
                          styles.messageSubject,
                          !message.is_read && styles.unreadSubject,
                        ]}
                      >
                        {message.subject}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Mail size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>Hiç mesajınız yok</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadMessage: {
    backgroundColor: '#F3E8FF',
  },
  messageContent: {
    gap: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  messageDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageSubject: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  unreadSubject: {
    fontWeight: '600',
  },
  emptyState: {
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
