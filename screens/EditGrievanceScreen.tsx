import React from 'react';
import { StyleSheet } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GrievanceForm from '../components/GrievanceForm';

export default function EditGrievanceScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();
  const route = useRoute();
  const { grievance } = route.params;

  const handleSubmit = async (updatedGrievance) => {
    try {
      await db.from('grievances').update(grievance.id, updatedGrievance);
      
      // Navigate back to details screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating grievance:', error);
      // Handle error (could show an alert or error message)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GrievanceForm 
        onSubmit={handleSubmit} 
        initialValues={grievance}
        isEditing={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});