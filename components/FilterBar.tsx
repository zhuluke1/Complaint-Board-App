import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Chip, Searchbar } from 'react-native-paper';

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

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search grievances"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <View style={styles.chipGroup}>
          {statuses.map((status) => (
            <Chip
              key={status.value}
              selected={selectedStatuses.includes(status.value)}
              onPress={() => toggleStatus(status.value)}
              style={[
                styles.chip,
                selectedStatuses.includes(status.value) && styles.selectedChip
              ]}
            >
              {status.label}
            </Chip>
          ))}
        </View>
        
        <View style={styles.chipGroup}>
          {priorities.map((priority) => (
            <Chip
              key={priority.value}
              selected={selectedPriorities.includes(priority.value)}
              onPress={() => togglePriority(priority.value)}
              style={[
                styles.chip,
                selectedPriorities.includes(priority.value) && styles.selectedChip
              ]}
            >
              {priority.label}
            </Chip>
          ))}
        </View>
        
        <View style={styles.chipGroup}>
          {categories.map((category) => (
            <Chip
              key={category.value}
              selected={selectedCategories.includes(category.value)}
              onPress={() => toggleCategory(category.value)}
              style={[
                styles.chip,
                selectedCategories.includes(category.value) && styles.selectedChip
              ]}
            >
              {category.label}
            </Chip>
          ))}
        </View>
      </ScrollView>
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
  searchbar: {
    margin: 8,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    paddingHorizontal: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    marginRight: 16,
  },
  chip: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
});