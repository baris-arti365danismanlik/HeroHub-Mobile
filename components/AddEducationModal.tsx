import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, ChevronDown, Calendar } from 'lucide-react-native';
import { DatePicker } from './DatePicker';

interface AddEducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: EducationFormData) => void;
}

export interface EducationFormData {
  schoolType: string;
  schoolName: string;
  department: string;
  grade: string;
  gradeSystem: string;
  language: string;
  startDate: string;
  endDate: string;
}

const SCHOOL_TYPES = [
  { id: 1, name: 'İlkokul' },
  { id: 2, name: 'Ortaokul' },
  { id: 3, name: 'Lise' },
  { id: 4, name: 'Ön Lisans' },
  { id: 5, name: 'Lisans' },
  { id: 6, name: 'Yüksek Lisans' },
  { id: 7, name: 'Doktora' },
];

const GRADE_SYSTEMS = [
  { id: 1, name: '4.00' },
  { id: 2, name: '5.00' },
  { id: 3, name: '10.00' },
  { id: 4, name: '100.00' },
];

const LANGUAGES = [
  { id: 1, name: 'Türkçe' },
  { id: 2, name: 'İngilizce' },
  { id: 3, name: 'Almanca' },
  { id: 4, name: 'Fransızca' },
  { id: 5, name: 'İspanyolca' },
  { id: 6, name: 'İtalyanca' },
  { id: 7, name: 'Rusça' },
  { id: 8, name: 'Çince' },
  { id: 9, name: 'Japonca' },
  { id: 10, name: 'Arapça' },
];

export function AddEducationModal({ visible, onClose, onSubmit }: AddEducationModalProps) {
  const [schoolType, setSchoolType] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeSystem, setGradeSystem] = useState('');
  const [language, setLanguage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showSchoolTypeDropdown, setShowSchoolTypeDropdown] = useState(false);
  const [showGradeSystemDropdown, setShowGradeSystemDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleClose = () => {
    setSchoolType('');
    setSchoolName('');
    setDepartment('');
    setGrade('');
    setGradeSystem('');
    setLanguage('');
    setStartDate('');
    setEndDate('');
    setShowSchoolTypeDropdown(false);
    setShowGradeSystemDropdown(false);
    setShowLanguageDropdown(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!schoolType || !schoolName || !startDate) {
      alert('Lütfen zorunlu alanları doldurunuz');
      return;
    }

    onSubmit({
      schoolType,
      schoolName,
      department,
      grade,
      gradeSystem,
      language,
      startDate,
      endDate,
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
            <View style={[styles.fieldContainer, showSchoolTypeDropdown && { zIndex: 1000 }]}>
              <Text style={styles.label}>Okul Türü</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowSchoolTypeDropdown(!showSchoolTypeDropdown);
                  setShowGradeSystemDropdown(false);
                  setShowLanguageDropdown(false);
                }}
              >
                <Text style={schoolType ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {schoolType || 'İlkokul'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showSchoolTypeDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {SCHOOL_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSchoolType(type.name);
                          setShowSchoolTypeDropdown(false);
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
              <Text style={styles.label}>Okul Adı</Text>
              <TextInput
                style={styles.textInput}
                value={schoolName}
                onChangeText={setSchoolName}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bölüm</Text>
              <TextInput
                style={styles.textInput}
                value={department}
                onChangeText={setDepartment}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Not</Text>
              <TextInput
                style={styles.textInput}
                value={grade}
                onChangeText={setGrade}
                placeholder=""
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.fieldContainer, showGradeSystemDropdown && { zIndex: 999 }]}>
              <Text style={styles.label}>Not Sistemi</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowGradeSystemDropdown(!showGradeSystemDropdown);
                  setShowSchoolTypeDropdown(false);
                  setShowLanguageDropdown(false);
                }}
              >
                <Text style={gradeSystem ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {gradeSystem || '4.00'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showGradeSystemDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {GRADE_SYSTEMS.map((system) => (
                      <TouchableOpacity
                        key={system.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setGradeSystem(system.name);
                          setShowGradeSystemDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{system.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={[styles.fieldContainer, showLanguageDropdown && { zIndex: 998 }]}>
              <Text style={styles.label}>Eğitim Dili</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowSchoolTypeDropdown(false);
                  setShowGradeSystemDropdown(false);
                }}
              >
                <Text style={language ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {language || 'Türkçe'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showLanguageDropdown && (
                <View style={[styles.dropdownListContainer, { maxHeight: 200 }]}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {LANGUAGES.map((lang) => (
                      <TouchableOpacity
                        key={lang.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setLanguage(lang.name);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{lang.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Başlangıç Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={startDate ? styles.dateText : styles.datePlaceholder}>
                  {startDate || 'Başlangıç Tarihi Seçin'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showStartDatePicker}
                onClose={() => setShowStartDatePicker(false)}
                onSelectDate={(date) => {
                  setStartDate(date);
                  setShowStartDatePicker(false);
                }}
                initialDate={startDate}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bitiş Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={endDate ? styles.dateText : styles.datePlaceholder}>
                  {endDate || 'Bitiş Tarihi Seçin'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showEndDatePicker}
                onClose={() => setShowEndDatePicker(false)}
                onSelectDate={(date) => {
                  setEndDate(date);
                  setShowEndDatePicker(false);
                }}
                initialDate={endDate}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Kaydet</Text>
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
