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
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import type { UserProfileDetails } from '@/types/backend';
import { userService } from '@/services/user.service';
import { DatePicker as DatePickerModal } from './DatePicker';

type SectionType = 'personal' | 'contact' | 'address' | 'health' | 'military';

interface EditSectionModalProps {
  visible: boolean;
  sectionType: SectionType | null;
  employee: UserProfileDetails | null;
  onClose: () => void;
  onSave: () => void;
}

export default function EditSectionModal({
  visible,
  sectionType,
  employee,
  onClose,
  onSave,
}: EditSectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (visible && employee && sectionType) {
      initializeFormData();
    }
  }, [visible, employee, sectionType]);

  const initializeFormData = () => {
    if (!employee || !sectionType) return;

    switch (sectionType) {
      case 'personal':
        setFormData({
          tckn: employee.personalInformation?.tckn || '',
          firstName: employee.personalInformation?.firstName || '',
          lastName: employee.personalInformation?.lastName || '',
          birthPlace: employee.personalInformation?.birthPlace || '',
          birthdate: employee.personalInformation?.birthdate || '',
          gender: employee.personalInformation?.gender?.toString() || '0',
          maritalStatus: employee.personalInformation?.maritalStatus?.toString() || '0',
        });
        break;
      case 'contact':
        setFormData({
          phoneNumber: employee.userContact?.phoneNumber || '',
          homePhone: employee.userContact?.homePhone || '',
          businessPhone: employee.userContact?.businessPhone || '',
          email: employee.userContact?.email || '',
          businessEmail: employee.userContact?.businessEmail || '',
          otherEmail: employee.userContact?.otherEmail || '',
        });
        break;
      case 'address':
        setFormData({
          address: employee.userAddress?.address || '',
        });
        break;
      case 'health':
        setFormData({
          height: employee.userHealth?.height?.toString() || '',
          weight: employee.userHealth?.weight?.toString() || '',
          bloodType: employee.userHealth?.bloodType?.toString() || '0',
          allergies: employee.userHealth?.allergies || '',
          drugs: employee.userHealth?.drugs || '',
        });
        break;
      case 'military':
        setFormData({
          militaryStatus: employee.userMilitary?.militaryStatus?.toString() || '0',
          militaryPostpone: employee.userMilitary?.militaryPostpone || '',
          militaryNote: employee.userMilitary?.militaryNote || '',
        });
        break;
    }
  };

  const handleSave = async () => {
    if (!employee || !sectionType) return;

    try {
      setLoading(true);

      switch (sectionType) {
        case 'personal':
          await userService.updatePersonalInformation(employee.backendUserId, {
            tckn: formData.tckn,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthPlace: formData.birthPlace,
            birthdate: formData.birthdate,
            gender: parseInt(formData.gender),
            maritalStatus: parseInt(formData.maritalStatus),
          });
          break;
        case 'contact':
          await userService.updateContactInformation(employee.backendUserId, {
            phoneNumber: formData.phoneNumber,
            homePhone: formData.homePhone,
            businessPhone: formData.businessPhone,
            email: formData.email,
            businessEmail: formData.businessEmail,
            otherEmail: formData.otherEmail,
          });
          break;
        case 'address':
          await userService.updateAddressInformation(employee.backendUserId, {
            address: formData.address,
          });
          break;
        case 'health':
          await userService.updateHealthInformation(employee.backendUserId, {
            height: formData.height ? parseInt(formData.height) : undefined,
            weight: formData.weight ? parseInt(formData.weight) : undefined,
            bloodType: parseInt(formData.bloodType),
            allergies: formData.allergies,
            drugs: formData.drugs,
          });
          break;
        case 'military':
          await userService.updateMilitaryInformation(employee.backendUserId, {
            militaryStatus: parseInt(formData.militaryStatus),
            militaryPostpone: formData.militaryPostpone,
            militaryNote: formData.militaryNote,
          });
          break;
      }

      onSave();
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getSectionTitle = () => {
    switch (sectionType) {
      case 'personal': return 'Kişisel Bilgileri Düzenle';
      case 'contact': return 'İletişim Bilgilerini Düzenle';
      case 'address': return 'Adres Bilgilerini Düzenle';
      case 'health': return 'Sağlık Bilgilerini Düzenle';
      case 'military': return 'Askerlik Bilgilerini Düzenle';
      default: return 'Düzenle';
    }
  };

  const renderPersonalForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>TC Kimlik No</Text>
        <TextInput
          style={styles.input}
          value={formData.tckn}
          onChangeText={(text) => setFormData({ ...formData, tckn: text })}
          placeholder="TC Kimlik No"
          keyboardType="numeric"
          maxLength={11}
        />
      </View>
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
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Doğum Yeri</Text>
        <TextInput
          style={styles.input}
          value={formData.birthPlace}
          onChangeText={(text) => setFormData({ ...formData, birthPlace: text })}
          placeholder="Doğum Yeri"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Doğum Tarihi</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={[styles.dateText, !formData.birthdate && styles.placeholderText]}>
            {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('tr-TR') : 'Doğum tarihini seçin'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cinsiyet</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioOption, formData.gender === '0' && styles.radioOptionSelected]}
            onPress={() => setFormData({ ...formData, gender: '0' })}
          >
            <Text style={[styles.radioText, formData.gender === '0' && styles.radioTextSelected]}>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioOption, formData.gender === '1' && styles.radioOptionSelected]}
            onPress={() => setFormData({ ...formData, gender: '1' })}
          >
            <Text style={[styles.radioText, formData.gender === '1' && styles.radioTextSelected]}>Kadın</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Medeni Durum</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioOption, formData.maritalStatus === '0' && styles.radioOptionSelected]}
            onPress={() => setFormData({ ...formData, maritalStatus: '0' })}
          >
            <Text style={[styles.radioText, formData.maritalStatus === '0' && styles.radioTextSelected]}>Bekar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioOption, formData.maritalStatus === '1' && styles.radioOptionSelected]}
            onPress={() => setFormData({ ...formData, maritalStatus: '1' })}
          >
            <Text style={[styles.radioText, formData.maritalStatus === '1' && styles.radioTextSelected]}>Evli</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioOption, formData.maritalStatus === '2' && styles.radioOptionSelected]}
            onPress={() => setFormData({ ...formData, maritalStatus: '2' })}
          >
            <Text style={[styles.radioText, formData.maritalStatus === '2' && styles.radioTextSelected]}>Boşanmış</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderContactForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="E-posta"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          placeholder="Telefon"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>İş E-postası</Text>
        <TextInput
          style={styles.input}
          value={formData.businessEmail}
          onChangeText={(text) => setFormData({ ...formData, businessEmail: text })}
          placeholder="İş E-postası"
          keyboardType="email-address"
          autoCapitalize="none"
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
        <Text style={styles.inputLabel}>Ev Telefonu</Text>
        <TextInput
          style={styles.input}
          value={formData.homePhone}
          onChangeText={(text) => setFormData({ ...formData, homePhone: text })}
          placeholder="Ev Telefonu"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Diğer E-posta</Text>
        <TextInput
          style={styles.input}
          value={formData.otherEmail}
          onChangeText={(text) => setFormData({ ...formData, otherEmail: text })}
          placeholder="Diğer E-posta"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </>
  );

  const renderAddressForm = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Adres</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        placeholder="Adres"
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const renderHealthForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Boy (cm)</Text>
        <TextInput
          style={styles.input}
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="Boy"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Kilo (kg)</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          placeholder="Kilo"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Kan Grubu</Text>
        <View style={styles.radioGroup}>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'].map((type, index) => (
            <TouchableOpacity
              key={type}
              style={[styles.radioOption, formData.bloodType === index.toString() && styles.radioOptionSelected]}
              onPress={() => setFormData({ ...formData, bloodType: index.toString() })}
            >
              <Text style={[styles.radioText, formData.bloodType === index.toString() && styles.radioTextSelected]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Alerjiler</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.allergies}
          onChangeText={(text) => setFormData({ ...formData, allergies: text })}
          placeholder="Alerjiler"
          multiline
          numberOfLines={3}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Kullandığı İlaçlar</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.drugs}
          onChangeText={(text) => setFormData({ ...formData, drugs: text })}
          placeholder="Kullandığı İlaçlar"
          multiline
          numberOfLines={3}
        />
      </View>
    </>
  );

  const renderMilitaryForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Askerlik Durumu</Text>
        <View style={styles.radioGroup}>
          {['Tamamlandı', 'Ertelenmiş', 'Muaf', 'Tabi Değil'].map((status, index) => (
            <TouchableOpacity
              key={status}
              style={[styles.radioOption, formData.militaryStatus === index.toString() && styles.radioOptionSelected]}
              onPress={() => setFormData({ ...formData, militaryStatus: index.toString() })}
            >
              <Text style={[styles.radioText, formData.militaryStatus === index.toString() && styles.radioTextSelected]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tecil Durumu</Text>
        <TextInput
          style={styles.input}
          value={formData.militaryPostpone}
          onChangeText={(text) => setFormData({ ...formData, militaryPostpone: text })}
          placeholder="Tecil Durumu"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Notlar</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.militaryNote}
          onChangeText={(text) => setFormData({ ...formData, militaryNote: text })}
          placeholder="Notlar"
          multiline
          numberOfLines={3}
        />
      </View>
    </>
  );

  const renderFormContent = () => {
    switch (sectionType) {
      case 'personal':
        return renderPersonalForm();
      case 'contact':
        return renderContactForm();
      case 'address':
        return renderAddressForm();
      case 'health':
        return renderHealthForm();
      case 'military':
        return renderMilitaryForm();
      default:
        return null;
    }
  };

  if (!employee || !sectionType) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getSectionTitle()}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderFormContent()}
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
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

        <DatePickerModal
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onSelectDate={(date) => {
            const [month, day, year] = date.split('/').map(s => s.trim());
            const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
            setFormData({ ...formData, birthdate: isoDate });
          }}
          initialDate={formData.birthdate ? (() => {
            const d = new Date(formData.birthdate);
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${month} / ${day} / ${year}`;
          })() : undefined}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  placeholderText: {
    color: '#999',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  radioOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F0E7FF',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
  },
  radioTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  footer: {
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
