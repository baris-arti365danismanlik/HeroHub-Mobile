import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronDown, Calendar as CalendarIcon } from 'lucide-react-native';
import { employmentService } from '@/services/employment.service';
import { userService } from '@/services/user.service';
import { DatePicker } from './DatePicker';
import type {
  Department,
  UserTitle,
  Workplace,
  GroupedDepartmentUsers,
} from '@/types/backend';

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormData) => Promise<void>;
  organizationId?: number;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number | null;
  titleId: number | null;
  workplaceId: number | null;
  workType: string;
  managerId: number | null;
  subordinateIds: number[];
  notes: string;
  startDate: string;
  salary: string;
  role: 'HR' | 'HR Manager' | 'IT' | 'Other';
}

export function AddEmployeeModal({ visible, onClose, onSave, organizationId = 2 }: AddEmployeeModalProps) {
  const getFormattedDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month} / ${day} / ${year}`;
  };

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: null,
    titleId: null,
    workplaceId: null,
    workType: '',
    managerId: null,
    subordinateIds: [],
    notes: '',
    startDate: getFormattedDate(),
    salary: '',
    role: 'Other',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [titles, setTitles] = useState<UserTitle[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [managerUsers, setManagerUsers] = useState<GroupedDepartmentUsers | null>(null);
  const [subordinateUsers, setSubordinateUsers] = useState<GroupedDepartmentUsers | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [showWorkplacePicker, setShowWorkplacePicker] = useState(false);
  const [showWorkTypePicker, setShowWorkTypePicker] = useState(false);
  const [showManagerPicker, setShowManagerPicker] = useState(false);
  const [showSubordinatePicker, setShowSubordinatePicker] = useState(false);
  const [expandedManagerDepts, setExpandedManagerDepts] = useState<Set<number>>(new Set());
  const [expandedSubordinateDepts, setExpandedSubordinateDepts] = useState<Set<number>>(new Set());
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [subordinateSearchQuery, setSubordinateSearchQuery] = useState('');
  const [selectedSubordinates, setSelectedSubordinates] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadFormData();
    }
  }, [visible]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      subordinateIds: Array.from(selectedSubordinates)
    }));
  }, [selectedSubordinates]);

  const loadFormData = async () => {
    try {
      const [depts, ttls, wps, mgrs, subs] = await Promise.all([
        employmentService.getOrganizationDepartments(),
        employmentService.getUserTitles(),
        employmentService.getWorkplaces(),
        userService.getGroupedByDepartments(organizationId, false, 'picker1'),
        userService.getGroupedByDepartments(organizationId, false, 'picker2'),
      ]);

      setDepartments(depts);
      setTitles(ttls);
      setWorkplaces(wps);
      setManagerUsers(mgrs);
      setSubordinateUsers(subs);
    } catch (error) {
    }
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Çalışan kaydedilemedi:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      departmentId: null,
      titleId: null,
      workplaceId: null,
      workType: '',
      managerId: null,
      subordinateIds: [],
      notes: '',
      startDate: getFormattedDate(),
      salary: '',
      role: 'Other',
    });
    setSelectedSubordinates(new Set());
    setManagerSearchQuery('');
    setSubordinateSearchQuery('');
    setExpandedManagerDepts(new Set());
    setExpandedSubordinateDepts(new Set());
    setSaving(false);
    onClose();
  };

  const workTypes = ['Tam Zamanlı', 'Yarı Zamanlı', 'Sözleşmeli', 'Stajyer', 'Danışman'];

  const selectedDepartment = departments.find((d) => d.id === formData.departmentId);
  const selectedTitle = titles.find((t) => t.id === formData.titleId);
  const selectedWorkplace = workplaces.find((w) => w.id === formData.workplaceId);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Yeni Çalışan Ekle</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ad"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Soyad"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-posta Adresi</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta Adresi"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Departman</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    setShowDepartmentPicker(!showDepartmentPicker);
                    setShowTitlePicker(false);
                    setShowWorkplacePicker(false);
                    setShowWorkTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>
                    {selectedDepartment?.name || 'Departman'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Unvan</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    setShowTitlePicker(!showTitlePicker);
                    setShowDepartmentPicker(false);
                    setShowWorkplacePicker(false);
                    setShowWorkTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{selectedTitle?.name || 'Unvan'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>İş Yeri</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    setShowWorkplacePicker(!showWorkplacePicker);
                    setShowDepartmentPicker(false);
                    setShowTitlePicker(false);
                    setShowWorkTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>
                    {selectedWorkplace?.name || 'İş Yeri'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Çalışma Şekli</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    setShowWorkTypePicker(!showWorkTypePicker);
                    setShowDepartmentPicker(false);
                    setShowTitlePicker(false);
                    setShowWorkplacePicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{formData.workType || 'Çalışma Şekli'}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yönetici</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => {
                  setShowManagerPicker(!showManagerPicker);
                  setManagerSearchQuery('');
                  setExpandedManagerDepts(new Set());
                }}
              >
                <Text style={styles.pickerText}>
                  {formData.managerId
                    ? managerUsers?.departmentUsers
                        .flatMap(d => d.users)
                        .find(u => u.id === formData.managerId)
                        ?.firstName + ' ' + managerUsers?.departmentUsers
                        .flatMap(d => d.users)
                        .find(u => u.id === formData.managerId)
                        ?.lastName
                    : 'Çalışanların içinde ara'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bağlı Çalışanlar</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => {
                  setShowSubordinatePicker(!showSubordinatePicker);
                  setSubordinateSearchQuery('');
                  setExpandedSubordinateDepts(new Set());
                }}
              >
                <Text style={styles.pickerText}>
                  {selectedSubordinates.size > 0
                    ? `${selectedSubordinates.size} çalışan seçildi`
                    : 'Çalışanların içinde ara'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Görev Tanımı</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Görev tanımı buraya gelecektir."
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>İşe Giriş Tarihi</Text>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateText}>{formData.startDate}</Text>
                <TouchableOpacity
                  style={styles.dateIconButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <CalendarIcon size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Maaş</Text>
              <View style={styles.salaryContainer}>
                <TextInput
                  style={styles.salaryInput}
                  placeholder="Maaş"
                  value={formData.salary}
                  onChangeText={(text) => setFormData({ ...formData, salary: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.currencySymbol}>₺</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rolü</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormData({ ...formData, role: 'HR' })}
                >
                  <View style={styles.radioCircle}>
                    {formData.role === 'HR' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>HR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormData({ ...formData, role: 'HR Manager' })}
                >
                  <View style={styles.radioCircle}>
                    {formData.role === 'HR Manager' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>HR Manager</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormData({ ...formData, role: 'IT' })}
                >
                  <View style={styles.radioCircle}>
                    {formData.role === 'IT' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>IT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormData({ ...formData, role: 'Other' })}
                >
                  <View style={styles.radioCircle}>
                    {formData.role === 'Other' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Diğer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DatePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onSelectDate={(dateString) => {
              setFormData({ ...formData, startDate: dateString });
            }}
            initialDate={formData.startDate}
          />
        )}

        {showDepartmentPicker && (
          <Modal transparent visible={showDepartmentPicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowDepartmentPicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Departman Seçin</Text>
                  <ScrollView style={styles.dropdownScroll}>
                    {departments.map((dept) => (
                      <TouchableOpacity
                        key={dept.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, departmentId: dept.id });
                          setShowDepartmentPicker(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{dept.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.dropdownAddItem} onPress={() => {}}>
                      <Text style={styles.dropdownAddItemText}>Yeni Departman Ekle</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showTitlePicker && (
          <Modal transparent visible={showTitlePicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowTitlePicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Unvan Seçin</Text>
                  <ScrollView style={styles.dropdownScroll}>
                    {titles.map((title) => (
                      <TouchableOpacity
                        key={title.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, titleId: title.id });
                          setShowTitlePicker(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{title.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.dropdownAddItem} onPress={() => {}}>
                      <Text style={styles.dropdownAddItemText}>Yeni Unvan Ekle</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showWorkplacePicker && (
          <Modal transparent visible={showWorkplacePicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowWorkplacePicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>İş Yeri Seçin</Text>
                  <ScrollView style={styles.dropdownScroll}>
                    {workplaces.map((workplace) => (
                      <TouchableOpacity
                        key={workplace.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, workplaceId: workplace.id });
                          setShowWorkplacePicker(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{workplace.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.dropdownAddItem} onPress={() => {}}>
                      <Text style={styles.dropdownAddItemText}>Yeni İş Yeri Ekle</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showWorkTypePicker && (
          <Modal transparent visible={showWorkTypePicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowWorkTypePicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Çalışma Şekli Seçin</Text>
                  <ScrollView style={styles.dropdownScroll}>
                    {workTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, workType: type });
                          setShowWorkTypePicker(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showManagerPicker && managerUsers && (
          <Modal transparent visible={showManagerPicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowManagerPicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.employeePickerContainer}>
                  <Text style={styles.dropdownTitle}>Yönetici</Text>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Çalışanların içinde ara"
                      value={managerSearchQuery}
                      onChangeText={setManagerSearchQuery}
                    />
                  </View>
                  <ScrollView style={styles.employeePickerScroll}>
                    {managerUsers.departmentUsers
                      .filter(dept =>
                        managerSearchQuery === '' ||
                        dept.departmentName.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
                        dept.users.some(user =>
                          `${user.firstName} ${user.lastName}`.toLowerCase().includes(managerSearchQuery.toLowerCase())
                        )
                      )
                      .map((dept) => (
                        <View key={dept.departmentId}>
                          <TouchableOpacity
                            style={styles.departmentHeader}
                            onPress={() => {
                              const newExpanded = new Set(expandedManagerDepts);
                              if (newExpanded.has(dept.departmentId)) {
                                newExpanded.delete(dept.departmentId);
                              } else {
                                newExpanded.add(dept.departmentId);
                              }
                              setExpandedManagerDepts(newExpanded);
                            }}
                          >
                            <Text style={styles.departmentHeaderText}>{dept.departmentName}</Text>
                            <ChevronDown
                              size={20}
                              color="#666"
                              style={{
                                transform: [
                                  { rotate: expandedManagerDepts.has(dept.departmentId) ? '180deg' : '0deg' }
                                ]
                              }}
                            />
                          </TouchableOpacity>
                          {expandedManagerDepts.has(dept.departmentId) &&
                            dept.users
                              .filter(user =>
                                managerSearchQuery === '' ||
                                `${user.firstName} ${user.lastName}`.toLowerCase().includes(managerSearchQuery.toLowerCase())
                              )
                              .map((user) => (
                                <TouchableOpacity
                                  key={user.id}
                                  style={styles.userItem}
                                  onPress={() => {
                                    setFormData({ ...formData, managerId: user.id });
                                    setShowManagerPicker(false);
                                  }}
                                >
                                  <Text style={styles.userItemText}>
                                    {user.firstName} {user.lastName}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                        </View>
                      ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showSubordinatePicker && subordinateUsers && (
          <Modal transparent visible={showSubordinatePicker} animationType="fade">
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setShowSubordinatePicker(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.employeePickerContainer}>
                  <Text style={styles.dropdownTitle}>Bağlı Çalışanlar</Text>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Çalışanların içinde ara"
                      value={subordinateSearchQuery}
                      onChangeText={setSubordinateSearchQuery}
                    />
                  </View>
                  <ScrollView style={styles.employeePickerScroll}>
                    {subordinateUsers.departmentUsers
                      .filter(dept =>
                        subordinateSearchQuery === '' ||
                        dept.departmentName.toLowerCase().includes(subordinateSearchQuery.toLowerCase()) ||
                        dept.users.some(user =>
                          `${user.firstName} ${user.lastName}`.toLowerCase().includes(subordinateSearchQuery.toLowerCase())
                        )
                      )
                      .map((dept) => {
                        const deptUsers = dept.users.filter(user =>
                          subordinateSearchQuery === '' ||
                          `${user.firstName} ${user.lastName}`.toLowerCase().includes(subordinateSearchQuery.toLowerCase())
                        );
                        const allDeptUsersSelected = deptUsers.every(user => selectedSubordinates.has(user.id));
                        const someDeptUsersSelected = deptUsers.some(user => selectedSubordinates.has(user.id));

                        return (
                          <View key={dept.departmentId}>
                            <View style={styles.departmentHeaderWithCheckbox}>
                              <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => {
                                  const newSelected = new Set(selectedSubordinates);
                                  if (allDeptUsersSelected) {
                                    deptUsers.forEach(user => newSelected.delete(user.id));
                                  } else {
                                    deptUsers.forEach(user => newSelected.add(user.id));
                                  }
                                  setSelectedSubordinates(newSelected);
                                }}
                              >
                                <View style={[
                                  styles.checkbox,
                                  (allDeptUsersSelected || someDeptUsersSelected) && styles.checkboxChecked
                                ]}>
                                  {(allDeptUsersSelected || someDeptUsersSelected) && (
                                    <Text style={styles.checkboxMark}>✓</Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.departmentHeaderFlex}
                                onPress={() => {
                                  const newExpanded = new Set(expandedSubordinateDepts);
                                  if (newExpanded.has(dept.departmentId)) {
                                    newExpanded.delete(dept.departmentId);
                                  } else {
                                    newExpanded.add(dept.departmentId);
                                  }
                                  setExpandedSubordinateDepts(newExpanded);
                                }}
                              >
                                <Text style={styles.departmentHeaderText}>{dept.departmentName}</Text>
                                <ChevronDown
                                  size={20}
                                  color="#666"
                                  style={{
                                    transform: [
                                      { rotate: expandedSubordinateDepts.has(dept.departmentId) ? '180deg' : '0deg' }
                                    ]
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            {expandedSubordinateDepts.has(dept.departmentId) &&
                              deptUsers.map((user) => (
                                <TouchableOpacity
                                  key={user.id}
                                  style={styles.userItemWithCheckbox}
                                  onPress={() => {
                                    const newSelected = new Set(selectedSubordinates);
                                    if (newSelected.has(user.id)) {
                                      newSelected.delete(user.id);
                                    } else {
                                      newSelected.add(user.id);
                                    }
                                    setSelectedSubordinates(newSelected);
                                  }}
                                >
                                  <View style={[
                                    styles.checkbox,
                                    selectedSubordinates.has(user.id) && styles.checkboxChecked
                                  ]}>
                                    {selectedSubordinates.has(user.id) && (
                                      <Text style={styles.checkboxMark}>✓</Text>
                                    )}
                                  </View>
                                  <Text style={styles.userItemText}>
                                    {user.firstName} {user.lastName}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
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
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dropdownScroll: {
    maxHeight: '100%',
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownAddItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  dropdownAddItemText: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  dateIconButton: {
    padding: 4,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  salaryInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#666',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B8A3E0',
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  employeePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  employeePickerScroll: {
    maxHeight: '100%',
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  departmentHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userItem: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userItemText: {
    fontSize: 15,
    color: '#333',
  },
  departmentHeaderWithCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkboxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  departmentHeaderFlex: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingVertical: 14,
  },
  userItemWithCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 48,
    paddingRight: 32,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
