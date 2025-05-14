import React from 'react';
import { StyleSheet, Alert, View, Text } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ActivityIndicator } from 'react-native-paper';
import GrievanceForm from '../components/GrievanceForm';

export default function EditGrievanceScreen() {
  const { db, isSignedIn, login, isLoading } = useBasic();
  const navigation = useNavigation();
  const route = useRoute();
  const { grievance } = route.params;

  const handleSubmit = async (updatedGrievance) => {
    try {
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
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Grievance Board</Text>
          <Text style={styles.authText}>Please sign in to edit grievances</Text>
          <Button 
            mode="contained" 
            onPress={login}
            style={styles.authButton}
          >
            Sign In
          </Button>
        </View>
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
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  authText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  authButton: {
    paddingHorizontal: 16,
  },
});
