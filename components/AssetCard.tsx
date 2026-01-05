import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';

interface AssetDetail {
  label: string;
  value: string;
}

interface AssetCardProps {
  title: string;
  details: AssetDetail[];
  onEdit: () => void;
  isInactive?: boolean;
}

export function AssetCard({ title, details, onEdit, isInactive = false }: AssetCardProps) {
  return (
    <View style={[styles.card, isInactive && styles.cardInactive]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isInactive && styles.textInactive]}>{title}</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Pencil size={16} color={isInactive ? '#CCC' : '#666'} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        {details.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={[styles.detailLabel, isInactive && styles.textInactive]}>
              {detail.label}
            </Text>
            <Text style={[styles.detailValue, isInactive && styles.textInactive]}>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardInactive: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  cardBody: {
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
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  textInactive: {
    color: '#999',
  },
});
