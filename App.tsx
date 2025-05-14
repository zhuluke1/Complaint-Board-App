import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Button } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Simplified App component that doesn't get stuck in loading
export default function App() {
  console.log('App rendering - simplified version with timeout');
  
  const [loading, setLoading] = React.useState(true);
  
  // Add a timeout to automatically stop loading after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Loading timeout reached, forcing content display');
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <PaperProvider theme={MD3LightTheme}>
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
      </PaperProvider>
    );
  }
  
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Grievance Board</Text>
          <Text style={styles.text}>Welcome to the Grievance Board app!</Text>
          <Text style={styles.subText}>This is a simplified version to help diagnose the loading issue.</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sample Grievance</Text>
            <Text style={styles.cardText}>This is an example of what a grievance would look like on the board.</Text>
            <View style={styles.tagContainer}>
              <View style={[styles.tag, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.tagText}>Open</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#FFC107' }]}>
                <Text style={styles.tagText}>Medium</Text>
              </View>
            </View>
          </View>
          
          <Button 
            title="Add New Grievance" 
            onPress={() => console.log('Add new grievance')}
            color="#2196F3"
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});