import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import {
  Menu,
  Bell,
  MessageSquare,
  User as UserIcon,
  Briefcase,
  Building2,
  Package,
  Download,
  Plus,
} from 'lucide-react-native';
import { DrawerMenu } from '@/components/DrawerMenu';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Accordion } from '@/components/Accordion';
import { AssetCard } from '@/components/AssetCard';

export default function AssetsScreen() {
  const { user } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Zimmet Bilgileri');

  if (!user) {
    return null;
  }

  const sections = ['Zimmet Bilgileri'];

  const handleEdit = (assetId: string) => {
    console.log('Edit asset:', assetId);
  };

  const handleDownloadReport = () => {
    console.log('Download asset report');
  };

  const handleAddAsset = () => {
    console.log('Add new asset');
  };

  const renderAssetsSection = () => (
    <>
      <Accordion
        title="ZİMMET BİLGİLERİ"
        icon={<Package size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadReport}
          >
            <Download size={18} color="#7C3AED" />
            <Text style={styles.downloadButtonText}>Zimmet Raporu İndir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleAddAsset}>
            <Text style={styles.addButtonText}>Zimmet Ekle</Text>
          </TouchableOpacity>
        </View>

        <AssetCard
          title="Bilgisayar"
          details={[
            { label: 'Açıklama', value: 'M3 Macbook Pro 2023' },
            { label: 'Seri No', value: '123131637ABJ1' },
            { label: 'Teslim Tarihi', value: '09.12.2024' },
          ]}
          onEdit={() => handleEdit('computer-1')}
        />

        <AssetCard
          title="Cep Telefonu"
          details={[
            { label: 'Açıklama', value: 'iPhone 16' },
            { label: 'Seri No', value: '89781637ABJ1' },
            { label: 'Teslim Tarihi', value: '10.08.2020' },
          ]}
          onEdit={() => handleEdit('phone-1')}
        />

        <AssetCard
          title="Telefon"
          details={[
            { label: 'Açıklama', value: 'Blackberry' },
            { label: 'Seri No', value: '2423AAA112' },
            { label: 'Teslim Tarihi', value: '01.01.2019' },
            { label: 'İade Tarihi', value: '10.08.2020' },
          ]}
          onEdit={() => handleEdit('phone-2')}
          isInactive
        />
      </Accordion>
    </>
  );

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

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color="#1a1a1a" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <MessageSquare size={20} color="#1a1a1a" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>12</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton}>
              {user.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.headerProfileImage}
                />
              ) : (
                <View style={styles.headerProfilePlaceholder}>
                  <UserIcon size={20} color="#7C3AED" />
                </View>
              )}
            </TouchableOpacity>
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
                  <Text style={styles.profileDetailText}>
                    Art365 Danışmanlık
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <ProfileDropdown
            options={sections}
            selectedOption={selectedSection}
            onSelect={setSelectedSection}
          />

          <View style={styles.sectionsContainer}>{renderAssetsSection()}</View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuButton: {
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -35,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 4,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerProfilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
