import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  FileText,
  Award,
  Globe,
  Languages,
  CreditCard,
  LogOut,
  Menu,
  Building2,
  Users2,
  DollarSign
} from 'lucide-react-native';
import { Accordion } from '@/components/Accordion';
import { InfoRow } from '@/components/InfoRow';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { WorkInfoCard } from '@/components/WorkInfoCard';
import { DrawerMenu } from '@/components/DrawerMenu';
import {
  formatGender,
  formatBloodType,
  formatMaritalStatus,
  formatDate,
  formatPhone
} from '@/utils/formatters';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Çalışma Bilgileri');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleEdit = (section: string) => {
    console.log('Edit section:', section);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const profileSections = [
    'Çalışma Bilgileri',
    'Profil Bilgileri',
    'İletişim Bilgileri',
    'Eğitim ve Deneyim',
  ];

  const renderWorkInfoSection = () => (
    <>
      <Accordion
        title="ÇALIŞAN BİLGİLERİ"
        icon={<UserIcon size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <InfoRow label="İşe Giriş Tarihi" value="05.09.2012" />
        <InfoRow label="Çalışma Şekli" value="Tam Zamanlı" isLast />
      </Accordion>

      <Accordion
        title="POZİSYON BİLGİLERİ"
        icon={<Briefcase size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <WorkInfoCard
          title="Şube Müdürü"
          details={[
            { label: 'Tarih', value: '05.09.2021' },
            { label: 'Departman', value: 'Banka Yönetimi' },
            { label: 'İş Yeri', value: 'İstanbul (ANB.)' },
            { label: 'Konum', value: 'Altunizade' },
            { label: 'Yönetici', value: 'Selim Yücesoy', isHighlight: true },
          ]}
          onEdit={() => handleEdit('position-current')}
        />

        <WorkInfoCard
          title="Kredi Puanlama Yetkilisi"
          details={[
            { label: 'Tarih', value: '05.09.2020' },
            { label: 'Departman', value: 'Kredi Departmanı' },
            { label: 'İş Yeri', value: 'İstanbul (AVR.)' },
            { label: 'Konum', value: 'Galata' },
            { label: 'Yönetici', value: 'Mert Gözüdağ', isHighlight: true },
          ]}
          onEdit={() => handleEdit('position-past')}
          isPast
        />
      </Accordion>

      <Accordion
        title="MAAŞ BİLGİLERİ"
        icon={<DollarSign size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <WorkInfoCard
          title="80.000 ₺"
          details={[
            { label: 'Tarih', value: '05.09.2021' },
            { label: 'Güncelleme Nedeni', value: 'Terfi' },
          ]}
          onEdit={() => handleEdit('salary-current')}
        />

        <WorkInfoCard
          title="50.000 ₺"
          details={[
            { label: 'Tarih', value: '05.09.2020' },
            { label: 'Güncelleme Nedeni', value: 'Terfi' },
          ]}
          onEdit={() => handleEdit('salary-past')}
          isPast
        />
      </Accordion>

      <Accordion
        title="BAĞLI ÇALIŞANLAR"
        icon={<Users2 size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <WorkInfoCard
          title="Görkem Çağlayan"
          details={[
            { label: 'Ünvanı', value: 'Pazarlama Direktörü' },
            { label: 'İşe Giriş Tarihi', value: '12.10.2020' },
          ]}
          onEdit={() => handleEdit('employee-1')}
        />

        <WorkInfoCard
          title="Melisa Toköz"
          details={[
            { label: 'Ünvanı', value: 'Dijital Pazarlama Müdürü' },
            { label: 'İşe Giriş Tarihi', value: '12.10.2021' },
          ]}
          onEdit={() => handleEdit('employee-2')}
        />
      </Accordion>
    </>
  );

  const renderProfileInfoSection = () => (
    <>
      <Accordion
        title="PROFİL BİLGİLERİ"
        icon={<UserIcon size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('profile')}
      >
        <InfoRow label="Personel No" value={user.personalNumber || user.id} />
        <InfoRow label="TCKN" value={user.identityNumber} />
        <InfoRow label="Telefon" value={formatPhone(user.phone)} />
        <InfoRow label="Adı Soyadı" value={`${user.firstName} ${user.lastName}`} />
        <InfoRow label="Doğum Yeri" value={user.birthPlace} />
        <InfoRow label="Doğum Tarihi" value={formatDate(user.birthDate)} />
        <InfoRow label="Cinsiyet" value={formatGender(user.gender)} />
        <InfoRow label="Medeni Hal" value={formatMaritalStatus(user.maritalStatus)} isLast />
      </Accordion>
    </>
  );

  const renderContactInfoSection = () => (
    <>
      <Accordion
        title="İLETİŞİM BİLGİLERİ"
        icon={<Phone size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('contact')}
      >
        <InfoRow label="İç Hat Telefon" value={user.workPhone} />
        <InfoRow label="Cep Telefonu" value={formatPhone(user.mobilePhone || user.phone)} />
        <InfoRow label="E-Posta" value={user.email} />
        <InfoRow label="İl" value={user.city} />
        <InfoRow label="Ülke" value={user.country} />
        <InfoRow label="Adres" value={user.address} isLast />
      </Accordion>
    </>
  );

  const renderEducationSection = () => (
    <>
      <Accordion
        title="EĞİTİM BİLGİLERİ"
        icon={<GraduationCap size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('education')}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz eğitim bilgisi eklenmemiş</Text>
        </View>
      </Accordion>

      <Accordion
        title="DENEYİM BİLGİLERİ"
        icon={<Briefcase size={18} color="#7C3AED" />}
        onEdit={() => handleEdit('experience')}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz deneyim bilgisi eklenmemiş</Text>
        </View>
      </Accordion>
    </>
  );

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'Çalışma Bilgileri':
        return renderWorkInfoSection();
      case 'Profil Bilgileri':
        return renderProfileInfoSection();
      case 'İletişim Bilgileri':
        return renderContactInfoSection();
      case 'Eğitim ve Deneyim':
        return renderEducationSection();
      default:
        return renderWorkInfoSection();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerVisible(true)}
          >
            <Menu size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>hero</Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>+</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              {user.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <UserIcon size={48} color="#7C3AED" />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user.firstName} {user.lastName}
              </Text>

              <View style={styles.profileDetails}>
                <View style={styles.profileDetailRow}>
                  <Briefcase size={16} color="#666" />
                  <Text style={styles.profileDetailText}>
                    {user.position || 'Management Trainee'}
                  </Text>
                </View>
                <View style={styles.profileDetailRow}>
                  <Building2 size={16} color="#666" />
                  <Text style={styles.profileDetailText}>Art365 Danışmanlık</Text>
                </View>
              </View>
            </View>
          </View>

          <ProfileDropdown
            options={profileSections}
            selectedOption={selectedSection}
            onSelect={setSelectedSection}
          />

          <View style={styles.sectionsContainer}>
            {renderSectionContent()}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  logoBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 6,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDetailText: {
    fontSize: 14,
    color: '#666',
  },
  sectionsContainer: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
