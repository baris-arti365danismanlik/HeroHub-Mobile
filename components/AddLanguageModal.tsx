import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';

interface AddLanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: LanguageData) => Promise<void>;
}

export interface LanguageData {
  languageId: number;
  languageName: string;
  languageLevel: number;
  languageLevelName: string;
}

const LANGUAGES = [
  { id: 1, name: 'İngilizce' },
  { id: 2, name: 'Almanca' },
  { id: 3, name: 'Fransızca' },
  { id: 4, name: 'İspanyolca' },
  { id: 5, name: 'İtalyanca' },
  { id: 6, name: 'Rusça' },
  { id: 7, name: 'Çince' },
  { id: 8, name: 'Japonca' },
  { id: 9, name: 'Arapça' },
  { id: 10, name: 'Portekizce' },
];

const LANGUAGE_LEVELS = [
  { id: 0, name: 'Başlangıç' },
  { id: 1, name: 'Orta' },
  { id: 2, name: 'İleri' },
  { id: 3, name: 'Anadil' },
];

export function AddLanguageModal({ visible, onClose, onSubmit }: AddLanguageModalProps) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedLevelName, setSelectedLevelName] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const handleSubmit = async () => {
    if (selectedLanguageId === null || selectedLevelId === null) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    await onSubmit({
      languageId: selectedLanguageId,
      languageName: selectedLanguageName,
      languageLevel: selectedLevelId,
      languageLevelName: selectedLevelName,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedLanguageId(null);
    setSelectedLanguageName('');
    setSelectedLevelId(null);
    setSelectedLevelName('');
    setShowLanguageDropdown(false);
    setShowLevelDropdown(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Dil Bilgisi Ekle</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.fieldContainer, showLanguageDropdown && { zIndex: 1000 }]}>
              <Text style={styles.label}>Dil *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowLevelDropdown(false);
                }}
              >
                <Text style={selectedLanguageName ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedLanguageName || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showLanguageDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {LANGUAGES.map((language) => (
                      <TouchableOpacity
                        key={language.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedLanguageId(language.id);
                          setSelectedLanguageName(language.name);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{language.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={[styles.fieldContainer, showLevelDropdown && { zIndex: 999 }]}>
              <Text style={styles.label}>Seviye *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setShowLevelDropdown(!showLevelDropdown);
                  setShowLanguageDropdown(false);
                }}
              >
                <Text style={selectedLevelName ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedLevelName || 'Seçiniz'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {showLevelDropdown && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {LANGUAGE_LEVELS.map((level) => (
                      <TouchableOpacity
                        key={level.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedLevelId(level.id);
                          setSelectedLevelName(level.name);
                          setShowLevelDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{level.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
