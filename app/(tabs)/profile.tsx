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
  DollarSign,
  Bell,
  MessageSquare,
  Package,
  Download,
  Pencil,
  Umbrella,
  ChevronDown
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
    'İzin Bilgileri',
    'Çalışma Bilgileri',
    'Profil Bilgileri',
    'Zimmet Bilgileri',
  ];

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedType, setSelectedType] = useState('Tümü');

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

        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>İzin Talebi Gir</Text>
        </TouchableOpacity>
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
            onPress={() => console.log('Download report')}
          >
            <Download size={18} color="#7C3AED" />
            <Text style={styles.downloadButtonText}>Zimmet Raporu İndir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => console.log('Add asset')}
          >
            <Text style={styles.addButtonText}>Zimmet Ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetCard}>
          <View style={styles.assetCardHeader}>
            <Text style={styles.assetCardTitle}>Bilgisayar</Text>
            <TouchableOpacity
              style={styles.assetEditButton}
              onPress={() => handleEdit('asset-1')}
            >
              <Pencil size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <InfoRow label="Açıklama" value="M3 Macbook Pro 2023" />
          <InfoRow label="Seri No" value="123131637ABJ1" />
          <InfoRow label="Teslim Tarihi" value="09.12.2024" isLast />
        </View>

        <View style={styles.assetCard}>
          <View style={styles.assetCardHeader}>
            <Text style={styles.assetCardTitle}>Cep Telefonu</Text>
            <TouchableOpacity
              style={styles.assetEditButton}
              onPress={() => handleEdit('asset-2')}
            >
              <Pencil size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <InfoRow label="Açıklama" value="iPhone 16" />
          <InfoRow label="Seri No" value="89781637ABJ1" />
          <InfoRow label="Teslim Tarihi" value="10.08.2020" isLast />
        </View>

        <View style={[styles.assetCard, styles.assetCardInactive]}>
          <View style={styles.assetCardHeader}>
            <Text style={[styles.assetCardTitle, styles.assetCardInactiveText]}>
              Telefon
            </Text>
            <TouchableOpacity
              style={styles.assetEditButton}
              onPress={() => handleEdit('asset-3')}
            >
              <Pencil size={16} color="#CCC" />
            </TouchableOpacity>
          </View>
          <InfoRow label="Açıklama" value="Blackberry" />
          <InfoRow label="Seri No" value="2423AAA112" />
          <InfoRow label="Teslim Tarihi" value="01.01.2019" />
          <InfoRow label="İade Tarihi" value="10.08.2020" isLast />
        </View>
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
      </Accordion>
    </>
  );

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'İzin Bilgileri':
        return renderDayOffSection();
      case 'Çalışma Bilgileri':
        return renderWorkInfoSection();
      case 'Profil Bilgileri':
        return renderProfileInfoSection();
      case 'Zimmet Bilgileri':
        return renderAssetsSection();
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
    opacity: 0.5,
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
  assetCardInactiveText: {
    color: '#999',
  },
  assetEditButton: {
    padding: 4,
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
});
