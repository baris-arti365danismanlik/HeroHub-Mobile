import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Diamond, ChevronDown, X } from 'lucide-react-native';
import { onboardingService } from '@/services/onboarding.service';
import { OnboardingProcess, WelcomePackageForm } from '@/types/backend';
import { WelcomePackageModal } from './WelcomePackageModal';
import { SuccessModal } from './SuccessModal';

interface OnboardingDropdownProps {
  userId: number;
  organizationId: number;
}

export function OnboardingDropdown({ userId, organizationId }: OnboardingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [process, setProcess] = useState<OnboardingProcess | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOnboardingProcess();
    }
  }, [isOpen]);

  const loadOnboardingProcess = async () => {
    setLoading(true);
    try {
      const data = await onboardingService.getUserOnboardingProcess(userId);
      setProcess(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWelcomePackage = async () => {
    setWelcomeModalVisible(true);
  };

  const handleWelcomePackageSubmit = async (
    form: WelcomePackageForm
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await onboardingService.sendWelcomePackage(userId, form);
    if (result.success) {
      await loadOnboardingProcess();
      setSuccessModalVisible(true);
    } else {
      alert(result.error || 'Hoşgeldin paketi gönderilemedi');
    }
    return result;
  };

  const handleResend = async () => {
    setActionLoading(true);
    try {
      const result = await onboardingService.sendWelcomePackage(userId);
      if (result.success) {
        await loadOnboardingProcess();
        setSuccessModalVisible(true);
      } else {
        alert(result.error || 'Hoşgeldin paketi gönderilemedi');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const success = await onboardingService.cancelOnboarding(userId);
      if (success) {
        await loadOnboardingProcess();
        setIsOpen(false);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Hosgeldin Paketi Gönderildi',
      completed: process?.welcomePackageSent || false,
    },
    {
      number: 2,
      title: 'Hosgeldin Paketi Görüntülendi',
      completed: process?.welcomePackageViewed || false,
    },
    {
      number: 3,
      title: 'Yeni Çalışan Bilgileri Dolduruldu',
      completed: process?.employeeInfoFilled || false,
    },
    {
      number: 4,
      title: 'Tanışma Soruları Cevaplandı',
      completed: process?.introQuestionsAnswered || false,
    },
    {
      number: 5,
      title: 'İşe Başlama Görevleri Tamamlandı',
      completed: process?.tasksCompleted || false,
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}>
        <Diamond size={20} color="#6B46C1" strokeWidth={2} />
        <Text style={styles.dropdownButtonText}>İşe Başlama</Text>
        <ChevronDown
          size={20}
          color="#6B46C1"
          strokeWidth={2}
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
          }}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Diamond size={24} color="#6B46C1" strokeWidth={2} />
                <Text style={styles.modalTitle}>İŞE BAŞLAMA (ONBOARDING)</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <X size={24} color="#666" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6B46C1" />
                </View>
              ) : (
                <>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={handleSendWelcomePackage}
                      disabled={actionLoading}>
                      {actionLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>Hosgeldin Paketi Gönder</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={handleResend}
                      disabled={actionLoading}>
                      {actionLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>Tekrar Gönder</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.dangerButton]}
                      onPress={handleCancel}
                      disabled={actionLoading}>
                      {actionLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionButtonText}>İptal Et</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.timelineContainer}>
                    {steps.map((step, index) => (
                      <View key={step.number} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                          <View
                            style={[
                              styles.timelineCircle,
                              step.completed && styles.timelineCircleCompleted,
                            ]}>
                            <Text
                              style={[
                                styles.timelineNumber,
                                step.completed && styles.timelineNumberCompleted,
                              ]}>
                              {step.number}
                            </Text>
                          </View>
                          {index < steps.length - 1 && (
                            <View
                              style={[
                                styles.timelineLine,
                                steps[index + 1].completed && styles.timelineLineCompleted,
                              ]}
                            />
                          )}
                        </View>
                        <View style={styles.timelineRight}>
                          <Text
                            style={[
                              styles.timelineTitle,
                              step.completed && styles.timelineTitleCompleted,
                            ]}>
                            {step.title}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <WelcomePackageModal
        visible={welcomeModalVisible}
        onClose={() => setWelcomeModalVisible(false)}
        userId={userId}
        organizationId={organizationId}
        onSubmit={handleWelcomePackageSubmit}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Hoşgeldin Paketi"
        message="Hoşgeldin paketi başarıyla gönderildi"
      />
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#6B46C1',
  },
  secondaryButton: {
    backgroundColor: '#3B82F6',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  timelineContainer: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  timelineCircleCompleted: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  timelineNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  timelineNumberCompleted: {
    color: '#fff',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#6B46C1',
  },
  timelineRight: {
    flex: 1,
    paddingTop: 12,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 24,
  },
  timelineTitleCompleted: {
    color: '#1F2937',
    fontWeight: '600',
  },
});
