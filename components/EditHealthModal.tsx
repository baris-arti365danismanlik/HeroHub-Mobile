import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';

interface HealthInfo {
  bloodType?: number;
  height?: number;
  weight?: number;
  allergies?: string;
}

interface EditHealthModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: HealthInfo) => Promise<void>;
  initialData?: HealthInfo;
}

export function EditHealthModal({
  visible,
  onClose,
  onSave,
  initialData,
}: EditHealthModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HealthInfo>({
    bloodType: 0,
    height: 0,
    weight: 0,
    allergies: '',
  });
  const [showBloodTypeDropdown, setShowBloodTypeDropdown] = useState(false);

  const bloodTypes = [
    { label: 'A+', value: 0 },
    { label: 'A-', value: 1 },
    { label: 'B+', value: 2 },
    { label: 'B-', value: 3 },
    { label: 'AB+', value: 4 },
    { label: 'AB-', value: 5 },
    { label: '0+', value: 6 },
    { label: '0-', value: 7 },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBloodTypeLabel = (value: number) => {
    return bloodTypes.find((bt) => bt.value === value)?.label || 'Seçiniz';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sağlık Bilgilerini Düzenle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Kan Grubu *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowBloodTypeDropdown(!showBloodTypeDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {getBloodTypeLabel(formData.bloodType || 0)}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {showBloodTypeDropdown && (
                <View style={styles.dropdownList}>
                  {bloodTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, bloodType: type.value });
                        setShowBloodTypeDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.bloodType === type.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Boy (cm) *</Text>
              <TextInput
                style={styles.input}
                value={formData.height?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({ ...formData, height: parseInt(text) || 0 })
                }
                placeholder="Örn: 175"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kilo (kg) *</Text>
              <TextInput
                style={styles.input}
                value={formData.weight?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({ ...formData, weight: parseInt(text) || 0 })
                }
                placeholder="Örn: 70"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alerjiler</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.allergies}
                onChangeText={(text) =>
                  setFormData({ ...formData, allergies: text })
                }
                placeholder="Alerjileriniz varsa belirtiniz"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 100,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownItemTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
