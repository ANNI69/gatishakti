import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  componentId?: string;
  actionRequired?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Inspection Overdue',
    message: 'Component QR003 (Liner) requires immediate inspection. Last inspection was 30 days ago.',
    timestamp: '2024-09-17 14:30',
    isRead: false,
    priority: 'high',
    componentId: 'QR003',
    actionRequired: true,
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance Required',
    message: 'Rail Pad QR005 shows signs of wear and requires maintenance within 7 days.',
    timestamp: '2024-09-17 12:15',
    isRead: false,
    priority: 'high',
    componentId: 'QR005',
    actionRequired: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'Sync Completed',
    message: 'Successfully synchronized 5 inspection reports to the central database.',
    timestamp: '2024-09-17 11:00',
    isRead: true,
    priority: 'low',
    actionRequired: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'Quality Check Passed',
    message: 'Elastic Rail Clip QR001 passed all quality parameters during routine inspection.',
    timestamp: '2024-09-16 16:45',
    isRead: true,
    priority: 'medium',
    componentId: 'QR001',
    actionRequired: false,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Warranty Expiring',
    message: 'Component QR002 warranty expires in 30 days. Consider scheduling replacement.',
    timestamp: '2024-09-16 09:20',
    isRead: false,
    priority: 'medium',
    componentId: 'QR002',
    actionRequired: false,
  },
  {
    id: '6',
    type: 'error',
    title: 'Sync Failed',
    message: 'Failed to upload inspection report for QR004. Check network connection.',
    timestamp: '2024-09-15 14:30',
    isRead: true,
    priority: 'medium',
    actionRequired: true,
  },
  {
    id: '7',
    type: 'info',
    title: 'New Component Added',
    message: 'New Elastic Rail Clip QR006 has been added to Track Section F-12.',
    timestamp: '2024-09-15 10:15',
    isRead: true,
    priority: 'low',
    actionRequired: false,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'high', label: 'High Priority' },
    { value: 'action', label: 'Action Required' },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      case 'maintenance':
        return 'construct';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'success':
        return '#10b981';
      case 'info':
        return '#3b82f6';
      case 'maintenance':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.isRead;
      case 'high':
        return notification.priority === 'high';
      case 'action':
        return notification.actionRequired;
      default:
        return true;
    }
  });

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    if (notification.componentId) {
      // Navigate to component detail
      const mockData = {
        id: notification.componentId,
        type: 'Railway Component',
        vendor: 'Railway Components Ltd.',
        lotNumber: `${notification.componentId}-LOT-001`,
        manufactureDate: '2024-01-15',
        supplyDate: '2024-02-01',
        warrantyPeriod: '5 years',
        lastInspection: '2024-08-15',
        status: notification.type === 'warning' ? 'Needs Inspection' : 'Active',
        location: 'Track Section A-12',
      };

      router.push({
        pathname: '/component-detail',
        params: { componentData: JSON.stringify(mockData) }
      });
    } else if (notification.actionRequired) {
      // Show action options
      Alert.alert(
        'Action Required',
        notification.message,
        [
          { text: 'Dismiss', style: 'cancel' },
          { text: 'Take Action', onPress: () => handleTakeAction(notification) },
        ]
      );
    }
  };

  const handleTakeAction = (notification: Notification) => {
    switch (notification.type) {
      case 'error':
        router.push('/sync');
        break;
      case 'warning':
      case 'maintenance':
        if (notification.componentId) {
          router.push({
            pathname: '/inspection-form',
            params: { 
              componentId: notification.componentId, 
              componentType: 'Railway Component' 
            }
          });
        }
        break;
      default:
        Alert.alert('Action', 'Action functionality will be implemented in the full version.');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    Alert.alert('Success', 'All notifications marked as read.');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={20} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{highPriorityCount}</Text>
              <Text style={styles.statLabel}>High Priority</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{actionRequiredCount}</Text>
              <Text style={styles.statLabel}>Action Required</Text>
            </View>
          </View>
        </View>

        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
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

        <View style={styles.notificationsSection}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyDescription}>
                {selectedFilter === 'all' 
                  ? 'You\'re all caught up! No new notifications.'
                  : `No notifications match the selected filter.`
                }
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.notificationCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationHeader}>
                    <View style={[
                      styles.notificationIcon,
                      { backgroundColor: getNotificationColor(notification.type) + '20' }
                    ]}>
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <View style={styles.notificationMeta}>
                          <View style={[
                            styles.priorityBadge,
                            { backgroundColor: getPriorityColor(notification.priority) }
                          ]}>
                            <Text style={styles.priorityText}>{notification.priority}</Text>
                          </View>
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <View style={styles.notificationFooter}>
                        <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                        {notification.actionRequired && (
                          <View style={styles.actionBadge}>
                            <Ionicons name="alert-circle" size={12} color="#ef4444" />
                            <Text style={styles.actionText}>Action Required</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersContainer: {
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
  notificationsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ef4444',
  },
});
