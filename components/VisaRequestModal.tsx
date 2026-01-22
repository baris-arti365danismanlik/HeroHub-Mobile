import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { X, ChevronDown, Calendar } from 'lucide-react-native';
import { userService } from '@/services/user.service';
import { DatePicker } from './DatePicker';

interface VisaRequestModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
  onSubmit: (data: VisaRequestData) => Promise<void>;
}

export interface VisaRequestData {
  visaTypeId: number;
  visaType: string;
  countryId: number;
  countryName: string;
  entryDate: string;
  exitDate: string;
  cityId: number;
  cityName: string;
  notes: string;
}

const VISA_TYPES = [
  { id: 1, name: 'Turist Vizesi' },
  { id: 2, name: 'İş Vizesi' },
  { id: 3, name: 'Öğrenci Vizesi' },
  { id: 4, name: 'Transit Vize' },
  { id: 5, name: 'Çalışma Vizesi' },
  { id: 6, name: 'Aile Vizesi' },
  { id: 7, name: 'Geçici Vize' },
  { id: 8, name: 'Daimi Vize' },
  { id: 9, name: 'Ticari Vize' },
  { id: 10, name: 'Diplomatik Vize' },
  { id: 11, name: 'Sağlık Vizesi' },
  { id: 12, name: 'Kültürel Vize' },
  { id: 13, name: 'Gazeteci Vizesi' },
  { id: 14, name: 'Göçmen Vizesi' },
  { id: 15, name: 'Din Görevlisi Vizesi' },
];

export function VisaRequestModal({ visible, onClose, userId, onSubmit }: VisaRequestModalProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedVisaTypeId, setSelectedVisaTypeId] = useState<number | null>(null);
  const [selectedVisaType, setSelectedVisaType] = useState<string>('');
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>('');
  const [exitDate, setExitDate] = useState<string>('');
  const [showVisaTypeDropdown, setShowVisaTypeDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showEntryDatePicker, setShowEntryDatePicker] = useState(false);
  const [showExitDatePicker, setShowExitDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCountries();
    }
  }, [visible]);

  const loadCountries = async () => {
    try {
      const data = await userService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVisaTypeId || !selectedCountryId || !entryDate || !exitDate) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    await onSubmit({
      visaTypeId: selectedVisaTypeId,
      visaType: selectedVisaType,
      countryId: selectedCountryId,
      countryName: selectedCountryName,
      entryDate,
      exitDate,
      cityId: 0,
      cityName: '',
      notes: '',
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedVisaTypeId(null);
    setSelectedVisaType('');
    setSelectedCountryId(null);
    setSelectedCountryName('');
    setEntryDate('');
    setExitDate('');
    setShowVisaTypeDropdown(false);
    setShowCountryDropdown(false);
    setShowEntryDatePicker(false);
    setShowExitDatePicker(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Vize Başvuru Evrak Talebi</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.fieldContainer, showVisaTypeDropdown && { zIndex: 1000 }]}>
              <Text style={styles.label}>Vize Türü</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowVisaTypeDropdown(!showVisaTypeDropdown);
                  setShowCountryDropdown(false);
                }}
              >
                <Text style={selectedVisaType ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedVisaType || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showVisaTypeDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {VISA_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedVisaTypeId(type.id);
                          setSelectedVisaType(type.name);
                          setShowVisaTypeDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={[styles.fieldContainer, showCountryDropdown && { zIndex: 999 }]}>
              <Text style={styles.label}>Başvurulacak Ülke</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setShowVisaTypeDropdown(false);
                }}
              >
                <Text style={selectedCountryName ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedCountryName || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showCountryDropdown && (
                <View style={[styles.dropdownListContainer, { maxHeight: 200 }]}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {countries.map((country) => (
                      <TouchableOpacity
                        key={country.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedCountryId(country.id);
                          setSelectedCountryName(country.name);
                          setShowCountryDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{country.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Giriş Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEntryDatePicker(true)}
              >
                <Text style={entryDate ? styles.dateText : styles.datePlaceholder}>
                  {entryDate || 'DD / MM / YYYY'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showEntryDatePicker}
                onClose={() => setShowEntryDatePicker(false)}
                onSelectDate={(date) => {
                  setEntryDate(date);
                }}
                initialDate={entryDate}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Çıkış Tarihi</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowExitDatePicker(true)}
              >
                <Text style={exitDate ? styles.dateText : styles.datePlaceholder}>
                  {exitDate || 'DD / MM / YYYY'}
                </Text>
                <Calendar size={20} color="#7C3AED" />
              </TouchableOpacity>
              <DatePicker
                visible={showExitDatePicker}
                onClose={() => setShowExitDatePicker(false)}
                onSelectDate={(date) => {
                  setExitDate(date);
                }}
                initialDate={exitDate}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Devam Et</Text>
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
