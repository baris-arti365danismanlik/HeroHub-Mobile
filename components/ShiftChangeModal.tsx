import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import { shiftService, ShiftPlan } from '@/services/shift.service';

export interface ShiftChangeData {
  shiftPlanId: number;
}

interface ShiftChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ShiftChangeData) => Promise<void>;
  currentShiftPlanId?: number;
}

export const ShiftChangeModal: React.FC<ShiftChangeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentShiftPlanId,
}) => {
  const [shiftPlans, setShiftPlans] = useState<ShiftPlan[]>([]);
  const [selectedShiftPlanId, setSelectedShiftPlanId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadShiftPlans();
    }
  }, [visible]);

  const loadShiftPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await shiftService.getShiftPlans();
      setShiftPlans(plans.filter(plan => plan.id !== currentShiftPlanId && plan.isActive));
    } catch (error) {
      console.error('Error loading shift plans:', error);
      Alert.alert('Hata', 'Vardiya planları yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedShiftPlanId(null);
    setShowDropdown(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedShiftPlanId) {
      Alert.alert('Hata', 'Lütfen bir vardiya planı seçin');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        shiftPlanId: selectedShiftPlanId,
      });
      handleReset();
    } catch (error) {
      console.error('Error submitting shift change request:', error);
      Alert.alert('Hata', 'Vardiya değişikliği talebi gönderilemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlan = shiftPlans.find(plan => plan.id === selectedShiftPlanId);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vardiya Değiştir</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={styles.loadingText}>Vardiya planları yükleniyor...</Text>
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Vardiya Planı <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text style={selectedPlan ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {selectedPlan ? `${selectedPlan.name} (${selectedPlan.startTime} - ${selectedPlan.endTime})` : 'Vardiya planı seçin'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {shiftPlans.length === 0 ? (
                        <View style={styles.emptyDropdown}>
                          <Text style={styles.emptyDropdownText}>Uygun vardiya planı bulunamadı</Text>
                        </View>
                      ) : (
                        shiftPlans.map((plan) => (
                          <TouchableOpacity
                            key={plan.id}
                            style={[
                              styles.dropdownItem,
                              selectedShiftPlanId === plan.id && styles.dropdownItemActive,
                            ]}
                            onPress={() => {
                              setSelectedShiftPlanId(plan.id);
                              setShowDropdown(false);
                            }}
                          >
                            <View>
                              <Text style={styles.dropdownItemTitle}>{plan.name}</Text>
                              <Text style={styles.dropdownItemSubtitle}>
                                {plan.startTime} - {plan.endTime}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, (isSubmitting || isLoading) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || isLoading}
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
    minHeight: 150,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
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
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#F5F3FF',
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dropdownItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  emptyDropdown: {
    padding: 20,
    alignItems: 'center',
  },
  emptyDropdownText: {
    fontSize: 14,
    color: '#9CA3AF',
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
