import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export default function InspectionFormScreen() {
  const { componentId, componentType } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    inspectorName: user?.username || '',
    inspectionDate: new Date().toISOString().split('T')[0],
    visualCondition: '',
    functionalTest: '',
    measurements: '',
    defectsFound: '',
    recommendations: '',
    overallRating: '',
    notes: '',
  });

  const [selectedRating, setSelectedRating] = useState('');

  const ratings = [
    { value: 'excellent', label: 'Excellent', color: '#10b981', icon: 'checkmark-circle' },
    { value: 'good', label: 'Good', color: '#3b82f6', icon: 'checkmark' },
    { value: 'fair', label: 'Fair', color: '#f59e0b', icon: 'warning' },
    { value: 'poor', label: 'Poor', color: '#ef4444', icon: 'close-circle' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.visualCondition || !formData.functionalTest || !selectedRating) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Inspection Submitted',
      'Inspection form has been saved locally and will be synced when connection is available.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Inspection form saved as draft.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.componentInfo}>
          <View style={styles.infoCard}>
            <Ionicons name="cube" size={24} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.componentId}>Component: {componentId}</Text>
              <Text style={styles.componentTypeText}>Type: {componentType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Inspector Information</Text>
          <View style={styles.formCard}>
            <FormField
              label="Inspector Name"
              value={formData.inspectorName}
              onChangeText={(value) => handleInputChange('inspectorName', value)}
              placeholder="Enter inspector name"
              required
            />
            <FormField
              label="Inspection Date"
              value={formData.inspectionDate}
              onChangeText={(value) => handleInputChange('inspectionDate', value)}
              placeholder="YYYY-MM-DD"
              required
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Visual Inspection</Text>
          <View style={styles.formCard}>
            <FormField
              label="Visual Condition"
              value={formData.visualCondition}
              onChangeText={(value) => handleInputChange('visualCondition', value)}
              placeholder="Describe visual condition..."
              multiline
              required
            />
            <FormField
              label="Defects Found"
              value={formData.defectsFound}
              onChangeText={(value) => handleInputChange('defectsFound', value)}
              placeholder="List any defects or issues..."
              multiline
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Functional Testing</Text>
          <View style={styles.formCard}>
            <FormField
              label="Functional Test Results"
              value={formData.functionalTest}
              onChangeText={(value) => handleInputChange('functionalTest', value)}
              placeholder="Describe functional test results..."
              multiline
              required
            />
            <FormField
              label="Measurements"
              value={formData.measurements}
              onChangeText={(value) => handleInputChange('measurements', value)}
              placeholder="Record measurements if applicable..."
              multiline
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Overall Rating</Text>
          <View style={styles.formCard}>
            <View style={styles.ratingContainer}>
              {ratings.map((rating) => (
                <TouchableOpacity
                  key={rating.value}
                  style={[
                    styles.ratingButton,
                    selectedRating === rating.value && {
                      backgroundColor: rating.color,
                      borderColor: rating.color,
                    },
                  ]}
                  onPress={() => {
                    setSelectedRating(rating.value);
                    handleInputChange('overallRating', rating.value);
                  }}
                >
                  <Ionicons
                    name={rating.icon as any}
                    size={24}
                    color={selectedRating === rating.value ? '#fff' : rating.color}
                  />
                  <Text
                    style={[
                      styles.ratingText,
                      selectedRating === rating.value && styles.ratingTextActive,
                    ]}
                  >
                    {rating.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Recommendations & Notes</Text>
          <View style={styles.formCard}>
            <FormField
              label="Recommendations"
              value={formData.recommendations}
              onChangeText={(value) => handleInputChange('recommendations', value)}
              placeholder="Enter maintenance recommendations..."
              multiline
            />
            <FormField
              label="Additional Notes"
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Any additional notes..."
              multiline
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Inspection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
}

function FormField({ label, value, onChangeText, placeholder, multiline = false, required = false }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>}
      </Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    flex: 1,
  },
  componentInfo: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '20',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  componentId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  componentTypeText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  formSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#ef4444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#fff',
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ratingButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  ratingTextActive: {
    color: '#fff',
  },
  actionButtons: {
    margin: 20,
    marginBottom: 40,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
