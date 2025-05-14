import React from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import NewGrievanceScreen from './screens/NewGrievanceScreen';
import GrievanceDetailsScreen from './screens/GrievanceDetailsScreen';
import EditGrievanceScreen from './screens/EditGrievanceScreen';
import { BasicProvider } from '@basictech/expo';
import { schema } from './basic.config';

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Custom theme with primary color
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03A9F4',
  },
};

// Main App component - completely removed authentication
export default function App() {
  console.log('App rendering - authentication completely removed');
  console.log('Using project_id:', schema.project_id);
  
  return (
    <BasicProvider 
      project_id={schema.project_id} 
      schema={schema} 
      skipAuth={true}
      onError={(error) => {
        console.error('BasicProvider error:', error);
      }}
    >
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
      </PaperProvider>
    </BasicProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});