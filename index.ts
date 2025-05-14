import "@expo/metro-runtime";
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Add debugging logs
console.log('Starting Grievance Board app...');

// Try both registration methods to ensure the app starts
try {
  console.log('Registering app with AppRegistry...');
  AppRegistry.registerComponent('main', () => App);
  console.log('AppRegistry registration successful');
} catch (error) {
  console.error('Error registering with AppRegistry:', error);
}

try {
  console.log('Registering app with registerRootComponent...');
  registerRootComponent(App);
  console.log('registerRootComponent registration successful');
} catch (error) {
  console.error('Error registering with registerRootComponent:', error);
}

console.log('Root component registration complete');
