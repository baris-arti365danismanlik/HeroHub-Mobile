import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Menu, Search, Users as UsersIcon, MoreVertical } from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { EmployeeDropdown } from '@/components/EmployeeDropdown';
import { useAuth } from '@/contexts/AuthContext';

export default function EmployeesScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number;
    name: string;
    position: { x: number; y: number };
  } | null>(null);
  const { user } = useAuth();

  const employees = [
    { id: 1, name: 'Selin Yeşilce', position: 'Management Trainee', department: 'Yönetim' },
    { id: 2, name: 'Mert Gözüdağ', position: 'Yazılım Geliştirici', department: 'Teknoloji' },
    { id: 3, name: 'Selim Yücesoy', position: 'Proje Yöneticisi', department: 'Yönetim' },
    { id: 4, name: 'Ayşe Demir', position: 'İK Uzmanı', department: 'İnsan Kaynakları' },
    { id: 5, name: 'Mehmet Kaya', position: 'Satış Müdürü', department: 'Satış' },
  ];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setDrawerVisible(true)}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Menu size={24} color="#7C3AED" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Çalışanlar</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Çalışan ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <UsersIcon size={24} color="#7C3AED" />
            <Text style={styles.statNumber}>{employees.length}</Text>
            <Text style={styles.statLabel}>Toplam Çalışan</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {filteredEmployees.map((employee) => (
            <View key={employee.id} style={styles.employeeCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                <Text style={styles.employeePosition}>{employee.position}</Text>
                <Text style={styles.employeeDepartment}>{employee.department}</Text>
              </View>
              <TouchableOpacity
                style={styles.moreButton}
                activeOpacity={0.7}
                onPress={(e) => {
                  const target = e.nativeEvent;
                  setSelectedEmployee({
                    id: employee.id,
                    name: employee.name,
                    position: { x: target.pageX, y: target.pageY },
                  });
                  setDropdownVisible(true);
                }}
              >
                <MoreVertical size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    gap: 12,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
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
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 12,
    color: '#999',
  },
});
