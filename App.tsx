import React from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';

// Import screens
import HomeScreen from './screens/HomeScreen';
import NewGrievanceScreen from './screens/NewGrievanceScreen';
import GrievanceDetailsScreen from './screens/GrievanceDetailsScreen';
import EditGrievanceScreen from './screens/EditGrievanceScreen';
import AuthScreen from './screens/AuthScreen';

// Create stack navigator
const Stack = createNativeStackNavigator();

// Custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03A9F4',
  },
};

// Adapt navigation theme for web
const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: {
    dark: false,
    colors: {
      primary: theme.colors.primary,
      background: '#f5f5f5',
      card: theme.colors.primary,
      text: '#fff',
      border: 'transparent',
      notification: theme.colors.error,
    },
  },
});

// Main app content with navigation
function AppContent() {
  const { isSignedIn, isLoading } = useBasic();
  const isWeb = Platform.OS === 'web';

  if (isLoading) {
    // You could show a splash screen or loading indicator here
    return null;
  }

  return (
    <NavigationContainer theme={isWeb ? LightTheme : undefined}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Add animation for web
          animation: isWeb ? 'fade' : 'default',
        }}
      >
        {!isSignedIn ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Grievance Board' }}
            />
            <Stack.Screen 
              name="NewGrievance" 
              component={NewGrievanceScreen} 
              options={{ title: 'New Grievance' }}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App component
export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <BasicProvider project_id={schema.project_id} schema={schema}>
          <StatusBar barStyle="light-content" />
          <AppContent />
        </BasicProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
