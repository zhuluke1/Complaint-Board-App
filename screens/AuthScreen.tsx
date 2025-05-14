import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useBasic } from '@basictech/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AuthScreen() {
  const { login, isLoading, error } = useBasic();
  const { width } = useWindowDimensions();
  const [imageError, setImageError] = useState(false);
  
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  // Add debugging logs
  useEffect(() => {
    console.log('AuthScreen mounted');
    console.log('isLoading:', isLoading);
    console.log('isWeb:', isWeb);
    if (error) {
      console.error('Auth error:', error);
    }
  }, [isLoading, error]);

  const handleLogin = () => {
    console.log('Login button pressed');
    try {
      login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading authentication...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        styles.content,
        isWeb && isWideScreen && styles.webContent
      ]}>
        {imageError ? (
          <View style={[styles.logoFallback, isWeb && isWideScreen && styles.webLogoFallback]}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={isWideScreen ? 80 : 60} color="#2196F3" />
          </View>
        ) : (
          <Image 
            source={require('../assets/images/appacella-logo-blue.png')} 
            style={[
              styles.logo,
              isWeb && isWideScreen && styles.webLogo
            ]} 
            resizeMode="contain"
            onError={() => {
              console.error('Image failed to load');
              setImageError(true);
            }}
          />
        )}
        
        <Text variant={isWideScreen ? "headlineLarge" : "headlineMedium"} style={styles.title}>
          Grievance Board
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          A platform to submit and track grievances
        </Text>
        
        {error && (
          <Text style={styles.errorText}>
            Error: {error.message || 'An error occurred during authentication'}
          </Text>
        )}
        
        <Button 
          mode="contained" 
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={[
            styles.loginButton,
            isWeb && isWideScreen && styles.webLoginButton
          ]}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webContent: {
    maxWidth: 600,
    marginHorizontal: 'auto',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 32,
  },
  webLogo: {
    width: 300,
    height: 150,
  },
  logoFallback: {
    width: 200,
    height: 100,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLogoFallback: {
    width: 300,
    height: 150,
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
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    borderRadius: 8,
  },
  webLoginButton: {
    maxWidth: 300,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
});
