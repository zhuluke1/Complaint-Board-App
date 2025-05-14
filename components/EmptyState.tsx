import React from 'react';
import { StyleSheet, View, Platform, useWindowDimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type EmptyStateProps = {
  title: string;
  message: string;
  icon: string;
  buttonText?: string;
  onButtonPress?: () => void;
};

export default function EmptyState({
  title,
  message,
  icon,
  buttonText,
  onButtonPress,
}: EmptyStateProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  return (
    <View style={[
      styles.container,
      isWeb && isWideScreen && styles.webContainer
    ]}>
      <MaterialCommunityIcons 
        name={icon} 
        size={isWideScreen ? 120 : 80} 
        color="#BDBDBD" 
      />
      <Text 
        variant={isWideScreen ? "headlineMedium" : "headlineSmall"} 
        style={styles.title}
      >
        {title}
      </Text>
      <Text 
        variant="bodyMedium" 
        style={[
          styles.message,
          isWeb && isWideScreen && styles.webMessage
        ]}
      >
        {message}
      </Text>
      {buttonText && onButtonPress && (
        <Button 
          mode="contained" 
          onPress={onButtonPress}
          style={styles.button}
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webContainer: {
    padding: 48,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    color: '#757575',
  },
  webMessage: {
    maxWidth: 500,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 16,
  },
});
