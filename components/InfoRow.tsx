import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoRowProps {
  label?: string;
  value: string;
  isLast?: boolean;
  fullWidth?: boolean;
}

export function InfoRow({ label, value, isLast = false, fullWidth = false }: InfoRowProps) {
  if (fullWidth || !label) {
    return (
      <View style={[styles.container, !isLast && styles.containerWithBorder]}>
        <Text style={styles.fullWidthValue}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, !isLast && styles.containerWithBorder]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  containerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  value: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  fullWidthValue: {
    fontSize: 14,
    color: '#666',
    width: '100%',
  },
});
