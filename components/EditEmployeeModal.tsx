import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import type { UserProfileDetails, Country } from '@/types/backend';
import { userService } from '@/services/user.service';

interface EditEmployeeModalProps {
  visible: boolean;
  employee: UserProfileDetails | null;
  onClose: () => void;
  onSave: (updatedEmployee: Partial<UserProfileDetails>) => void;
}

export default function EditEmployeeModal({
  visible,
  employee,
  onClose,
  onSave,
}: EditEmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessEmail: '',
    businessPhone: '',
    address: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    if (visible && employee) {
      setFormData({
        firstName: employee.personalInformation.firstName || '',
        lastName: employee.personalInformation.lastName || '',
        email: employee.userContact.email || '',
        phoneNumber: employee.userContact.phoneNumber || '',
        businessEmail: employee.userContact.businessEmail || '',
        businessPhone: employee.userContact.businessPhone || '',
        address: employee.userAddress.address || '',
        linkedin: employee.socialMedia?.linkedin || '',
        facebook: employee.socialMedia?.facebook || '',
        instagram: employee.socialMedia?.instagram || '',
        twitter: employee.socialMedia?.twitter || '',
      });
      loadCountries();
    }
  }, [visible, employee]);

  const loadCountries = async () => {
    try {
      const countriesData = await userService.getCountries();
      setCountries(countriesData);
    } catch (error) {
    }
  };

  const handleSave = () => {
    setLoading(true);
    onSave({
      personalInformation: {
        ...employee!.personalInformation,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      userContact: {
        ...employee!.userContact,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
      },
      userAddress: {
        ...employee!.userAddress,
        address: formData.address,
      },
      socialMedia: {
        linkedin: formData.linkedin,
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
      },
    });
    setLoading(false);
  };

  if (!employee) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Çalışan Bilgilerini Düzenle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ad</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  placeholder="Ad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Soyad</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  placeholder="Soyad"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Şahsi Telefon</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                  placeholder="Şahsi Telefon"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>İş Telefonu</Text>
                <TextInput
                  style={styles.input}
                  value={formData.businessPhone}
                  onChangeText={(text) => setFormData({ ...formData, businessPhone: text })}
                  placeholder="İş Telefonu"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Şahsi E-Posta</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Şahsi E-Posta"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>İş E-Postası</Text>
                <TextInput
                  style={styles.input}
                  value={formData.businessEmail}
                  onChangeText={(text) => setFormData({ ...formData, businessEmail: text })}
                  placeholder="İş E-Postası"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adres</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adres</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Adres"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sosyal Medya</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>LinkedIn</Text>
                <TextInput
                  style={styles.input}
                  value={formData.linkedin}
                  onChangeText={(text) => setFormData({ ...formData, linkedin: text })}
                  placeholder="LinkedIn profil linki"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Facebook</Text>
                <TextInput
                  style={styles.input}
                  value={formData.facebook}
                  onChangeText={(text) => setFormData({ ...formData, facebook: text })}
                  placeholder="Facebook profil linki"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instagram</Text>
                <TextInput
                  style={styles.input}
                  value={formData.instagram}
                  onChangeText={(text) => setFormData({ ...formData, instagram: text })}
                  placeholder="Instagram profil linki"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Twitter</Text>
                <TextInput
                  style={styles.input}
                  value={formData.twitter}
                  onChangeText={(text) => setFormData({ ...formData, twitter: text })}
                  placeholder="Twitter profil linki"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
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
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
