import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, Pencil, Plus } from 'lucide-react-native';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isExpandedDefault?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  canAdd?: boolean;
  onAdd?: () => void;
  subtitle?: string;
}

export function Accordion({ title, icon, children, isExpandedDefault = false, canEdit = false, onEdit, canAdd = false, onAdd, subtitle }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);

  useEffect(() => {
    setIsExpanded(isExpandedDefault);
  }, [isExpandedDefault]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{title}</Text>
            {!isExpanded && subtitle && (
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitleLabel}>Vize</Text>
                <Text style={styles.subtitleValue}>{subtitle}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          {canAdd && onAdd && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#7C3AED" />
            </TouchableOpacity>
          )}
          {canEdit && onEdit && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={styles.editButton}
              activeOpacity={0.7}
            >
              <Pencil size={16} color="#7C3AED" />
            </TouchableOpacity>
          )}
          <View style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
            <ChevronDown size={20} color="#666" />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  subtitleLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  subtitleValue: {
    fontSize: 13,
    color: '#6B7280',
  },
  addButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
