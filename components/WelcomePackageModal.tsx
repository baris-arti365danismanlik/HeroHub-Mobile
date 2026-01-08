import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { X, Calendar, Clock, ChevronDown, User as UserIcon } from 'lucide-react-native';
import { userService } from '@/services/user.service';
import {
  BadgeCardInfo,
  GroupedDepartmentUsers,
  DepartmentUser,
  WelcomePackageForm,
} from '@/types/backend';

interface WelcomePackageModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
  organizationId: number;
  onSubmit: (form: WelcomePackageForm) => Promise<void>;
}

export function WelcomePackageModal({
  visible,
  onClose,
  userId,
  organizationId,
  onSubmit,
}: WelcomePackageModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [badgeInfo, setBadgeInfo] = useState<BadgeCardInfo | null>(null);
  const [greeters, setGreeters] = useState<GroupedDepartmentUsers | null>(null);
  const [managers, setManagers] = useState<GroupedDepartmentUsers | null>(null);
  const [showGreeterDropdown, setShowGreeterDropdown] = useState(false);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [form, setForm] = useState<WelcomePackageForm>({
    email: '',
    startDate: '',
    arrivalTime: '',
    arrivalAddress: '',
    greeterUserId: null,
    managerId: null,
    otherInstructions: '',
  });

  const [selectedGreeter, setSelectedGreeter] = useState<DepartmentUser | null>(null);
  const [selectedManager, setSelectedManager] = useState<DepartmentUser | null>(null);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, userId, organizationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [badge, greeterData, managerData] = await Promise.all([
        userService.getBadgeCardInfo(userId),
        userService.getGroupedByDepartments(organizationId, false, 'personToMeet'),
        userService.getGroupedByDepartments(organizationId, true, 'reportsTo'),
      ]);

      setBadgeInfo(badge);
      setGreeters(greeterData);
      setManagers(managerData);

      if (badge?.fullName) {
        const emailParts = badge.fullName.toLowerCase().split(' ');
        const generatedEmail = `${emailParts.join('.')}@company.com`;
        setForm((prev) => ({ ...prev, email: generatedEmail }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectGreeter = (user: DepartmentUser) => {
    setSelectedGreeter(user);
    setForm((prev) => ({ ...prev, greeterUserId: user.id }));
    setShowGreeterDropdown(false);
  };

  const handleSelectManager = (user: DepartmentUser) => {
    setSelectedManager(user);
    setForm((prev) => ({ ...prev, managerId: user.id }));
    setShowManagerDropdown(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Hoşgeldin Paketi Gönder</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6B46C1" />
              </View>
            ) : (
              <>
                {badgeInfo && (
                  <View style={styles.userCard}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {getInitials(badgeInfo.fullName)}
                      </Text>
                    </View>
                    <Text style={styles.userName}>{badgeInfo.fullName}</Text>
                    <Text style={styles.userTitle}>{badgeInfo.title || '—'}</Text>
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>E-posta Adresi</Text>
                  <TextInput
                    style={styles.input}
                    value={form.email}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                    placeholder="ornek@email.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>İşe Giriş Tarihi (İlk Gün)</Text>
                  <TouchableOpacity
                    style={styles.inputWithIcon}
                    onPress={() => setShowDatePicker(true)}>
                    <TextInput
                      style={styles.inputText}
                      value={form.startDate}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, startDate: text }))}
                      placeholder="GG/AA/YYYY"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                    <Calendar size={20} color="#6B46C1" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Geleceği Saat</Text>
                  <TouchableOpacity
                    style={styles.inputWithIcon}
                    onPress={() => setShowTimePicker(true)}>
                    <TextInput
                      style={styles.inputText}
                      value={form.arrivalTime}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, arrivalTime: text }))}
                      placeholder="Saat seçin"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                    <Clock size={20} color="#6B46C1" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Geleceği Adres</Text>
                  <TextInput
                    style={styles.input}
                    value={form.arrivalAddress}
                    onChangeText={(text) =>
                      setForm((prev) => ({ ...prev, arrivalAddress: text }))
                    }
                    placeholder="Adres giriniz"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Karşılayacak Kişi</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowGreeterDropdown(!showGreeterDropdown)}>
                    <Text style={styles.dropdownText}>
                      {selectedGreeter
                        ? `${selectedGreeter.firstName} ${selectedGreeter.lastName}`
                        : 'Çalışanların içinde ara'}
                    </Text>
                    <ChevronDown size={20} color="#666" strokeWidth={2} />
                  </TouchableOpacity>
                  {showGreeterDropdown && greeters && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {greeters.departmentUsers.map((dept) => (
                          <View key={dept.departmentId}>
                            <Text style={styles.departmentName}>{dept.departmentName}</Text>
                            {dept.users.map((user) => (
                              <TouchableOpacity
                                key={user.id}
                                style={styles.dropdownItem}
                                onPress={() => handleSelectGreeter(user)}>
                                <UserIcon size={16} color="#666" strokeWidth={2} />
                                <Text style={styles.dropdownItemText}>
                                  {user.firstName} {user.lastName}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Yönetici</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowManagerDropdown(!showManagerDropdown)}>
                    <Text style={styles.dropdownText}>
                      {selectedManager
                        ? `${selectedManager.firstName} ${selectedManager.lastName}`
                        : 'Çalışanların içinde ara'}
                    </Text>
                    <ChevronDown size={20} color="#666" strokeWidth={2} />
                  </TouchableOpacity>
                  {showManagerDropdown && managers && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {managers.departmentUsers.map((dept) => (
                          <View key={dept.departmentId}>
                            <Text style={styles.departmentName}>{dept.departmentName}</Text>
                            {dept.users.map((user) => (
                              <TouchableOpacity
                                key={user.id}
                                style={styles.dropdownItem}
                                onPress={() => handleSelectManager(user)}>
                                <UserIcon size={16} color="#666" strokeWidth={2} />
                                <Text style={styles.dropdownItemText}>
                                  {user.firstName} {user.lastName}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Diğer Talimatlar</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={form.otherInstructions}
                    onChangeText={(text) =>
                      setForm((prev) => ({ ...prev, otherInstructions: text }))
                    }
                    placeholder="Ek talimatlar yazınız..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={submitting || loading}>
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Kaydet</Text>
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
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B46C1',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#6B7280',
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  departmentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B46C1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6B46C1',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
