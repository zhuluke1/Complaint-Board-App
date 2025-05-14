import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

// Define priority and status colors
const PRIORITY_COLORS = {
  high: '#FF5252',
  medium: '#FFD740',
  low: '#69F0AE',
};

const STATUS_COLORS = {
  open: '#2196F3',
  inProgress: '#FF9800',
  resolved: '#4CAF50',
  closed: '#9E9E9E',
};

// Define the props for the GrievanceCard component
type GrievanceCardProps = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'inProgress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  onPress: (id: string) => void;
};

export default function GrievanceCard({
  id,
  title,
  description,
  status,
  priority,
  category,
  createdAt,
  onPress,
}: GrievanceCardProps) {
  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const isWeb = Platform.OS === 'web';
  
  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress(id)}
      style={isWeb ? styles.webCardContainer : null}
      activeOpacity={0.7}
    >
      <Card style={[styles.card, isWeb && styles.webCard]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>{title}</Text>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          
          <View style={styles.metaContainer}>
            <Chip 
              style={[styles.chip, { backgroundColor: STATUS_COLORS[status] }]}
              textStyle={styles.chipText}
            >
              {getStatusLabel(status)}
            </Chip>
            
            <Chip 
              style={[styles.chip, { backgroundColor: PRIORITY_COLORS[priority] }]}
              textStyle={styles.chipText}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Chip>
            
            <Chip style={styles.categoryChip}>
              {category}
            </Chip>
          </View>
          
          <Text variant="bodySmall" style={styles.date}>
            Created: {formattedDate}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  webCardContainer: {
    marginBottom: 16,
    height: '100%',
    display: 'flex',
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  webCard: {
    marginHorizontal: 0,
    height: '100%',
    transition: '0.3s',
    // Add hover effect for web
    ':hover': {
      transform: [{ translateY: -4 }],
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    },
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
    color: '#555',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  date: {
    color: '#757575',
    marginTop: 4,
  },
});
