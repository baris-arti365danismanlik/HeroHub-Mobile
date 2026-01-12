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
import { useRouter } from 'expo-router';
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
  const router = useRouter();
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
    if (user?.organization_id) {
      loadData();
    }
  }, [user]);

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

  const renderTreeEmployee = (employee: TreeEmployee, depth: number = 0, isLast: boolean = false) => {
    const hasChildren = employee.children && employee.children.length > 0;

    return (
      <View key={employee.id} style={styles.treeNodeContainer}>
        <TouchableOpacity
          style={styles.treeEmployeeCard}
          activeOpacity={0.7}
          onPress={() => router.push(`/employee/${employee.id}`)}
        >
          <View style={styles.treeCardContent}>
            <View style={styles.treeAvatar}>
              {employee.profilePhoto && employee.profilePhoto !== 'https://faz2-cdn.herotr.com' ? (
                <Image source={{ uri: employee.profilePhoto }} style={styles.treeAvatarImage} />
              ) : (
                <Text style={styles.treeAvatarText}>
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </Text>
              )}
            </View>
            <View style={styles.treeEmployeeInfo}>
              <Text style={styles.treeEmployeeName}>{employee.name}</Text>
              {employee.attributes.title && (
                <Text style={styles.treeEmployeeTitle}>{employee.attributes.title}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {hasChildren && (
          <>
            <View style={styles.verticalConnector} />
            <View style={styles.childrenRow}>
              <View style={styles.childrenContainer}>
                {employee.children!.map((child, index) => (
                  <View key={child.id} style={styles.childWrapper}>
                    <View style={styles.childVerticalLine} />
                    {renderTreeEmployee(child, depth + 1, index === employee.children!.length - 1)}
                  </View>
                ))}
              </View>
              {employee.children!.length > 1 && (
                <View style={[
                  styles.horizontalConnector,
                  {
                    width: (employee.children!.length - 1) * 260 + 40,
                  }
                ]} />
              )}
            </View>
          </>
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

        {viewMode === 'list' ? (
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
        ) : (
          <View style={styles.treeHeaderRow}>
            <TouchableOpacity
              style={styles.addTreeButton}
              activeOpacity={0.7}
              onPress={() => setAddEmployeeModalVisible(true)}
            >
              <UserPlus size={18} color="#fff" />
              <Text style={styles.addTreeButtonText}>Yeni Çalışan Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {viewMode === 'list' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredGroupedEmployees.map((group) => (
            <View key={group.key} style={styles.groupContainer}>
              <View style={styles.letterHeader}>
                <Text style={styles.letterText}>{group.key}</Text>
              </View>
              {group.workers.map((worker) => (
                <TouchableOpacity
                  key={worker.id}
                  style={styles.employeeCard}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/employee/${worker.id}`)}
                >
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
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.treeContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {treeEmployees.map((employee) => renderTreeEmployee(employee, 0))}
        </ScrollView>
      )}

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
    zIndex: 9999,
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
    zIndex: 10000,
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
    zIndex: 10000,
  },
  dropdownWrapper: {
    position: 'relative',
    flex: 1,
    zIndex: 10000,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    maxHeight: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10001,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemActive: {
    backgroundColor: '#F3E8FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    zIndex: 1,
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
    padding: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    minWidth: '100%',
  },
  treeNodeContainer: {
    alignItems: 'center',
  },
  treeEmployeeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 220,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  treeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  treeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  treeAvatarText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#7C3AED',
  },
  treeEmployeeInfo: {
    flex: 1,
  },
  treeEmployeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  treeEmployeeTitle: {
    fontSize: 13,
    color: '#666',
  },
  verticalConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#9333EA',
    marginVertical: 0,
  },
  childrenRow: {
    position: 'relative',
    alignItems: 'center',
  },
  horizontalConnector: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#9333EA',
    top: 0,
    alignSelf: 'center',
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20,
  },
  childWrapper: {
    alignItems: 'center',
  },
  childVerticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#9333EA',
    marginBottom: 0,
  },
  treeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addTreeButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});
