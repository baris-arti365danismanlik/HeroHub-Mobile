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

interface MilitaryInfo {
  militaryStatus?: number;
  militaryNote?: string;
}

interface EditMilitaryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: MilitaryInfo) => Promise<void>;
  initialData?: MilitaryInfo;
}

export function EditMilitaryModal({
  visible,
  onClose,
  onSave,
  initialData,
}: EditMilitaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MilitaryInfo>({
    militaryStatus: 0,
    militaryNote: '',
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const militaryStatuses = [
    { label: 'Tamamlandı', value: 0 },
    { label: 'Ertelendi', value: 1 },
    { label: 'Muaf', value: 2 },
    { label: 'Yok', value: 3 },
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

  const getStatusLabel = (value: number) => {
    return militaryStatuses.find((s) => s.value === value)?.label || 'Seçiniz';
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
            <Text style={styles.modalTitle}>Askerlik Bilgilerini Düzenle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Askerlik Durumu *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {getStatusLabel(formData.militaryStatus || 0)}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  {militaryStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, militaryStatus: status.value });
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.militaryStatus === status.value &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Not</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.militaryNote}
                onChangeText={(text) =>
                  setFormData({ ...formData, militaryNote: text })
                }
                placeholder="Askerlik ile ilgili ek bilgiler (opsiyonel)"
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
