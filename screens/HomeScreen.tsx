import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { useBasic } from '@basictech/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GrievanceCard from '../components/GrievanceCard';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';

export default function HomeScreen() {
  const { db, isSignedIn } = useBasic();
  const navigation = useNavigation();
  
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    priority: [],
    category: [],
  });

  useEffect(() => {
    if (isSignedIn) {
      fetchGrievances();
    }
  }, [isSignedIn]);

  useEffect(() => {
    applyFilters();
  }, [grievances, filters]);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const result = await db.from('grievances').getAll();
      
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
    } finally {
      setLoading(false);
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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
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
          renderItem={({ item }) => (
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
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
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
  listContent: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});