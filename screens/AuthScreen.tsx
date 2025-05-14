import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useBasic } from '@basictech/expo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const { login, isLoading } = useBasic();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/appacella-logo-blue.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text variant="headlineMedium" style={styles.title}>
          Grievance Board
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          A platform to submit and track grievances
        </Text>
        
        <Button 
          mode="contained" 
          onPress={login}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
        >
          Sign in with Kiki Auth
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    color: '#757575',
  },
  loginButton: {
    width: '100%',
    borderRadius: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
});