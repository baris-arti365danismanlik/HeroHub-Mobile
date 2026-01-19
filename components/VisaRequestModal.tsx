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
  onSubmit: (data: VisaRequestData) => void;
}

export interface VisaRequestData {
  visaType: number;
  countryId: number;
  countryName: string;
  entryDate: string;
  exitDate: string;
  notes: string;
}

const VISA_TYPES = [
  { id: 1, name: 'Turist/Turizm Vizesi' },
  { id: 2, name: 'İş Vizesi' },
  { id: 3, name: 'Öğrenci Vizesi' },
  { id: 4, name: 'Transit Vize' },
  { id: 5, name: 'Çalışma Vizesi' },
];

export function VisaRequestModal({ visible, onClose, userId, onSubmit }: VisaRequestModalProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedVisaTypeId, setSelectedVisaTypeId] = useState<number | null>(null);
  const [selectedVisaTypeName, setSelectedVisaTypeName] = useState<string>('');
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>('');
  const [exitDate, setExitDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
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

  const handleSubmit = () => {
    if (!selectedVisaTypeId || !selectedCountryId || !entryDate || !exitDate) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    onSubmit({
      visaType: selectedVisaTypeId,
      countryId: selectedCountryId,
      countryName: selectedCountryName,
      entryDate,
      exitDate,
      notes,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedVisaTypeId(null);
    setSelectedVisaTypeName('');
    setSelectedCountryId(null);
    setSelectedCountryName('');
    setEntryDate('');
    setExitDate('');
    setNotes('');
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
            <Text style={styles.title}>Vize Bilgisi Ekle</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Vize Türü</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowVisaTypeDropdown(!showVisaTypeDropdown)}
              >
                <Text style={selectedVisaTypeName ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedVisaTypeName || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showVisaTypeDropdown && (
                <View style={styles.dropdownList}>
                  {VISA_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedVisaTypeId(type.id);
                        setSelectedVisaTypeName(type.name);
                        setShowVisaTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Geçerli Olduğu Ülke</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <Text style={selectedCountryName ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedCountryName || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showCountryDropdown && (
                <ScrollView style={[styles.dropdownList, { maxHeight: 200 }]} nestedScrollEnabled>
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
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Alındığı Tarih</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEntryDatePicker(true)}
              >
                <Text style={entryDate ? styles.dateText : styles.datePlaceholder}>
                  {entryDate || 'Tarih Seçin'}
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
              <Text style={styles.label}>Bittiği Tarih</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowExitDatePicker(true)}
              >
                <Text style={exitDate ? styles.dateText : styles.datePlaceholder}>
                  {exitDate || 'Tarih Seçin'}
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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Not</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Varsa iletmek istediği detayları çalışan bu alandan gönderebilir."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
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
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
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
