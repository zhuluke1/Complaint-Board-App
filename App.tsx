import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Button } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import NewGrievanceScreen from './screens/NewGrievanceScreen';
import GrievanceDetailsScreen from './screens/GrievanceDetailsScreen';
import { BasicProvider } from '@basictech/expo';
import { schema } from './basic.config';

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Main App component
export default function App() {
  console.log('App rendering - with navigation');
  
  const [loading, setLoading] = useState(true);
  
  // Add a timeout to automatically stop loading after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Loading timeout reached, forcing content display');
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <PaperProvider theme={MD3LightTheme}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <View style={styles.content}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.text}>Loading Grievance Board...</Text>
              <Text style={styles.subText}>If loading takes too long, tap below:</Text>
              <Button 
                title="Skip Loading" 
                onPress={() => setLoading(false)}
                color="#2196F3"
              />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }
  
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <PaperProvider theme={MD3LightTheme}>
        <SafeAreaProvider>
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
            </Stack.Navigator>
          </NavigationContainer>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2196F3',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});