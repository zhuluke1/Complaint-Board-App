import "@expo/metro-runtime";
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Add debugging logs
console.log('Starting Grievance Board app...');

// Try both registration methods to ensure the app starts
AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);

console.log('Root component registered');