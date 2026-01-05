import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit2, Umbrella, Calendar, Baby } from 'lucide-react-native';

interface DayOffCardProps {
  type: string;
  days: number;
  startDate: string;
  endDate: string;
  color?: string;
  isPast?: boolean;
  onEdit?: () => void;
}

const ICON_MAP: Record<string, any> = {
  'Yıllık İzin': Umbrella,
  'Doğum Günü İzni': Baby,
  'Karne Günü İzni': Calendar,
};

const COLOR_MAP: Record<string, string> = {
  'Yıllık İzin': '#34C759',
  'Doğum Günü İzni': '#FF9500',
  'Karne Günü İzni': '#FF9500',
};

const BADGE_COLOR_MAP: Record<string, string> = {
  'Yıllık İzin': '#7C3AED',
  'Doğum Günü İzni': '#FF9500',
  'Karne Günü İzni': '#FF9500',
};

export function DayOffCard({
  type,
  days,
  startDate,
  endDate,
  color,
  isPast = false,
  onEdit,
}: DayOffCardProps) {
  const Icon = ICON_MAP[type] || Umbrella;
  const borderColor = color || COLOR_MAP[type] || '#34C759';
  const badgeColor = BADGE_COLOR_MAP[type] || '#7C3AED';

  return (
    <View style={[styles.card, isPast && styles.cardPast]}>
      <View style={[styles.leftBorder, { backgroundColor: isPast ? '#FF3B30' : borderColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.typeRow}>
            <Icon size={18} color={isPast ? '#999' : '#1a1a1a'} />
            <Text style={[styles.typeText, isPast && styles.textPast]}>{type}</Text>
          </View>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Edit2 size={18} color={isPast ? '#999' : '#666'} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <View style={[styles.daysBadge, { backgroundColor: isPast ? '#F8F9FA' : badgeColor }]}>
            <Text style={[styles.daysText, isPast && styles.daysTextPast]}>
              {days > 0 ? `${days} Gün` : `${days} Gün`}
            </Text>
          </View>

          <View style={styles.datesContainer}>
            <Text style={[styles.dateText, isPast && styles.textPast]}>{startDate}</Text>
            <Text style={[styles.dateText, isPast && styles.textPast]}>{endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardPast: {
    backgroundColor: '#F8F9FA',
  },
  leftBorder: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  textPast: {
    color: '#999',
  },
  editButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  daysTextPast: {
    color: '#999',
  },
  datesContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
});
