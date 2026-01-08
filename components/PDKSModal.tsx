import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronDown, ChevronLeft, ChevronRight, Briefcase, Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { pdksService, UserShiftPlan, WorkLog } from '@/services/pdks.service';

interface PDKSModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
}

export function PDKSModal({ visible, onClose, userId }: PDKSModalProps) {
  const [loading, setLoading] = useState(true);
  const [shiftPlan, setShiftPlan] = useState<UserShiftPlan | null>(null);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [periodFilter, setPeriodFilter] = useState('Son 6 Ay');
  const [timeFilter, setTimeFilter] = useState('Tüm Saatler');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [shiftInfoExpanded, setShiftInfoExpanded] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(true);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [shift, logs] = await Promise.all([
        pdksService.getUserShiftPlan(userId),
        pdksService.getUserWorkLog(userId),
      ]);
      setShiftPlan(shift);
      setWorkLogs(logs);
    } catch (error) {
      console.error('Error loading PDKS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getDayStyle = (day: number | null) => {
    if (!day) return null;

    const dayDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const hasLog = workLogs.some(log => {
      const logDate = new Date(log.date);
      return logDate.getDate() === day &&
             logDate.getMonth() === selectedMonth.getMonth() &&
             logDate.getFullYear() === selectedMonth.getFullYear();
    });

    if (hasLog) {
      return styles.dayWithLog;
    }
    return null;
  };

  const getDayTextStyle = (day: number | null) => {
    if (!day) return null;

    const dayDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dayOfWeek = dayDate.getDay();

    if (dayOfWeek === 0) return styles.sundayText;
    if (dayOfWeek === 6) return styles.saturdayText;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PDKS</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShiftInfoExpanded(!shiftInfoExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.iconWrapper}>
                  <CalendarIcon size={18} color="#666" />
                </View>
                <Text style={styles.sectionTitle}>VARDİYA BİLGİSİ</Text>
              </View>
              <ChevronDown
                size={20}
                color="#666"
                style={{ transform: [{ rotate: shiftInfoExpanded ? '0deg' : '-90deg' }] }}
              />
            </TouchableOpacity>

            {shiftInfoExpanded && (
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mevcut Vardiya</Text>
                  <Text style={styles.infoValue}>
                    {shiftPlan?.name || 'Vardiya Grup-1'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mevcut Tip</Text>
                  <Text style={styles.infoValue}>
                    {shiftPlan?.type || 'Sabah Vardiyası'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Çalışma Saatleri</Text>
                  <Text style={styles.infoValue}>
                    {shiftPlan ? `${shiftPlan.startTime} - ${shiftPlan.endTime}` : '08:00 - 19:00'}
                  </Text>
                </View>

                <TouchableOpacity style={styles.changeShiftButton} activeOpacity={0.8}>
                  <Text style={styles.changeShiftButtonText}>Vardiya Değiştir</Text>
                </TouchableOpacity>

                <View style={styles.calendar}>
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={previousMonth} style={styles.monthButton}>
                      <ChevronLeft size={20} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>
                      {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
                      <ChevronRight size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.weekDaysRow}>
                    {weekDays.map((day, index) => (
                      <View key={day} style={styles.weekDayCell}>
                        <Text
                          style={[
                            styles.weekDayText,
                            index === 5 && styles.saturdayText,
                            index === 6 && styles.sundayText,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.daysGrid}>
                    {getDaysInMonth(selectedMonth).map((day, index) => (
                      <View key={index} style={styles.dayCell}>
                        {day && (
                          <View style={[styles.dayInner, getDayStyle(day)]}>
                            <Text style={[styles.dayText, getDayTextStyle(day)]}>
                              {day}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.sectionHeader, styles.sectionHeaderWithMargin]}
              onPress={() => setHistoryExpanded(!historyExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.iconWrapper}>
                  <Clock size={18} color="#666" />
                </View>
                <Text style={styles.sectionTitle}>VARDİYA GEÇMİŞİ</Text>
              </View>
              <ChevronDown
                size={20}
                color="#666"
                style={{ transform: [{ rotate: historyExpanded ? '0deg' : '-90deg' }] }}
              />
            </TouchableOpacity>

            {historyExpanded && (
              <View style={styles.sectionContent}>
                <View style={styles.filterRow}>
                  <View style={styles.filterDropdown}>
                    <TouchableOpacity
                      style={styles.filterButton}
                      onPress={() => {
                        setShowPeriodDropdown(!showPeriodDropdown);
                        setShowTimeDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.filterButtonText}>{periodFilter}</Text>
                      <ChevronDown size={16} color="#666" />
                    </TouchableOpacity>
                    {showPeriodDropdown && (
                      <View style={styles.dropdownMenu}>
                        {['Son 6 Ay', 'Son 3 Ay', 'Son Ay'].map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setPeriodFilter(option);
                              setShowPeriodDropdown(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                periodFilter === option && styles.dropdownItemTextActive,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.filterDropdown}>
                    <TouchableOpacity
                      style={styles.filterButton}
                      onPress={() => {
                        setShowTimeDropdown(!showTimeDropdown);
                        setShowPeriodDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.filterButtonText}>{timeFilter}</Text>
                      <ChevronDown size={16} color="#666" />
                    </TouchableOpacity>
                    {showTimeDropdown && (
                      <View style={styles.dropdownMenu}>
                        {['Tüm Saatler', 'Sabah', 'Öğleden Sonra'].map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setTimeFilter(option);
                              setShowTimeDropdown(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                timeFilter === option && styles.dropdownItemTextActive,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
                    <CalendarIcon size={16} color="#7C3AED" />
                  </TouchableOpacity>
                </View>

                <View style={styles.logsList}>
                  {workLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>Henüz vardiya kaydı bulunmuyor</Text>
                    </View>
                  ) : (
                    workLogs.map((log) => (
                      <View key={log.id} style={styles.logItem}>
                        <View style={styles.logHeader}>
                          <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                          <Text style={[
                            styles.logTime,
                            log.checkIn && log.checkOut ? styles.logTimeComplete : styles.logTimeIncomplete
                          ]}>
                            {formatTime(log.shiftStartTime)} - {formatTime(log.shiftEndTime)}
                          </Text>
                        </View>
                        <View style={styles.logDetails}>
                          <View style={styles.logRow}>
                            <Text style={styles.logLabel}>Giriş</Text>
                            <Text style={styles.logValue}>
                              {log.checkInDoor || 'A Kapısı'} - {formatTime(log.checkIn)}
                            </Text>
                          </View>
                          <View style={styles.logRow}>
                            <Text style={styles.logLabel}>Çıkış</Text>
                            <Text style={styles.logValue}>
                              {log.checkOutDoor || 'B Kapısı'} - {formatTime(log.checkOut)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.8}>
                  <Text style={styles.seeAllButtonText}>Görevi Tamamla</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  sectionHeaderWithMargin: {
    marginTop: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  changeShiftButton: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
  },
  changeShiftButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  calendar: {
    marginTop: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  saturdayText: {
    color: '#F59E0B',
  },
  sundayText: {
    color: '#EF4444',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayWithLog: {
    backgroundColor: '#DDD6FE',
  },
  dayText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    zIndex: 1000,
  },
  filterDropdown: {
    flex: 1,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  exportButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#666',
  },
  dropdownItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  logsList: {
    gap: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  logItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logTime: {
    fontSize: 13,
    fontWeight: '600',
  },
  logTimeComplete: {
    color: '#10B981',
  },
  logTimeIncomplete: {
    color: '#EF4444',
  },
  logDetails: {
    gap: 8,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logLabel: {
    fontSize: 13,
    color: '#666',
  },
  logValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  seeAllButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
  },
  seeAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
});
