import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

interface AddEducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: EducationFormData) => void;
}

export interface EducationFormData {
  level: number;
  schoolName: string;
  department: string;
  gpa: number;
  gpaSystem: number;
  language: number;
  startDate: string;
  endDate: string;
}

export function AddEducationModal({ visible, onClose, onSubmit }: AddEducationModalProps) {
  const [schoolName, setSchoolName] = useState('');
  const [department, setDepartment] = useState('');

  const handleClose = () => {
    setSchoolName('');
    setDepartment('');
    onClose();
  };

  const handleSubmit = () => {
    if (!schoolName) {
      alert('Lütfen okul adını giriniz');
      return;
    }

    const currentDate = new Date().toISOString();

    onSubmit({
      level: 5,
      schoolName,
      department: department || '',
      gpa: 0,
      gpaSystem: 1,
      language: 1,
      startDate: currentDate,
      endDate: currentDate,
    });

    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Eğitim Bilgisi Ekle</Text>
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
              <Text style={styles.label}>Okul Adı *</Text>
              <TextInput
                style={styles.textInput}
                value={schoolName}
                onChangeText={setSchoolName}
                placeholder="Örn: İstanbul Üniversitesi"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bölüm</Text>
              <TextInput
                style={styles.textInput}
                value={department}
                onChangeText={setDepartment}
                placeholder="Örn: Bilgisayar Mühendisliği"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
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
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#1a1a1a',
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
