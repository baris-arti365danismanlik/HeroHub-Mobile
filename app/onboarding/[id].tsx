import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Circle,
  Send,
  Trash2,
  Plus,
  ChevronUp,
  Bell,
} from 'lucide-react-native';
import { onboardingService } from '@/services/onboarding.service';
import {
  OnboardingTask,
  OnboardingQuestion,
  UserOnboarding,
  UserOnboardingStep,
  UserOnboardingTask,
} from '@/types/backend';

export default function OnboardingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [questionsExpanded, setQuestionsExpanded] = useState(true);

  const [userOnboarding, setUserOnboarding] = useState<UserOnboarding | null>(null);
  const [steps, setSteps] = useState<UserOnboardingStep[]>([]);
  const [tasks, setTasks] = useState<UserOnboardingTask[]>([]);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [questionStates, setQuestionStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const demoSteps: UserOnboardingStep[] = [
        {
          id: '1',
          user_onboarding_id: id,
          step_id: '1',
          is_completed: true,
          completed_at: '2024-08-22T10:00:00Z',
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '1',
            title: 'Hoşgeldin Paketi Gönderildi',
            order: 1,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '2',
          user_onboarding_id: id,
          step_id: '2',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '2',
            title: 'Hoşgeldin Paketi Görüntülendi',
            order: 2,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '3',
          user_onboarding_id: id,
          step_id: '3',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '3',
            title: 'Yeni Çalışan Bilgileri Dolduruldu',
            order: 3,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '4',
          user_onboarding_id: id,
          step_id: '4',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '4',
            title: 'Tanışma Soruları Cevaplandı',
            order: 4,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '5',
          user_onboarding_id: id,
          step_id: '5',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '5',
            title: 'İşe Başlama Görevleri Tamamlandı',
            order: 5,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '6',
          user_onboarding_id: id,
          step_id: '6',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          step: {
            id: '6',
            title: 'Hoşgeldin Görevleri Tamamlandı',
            order: 6,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
      ];

      const demoTasks: UserOnboardingTask[] = [
        {
          id: '1',
          user_onboarding_id: id,
          task_id: '1',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          task: {
            id: '1',
            title: 'E-posta adresi oluştur',
            description: 'Yeni çalışan için kurumsal e-posta adresi oluştur',
            assigned_to: 'Phillip Stanton',
            due_date: '2025-11-13',
            order: 1,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '2',
          user_onboarding_id: id,
          task_id: '2',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          task: {
            id: '2',
            title: 'Çalışma ortamını ayarla',
            description: 'Bilgisayar ve gerekli yazılımları kur',
            assigned_to: 'Tianna Rosser',
            due_date: '2025-12-11',
            order: 2,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '3',
          user_onboarding_id: id,
          task_id: '3',
          is_completed: true,
          completed_at: '2024-11-10T10:00:00Z',
          created_at: '2024-08-22T10:00:00Z',
          task: {
            id: '3',
            title: 'Telefon eklentisi kur',
            description: 'Dahili telefon sistemi kurulumu',
            assigned_to: 'Maria Carder',
            due_date: '2025-12-11',
            order: 3,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
        {
          id: '4',
          user_onboarding_id: id,
          task_id: '4',
          is_completed: false,
          created_at: '2024-08-22T10:00:00Z',
          task: {
            id: '4',
            title: 'Yeni işe giriş oryantasyonu',
            description: 'Şirket kültürü ve değerleri tanıtımı',
            assigned_to: 'Phillip Stanton',
            due_date: '2025-11-13',
            order: 4,
            is_active: true,
            created_at: '2024-08-22T10:00:00Z',
          },
        },
      ];

      const demoQuestions: OnboardingQuestion[] = [
        {
          id: '1',
          question: 'Nerede büyüdün?',
          is_required: false,
          order: 1,
          is_active: true,
          created_at: '2024-08-22T10:00:00Z',
        },
        {
          id: '2',
          question: 'Nerede yaşıyorsun?',
          is_required: true,
          order: 2,
          is_active: true,
          created_at: '2024-08-22T10:00:00Z',
        },
      ];

      setSteps(demoSteps);
      setTasks(demoTasks);
      setQuestions(demoQuestions);

      const initialStates: { [key: string]: boolean } = {};
      demoQuestions.forEach((q) => {
        initialStates[q.id] = q.is_required;
      });
      setQuestionStates(initialStates);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await onboardingService.completeTask(taskId);
      await loadData();
    } catch (error) {
    }
  };

  const handleResend = async () => {
    if (userOnboarding) {
      await onboardingService.updateWelcomePackage(userOnboarding.id, true);
      await loadData();
    }
  };

  const handleCancel = () => {
    router.back();
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/120x40/7C3AED/FFFFFF?text=hero' }}
          style={styles.logo}
        />
        <View style={styles.headerIcons}>
          <View style={styles.iconButton}>
            <View style={styles.iconDot} />
          </View>
          <View style={styles.iconButton}>
            <View style={styles.iconDot} />
          </View>
          <View style={styles.iconButton}>
            <View style={styles.iconDot} />
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.employeeCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }}
            style={styles.employeePhoto}
          />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>Selin Yeşilce</Text>
            <View style={styles.employeeDetail}>
              <View style={styles.detailIcon} />
              <Text style={styles.detailText}>Management Trainee</Text>
            </View>
            <View style={styles.employeeDetail}>
              <View style={styles.detailIcon} />
              <Text style={styles.detailText}>Ant365 Danışmanlık</Text>
            </View>
          </View>
        </View>

        <View style={styles.dropdownCard}>
          <Text style={styles.dropdownLabel}>İşe Başlama</Text>
          <ChevronDown size={20} color="#666" />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>İŞE BAŞLAMA (ONBOARDING)</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
              <Text style={styles.resendButtonText}>Tekrar Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeline}>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  {step.is_completed ? (
                    <CheckCircle2 size={24} color="#10B981" />
                  ) : (
                    <View style={styles.timelineNumber}>
                      <Text style={styles.timelineNumberText}>{index + 1}</Text>
                    </View>
                  )}
                  {index < steps.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      step.is_completed && styles.timelineTitleCompleted,
                    ]}
                  >
                    {step.step?.title}
                  </Text>
                  {step.completed_at && (
                    <Text style={styles.timelineDate}>
                      {new Date(step.completed_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.accordionSection}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setTasksExpanded(!tasksExpanded)}
          >
            <View style={styles.accordionTitleRow}>
              <View style={styles.accordionIcon} />
              <Text style={styles.accordionTitle}>İŞE BAŞLAMA GÖREVLERİ</Text>
            </View>
            {tasksExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </TouchableOpacity>

          {tasksExpanded && (
            <View style={styles.accordionContent}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>Bilgi Teknolojileri</Text>
              </View>

              {tasks.slice(0, 3).map((userTask) => (
                <View key={userTask.id} style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{userTask.task?.title}</Text>
                  </View>
                  <View style={styles.taskRow}>
                    <Text style={styles.taskLabel}>İlgili</Text>
                    <Text style={styles.taskValue}>
                      {userTask.task?.assigned_to || 'Atanmamış'}
                    </Text>
                  </View>
                  <View style={styles.taskRow}>
                    <Text style={styles.taskLabel}>Son Tarih</Text>
                    <Text
                      style={[
                        styles.taskValue,
                        userTask.is_completed && styles.taskValueCompleted,
                      ]}
                    >
                      {userTask.task?.due_date
                        ? new Date(userTask.task.due_date).toLocaleDateString('tr-TR')
                        : '-'}
                    </Text>
                  </View>
                  {userTask.is_completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Tamamlandı</Text>
                    </View>
                  ) : (
                    <View style={styles.taskButtonRow}>
                      <TouchableOpacity
                        style={styles.completeTaskButton}
                        onPress={() => handleCompleteTask(userTask.id)}
                      >
                        <Text style={styles.completeTaskButtonText}>Görevi Tamamla</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {}}
                      >
                        <Bell size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}

              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>İnsan Kaynakları</Text>
              </View>

              {tasks.slice(3).map((userTask) => (
                <View key={userTask.id} style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{userTask.task?.title}</Text>
                  </View>
                  <View style={styles.taskRow}>
                    <Text style={styles.taskLabel}>İlgili</Text>
                    <Text style={styles.taskValue}>
                      {userTask.task?.assigned_to || 'Atanmamış'}
                    </Text>
                  </View>
                  <View style={styles.taskRow}>
                    <Text style={styles.taskLabel}>Son Tarih</Text>
                    <Text
                      style={[
                        styles.taskValue,
                        userTask.is_completed && styles.taskValueCompleted,
                      ]}
                    >
                      {userTask.task?.due_date
                        ? new Date(userTask.task.due_date).toLocaleDateString('tr-TR')
                        : '-'}
                    </Text>
                  </View>
                  {userTask.is_completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Tamamlandı</Text>
                    </View>
                  ) : (
                    <View style={styles.taskButtonRow}>
                      <TouchableOpacity
                        style={styles.completeTaskButton}
                        onPress={() => handleCompleteTask(userTask.id)}
                      >
                        <Text style={styles.completeTaskButtonText}>Görevi Tamamla</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {}}
                      >
                        <Bell size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.accordionSection}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setQuestionsExpanded(!questionsExpanded)}
          >
            <View style={styles.accordionTitleRow}>
              <View style={styles.accordionIcon} />
              <Text style={styles.accordionTitle}>SENİ TANIYALIM</Text>
            </View>
            {questionsExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </TouchableOpacity>

          {questionsExpanded && (
            <View style={styles.accordionContent}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>Seni Tanıyalım Soruları</Text>
              </View>

              {questions.map((question) => (
                <View key={question.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionText}>{question.question}</Text>
                  </View>
                  <View style={styles.questionFooter}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() =>
                        setQuestionStates({
                          ...questionStates,
                          [question.id]: !questionStates[question.id],
                        })
                      }
                    >
                      {questionStates[question.id] && <View style={styles.checkboxChecked} />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>Zorunlu Soru</Text>
                    <TouchableOpacity style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addQuestionButton}>
                <Text style={styles.addQuestionButtonText}>Soru Ekle</Text>
                <Send size={16} color="#7C3AED" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.sendEmailButton}>
                <Text style={styles.sendEmailButtonText}>Seni Tanıyalım E-postası Gönder</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    padding: 8,
  },
  logo: {
    width: 80,
    height: 32,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  employeeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  employeePhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  employeeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  resendButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    minHeight: 32,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  timelineTitleCompleted: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
  },
  accordionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  accordionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  accordionContent: {
    padding: 16,
  },
  categoryHeader: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  taskCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskLabel: {
    fontSize: 13,
    color: '#666',
  },
  taskValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  taskValueCompleted: {
    color: '#DC2626',
  },
  taskButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  completeTaskButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  completeTaskButtonText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  questionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  addQuestionButtonText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  sendEmailButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendEmailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
