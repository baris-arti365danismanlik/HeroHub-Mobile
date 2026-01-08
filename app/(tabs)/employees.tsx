import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  Menu,
  Search,
  Users as UsersIcon,
  MoreVertical,
  UserPlus,
  ChevronDown,
  Briefcase,
  Calendar,
  Clock,
  Building2
} from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { EmployeeDropdown } from '@/components/EmployeeDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  startDate: string;
  workType: string;
  company: string;
  avatar?: string;
}

export default function EmployeesScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sortType, setSortType] = useState('Alfabetik');
  const [filterType, setFilterType] = useState('Tüm Çalışanlar');
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number;
    name: string;
    position: { x: number; y: number };
  } | null>(null);
  const { user } = useAuth();

  const employees: Employee[] = [
    {
      id: 1,
      name: 'Abba Jaxson Lipshutz',
      position: 'Management Trainee',
      department: 'Yönetim',
      startDate: '31 Aralık 2023',
      workType: 'Tam Zamanlı',
      company: 'Artı365 Danışmanlık',
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      position: 'İK Uzmanı',
      department: 'İnsan Kaynakları',
      startDate: '15 Ocak 2023',
      workType: 'Tam Zamanlı',
      company: 'Artı365 Danışmanlık',
    },
    {
      id: 3,
      name: 'Dabba Jaxson Lipshutz',
      position: 'Management Trainee',
      department: 'Yönetim',
      startDate: '31 Aralık 2023',
      workType: 'Tam Zamanlı',
      company: 'Artı365 Danışmanlık',
    },
  ];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
    const firstLetter = employee.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(employee);
    return groups;
  }, {} as Record<string, Employee[]>);

  const sortedGroups = Object.keys(groupedEmployees).sort();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <UsersIcon size={20} color="#666" />
          <Text style={styles.sectionTitle}>ÇALIŞANLAR</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
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
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <UsersIcon size={24} color="#666" />
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

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Text style={styles.filterButtonText}>{sortType}</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Text style={styles.filterButtonText}>{filterType}</Text>
            <ChevronDown size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedGroups.map((letter) => (
          <View key={letter} style={styles.groupContainer}>
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>{letter}</Text>
            </View>
            {groupedEmployees[letter].map((employee) => (
              <View key={employee.id} style={styles.employeeCard}>
                <View style={styles.avatar}>
                  {employee.avatar ? (
                    <Image source={{ uri: employee.avatar }} style={styles.avatarImage} />
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
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <View style={styles.infoRow}>
                    <Briefcase size={14} color="#666" />
                    <Text style={styles.infoText}>{employee.position}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.infoText}>{employee.startDate}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.infoText}>{employee.workType}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Building2 size={14} color="#666" />
                    <Text style={styles.infoText}>{employee.company}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {selectedEmployee && (
        <EmployeeDropdown
          visible={dropdownVisible}
          onClose={() => {
            setDropdownVisible(false);
            setSelectedEmployee(null);
          }}
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          position={selectedEmployee.position}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
