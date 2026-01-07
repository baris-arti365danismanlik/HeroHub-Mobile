import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { X, ChevronDown, Calendar, User as UserIcon } from 'lucide-react-native';

interface LeaveRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestData, requestId?: string) => void;
  userName?: string;
  userRole?: string;
  userPhoto?: string;
  leaveBalance?: string;
  editMode?: boolean;
  requestId?: string;
  initialData?: LeaveRequestData;
}

export interface LeaveRequestData {
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  notes?: string;
}

const LEAVE_TYPES = [
  'Yıllık İzin',
  'Mazeret İzni',
  'Hastalık İzni',
  'Evlilik İzni',
  'Doğum İzni',
  'Ölüm İzni',
  'Ücretsiz İzin',
];

const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';

  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')} / ${month.padStart(2, '0')} / ${year}`;
    }
  }

  return dateStr;
};

const formatDateForDB = (dateStr: string): string => {
  if (!dateStr) return '';

  if (dateStr.includes('/')) {
    const parts = dateStr.split('/').map(p => p.trim());
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  if (dateStr.includes('-')) {
    return dateStr;
  }

  return dateStr;
};

export function LeaveRequestModal({
  visible,
  onClose,
  onSubmit,
  userName = 'Kullanıcı',
  userRole = 'Çalışan',
  userPhoto,
  leaveBalance = '125,5 Gün',
  editMode = false,
  requestId,
  initialData,
}: LeaveRequestModalProps) {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  React.useEffect(() => {
    if (visible) {
      if (initialData && editMode) {
        setLeaveType(initialData.leaveType);
        setStartDate(formatDateForDisplay(initialData.startDate));
        setEndDate(formatDateForDisplay(initialData.endDate));
        setDuration(initialData.duration.toString());
        setNotes(initialData.notes || '');
      } else {
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setDuration('');
        setNotes('');
      }
      setShowTypeDropdown(false);
    }
  }, [visible, initialData, editMode]);

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setDuration('');
    setNotes('');
    setShowTypeDropdown(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !duration) {
      console.log('Form validation failed:', { leaveType, startDate, endDate, duration });
      return;
    }

    console.log('Submitting leave request from modal');
    onSubmit({
      leaveType,
      startDate: formatDateForDB(startDate),
      endDate: formatDateForDB(endDate),
      duration: parseInt(duration),
      notes: notes || undefined,
    }, requestId);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editMode ? 'İzin Talebini Düzenle' : 'İzin Talebi Gir'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.userCard}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
              ) : (
                <View style={styles.userPhotoPlaceholder}>
                  <UserIcon size={24} color="#7C3AED" />
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userRole}>{userRole}</Text>
              </View>
              <View style={styles.balanceBox}>
                <Text style={styles.balanceLabel}>İZİN BAKİYESİ</Text>
                <Text style={styles.balanceValue}>{leaveBalance}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>İzin Türü</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text style={leaveType ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {leaveType || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showTypeDropdown && (
                <View style={styles.dropdownMenu}>
                  {LEAVE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setLeaveType(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Başlangıç Tarihi</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="12 / 23 / 2023"
                  placeholderTextColor="#999"
                />
                <Calendar size={20} color="#7C3AED" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bitiş Tarihi</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="12 / 23 / 2023"
                  placeholderTextColor="#999"
                />
                <Calendar size={20} color="#7C3AED" />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Süre</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowTypeDropdown(false)}
              >
                <TextInput
                  style={styles.durationInput}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="0.5 Gün"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Not</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Varsa iletmek istediği detayları çalışan bu alandan gönderebilir."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!leaveType || !startDate || !endDate || !duration) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!leaveType || !startDate || !endDate || !duration}
            >
              <Text style={styles.submitButtonText}>
                {editMode ? 'Güncelle' : 'Devam Et'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#666',
  },
  balanceBox: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  durationInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
