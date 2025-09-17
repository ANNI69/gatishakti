import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface ComponentData {
  id: string;
  type: string;
  vendor: string;
  lotNumber: string;
  manufactureDate: string;
  supplyDate: string;
  warrantyPeriod: string;
  lastInspection: string;
  status: string;
  location: string;
}

export default function ComponentDetailScreen() {
  const { componentData } = useLocalSearchParams();
  
  let data: ComponentData;
  try {
    data = JSON.parse(componentData as string);
  } catch (error) {
    data = {
      id: 'Unknown',
      type: 'Unknown Component',
      vendor: 'Unknown',
      lotNumber: 'N/A',
      manufactureDate: 'N/A',
      supplyDate: 'N/A',
      warrantyPeriod: 'N/A',
      lastInspection: 'N/A',
      status: 'Unknown',
      location: 'N/A',
    };
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'needs inspection':
        return '#f59e0b';
      case 'maintenance required':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'checkmark-circle';
      case 'needs inspection':
        return 'warning';
      case 'maintenance required':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const handleInspection = () => {
    router.push({
      pathname: '/inspection-form',
      params: { componentId: data.id, componentType: data.type }
    });
  };

  const handleGenerateReport = () => {
    Alert.alert(
      'Generate Report',
      'Your comprehensive inspection report will be generated soon. You will receive a notification once it\'s ready for download.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.componentCard}>
          <View style={styles.componentHeader}>
            <View style={styles.componentIcon}>
              <Ionicons name="cube" size={40} color={Colors.primary} />
            </View>
            <View style={styles.componentInfo}>
              <Text style={styles.componentId}>{data.id}</Text>
              <Text style={styles.componentType}>{data.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(data.status) }]}>
              <Ionicons name={getStatusIcon(data.status)} size={16} color="#fff" />
              <Text style={styles.statusText}>{data.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Component Information</Text>
          
          <View style={styles.detailCard}>
            <DetailRow
              icon="business"
              label="Vendor"
              value={data.vendor}
            />
            <DetailRow
              icon="barcode"
              label="Lot Number"
              value={data.lotNumber}
            />
            <DetailRow
              icon="calendar"
              label="Manufacture Date"
              value={data.manufactureDate}
            />
            <DetailRow
              icon="calendar-outline"
              label="Supply Date"
              value={data.supplyDate}
            />
            <DetailRow
              icon="shield-checkmark"
              label="Warranty Period"
              value={data.warrantyPeriod}
            />
            <DetailRow
              icon="location"
              label="Location"
              value={data.location}
            />
          </View>
        </View>

        <View style={styles.inspectionSection}>
          <Text style={styles.sectionTitle}>Inspection History</Text>
          
          <View style={styles.detailCard}>
            <DetailRow
              icon="search"
              label="Last Inspection"
              value={data.lastInspection}
            />
            <View style={styles.inspectionHistory}>
              <Text style={styles.historyTitle}>Recent Inspections</Text>
              <View style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>2024-08-15</Text>
                  <Text style={styles.historyNote}>Routine inspection - All parameters normal</Text>
                </View>
              </View>
              <View style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>2024-05-20</Text>
                  <Text style={styles.historyNote}>Installation inspection - Component installed</Text>
                </View>
              </View>
              <View style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>2024-02-01</Text>
                  <Text style={styles.historyNote}>Quality check - Passed all tests</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleInspection}
          >
            <Ionicons name="clipboard" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>New Inspection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGenerateReport}
          >
            <Ionicons name="document-text" size={20} color="#2563eb" />
            <Text style={styles.secondaryButtonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon as any} size={20} color="#6b7280" />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
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
  componentCard: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  componentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentInfo: {
    flex: 1,
  },
  componentId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  componentType: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  detailIcon: {
    width: 32,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  inspectionSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inspectionHistory: {
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginTop: 6,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  historyNote: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    margin: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});
