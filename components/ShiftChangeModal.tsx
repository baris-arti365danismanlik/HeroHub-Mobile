import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { DatePicker } from './DatePicker';

export interface ShiftChangeData {
  currentShiftType: string;
  requestedShiftType: string;
  reason?: string;
  effectiveDate: string;
}

interface ShiftChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ShiftChangeData) => Promise<void>;
  currentShiftType?: string;
}

const SHIFT_TYPES = [
  { label: 'Sabah Vardiyası', value: 'Sabah Vardiyası' },
  { label: 'Öğle Vardiyası', value: 'Öğle Vardiyası' },
  { label: 'Akşam Vardiyası', value: 'Akşam Vardiyası' },
  { label: 'Gece Vardiyası', value: 'Gece Vardiyası' },
  { label: 'Grup-1', value: 'Vardiya Grup-1' },
  { label: 'Grup-2', value: 'Vardiya Grup-2' },
];

export const ShiftChangeModal: React.FC<ShiftChangeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentShiftType,
}) => {
  const [requestedShiftType, setRequestedShiftType] = useState('');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setRequestedShiftType('');
    setReason('');
    setEffectiveDate('');
    setShowDatePicker(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!requestedShiftType) {
      Alert.alert('Hata', 'Lütfen talep edilen vardiya tipini seçin');
      return;
    }

    if (!effectiveDate) {
      Alert.alert('Hata', 'Lütfen geçerlilik tarihini seçin');
      return;
    }

    if (requestedShiftType === currentShiftType) {
      Alert.alert('Hata', 'Mevcut vardiya ile aynı vardiyayı seçemezsiniz');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        currentShiftType: currentShiftType || '',
        requestedShiftType,
        reason: reason.trim() || undefined,
        effectiveDate,
      });
      handleReset();
    } catch (error) {
      console.error('Error submitting shift change request:', error);
      Alert.alert('Hata', 'Vardiya değişikliği talebi gönderilemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vardiya Değiştir</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mevcut Vardiya</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledInputText}>
                    {currentShiftType || 'Belirlenmemiş'}
                  </Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Talep Edilen Vardiya <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.shiftTypeGrid}>
                  {SHIFT_TYPES.filter(type => type.value !== currentShiftType).map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.shiftTypeButton,
                        requestedShiftType === type.value && styles.shiftTypeButtonActive,
                      ]}
                      onPress={() => setRequestedShiftType(type.value)}
                    >
                      <Text
                        style={[
                          styles.shiftTypeButtonText,
                          requestedShiftType === type.value &&
                            styles.shiftTypeButtonTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Geçerlilik Tarihi <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={effectiveDate ? styles.dateText : styles.datePlaceholder}>
                    {effectiveDate || 'Tarih seçin'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Sebep</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Vardiya değişikliği sebebini yazın (opsiyonel)"
                  placeholderTextColor="#9CA3AF"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Talep Gönder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={(date) => {
          setEffectiveDate(date);
          setShowDatePicker(false);
        }}
        selectedDate={effectiveDate}
        minDate={new Date().toISOString().split('T')[0]}
      />
    </>
  );
};

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
    maxWidth: 500,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledInputText: {
    fontSize: 14,
    color: '#6B7280',
  },
  shiftTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shiftTypeButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  shiftTypeButtonActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  shiftTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  shiftTypeButtonTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1a1a1a',
    minHeight: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
