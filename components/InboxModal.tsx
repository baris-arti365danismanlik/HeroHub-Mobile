import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { X, Mail, ChevronLeft, Download, Send } from 'lucide-react-native';
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
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyText, setReplyText] = useState('');

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
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await inboxService.markAsRead(message.id);
        await loadMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleBack = () => {
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleSendReply = () => {
    console.log('Reply sent:', replyText);
    setReplyText('');
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

  const renderMessageList = () => (
    <>
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
    </>
  );

  const renderMessageDetail = () => {
    if (!selectedMessage) return null;

    return (
      <>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Vize Evrak Talebi</Text>
        </View>

        <ScrollView style={styles.detailContent}>
          <View style={styles.senderInfo}>
            {selectedMessage.sender_photo ? (
              <Image
                source={{ uri: selectedMessage.sender_photo }}
                style={styles.senderPhoto}
              />
            ) : (
              <View style={styles.senderPhotoPlaceholder}>
                <Text style={styles.senderInitial}>
                  {selectedMessage.sender_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.senderDetails}>
              <Text style={styles.senderNameDetail}>{selectedMessage.sender_name}</Text>
              <Text style={styles.messageDateTime}>{formatDate(selectedMessage.created_at)}</Text>
            </View>
          </View>

          {selectedMessage.title && (
            <View style={styles.documentInfo}>
              <View style={styles.documentHeader}>
                <Text style={styles.documentTitle}>{selectedMessage.title}</Text>
                {selectedMessage.document_date && (
                  <Text style={styles.documentDate}>{selectedMessage.document_date}</Text>
                )}
              </View>
              {selectedMessage.location && (
                <Text style={styles.documentLocation}>{selectedMessage.location}</Text>
              )}
            </View>
          )}

          {selectedMessage.subject && (
            <View style={styles.subjectSection}>
              <Text style={styles.subjectLabel}>Konu: <Text style={styles.subjectText}>{selectedMessage.subject}</Text></Text>
            </View>
          )}

          {selectedMessage.message && (
            <View style={styles.messageBody}>
              <Text style={styles.messageText}>{selectedMessage.message}</Text>
            </View>
          )}

          {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.attachmentsLabel}>Ekler:</Text>
              {selectedMessage.attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  <Text style={styles.attachmentName}>{attachment.name}</Text>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={18} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.replySection}>
            <Text style={styles.replyLabel}>Hızlı Yanıt</Text>
            <TextInput
              style={styles.replyInput}
              placeholder="Hızlı yanıt gönderilebilirsin."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={replyText}
              onChangeText={setReplyText}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.sendButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
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
          {selectedMessage ? renderMessageDetail() : renderMessageList()}
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
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  detailContent: {
    flex: 1,
  },
  senderInfo: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  senderPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  senderPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0D4F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },
  senderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  senderNameDetail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7C3AED',
    marginBottom: 4,
  },
  messageDateTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  documentInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  documentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  documentLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  subjectSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subjectLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  subjectText: {
    fontWeight: '400',
  },
  messageBody: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  messageText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  attachmentsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attachmentsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: '#7C3AED',
    flex: 1,
  },
  downloadButton: {
    padding: 4,
  },
  replySection: {
    padding: 16,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  replyInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    minHeight: 100,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
