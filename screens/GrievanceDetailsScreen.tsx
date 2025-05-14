import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform, useWindowDimensions } from 'react-native';
import { Text, Card, Button, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { useBasic } from '@basictech/expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

export default function GrievanceDetailsScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();
  const route = useRoute();
  const { grievanceId } = route.params;
  const { width } = useWindowDimensions();
  
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  // Add auto-refresh functionality
  useEffect(() => {
    fetchGrievanceDetails();
    
    // Set up polling every 10 seconds
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing grievance details...');
      fetchGrievanceDetails(false); // Pass false to not show loading indicator
    }, 10000); // 10 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [grievanceId]);

  const fetchGrievanceDetails = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const result = await db.from('grievances').get(grievanceId);
      
      if (result) {
        setGrievance({
          id: result.id,
          ...result.value,
        });
      }
    } catch (error) {
      console.error('Error fetching grievance details:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGrievanceDetails();
  };

  const handleEdit = () => {
    navigation.navigate('EditGrievance', { grievance });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Grievance',
      'Are you sure you want to delete this grievance? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await db.from('grievances').delete(grievanceId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting grievance:', error);
              Alert.alert('Error', 'Failed to delete grievance. Please try again.');
            }
          }
        },
      ]
    );
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!grievance) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#FF5252" />
          <Text variant="headlineSmall" style={styles.errorTitle}>Grievance Not Found</Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            The grievance you're looking for doesn't exist or has been deleted.
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[
        styles.scrollContent,
        isWeb && isWideScreen && styles.webScrollContent
      ]} refreshControl={
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        } />
      }>
        <Card style={[styles.card, isWeb && isWideScreen && styles.webCard]}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>{grievance.title}</Text>
            
            <View style={styles.metaContainer}>
              <Chip 
                style={[styles.chip, { backgroundColor: STATUS_COLORS[grievance.status] }]}
                textStyle={styles.chipText}
              >
                {getStatusLabel(grievance.status)}
              </Chip>
              
              <Chip 
                style={[styles.chip, { backgroundColor: PRIORITY_COLORS[grievance.priority] }]}
                textStyle={styles.chipText}
              >
                {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
              </Chip>
              
              <Chip style={styles.categoryChip}>
                {grievance.category}
              </Chip>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text variant="bodyMedium" style={styles.sectionTitle}>Description</Text>
            <Text variant="bodyLarge" style={styles.description}>
              {grievance.description}
            </Text>
            
            <Divider style={styles.divider} />
            
            <Text variant="bodyMedium" style={styles.sectionTitle}>Created</Text>
            <Text variant="bodyMedium" style={styles.dateText}>
              {formatDate(grievance.createdAt)}
            </Text>
          </Card.Content>
        </Card>
        
        <View style={[
          styles.buttonContainer,
          isWeb && isWideScreen && styles.webButtonContainer
        ]}>
          <Button 
            mode="contained" 
            onPress={handleEdit}
            style={styles.editButton}
            icon="pencil"
          >
            Edit
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleDelete}
            style={styles.deleteButton}
            textColor="#FF5252"
            icon="delete"
          >
            Delete
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  errorMessage: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#757575',
  },
  scrollContent: {
    padding: 16,
  },
  webScrollContent: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
    paddingTop: 24,
  },
  card: {
    marginBottom: 16,
  },
  webCard: {
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
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
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#757575',
  },
  description: {
    lineHeight: 24,
  },
  dateText: {
    color: '#757575',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  webButtonContainer: {
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#FF5252',
  },
});
