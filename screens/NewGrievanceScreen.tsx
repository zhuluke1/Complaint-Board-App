import React from 'react';
import { StyleSheet } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      
      // Navigate back to home screen
      navigation.goBack();
    } catch (error) {
      console.error('Error creating grievance:', error);
      // Handle error (could show an alert or error message)
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
});