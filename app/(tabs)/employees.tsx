import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Menu,
  Search,
  Users as UsersIcon,
  UserPlus,
  ChevronDown,
  Briefcase,
  Calendar,
  Building2,
  Network,
} from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { AddEmployeeModal, EmployeeFormData } from '@/components/AddEmployeeModal';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { employmentService } from '@/services/employment.service';
import type {
  GroupedEmployees,
  TreeEmployee,
  UserTitle,
  Department,
} from '@/types/backend';
import { formatDate } from '@/utils/formatters';

export default function EmployeesScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addEmployeeModalVisible, setAddEmployeeModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [loading, setLoading] = useState(true);
  const [groupedEmployees, setGroupedEmployees] = useState<GroupedEmployees[]>([]);
  const [treeEmployees, setTreeEmployees] = useState<TreeEmployee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [titles, setTitles] = useState<UserTitle[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetic' | 'date'>('alphabetic');
  const [filterByTitle, setFilterByTitle] = useState<'all' | number>('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const organizationId = user?.organization_id || 2;

      const [groupedData, treeData, departmentsData, titlesData] = await Promise.all([
        userService.getGroupedByUsers(organizationId),
        userService.getTreeByUsers(organizationId),
        employmentService.getOrganizationDepartments(),
        employmentService.getUserTitles(),
      ]);

      setGroupedEmployees(groupedData);
      setTreeEmployees(treeData);
      setDepartments(departmentsData);
      setTitles(titlesData);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployee = (data: EmployeeFormData) => {
    console.log('Saving employee:', data);
    loadData();
  };

  const getProcessedEmployees = () => {
    let allWorkers = groupedEmployees.flatMap(group => group.workers);

    if (searchQuery) {
      allWorkers = allWorkers.filter((worker) =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (worker.position && worker.position.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterByTitle !== 'all') {
      const selectedTitleName = titles.find(t => t.id === filterByTitle)?.name;
      if (selectedTitleName) {
        allWorkers = allWorkers.filter(worker => worker.position === selectedTitleName);
      }
    }

    if (sortBy === 'date') {
      allWorkers.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      return [{
        key: 'Tarih',
        workers: allWorkers
      }];
    } else {
      const grouped: { [key: string]: typeof allWorkers } = {};
      allWorkers.forEach(worker => {
        const firstLetter = worker.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(worker);
      });

      return Object.keys(grouped)
        .sort()
        .map(key => ({
          key,
          workers: grouped[key].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        }));
    }
  };

  const filteredGroupedEmployees = getProcessedEmployees();

  const renderTreeEmployee = (employee: TreeEmployee, depth: number = 0) => {
    return (
      <View key={employee.id} style={{ marginLeft: depth * 20 }}>
        <View style={styles.treeEmployeeCard}>
          <View style={styles.avatar}>
            {employee.profilePhoto && employee.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
              <Image source={{ uri: employee.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </Text>
            )}
          </View>
          <View style={styles.treeEmployeeInfo}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            {employee.attributes.title && (
              <View style={styles.infoRow}>
                <Briefcase size={14} color="#666" />
                <Text style={styles.infoText}>{employee.attributes.title}</Text>
              </View>
            )}
          </View>
        </View>
        {employee.children && employee.children.length > 0 && (
          <View style={styles.childrenContainer}>
            {employee.children.map((child) => renderTreeEmployee(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {(showSortDropdown || showTitleDropdown) && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowSortDropdown(false);
            setShowTitleDropdown(false);
          }}
        />
      )}
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <UsersIcon size={20} color="#666" />
          <Text style={styles.sectionTitle}>ÇALIŞANLAR</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.7}
            onPress={() => setAddEmployeeModalVisible(true)}
          >
            <UserPlus size={20} color="#7C3AED" />
            <Text style={styles.addButtonText}>Yeni Çalışan Ekle</Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Menu size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'list' ? 'tree' : 'list')}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              {viewMode === 'list' ? (
                <Network size={24} color="#666" />
              ) : (
                <UsersIcon size={24} color="#666" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Arama"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {viewMode === 'list' && (
          <View style={styles.filterRow}>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.filterButton}
                activeOpacity={0.7}
                onPress={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowTitleDropdown(false);
                }}
              >
                <Text style={styles.filterButtonText}>
                  {sortBy === 'alphabetic' ? 'Alfabetik' : 'Tarih'}
                </Text>
                <ChevronDown size={16} color="#666" />
              </TouchableOpacity>
              {showSortDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      sortBy === 'alphabetic' && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setSortBy('alphabetic');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      sortBy === 'alphabetic' && styles.dropdownItemTextActive
                    ]}>
                      Alfabetik
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      styles.dropdownItemLast,
                      sortBy === 'date' && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setSortBy('date');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      sortBy === 'date' && styles.dropdownItemTextActive
                    ]}>
                      Tarih
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.filterButton}
                activeOpacity={0.7}
                onPress={() => {
                  setShowTitleDropdown(!showTitleDropdown);
                  setShowSortDropdown(false);
                }}
              >
                <Text style={styles.filterButtonText}>
                  {filterByTitle === 'all'
                    ? 'Tüm Çalışanlar'
                    : titles.find(t => t.id === filterByTitle)?.name || 'Tüm Çalışanlar'}
                </Text>
                <ChevronDown size={16} color="#666" />
              </TouchableOpacity>
              {showTitleDropdown && (
                <ScrollView style={styles.dropdownMenu} nestedScrollEnabled>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      filterByTitle === 'all' && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setFilterByTitle('all');
                      setShowTitleDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      filterByTitle === 'all' && styles.dropdownItemTextActive
                    ]}>
                      Tüm Çalışanlar
                    </Text>
                  </TouchableOpacity>
                  {titles.map((title, index) => (
                    <TouchableOpacity
                      key={title.id}
                      style={[
                        styles.dropdownItem,
                        index === titles.length - 1 && styles.dropdownItemLast,
                        filterByTitle === title.id && styles.dropdownItemActive
                      ]}
                      onPress={() => {
                        setFilterByTitle(title.id);
                        setShowTitleDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        filterByTitle === title.id && styles.dropdownItemTextActive
                      ]}>
                        {title.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'list' ? (
          filteredGroupedEmployees.map((group) => (
            <View key={group.key} style={styles.groupContainer}>
              <View style={styles.letterHeader}>
                <Text style={styles.letterText}>{group.key}</Text>
              </View>
              {group.workers.map((worker) => (
                <View key={worker.id} style={styles.employeeCard}>
                  <View style={styles.avatar}>
                    {worker.profilePhoto && worker.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                      <Image source={{ uri: worker.profilePhoto }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {worker.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{worker.name}</Text>
                    {worker.position && (
                      <View style={styles.infoRow}>
                        <Briefcase size={14} color="#666" />
                        <Text style={styles.infoText}>{worker.position}</Text>
                      </View>
                    )}
                    <View style={styles.infoRow}>
                      <Calendar size={14} color="#666" />
                      <Text style={styles.infoText}>{formatDate(worker.startDate)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Building2 size={14} color="#666" />
                      <Text style={styles.infoText}>{worker.workPlaceName}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.treeContainer}>
            {treeEmployees.map((employee) => renderTreeEmployee(employee, 0))}
          </View>
        )}
      </ScrollView>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
      <AddEmployeeModal
        visible={addEmployeeModalVisible}
        onClose={() => setAddEmployeeModalVisible(false)}
        onSave={handleSaveEmployee}
        organizationId={user?.organization_id || 2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 1000,
  },
  dropdownWrapper: {
    position: 'relative',
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    maxHeight: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemActive: {
    backgroundColor: '#F5F3FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 8,
  },
  letterHeader: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  letterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  employeeCard: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  treeContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  treeEmployeeCard: {
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  treeEmployeeInfo: {
    flex: 1,
  },
  childrenContainer: {
    marginTop: 4,
  },
});
