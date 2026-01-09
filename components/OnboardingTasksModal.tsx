import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Check, ChevronDown, ChevronUp } from 'lucide-react-native';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
  userTaskId?: number;
}

interface TaskCategory {
  id: number;
  name: string;
  tasks: Task[];
  isExpanded: boolean;
}

interface OnboardingTasksModalProps {
  visible: boolean;
  onClose: () => void;
  categories: TaskCategory[];
  onCompleteTask: (userTaskId: number) => Promise<void>;
}

export default function OnboardingTasksModal({
  visible,
  onClose,
  categories: initialCategories,
  onCompleteTask,
}: OnboardingTasksModalProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const toggleCategory = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const handleCompleteTask = async (userTaskId: number) => {
    try {
      setLoadingTaskId(userTaskId);
      await onCompleteTask(userTaskId);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
              <Text style={styles.title}>İŞE BAŞLAMA GÖREVLERİ</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ChevronUp size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.isExpanded ? (
                    <ChevronUp size={20} color="#666" />
                  ) : (
                    <ChevronDown size={20} color="#666" />
                  )}
                </TouchableOpacity>

                {category.isExpanded && (
                  <View style={styles.tasksContainer}>
                    {category.tasks.map((task) => (
                      <View key={task.id} style={styles.taskCard}>
                        <Text style={styles.taskTitle}>{task.title}</Text>

                        <View style={styles.taskInfo}>
                          <View style={styles.taskInfoRow}>
                            <Text style={styles.taskInfoLabel}>İlgili</Text>
                            <Text style={styles.taskInfoValue}>{task.assignedTo}</Text>
                          </View>
                          <View style={styles.taskInfoRow}>
                            <Text style={styles.taskInfoLabel}>Son Tarih</Text>
                            <Text
                              style={[
                                styles.taskInfoValue,
                                !task.isCompleted &&
                                  new Date(task.dueDate) < new Date() &&
                                  styles.taskInfoValueOverdue,
                              ]}
                            >
                              {formatDate(task.dueDate)}
                            </Text>
                          </View>
                        </View>

                        {task.isCompleted ? (
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedBadgeText}>Tamamlandı</Text>
                          </View>
                        ) : (
                          <View style={styles.taskActions}>
                            <TouchableOpacity
                              style={styles.completeButton}
                              onPress={() => task.userTaskId && handleCompleteTask(task.userTaskId)}
                              disabled={loadingTaskId === task.userTaskId}
                            >
                              {loadingTaskId === task.userTaskId ? (
                                <ActivityIndicator color="#7C3AED" size="small" />
                              ) : (
                                <Text style={styles.completeButtonText}>Görevi Tamamla</Text>
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.checkButton}
                              onPress={() => task.userTaskId && handleCompleteTask(task.userTaskId)}
                              disabled={loadingTaskId === task.userTaskId}
                            >
                              <Check size={20} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLine: {
    width: 16,
    height: 2,
    backgroundColor: '#7C3AED',
    marginVertical: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryContainer: {
    marginTop: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tasksContainer: {
    marginTop: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7C3AED',
    marginBottom: 12,
  },
  taskInfo: {
    marginBottom: 16,
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskInfoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  taskInfoValueOverdue: {
    color: '#DC2626',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    backgroundColor: '#fff',
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
});
