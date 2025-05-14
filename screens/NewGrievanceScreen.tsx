import React from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import GrievanceForm from '../components/GrievanceForm';

export default function NewGrievanceScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();

  const handleSubmit = async (grievance) => {
    try {
      // Add createdAt timestamp
      const grievanceData = {
        ...grievance,
        createdAt: new Date().toISOString(),
        status: 'open', // Default status for new grievances
      };
      
      await db.from('grievances').add(grievanceData);
      
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
      // Show error message
      Alert.alert(
        "Error",
        "Failed to submit grievance. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

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
  }
});