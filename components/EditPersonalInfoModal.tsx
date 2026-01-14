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
import { X } from 'lucide-react-native';
import { DatePicker } from './DatePicker';

interface PersonalInfo {
  personnelNumber?: string;
  tckn?: string;
  birthdate?: string;
  birthPlace?: string;
  gender?: number;
  maritalStatus?: number;
}

interface EditPersonalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: PersonalInfo) => Promise<void>;
  initialData?: PersonalInfo;
}

export function EditPersonalInfoModal({
  visible,
  onClose,
  onSave,
  initialData,
}: EditPersonalInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>({
    personnelNumber: '',
    tckn: '',
    birthdate: '',
    birthPlace: '',
    gender: 0,
    maritalStatus: 0,
  });
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);

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

  const genderOptions = [
    { label: 'Erkek', value: 0 },
    { label: 'Kadın', value: 1 },
  ];

  const maritalStatusOptions = [
    { label: 'Bekar', value: 0 },
    { label: 'Evli', value: 1 },
    { label: 'Boşanmış', value: 2 },
    { label: 'Dul', value: 3 },
  ];

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
            <Text style={styles.modalTitle}>Kişisel Bilgileri Düzenle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Personel No</Text>
              <TextInput
                style={styles.input}
                value={formData.personnelNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, personnelNumber: text })
                }
                placeholder="Personel numarası giriniz"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>TCKN</Text>
              <TextInput
                style={styles.input}
                value={formData.tckn}
                onChangeText={(text) => setFormData({ ...formData, tckn: text })}
                placeholder="TC Kimlik No giriniz"
                keyboardType="numeric"
                maxLength={11}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Doğum Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowBirthdatePicker(true)}
              >
                <Text style={formData.birthdate ? styles.dateText : styles.placeholder}>
                  {formData.birthdate
                    ? new Date(formData.birthdate).toLocaleDateString('tr-TR')
                    : 'Tarih seçiniz'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Doğum Yeri</Text>
              <TextInput
                style={styles.input}
                value={formData.birthPlace}
                onChangeText={(text) =>
                  setFormData({ ...formData, birthPlace: text })
                }
                placeholder="Doğum yeri giriniz"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cinsiyet</Text>
              <View style={styles.radioGroup}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, gender: option.value })}
                  >
                    <View style={styles.radioCircle}>
                      {formData.gender === option.value && (
                        <View style={styles.radioCircleSelected} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Medeni Durum</Text>
              <View style={styles.radioGroup}>
                {maritalStatusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioButton}
                    onPress={() =>
                      setFormData({ ...formData, maritalStatus: option.value })
                    }
                  >
                    <View style={styles.radioCircle}>
                      {formData.maritalStatus === option.value && (
                        <View style={styles.radioCircleSelected} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

      <DatePicker
        visible={showBirthdatePicker}
        onClose={() => setShowBirthdatePicker(false)}
        onSelect={(date) => {
          setFormData({ ...formData, birthdate: date });
          setShowBirthdatePicker(false);
        }}
        selectedDate={formData.birthdate}
      />
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
  dateInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1a1a1a',
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
