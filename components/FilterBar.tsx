import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Chip, Searchbar, Text } from 'react-native-paper';

type FilterBarProps = {
  onFilterChange: (filters: {
    search: string;
    status: string[];
    priority: string[];
    category: string[];
  }) => void;
};

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  const statuses = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ];

  const priorities = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  const categories = [
    { label: 'General', value: 'General' },
    { label: 'Facilities', value: 'Facilities' },
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Management', value: 'Management' },
    { label: 'Safety', value: 'Safety' },
    { label: 'Other', value: 'Other' },
  ];

  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(newStatuses);
    updateFilters(searchQuery, newStatuses, selectedPriorities, selectedCategories);
  };

  const togglePriority = (priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    
    setSelectedPriorities(newPriorities);
    updateFilters(searchQuery, selectedStatuses, newPriorities, selectedCategories);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    updateFilters(searchQuery, selectedStatuses, selectedPriorities, newCategories);
  };

  const updateFilters = (
    search: string,
    statuses: string[],
    priorities: string[],
    categories: string[]
  ) => {
    onFilterChange({
      search,
      status: statuses,
      priority: priorities,
      category: categories,
    });
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters(query, selectedStatuses, selectedPriorities, selectedCategories);
  };

  // Render filter section with label
  const renderFilterSection = (title: string, items: { label: string, value: string }[], selectedItems: string[], toggleFn: (value: string) => void) => (
    <View style={styles.filterSection}>
      {isWideScreen && <Text variant="bodyMedium" style={styles.filterTitle}>{title}:</Text>}
      <View style={styles.chipGroup}>
        {items.map((item) => (
          <Chip
            key={item.value}
            selected={selectedItems.includes(item.value)}
            onPress={() => toggleFn(item.value)}
            style={[
              styles.chip,
              selectedItems.includes(item.value) && styles.selectedChip
            ]}
          >
            {item.label}
          </Chip>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <View style={[styles.searchContainer, isWideScreen && { maxWidth: 300 }]}>
        <Searchbar
          placeholder="Search grievances"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      
      {isWideScreen ? (
        <View style={styles.webFiltersContainer}>
          {renderFilterSection('Status', statuses, selectedStatuses, toggleStatus)}
          {renderFilterSection('Priority', priorities, selectedPriorities, togglePriority)}
          {renderFilterSection('Category', categories, selectedCategories, toggleCategory)}
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {renderFilterSection('', statuses, selectedStatuses, toggleStatus)}
          {renderFilterSection('', priorities, selectedPriorities, togglePriority)}
          {renderFilterSection('', categories, selectedCategories, toggleCategory)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  webContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchContainer: {
    marginBottom: 8,
    marginHorizontal: 8,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    paddingHorizontal: 8,
  },
  webFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  filterTitle: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
});
