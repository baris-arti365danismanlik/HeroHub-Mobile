import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ChevronDown, Pencil } from 'lucide-react-native';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isExpandedDefault?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  subtitle?: string;
  actionButton?: ReactNode;
}

export function Accordion({ title, icon, children, isExpandedDefault = false, canEdit = false, onEdit, subtitle, actionButton }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const rotateAnim = useRef(new Animated.Value(isExpandedDefault ? 1 : 0)).current;

  useEffect(() => {
    setIsExpanded(isExpandedDefault);
    Animated.timing(rotateAnim, {
      toValue: isExpandedDefault ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpandedDefault]);

  const handlePress = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);

    Animated.timing(rotateAnim, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleEditPress = (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onEdit) {
      onEdit();
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={handlePress}
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
          {actionButton && (
            <View style={styles.actionButtonContainer}>
              {actionButton}
            </View>
          )}
          {canEdit && onEdit && (
            <TouchableOpacity
              onPress={handleEditPress}
              style={styles.editButton}
              activeOpacity={0.7}
            >
              <Pencil size={16} color="#7C3AED" />
            </TouchableOpacity>
          )}
          <Animated.View style={[styles.chevron, { transform: [{ rotate: rotation }] }]}>
            <ChevronDown size={20} color="#666" />
          </Animated.View>
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
  actionButtonContainer: {
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
