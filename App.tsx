import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';
import { PaperProvider, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import NewGrievanceScreen from './screens/NewGrievanceScreen';
import GrievanceDetailsScreen from './screens/GrievanceDetailsScreen';
import EditGrievanceScreen from './screens/EditGrievanceScreen';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';

// Create the navigation stack
const Stack = createNativeStackNavigator();

// AppContent component to handle authentication state
function AppContent() {
  const { isSignedIn, isLoading } = useBasic();
  const [authChecked, setAuthChecked] = useState(false);

  // Listen for authentication messages from the popup window
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleAuthMessage = (event) => {
        if (event.data === 'AUTH_COMPLETE') {
          console.log('Received AUTH_COMPLETE message');
          // Force a re-render to check auth state again
          setAuthChecked(true);
        }
      };

      window.addEventListener('message', handleAuthMessage);
      return () => {
        window.removeEventListener('message', handleAuthMessage);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Grievance Board' }}
        />
        <Stack.Screen 
          name="NewGrievance" 
          component={NewGrievanceScreen} 
          options={{ title: 'Add New Grievance' }}
        />
        <Stack.Screen 
          name="GrievanceDetails" 
          component={GrievanceDetailsScreen} 
          options={{ title: 'Grievance Details' }}
        />
        <Stack.Screen 
          name="EditGrievance" 
          component={EditGrievanceScreen} 
          options={{ title: 'Edit Grievance' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App component
export default function App() {
  console.log('App rendering');
  
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <PaperProvider theme={MD3LightTheme}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PaperProvider>
    </BasicProvider>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});