import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, ChevronDown, Calendar } from 'lucide-react-native';
import { DatePicker } from './DatePicker';

interface AddDriverLicenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: DriverLicenseData) => Promise<void>;
}

export interface DriverLicenseData {
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
}

const LICENSE_TYPES = [
  { id: 'M', name: 'M Sınıfı' },
  { id: 'A1', name: 'A1 Sınıfı' },
  { id: 'A2', name: 'A2 Sınıfı' },
  { id: 'A', name: 'A Sınıfı' },
  { id: 'B1', name: 'B1 Sınıfı' },
  { id: 'B', name: 'B Sınıfı' },
  { id: 'BE', name: 'BE Sınıfı' },
  { id: 'C1', name: 'C1 Sınıfı' },
  { id: 'C1E', name: 'C1E Sınıfı' },
  { id: 'C', name: 'C Sınıfı' },
  { id: 'CE', name: 'CE Sınıfı' },
  { id: 'D1', name: 'D1 Sınıfı' },
  { id: 'D1E', name: 'D1E Sınıfı' },
  { id: 'D', name: 'D Sınıfı' },
  { id: 'DE', name: 'DE Sınıfı' },
  { id: 'F', name: 'F Sınıfı' },
  { id: 'G', name: 'G Sınıfı' },
];

export function AddDriverLicenseModal({ visible, onClose, onSubmit }: AddDriverLicenseModalProps) {
  const [selectedLicenseType, setSelectedLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showLicenseTypeDropdown, setShowLicenseTypeDropdown] = useState(false);
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!selectedLicenseType || !licenseNumber || !issueDate || !expiryDate) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    await onSubmit({
      licenseType: selectedLicenseType,
      licenseNumber,
      issueDate,
      expiryDate,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedLicenseType('');
    setLicenseNumber('');
    setIssueDate('');
    setExpiryDate('');
    setShowLicenseTypeDropdown(false);
    setShowIssueDatePicker(false);
    setShowExpiryDatePicker(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ehliyet Bilgisi Ekle</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.fieldContainer, showLicenseTypeDropdown && { zIndex: 1000 }]}>
              <Text style={styles.label}>Ehliyet Sınıfı *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowLicenseTypeDropdown(!showLicenseTypeDropdown);
                }}
              >
                <Text style={selectedLicenseType ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedLicenseType || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showLicenseTypeDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {LICENSE_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedLicenseType(type.name);
                          setShowLicenseTypeDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Ehliyet Numarası *</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: 12345678"
                placeholderTextColor="#999"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Veriliş Tarihi *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowIssueDatePicker(true)}
              >
                <Text style={issueDate ? styles.dateText : styles.datePlaceholder}>
                  {issueDate || 'DD / MM / YYYY'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showIssueDatePicker}
                onClose={() => setShowIssueDatePicker(false)}
                onSelectDate={(date) => {
                  setIssueDate(date);
                }}
                initialDate={issueDate}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Son Geçerlilik Tarihi *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowExpiryDatePicker(true)}
              >
                <Text style={expiryDate ? styles.dateText : styles.datePlaceholder}>
                  {expiryDate || 'DD / MM / YYYY'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showExpiryDatePicker}
                onClose={() => setShowExpiryDatePicker(false)}
                onSelectDate={(date) => {
                  setExpiryDate(date);
                }}
                initialDate={expiryDate}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Ekle</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  fieldContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#1a1a1a',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownList: {
    flex: 1,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    fontWeight: '400',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  datePlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
