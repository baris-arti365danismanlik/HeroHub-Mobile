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
import { X, Calendar } from 'lucide-react-native';
import { DatePicker } from './DatePicker';

interface AddCertificateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateData) => Promise<void>;
}

export interface CertificateData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
}

export function AddCertificateModal({ visible, onClose, onSubmit }: AddCertificateModalProps) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!name || !issuer || !issueDate) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    await onSubmit({
      name,
      issuer,
      issueDate,
      expiryDate,
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setShowIssueDatePicker(false);
    setShowExpiryDatePicker(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Sertifika Ekle</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Sertifika Adı *</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: AWS Certified Solutions Architect"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Veren Kuruluş *</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Amazon Web Services"
                placeholderTextColor="#999"
                value={issuer}
                onChangeText={setIssuer}
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
              <Text style={styles.label}>Geçerlilik Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowExpiryDatePicker(true)}
              >
                <Text style={expiryDate ? styles.dateText : styles.datePlaceholder}>
                  {expiryDate || 'DD / MM / YYYY (Opsiyonel)'}
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
