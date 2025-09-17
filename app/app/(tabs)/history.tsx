import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

interface ScanRecord {
  id: string;
  componentId: string;
  componentType: string;
  scanDate: string;
  scanTime: string;
  location: string;
  status: string;
  inspector: string;
}

const mockScanHistory: ScanRecord[] = [
  {
    id: '1',
    componentId: 'QR001',
    componentType: 'Elastic Rail Clip',
    scanDate: '2024-09-17',
    scanTime: '14:30',
    location: 'Track Section A-12',
    status: 'Active',
    inspector: 'user',
  },
  {
    id: '2',
    componentId: 'QR002',
    componentType: 'Rail Pad',
    scanDate: '2024-09-17',
    scanTime: '13:45',
    location: 'Track Section B-08',
    status: 'Active',
    inspector: 'user',
  },
  {
    id: '3',
    componentId: 'QR003',
    componentType: 'Liner',
    scanDate: '2024-09-16',
    scanTime: '16:20',
    location: 'Track Section C-15',
    status: 'Needs Inspection',
    inspector: 'user',
  },
  {
    id: '4',
    componentId: 'QR004',
    componentType: 'Elastic Rail Clip',
    scanDate: '2024-09-16',
    scanTime: '11:15',
    location: 'Track Section D-03',
    status: 'Active',
    inspector: 'user',
  },
  {
    id: '5',
    componentId: 'QR005',
    componentType: 'Rail Pad',
    scanDate: '2024-09-15',
    scanTime: '09:30',
    location: 'Track Section E-07',
    status: 'Maintenance Required',
    inspector: 'user',
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

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

  const filteredHistory = mockScanHistory.filter(record => {
    const matchesSearch = record.componentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.componentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'today') return matchesSearch && record.scanDate === '2024-09-17';
    if (selectedFilter === 'week') return matchesSearch; // For demo, showing all as this week
    if (selectedFilter === 'month') return matchesSearch; // For demo, showing all as this month
    
    return matchesSearch;
  });

  const handleRecordPress = (record: ScanRecord) => {
    // Navigate to component detail with mock data
    const mockData = {
      id: record.componentId,
      type: record.componentType,
      vendor: 'Railway Components Ltd.',
      lotNumber: `${record.componentId}-LOT-001`,
      manufactureDate: '2024-01-15',
      supplyDate: '2024-02-01',
      warrantyPeriod: '5 years',
      lastInspection: record.scanDate,
      status: record.status,
      location: record.location,
    };

    router.push({
      pathname: '/component-detail',
      params: { componentData: JSON.stringify(mockData) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search scans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                selectedFilter === filter.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.value && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.historyList}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredHistory.length}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredHistory.filter(r => r.scanDate === '2024-09-17').length}
            </Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredHistory.filter(r => r.status === 'Needs Inspection').length}
            </Text>
            <Text style={styles.statLabel}>Need Attention</Text>
          </View>
        </View>

        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No scans found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search terms' : 'Start scanning QR codes to see history here'}
            </Text>
          </View>
        ) : (
          <View style={styles.recordsList}>
            {filteredHistory.map((record) => (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                onPress={() => handleRecordPress(record)}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordIcon}>
                    <Ionicons name="cube-outline" size={24} color="#2563eb" />
                  </View>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordId}>{record.componentId}</Text>
                    <Text style={styles.recordType}>{record.componentType}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                    <Ionicons name={getStatusIcon(record.status)} size={12} color="#fff" />
                  </View>
                </View>

                <View style={styles.recordDetails}>
                  <View style={styles.recordDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text style={styles.recordDetailText}>
                      {record.scanDate} at {record.scanTime}
                    </Text>
                  </View>
                  <View style={styles.recordDetail}>
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text style={styles.recordDetailText}>{record.location}</Text>
                  </View>
                  <View style={styles.recordDetail}>
                    <Ionicons name="person-outline" size={16} color="#6b7280" />
                    <Text style={styles.recordDetailText}>Scanned by {record.inspector}</Text>
                  </View>
                </View>

                <View style={styles.recordActions}>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  exportButton: {
    padding: 8,
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginHorizontal: -20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  historyList: {
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  recordsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recordType: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordDetails: {
    gap: 8,
    marginBottom: 8,
  },
  recordDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  recordActions: {
    alignItems: 'flex-end',
  },
});
