import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Platform, useWindowDimensions } from 'react-native';
import { FAB, ActivityIndicator, Text } from 'react-native-paper';
import { useBasic } from '@basictech/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GrievanceCard from '../components/GrievanceCard';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';

export default function HomeScreen() {
  const { db } = useBasic();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    priority: [],
    category: [],
  });

  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  // Fetch grievances on component mount
  useEffect(() => {
    console.log('HomeScreen mounted, fetching grievances');
    fetchGrievances();
    
    // Set up polling every 10 seconds
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing grievances...');
      fetchGrievances(false); // Pass false to not show loading indicator
    }, 10000); // 10 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [grievances, filters]);

  const fetchGrievances = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }
      
      console.log('Fetching grievances from database...');
      const result = await db.from('grievances').getAll();
      console.log('Fetched grievances:', result);
      
      const formattedGrievances = result.map(item => ({
        id: item.id,
        ...item.value,
      }));
      
      // Sort by createdAt (newest first)
      formattedGrievances.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setGrievances(formattedGrievances);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setError('Failed to load grievances. Please try again.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGrievances();
  };

  const applyFilters = () => {
    let filtered = [...grievances];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }
    
    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(item => filters.priority.includes(item.priority));
    }
    
    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category));
    }
    
    setFilteredGrievances(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleGrievancePress = (id) => {
    navigation.navigate('GrievanceDetails', { grievanceId: id });
  };

  const handleAddGrievance = () => {
    navigation.navigate('NewGrievance');
  };

  // For web, we'll use a grid layout for wider screens
  const renderGridItem = ({ item, index }) => {
    // Calculate the correct margin based on position
    const isEven = index % 2 === 0;
    const marginStyle = isWideScreen ? {
      marginRight: isEven ? 8 : 0,
      marginLeft: !isEven ? 8 : 0,
      width: `${(width > 1200 ? 33.33 : 50) - 2}%`, // Adjust width based on screen size
    } : {};

    return (
      <View style={marginStyle}>
        <GrievanceCard
          id={item.id}
          title={item.title}
          description={item.description}
          status={item.status}
          priority={item.priority}
          category={item.category}
          createdAt={item.createdAt}
          onPress={handleGrievancePress}
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading grievances...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Error Loading Grievances"
          message={error}
          icon="alert-circle-outline"
          buttonText="Try Again"
          onButtonPress={() => fetchGrievances()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar onFilterChange={handleFilterChange} />
      
      {grievances.length === 0 ? (
        <EmptyState
          title="No Grievances Found"
          message="Start by adding your first grievance using the button below."
          icon="clipboard-text-outline"
          buttonText="Add Grievance"
          onButtonPress={handleAddGrievance}
        />
      ) : filteredGrievances.length === 0 ? (
        <EmptyState
          title="No Matching Grievances"
          message="Try adjusting your filters to see more results."
          icon="filter-off-outline"
        />
      ) : (
        <FlatList
          data={filteredGrievances}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={isWeb && isWideScreen ? (width > 1200 ? 3 : 2) : 1}
          key={isWeb && isWideScreen ? (width > 1200 ? 'three-columns' : 'two-columns') : 'one-column'}
          contentContainerStyle={[
            styles.listContent,
            isWeb && isWideScreen && styles.gridContent
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <FAB
        icon="plus"
        style={[styles.fab, isWeb && { bottom: 24, right: 24 }]}
        onPress={handleAddGrievance}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingVertical: 8,
  },
  gridContent: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});