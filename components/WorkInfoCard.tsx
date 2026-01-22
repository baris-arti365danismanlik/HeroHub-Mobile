import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit2 } from 'lucide-react-native';

interface WorkInfoCardProps {
  title: string;
  details: { label: string; value: string; isHighlight?: boolean }[];
  onEdit?: () => void;
  isPast?: boolean;
}

export function WorkInfoCard({ title, details, onEdit, isPast = false }: WorkInfoCardProps) {
  return (
    <View style={[styles.card, isPast && styles.cardPast]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isPast && styles.cardTitlePast]}>{title}</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Edit2 size={18} color={isPast ? '#999' : '#666'} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {details.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={[styles.detailLabel, isPast && styles.detailLabelPast]}>
              {detail.label}
            </Text>
            <Text
              style={[
                styles.detailValue,
                isPast && styles.detailValuePast,
                detail.isHighlight && styles.detailValueHighlight,
              ]}
            >
              {detail.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardPast: {
    backgroundColor: '#F8F9FA',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  cardTitlePast: {
    color: '#999',
  },
  editButton: {
    padding: 4,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailLabelPast: {
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailValuePast: {
    color: '#999',
  },
  detailValueHighlight: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});
