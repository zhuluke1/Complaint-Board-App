import "@expo/metro-runtime";
import { registerRootComponent } from 'expo';

import App from './App';

// Add debugging logs
console.log('Starting Grievance Board app...');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

console.log('Root component registered');
