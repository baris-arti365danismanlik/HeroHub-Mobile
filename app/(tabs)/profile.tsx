import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
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
  DollarSign,
  Bell,
  MessageSquare,
  Package,
  Download,
  Pencil,
  Umbrella,
  ChevronDown,
  Folder,
  File,
  Search,
  Plus,
  Share2,
  ChevronRight,
  FolderOpen,
  Calendar,
  X,
  AlignJustify,
  Linkedin,
  Facebook,
  Instagram,
  Clock,
  Smartphone
} from 'lucide-react-native';
import { Accordion } from '@/components/Accordion';
import { InfoRow } from '@/components/InfoRow';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { WorkInfoCard } from '@/components/WorkInfoCard';
import { assetService } from '@/services/asset.service';
import { Asset, AssetStatus } from '@/types/backend';
import { DrawerMenu } from '@/components/DrawerMenu';
import {
  formatGender,
  formatBloodType,
  formatMaritalStatus,
  formatDate,
  formatPhone
} from '@/utils/formatters';

export default function ProfileScreen() {
  const { user, logout, userProfile } = useAuth();
  const { canWrite, canDelete, isAdmin } = usePermissions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Özet');
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [assetForm, setAssetForm] = useState({
    category: 'Bilgisayar',
    serialNo: '',
    description: '',
    deliveryDate: '',
    returnDate: '',
  });
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [visaModalVisible, setVisaModalVisible] = useState(false);
  const [visaForm, setVisaForm] = useState({
    visaType: 'Turist/Turizm Vizesi',
    country: 'Hollanda',
    entryDate: '',
    exitDate: '',
    notes: '',
  });

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleEdit = (section: string) => {
    console.log('Edit section:', section);
  };

  useEffect(() => {
    if (user?.id) {
      loadAssets();
    }
  }, [user?.id]);

  const loadAssets = async () => {
    if (!user?.id) return;

    try {
      setAssetLoading(true);
      const data = await assetService.getUserAssets(user.id);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setAssetLoading(false);
    }
  };

  const handleAddAsset = async () => {
    if (!user?.id || !assetForm.serialNo || !assetForm.deliveryDate) {
      return;
    }

    try {
      setAssetLoading(true);

      await assetService.createAsset({
        user_id: user.id,
        category: assetForm.category,
        serial_no: assetForm.serialNo,
        description: assetForm.description,
        delivery_date: assetForm.deliveryDate,
        return_date: assetForm.returnDate || undefined,
        status: AssetStatus.Active,
      });

      setAssetForm({
        category: 'Bilgisayar',
        serialNo: '',
        description: '',
        deliveryDate: '',
        returnDate: '',
      });

      setAssetModalVisible(false);
      await loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
    } finally {
      setAssetLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const profileSections = [
    'Özet',
    'İzin Bilgileri',
    'Çalışma Bilgileri',
    'Profil Bilgileri',
    'Zimmet Bilgileri',
    'Dosyalar',
  ];

  const renderDayOffSection = () => (
    <>
      <Accordion
        title="İZİN BİLGİLERİ"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YILLIK İZİN</Text>
          <Text style={styles.balanceValue}>-4 Gün</Text>
        </View>

        {canWrite('Leave') && (
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.requestButtonText}>İzin Talebi Gir</Text>
          </TouchableOpacity>
        )}
      </Accordion>

      <Accordion
        title="PLANLANAN İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#7C3AED' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Yıllık İzin</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={styles.dayOffDaysText}>5 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#F59E0B' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Doğum Günü İzni</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={styles.dayOffDaysText}>1 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#F59E0B' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Karne Günü İzni</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={styles.dayOffDaysText}>0.5 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#7C3AED' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Yıllık İzin</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={styles.dayOffDaysText}>5 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>
      </Accordion>

      <Accordion
        title="GEÇMİŞ İZİNLER"
        icon={<Umbrella size={18} color="#7C3AED" />}
        defaultExpanded={true}
      >
        <View style={styles.filtersRow}>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>İzin Türü</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterDropdownText}>{selectedType}</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Yıl</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterDropdownText}>{selectedYear}</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#EF4444' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Yıllık İzin</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={[styles.dayOffDaysText, { color: '#EF4444' }]}>-5 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#EF4444' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Yıllık İzin</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={[styles.dayOffDaysText, { color: '#EF4444' }]}>-3 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>

        <View style={styles.dayOffItem}>
          <View style={[styles.dayOffLeftBorder, { backgroundColor: '#10B981' }]} />
          <View style={styles.dayOffContent}>
            <View style={styles.dayOffHeader}>
              <View style={styles.dayOffTitleRow}>
                <Umbrella size={16} color="#666" />
                <Text style={styles.dayOffType}>Yıllık İzin</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Edit')}>
                <Pencil size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dayOffDays}>
              <Text style={[styles.dayOffDaysText, { color: '#10B981' }]}>+14 Gün</Text>
            </View>
            <View style={styles.dayOffDates}>
              <Text style={styles.dayOffDateText}>05.09.2021 Pzt</Text>
              <Text style={styles.dayOffDateText}>26.10.2024 Pzt</Text>
            </View>
          </View>
        </View>
      </Accordion>
    </>
  );

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

  const calculateWorkDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    return `${years} yıl ${months} ay ${days} gün`;
  };

  const renderSummarySection = () => (
    <>
      <View style={styles.assetUserCard}>
        {user.profilePictureUrl ? (
          <Image
            source={{ uri: user.profilePictureUrl }}
            style={styles.assetUserImage}
          />
        ) : (
          <View style={styles.assetUserPlaceholder}>
            <UserIcon size={32} color="#7C3AED" />
          </View>
        )}
        <View style={styles.assetUserInfo}>
          <Text style={styles.assetUserName}>
            {user.firstName} {user.lastName}
          </Text>
          {userProfile?.role?.name && (
            <View style={styles.assetUserDetail}>
              <Briefcase size={14} color="#666" />
              <Text style={styles.assetUserDetailText}>{userProfile.role.name}</Text>
            </View>
          )}
          <View style={styles.assetUserDetail}>
            <Building2 size={14} color="#666" />
            <Text style={styles.assetUserDetailText}>Art365 Danışmanlık</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
          <View style={styles.contactItem}>
            <Phone size={20} color="#333" />
            <Text style={styles.contactText}>+90 530 234 76 54</Text>
          </View>

          <View style={styles.contactItem}>
            <Smartphone size={20} color="#333" />
            <Text style={styles.contactText}>+90 530 234 76 54</Text>
          </View>

          <View style={styles.contactItem}>
            <Mail size={20} color="#333" />
            <Text style={styles.contactText}>{user.email}</Text>
          </View>

          <View style={styles.socialMediaContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Linkedin size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Facebook size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Instagram size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.workInfoSection}>
            <Text style={styles.workInfoTitle}>İşe Başlama Tarihi</Text>
            <Text style={styles.workInfoDate}>10 Eylül 2021</Text>
            <Text style={styles.workInfoDuration}>3 yıl 2 ay 6 gün</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.summaryDetailItem}>
            <Briefcase size={20} color="#333" />
            <Text style={styles.summaryDetailText}>
              {userProfile?.role?.name || 'Management Trainee'}
            </Text>
          </View>

          <View style={styles.summaryDetailItem}>
            <Building2 size={20} color="#333" />
            <Text style={styles.summaryDetailText}>Art365 Danışmanlık</Text>
          </View>

          <View style={styles.summaryDetailItem}>
            <Clock size={20} color="#333" />
            <Text style={styles.summaryDetailText}>Tam Zamanlı</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.managerSection}>
            <Text style={styles.sectionTitle}>Yöneticisi</Text>
            <View style={styles.personItem}>
              <View style={styles.personAvatar}>
                <UserIcon size={20} color="#7C3AED" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>Gözde Onay</Text>
                <Text style={styles.personRole}>Pazarlama ve Ürün Direktörü</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>Ekip Arkadaşları</Text>
            {[
              { name: 'Justin Press', role: 'Ürün Uzmanı' },
              { name: 'Gretchen Vaccaro', role: 'İş Analisti' },
              { name: 'Jaylon Rosser', role: 'Ürün Müdürü' },
              { name: 'Tatiana Curtis', role: 'Pazarlama Elemanı' },
              { name: 'Jaydon Dorwart', role: 'Tedarikçi' },
            ].map((member, index, array) => (
              <View key={index} style={[styles.personItem, index === array.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.personAvatar}>
                  <UserIcon size={20} color="#7C3AED" />
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{member.name}</Text>
                  <Text style={styles.personRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
    </>
  );

  const renderAssetsSection = () => (
    <>
      <View style={styles.assetUserCard}>
        {user.profilePictureUrl ? (
          <Image
            source={{ uri: user.profilePictureUrl }}
            style={styles.assetUserImage}
          />
        ) : (
          <View style={styles.assetUserPlaceholder}>
            <UserIcon size={32} color="#7C3AED" />
          </View>
        )}
        <View style={styles.assetUserInfo}>
          <Text style={styles.assetUserName}>
            {user.firstName} {user.lastName}
          </Text>
          {userProfile?.role?.name && (
            <View style={styles.assetUserDetail}>
              <Briefcase size={14} color="#666" />
              <Text style={styles.assetUserDetailText}>{userProfile.role.name}</Text>
            </View>
          )}
          <View style={styles.assetUserDetail}>
            <Building2 size={14} color="#666" />
            <Text style={styles.assetUserDetailText}>Art365 Danışmanlık</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <AlignJustify size={18} color="#1a1a1a" />
        <Text style={styles.sectionHeaderTitle}>ZİMMET BİLGİLERİ</Text>
      </View>

      <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => console.log('Download report')}
          >
            <Download size={18} color="#7C3AED" />
            <Text style={styles.downloadButtonText}>Zimmet Raporu İndir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAssetModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Zimmet Ekle</Text>
          </TouchableOpacity>
        </View>

        {assetLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#7C3AED" />
          </View>
        ) : assets.length > 0 ? (
          assets.map((asset) => (
            <View
              key={asset.id}
              style={[
                styles.assetCardNew,
                asset.status === AssetStatus.Returned && styles.assetCardInactive,
              ]}
            >
              <View style={styles.assetCardNewHeader}>
                <Text
                  style={[
                    styles.assetCardNewTitle,
                    asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                  ]}
                >
                  {asset.category}
                </Text>
                <TouchableOpacity
                  style={styles.assetEditButton}
                  onPress={() => handleEdit(`asset-${asset.id}`)}
                >
                  <Pencil
                    size={18}
                    color={asset.status === AssetStatus.Returned ? '#CCC' : '#666'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.assetCardBody}>
                {asset.description && (
                  <View style={styles.assetInfoRow}>
                    <Text style={styles.assetInfoLabel}>Açıklama</Text>
                    <Text
                      style={[
                        styles.assetInfoValue,
                        asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                      ]}
                    >
                      {asset.description}
                    </Text>
                  </View>
                )}

                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Seri No</Text>
                  <Text
                    style={[
                      styles.assetInfoValue,
                      asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                    ]}
                  >
                    {asset.serial_no}
                  </Text>
                </View>

                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Teslim Tarihi</Text>
                  <Text
                    style={[
                      styles.assetInfoValue,
                      asset.status === AssetStatus.Returned && styles.assetCardInactiveText,
                    ]}
                  >
                    {new Date(asset.delivery_date).toLocaleDateString('tr-TR')}
                  </Text>
                </View>

                {asset.return_date && (
                  <View style={styles.assetInfoRow}>
                    <Text style={styles.assetInfoLabel}>İade Tarihi</Text>
                    <Text style={[styles.assetInfoValue, styles.assetCardInactiveText]}>
                      {new Date(asset.return_date).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Henüz zimmet kaydı bulunmuyor</Text>
          </View>
        )}
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
        <InfoRow label="Personel No" value="1203354" />
        <InfoRow label="TCKN" value={user.identityNumber} />
        <InfoRow label="Adı Soyadı" value="Selin Yeşilce" />
        <InfoRow label="Doğum Yeri" value="Balıkesir" />
        <InfoRow label="Doğum Tarihi" value="12.10.1982" />
        <InfoRow label="Cinsiyet" value="Kadın" />
        <InfoRow label="Medeni Hal" value="Bekar" isLast />
      </Accordion>

      <Accordion
        title="İLETİŞİM BİLGİLERİ"
        icon={<Phone size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('contact')}
      >
        <InfoRow label="İç Hat Telefon" value="0 312 754 24 07" />
        <InfoRow label="Cep Telefonu" value="0 532 754 24 07" />
        <InfoRow label="Cep Telefonu" value="0 212 754 24 07" />
        <InfoRow label="İş E-Posta" value="selin.yesilce@gmail.com" />
        <InfoRow label="Diğer E-Posta" value="yesilce@gmail.com" isLast />
      </Accordion>

      <Accordion
        title="ADRES BİLGİLERİ"
        icon={<MapPin size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('address')}
      >
        <InfoRow label="Mahalle" value="Yaşadığı Evvel Mah. Mağ... Ne İle 33/2 P1/C 34870..." />
        <InfoRow label="İkamet" value="İstanbul" />
        <InfoRow label="Ülke" value="Türkiye" isLast />
      </Accordion>

      <Accordion
        title="EĞİTİM BİLGİLERİ"
        icon={<GraduationCap size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('education')}
      >
        <WorkInfoCard
          title="1. Eğitim"
          details={[
            { label: 'Bölüm', value: 'Kimya' },
            { label: 'Üniversite', value: 'İstanbul Üniversitesi' },
            { label: 'Başlangıç Tarihi', value: '01' },
          ]}
          onEdit={() => handleEdit('education-1')}
        />
        <WorkInfoCard
          title="2. Eğitim"
          details={[
            { label: 'Güneydoğu Tarihi', value: '12.30.2020' },
          ]}
          onEdit={() => handleEdit('education-2')}
        />
      </Accordion>

      <Accordion
        title="BANKA BİLGİLERİ"
        icon={<CreditCard size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('bank')}
      >
        <WorkInfoCard
          title="1. Banka"
          details={[
            { label: 'Banka Adı', value: 'Akbank' },
            { label: 'IBAN', value: 'TR63 0011 1000 0000 0084 5959 70' },
            { label: 'Hesap No', value: 'Türkiye Cumhuriyet' },
          ]}
          onEdit={() => handleEdit('bank-1')}
        />
        <WorkInfoCard
          title="2. Banka"
          details={[
            { label: 'Banka Adı', value: 'Akbank Ödenmesi' },
            { label: 'Hesap No', value: 'Yapılır' },
            { label: 'İban/TR', value: 'TR63 0011 1000 0000 0084 5959 70' },
          ]}
          onEdit={() => handleEdit('bank-2')}
        />
      </Accordion>

      <Accordion
        title="İŞ TECRÜBELERİ"
        icon={<Briefcase size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('experience')}
      >
        <WorkInfoCard
          title="Okan Abal"
          details={[
            { label: 'Görev', value: 'Satış Müdürü' },
            { label: 'İşe Giriş Tarihi', value: 'Orta Satış' },
            { label: 'İşten Ayrılma Nedeni', value: 'Farklı İlçede Yaşamak İstiyorum' },
          ]}
          onEdit={() => handleEdit('exp-1')}
        />
      </Accordion>

      <Accordion
        title="YETKİNLİKLER"
        icon={<Award size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('skills')}
      >
        <InfoRow label="Cinsiyet" value="218" isLast />
      </Accordion>

      <Accordion
        title="SOSYAL LİNKLER"
        icon={<Globe size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('social')}
      >
        <InfoRow label="Instagram" value="www.instagram.com/company" />
        <InfoRow label="Facebook" value="www.facebook.com/company" isLast />
      </Accordion>

      <Accordion
        title="DİL BİLGİLERİ"
        icon={<Languages size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('languages')}
      >
        <InfoRow label="Seviye" value="Orta Seviye" />
        <InfoRow label="Seviye" value="C1" isLast />
      </Accordion>

      <Accordion
        title="SERTİFİKALAR"
        icon={<Award size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('certificates')}
      >
        <WorkInfoCard
          title="Marketing Eğitimi"
          details={[
            { label: 'Bölge İl', value: 'Marketing Eğitimi' },
            { label: 'Almaya Tarihi', value: '12.12.2020' },
          ]}
          onEdit={() => handleEdit('cert-1')}
        />
      </Accordion>

      <Accordion
        title="PASAPORT BİLGİLERİ"
        icon={<CreditCard size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('passport')}
      >
        <WorkInfoCard
          title="1. Pasaport"
          details={[
            { label: 'Ülçesiyle Tarihi', value: '12.11.2017' },
            { label: 'Veriliş', value: 'Seri Referans İdentitesi' },
            { label: 'İşlem Tarihi', value: '11.08.2020' },
          ]}
          onEdit={() => handleEdit('passport-1')}
        />
        <WorkInfoCard
          title="2. Pasaport"
          details={[
            { label: 'Kimlik Tarihi', value: 'Permanent Resident' },
            { label: 'Veriliş Tarihi', value: '22.08.2021' },
            { label: 'Doğum Tarihi', value: '22.08.2025' },
            { label: 'İşlem Tarihi', value: 'Permanent Resident' },
            { label: 'Aylık Tarihi', value: '22.08.2025' },
            { label: 'Doğum', value: 'İsveçlik' },
            { label: 'Almak İçin', value: '11.08.2038' },
          ]}
          onEdit={() => handleEdit('passport-2')}
        />
      </Accordion>

      <Accordion
        title="VİZE BİLGİLERİ"
        icon={<FileText size={18} color="#7C3AED" />}
        defaultExpanded={true}
        onEdit={() => handleEdit('visa')}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz vize bilgisi eklenmemiş</Text>
        </View>
        <TouchableOpacity
          style={styles.visaRequestButton}
          onPress={() => setVisaModalVisible(true)}
        >
          <Text style={styles.visaRequestButtonText}>Vize Başvuru Evrak Talebi</Text>
        </TouchableOpacity>
      </Accordion>
    </>
  );

  const renderFilesSection = () => {
    const files = [
      { id: '1', name: 'Özlük Dosyaları', type: 'folder', count: 'Boş Klasör', icon: 'folder-blue' },
      { id: '2', name: 'İmzalı Belgeler', type: 'folder', count: '8 Dosya', icon: 'folder-blue' },
      { id: '3', name: 'Evrak Klasörüm', type: 'folder', count: '3 Dosya', icon: 'folder-yellow' },
      { id: '4', name: 'Lazım Olur', type: 'folder', count: 'Boş Klasör', icon: 'folder-yellow' },
      { id: '5', name: 'vize_evrak.docx', type: 'file', size: '15 kb', icon: 'doc' },
      { id: '6', name: 'vesikalik.jpeg', type: 'file', size: '423 kb', icon: 'image' },
      { id: '7', name: 'basvuru_dosya.pdf', type: 'file', size: '1.53 mb', icon: 'pdf' },
    ];

    const getFileIcon = (iconType: string) => {
      switch (iconType) {
        case 'folder-blue':
          return <FolderOpen size={24} color="#3B82F6" />;
        case 'folder-yellow':
          return <Folder size={24} color="#F59E0B" />;
        case 'doc':
          return <FileText size={24} color="#2563EB" />;
        case 'image':
          return <Package size={24} color="#10B981" />;
        case 'pdf':
          return <FileText size={24} color="#EF4444" />;
        default:
          return <File size={24} color="#666" />;
      }
    };

    return (
      <>
        <View style={styles.filesHeader}>
          <View style={styles.filesHeaderTop}>
            <View style={styles.filesTitle}>
              <Folder size={20} color="#7C3AED" />
              <Text style={styles.filesTitleText}>DOSYALAR</Text>
            </View>
            <View style={styles.filesActions}>
              <TouchableOpacity style={styles.filesActionButton}>
                <Plus size={20} color="#7C3AED" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filesActionButton}>
                <Share2 size={20} color="#7C3AED" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Belgelerin içinde ara..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.breadcrumb}>
            <TouchableOpacity>
              <Text style={styles.breadcrumbActive}>Çalışma Alanınız</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <Text style={styles.breadcrumbText}>...</Text>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.breadcrumbLink}>Yeni Klasör</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.breadcrumbText}>Son Klasör</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filesContainer}>
          {files.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.fileItem,
                index === files.length - 1 && styles.fileItemLast
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.fileItemLeft}>
                <View style={styles.fileItemDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.fileItemIcon}>
                  {getFileIcon(item.icon)}
                </View>
                <View style={styles.fileItemInfo}>
                  <Text style={styles.fileItemName}>{item.name}</Text>
                  <Text style={styles.fileItemMeta}>
                    {item.type === 'folder' ? item.count : item.size}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'Özet':
        return renderSummarySection();
      case 'İzin Bilgileri':
        return renderDayOffSection();
      case 'Çalışma Bilgileri':
        return renderWorkInfoSection();
      case 'Profil Bilgileri':
        return renderProfileInfoSection();
      case 'Zimmet Bilgileri':
        return renderAssetsSection();
      case 'Dosyalar':
        return renderFilesSection();
      default:
        return renderDayOffSection();
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
                {userProfile?.role && (
                  <View style={styles.profileDetailRow}>
                    <Award size={16} color="#7C3AED" />
                    <Text style={[styles.profileDetailText, { color: '#7C3AED', fontWeight: '600' }]}>
                      {userProfile.role.name}
                    </Text>
                  </View>
                )}
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

      <Modal
        visible={assetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAssetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Zimmet Ekle</Text>
              <TouchableOpacity
                onPress={() => setAssetModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalUserCard}>
                {user.profilePictureUrl ? (
                  <Image
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.modalUserImage}
                  />
                ) : (
                  <View style={styles.modalUserPlaceholder}>
                    <UserIcon size={24} color="#7C3AED" />
                  </View>
                )}
                <View style={styles.modalUserInfo}>
                  <Text style={styles.modalUserName}>{user.firstName} {user.lastName}</Text>
                  <Text style={styles.modalUserRole}>{userProfile?.position || 'Pozisyon'}</Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kategori</Text>
                <TouchableOpacity style={styles.formDropdown}>
                  <Text style={styles.formDropdownText}>{assetForm.category}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Seri No</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="123131637ABJ1"
                  value={assetForm.serialNo}
                  onChangeText={(text) => setAssetForm({...assetForm, serialNo: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Zimmet Açıklaması</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="M3 Macbook Pro 2023"
                  multiline
                  numberOfLines={4}
                  value={assetForm.description}
                  onChangeText={(text) => setAssetForm({...assetForm, description: text})}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Teslim Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={assetForm.deliveryDate}
                    onChangeText={(text) => setAssetForm({...assetForm, deliveryDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İade Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={assetForm.returnDate}
                    onChangeText={(text) => setAssetForm({...assetForm, returnDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.addFileButton}>
                <Text style={styles.addFileText}>Dosya Ekle</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setAssetModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleAddAsset}
                disabled={assetLoading}
              >
                {assetLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Devam Et</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vize Başvuru Evrak Talebi</Text>
              <TouchableOpacity
                onPress={() => setVisaModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Vize Türü</Text>
                <TouchableOpacity style={styles.formDropdown}>
                  <Text style={styles.formDropdownText}>{visaForm.visaType}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Başvurulacak Ülke</Text>
                <TouchableOpacity style={styles.formDropdown}>
                  <Text style={styles.formDropdownText}>{visaForm.country}</Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Giriş Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={visaForm.entryDate}
                    onChangeText={(text) => setVisaForm({...visaForm, entryDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Çıkış Tarihi</Text>
                <TouchableOpacity style={styles.formDatePicker}>
                  <TextInput
                    style={styles.formDateInput}
                    placeholder="12 / 23 / 2023"
                    value={visaForm.exitDate}
                    onChangeText={(text) => setVisaForm({...visaForm, exitDate: text})}
                  />
                  <Calendar size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Not</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Varsa iletmek istediği detayları çalışan bu alandan gönderebilir."
                  multiline
                  numberOfLines={4}
                  value={visaForm.notes}
                  onChangeText={(text) => setVisaForm({...visaForm, notes: text})}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setVisaModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={() => {
                  console.log('Vize başvurusu:', visaForm);
                  setVisaModalVisible(false);
                }}
              >
                <Text style={styles.modalSubmitText}>Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
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
  assetCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  assetCardInactive: {
    opacity: 0.6,
  },
  assetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  assetCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  assetCardNew: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  assetCardNewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assetCardNewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  assetCardBody: {
    paddingHorizontal: 16,
  },
  assetCardInactiveText: {
    color: '#CCC',
  },
  assetEditButton: {
    padding: 4,
  },
  assetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  assetInfoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  assetInfoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  balanceCard: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  requestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  dayOffItem: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dayOffLeftBorder: {
    width: 4,
  },
  dayOffContent: {
    flex: 1,
    padding: 12,
  },
  dayOffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayOffTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayOffType: {
    fontSize: 14,
    color: '#666',
  },
  dayOffDays: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dayOffDaysText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  dayOffDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayOffDateText: {
    fontSize: 13,
    color: '#666',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  filesHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filesHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filesTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  filesActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filesActionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 4,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  breadcrumbActive: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  breadcrumbLink: {
    fontSize: 13,
    color: '#7C3AED',
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#666',
  },
  breadcrumbSeparator: {
    fontSize: 13,
    color: '#CCC',
  },
  filesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fileItemLast: {
    borderBottomWidth: 0,
  },
  fileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileItemDots: {
    gap: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  fileItemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileItemInfo: {
    flex: 1,
  },
  fileItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  fileItemMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  modalUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalUserPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modalUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  modalUserRole: {
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formDropdownText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTextarea: {
    minHeight: 100,
    paddingTop: 14,
  },
  formDatePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formDateInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 0,
  },
  addFileButton: {
    marginBottom: 20,
  },
  addFileText: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  assetUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assetUserImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 16,
  },
  assetUserPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  assetUserInfo: {
    flex: 1,
  },
  assetUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  assetUserDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  assetUserDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  summaryContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  workInfoSection: {
    paddingVertical: 8,
  },
  workInfoTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 6,
  },
  workInfoDate: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  workInfoDuration: {
    fontSize: 13,
    color: '#666',
  },
  summaryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryDetailText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  managerSection: {
    paddingTop: 8,
  },
  teamSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 12,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 2,
  },
  personRole: {
    fontSize: 13,
    color: '#666',
  },
  visaRequestButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  visaRequestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
