import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native-paper';
import GrievanceForm from '../components/GrievanceForm';

export default function EditGrievanceScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();
  const route = useRoute();
  const { grievance } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (updatedGrievance) => {
    try {
      setSubmitting(true);
      console.log('Updating grievance:', updatedGrievance);
      
      await db.from('grievances').update(grievance.id, updatedGrievance);
      
      // Show success message
      Alert.alert(
        "Success",
        "Grievance updated successfully!",
        [{ text: "OK" }]
      );
      
      // Navigate back to details screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating grievance:', error);
      // Show error message
      Alert.alert(
        "Error",
        "Failed to update grievance. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Updating grievance...</Text>
      </View>
    );
  }

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
  }
});