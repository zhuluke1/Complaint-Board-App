import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useBasic } from '@basictech/expo';
import { Button } from 'react-native-paper';

export default function AppContent() {
  const { isSignedIn, isLoading, login } = useBasic();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Grievance Board</Text>
        <Text style={styles.text}>Please sign in to continue</Text>
        <Button 
          mode="contained" 
          onPress={login}
          style={styles.button}
        >
          Sign In
        </Button>
      </View>
    );
  }

  // If signed in, the navigation stack will be rendered by the parent component
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2196F3',
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 16,
  },
});
