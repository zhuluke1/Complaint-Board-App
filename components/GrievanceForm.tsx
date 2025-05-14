import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Menu } from 'react-native-paper';

type GrievanceFormProps = {
  onSubmit: (grievance: {
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
  }) => void;
  initialValues?: {
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
  };
  isEditing?: boolean;
};

export default function GrievanceForm({ 
  onSubmit, 
  initialValues = { 
    title: '', 
    description: '', 
    status: 'open', 
    priority: 'medium',
    category: 'General'
  },
  isEditing = false
}: GrievanceFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [status, setStatus] = useState(initialValues.status);
  const [priority, setPriority] = useState(initialValues.priority);
  const [category, setCategory] = useState(initialValues.category);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const categories = [
    'General',
    'Facilities',
    'HR',
    'IT',
    'Management',
    'Safety',
    'Other'
  ];

  const validateForm = () => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        title,
        description,
        status,
        priority,
        category
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Edit Grievance' : 'New Grievance'}
        </Text>
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          error={!!titleError}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!descriptionError}
        />
        {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
        
        <Text variant="bodyMedium" style={styles.sectionLabel}>Priority</Text>
        <SegmentedButtons
          value={priority}
          onValueChange={setPriority}
          buttons={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          style={styles.segmentedButtons}
        />
        
        {isEditing && (
          <>
            <Text variant="bodyMedium" style={styles.sectionLabel}>Status</Text>
            <SegmentedButtons
              value={status}
              onValueChange={setStatus}
              buttons={[
                { value: 'open', label: 'Open' },
                { value: 'inProgress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
              style={styles.segmentedButtons}
            />
          </>
        )}
        
        <View style={styles.categoryContainer}>
          <Text variant="bodyMedium" style={styles.sectionLabel}>Category</Text>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setCategoryMenuVisible(true)}
                style={styles.categoryButton}
              >
                {category}
              </Button>
            }
          >
            {categories.map((cat) => (
              <Menu.Item
                key={cat}
                title={cat}
                onPress={() => {
                  setCategory(cat);
                  setCategoryMenuVisible(false);
                }}
              />
            ))}
          </Menu>
        </View>
        
        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={styles.submitButton}
        >
          {isEditing ? 'Update Grievance' : 'Submit Grievance'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    width: '100%',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});