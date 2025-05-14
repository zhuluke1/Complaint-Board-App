import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import GrievanceForm from '../components/GrievanceForm';

export default function NewGrievanceScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (grievance) => {
    try {
      setSubmitting(true);
      setError(null);
      console.log('Submitting grievance:', grievance);
      
      // Check if db is available
      if (!db) {
        console.error('Database connection not available');
        setError('Database connection not available. Please try again later.');
        return;
      }
      
      // Add createdAt timestamp
      const grievanceData = {
        ...grievance,
        createdAt: new Date().toISOString(),
        status: 'open', // Default status for new grievances
      };
      
      console.log('Formatted grievance data:', grievanceData);
      
      // Try to add the grievance with error handling
      try {
        const result = await db.from('grievances').add(grievanceData);
        console.log('Add grievance result:', result);
      } catch (dbError) {
        console.error('Error in db.from().add():', dbError);
        setError('Failed to save grievance. Database error.');
        return;
      }
      
      // Show success message
      Alert.alert(
        "Success",
        "Grievance submitted successfully!",
        [{ text: "OK" }]
      );
      
      // Navigate back to home screen
      navigation.goBack();
    } catch (error) {
      console.error('Error creating grievance:', error);
      setError('Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Submitting grievance...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Submitting Grievance</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => setError(null)}
            style={styles.retryButton}
          >
            Try Again
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GrievanceForm onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF5252',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  retryButton: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
  }
});