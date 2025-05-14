import React from 'react';
import { StyleSheet, Alert, View, Text } from 'react-native';
import { useBasic } from '@basictech/expo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ActivityIndicator } from 'react-native-paper';
import GrievanceForm from '../components/GrievanceForm';

export default function NewGrievanceScreen() {
  const { db, isSignedIn, login, isLoading } = useBasic();
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
          <Text style={styles.authText}>Please sign in to add a new grievance</Text>
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
