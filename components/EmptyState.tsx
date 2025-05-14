import React from 'react';
import { StyleSheet, View } from 'react-native';
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
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={80} color="#BDBDBD" />
      <Text variant="headlineSmall" style={styles.title}>{title}</Text>
      <Text variant="bodyMedium" style={styles.message}>{message}</Text>
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
  button: {
    paddingHorizontal: 16,
  },
});