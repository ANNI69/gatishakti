import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

interface SyncItem {
  id: string;
  type: 'scan' | 'inspection' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  size: string;
}

const mockSyncData: SyncItem[] = [
  {
    id: '1',
    type: 'inspection',
    title: 'Inspection Report - QR001',
    description: 'Elastic Rail Clip inspection completed',
    timestamp: '2024-09-17 14:30',
    status: 'pending',
    size: '2.3 MB',
  },
  {
    id: '2',
    type: 'scan',
    title: 'QR Code Scan - QR002',
    description: 'Rail Pad component scanned',
    timestamp: '2024-09-17 13:45',
    status: 'synced',
    size: '0.5 MB',
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Inspection Report - QR003',
    description: 'Liner component needs attention',
    timestamp: '2024-09-16 16:20',
    status: 'failed',
    size: '1.8 MB',
  },
  {
    id: '4',
    type: 'report',
    title: 'AI Analysis Report - Track A-12',
    description: 'Performance analysis for track section',
    timestamp: '2024-09-16 11:15',
    status: 'synced',
    size: '5.2 MB',
  },
  {
    id: '5',
    type: 'scan',
    title: 'QR Code Scan - QR005',
    description: 'Rail Pad maintenance required',
    timestamp: '2024-09-15 09:30',
    status: 'pending',
    size: '0.7 MB',
  },
];

export default function SyncScreen() {
  const [syncData, setSyncData] = useState<SyncItem[]>(mockSyncData);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2024-09-17 12:00');
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'syncing':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'syncing':
        return 'sync';
      case 'failed':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return 'qr-code';
      case 'inspection':
        return 'clipboard';
      case 'report':
        return 'document-text';
      default:
        return 'document';
    }
  };

  const handleSyncAll = async () => {
    if (!isOnline) {
      Alert.alert('No Connection', 'Please check your internet connection and try again.');
      return;
    }

    setIsSyncing(true);
    
    // Simulate sync process
    const pendingItems = syncData.filter(item => item.status === 'pending' || item.status === 'failed');
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      
      // Update status to syncing
      setSyncData(prev => prev.map(syncItem => 
        syncItem.id === item.id ? { ...syncItem, status: 'syncing' } : syncItem
      ));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly succeed or fail for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      setSyncData(prev => prev.map(syncItem => 
        syncItem.id === item.id 
          ? { ...syncItem, status: success ? 'synced' : 'failed' } 
          : syncItem
      ));
    }
    
    setIsSyncing(false);
    setLastSyncTime(new Date().toLocaleString());
    
    Alert.alert(
      'Sync Complete',
      'Data synchronization completed successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleRetryItem = async (itemId: string) => {
    if (!isOnline) {
      Alert.alert('No Connection', 'Please check your internet connection and try again.');
      return;
    }

    setSyncData(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'syncing' } : item
    ));

    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate on retry
    
    setSyncData(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: success ? 'synced' : 'failed' } 
        : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSyncData(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const pendingCount = syncData.filter(item => item.status === 'pending').length;
  const failedCount = syncData.filter(item => item.status === 'failed').length;
  const syncedCount = syncData.filter(item => item.status === 'synced').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sync Manager</Text>
        <View style={styles.connectionStatus}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.syncOverview}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="cloud-upload" size={24} color="#2563eb" />
              <Text style={styles.overviewTitle}>Sync Status</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>{syncedCount}</Text>
                <Text style={styles.statLabel}>Synced</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{pendingCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>{failedCount}</Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>

            <View style={styles.lastSyncContainer}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.lastSyncText}>Last sync: {lastSyncTime}</Text>
            </View>

            <TouchableOpacity
              style={[styles.syncButton, (!isOnline || isSyncing) && styles.syncButtonDisabled]}
              onPress={handleSyncAll}
              disabled={!isOnline || isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="sync" size={20} color="#fff" />
              )}
              <Text style={styles.syncButtonText}>
                {isSyncing ? 'Syncing...' : 'Sync All'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Data Items</Text>
          
          {syncData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No data to sync</Text>
              <Text style={styles.emptyDescription}>
                Scan QR codes and complete inspections to see items here
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {syncData.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIcon}>
                      <Ionicons name={getTypeIcon(item.type) as any} size={20} color="#2563eb" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                    <View style={[styles.itemStatus, { backgroundColor: getStatusColor(item.status) }]}>
                      {item.status === 'syncing' ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
                      )}
                    </View>
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.itemDetail}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.itemDetailText}>{item.timestamp}</Text>
                    </View>
                    <View style={styles.itemDetail}>
                      <Ionicons name="document-outline" size={14} color="#6b7280" />
                      <Text style={styles.itemDetailText}>{item.size}</Text>
                    </View>
                  </View>

                  {(item.status === 'failed' || item.status === 'pending') && (
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => handleRetryItem(item.id)}
                        disabled={!isOnline}
                      >
                        <Ionicons name="refresh" size={16} color="#2563eb" />
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteItem(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
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
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  syncOverview: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  lastSyncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  lastSyncText: {
    fontSize: 14,
    color: '#6b7280',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
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
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  itemStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemDetailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
    gap: 4,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
  },
});
