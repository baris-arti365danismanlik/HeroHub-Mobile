import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface VisaPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: () => void;
  data: {
    userName: string;
    userTitle: string;
    visaType: string;
    countryName: string;
    cityName: string;
    entryDate: string;
    exitDate: string;
    notes: string;
  };
}

export function VisaPreviewModal({ visible, onClose, onSend, data }: VisaPreviewModalProps) {
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('/').map(p => p.trim());
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${day}.${month}.${year}`;
    }
    return dateStr;
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Evrak Önizleme</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.letterHeader}>
              <Text style={styles.letterTitle}>{data.countryName.toUpperCase()} KONSOLOSLUĞU'NA,</Text>
              <Text style={styles.letterDate}>{getTodayDate()}</Text>
            </View>

            <Text style={styles.letterLocation}>{data.cityName}, Türkiye</Text>

            <View style={styles.letterSubject}>
              <Text style={styles.boldText}>Konu: </Text>
              <Text style={styles.normalText}>Vize İşyeri İzin Yazısı</Text>
            </View>

            <Text style={styles.normalText}>Sayın ilgili,</Text>

            <View style={styles.letterBody}>
              <Text style={styles.normalText}>
                Şirketimizde <Text style={styles.italicText}>(01.01.0001)</Text> tarihinden itibaren{' '}
                <Text style={styles.boldText}>{data.userTitle || '-Bilinmiyor-'}</Text> olarak görev yapan{' '}
                pasaport numaralı Sayın <Text style={styles.boldText}>{data.userName}</Text>,{' '}
                <Text style={styles.boldText}>{formatDate(data.entryDate)} - {formatDate(data.exitDate)}</Text> tarihleri arasında ülkenize seyahat edecektir.
              </Text>

              <Text style={styles.normalText}>
                Sayın <Text style={styles.boldText}>{data.userName}</Text> ülkeniz de bulunacağı süre zarfında ulaşım, konaklama, sağlık vb. tüm seyahat masrafları kendisi tarafından karşılanacaktır. Sayın <Text style={styles.boldText}>{data.userName}</Text> seyahat dönüşü şirketimizdeki görevine devam edecektir.
              </Text>

              <Text style={styles.normalText}>
                Vize islem sürecinde çalışanımıza uzun süreli ve çok girişli vize vermeniz konusunda nazik yardımlarınızı rica ederiz.
              </Text>
            </View>

            <View style={styles.letterFooter}>
              <Text style={styles.normalText}>Saygılarımızla,</Text>
              <Text style={styles.normalText}>Yönetim Kurulu Başkanı</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backButtonText}>Geri Dön</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
              <Text style={styles.sendButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  letterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  letterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  letterDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  letterLocation: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  letterSubject: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  boldText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  normalText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 21,
  },
  italicText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1a1a1a',
  },
  letterBody: {
    gap: 16,
    marginTop: 16,
  },
  letterFooter: {
    alignItems: 'flex-end',
    marginTop: 24,
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  sendButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
