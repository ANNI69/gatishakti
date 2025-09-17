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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleFeaturePress = (feature: string) => {
    Alert.alert(
      'Feature Coming Soon',
      `${feature} will be available in the full version of the app.`,
      [{ text: 'OK' }]
    );
  };

  const menuItems = [
    {
      id: 'sync',
      title: 'Sync Manager',
      subtitle: 'Manage offline data synchronization',
      icon: 'cloud-upload-outline',
      onPress: () => router.push('/sync'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      icon: 'settings-outline',
      onPress: () => handleFeaturePress('Settings'),
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      subtitle: 'Create AI-based analysis reports',
      icon: 'document-text-outline',
      onPress: () => handleFeaturePress('Report Generation'),
    },
    {
      id: 'export',
      title: 'Export Data',
      subtitle: 'Export inspection data and history',
      icon: 'download-outline',
      onPress: () => handleFeaturePress('Data Export'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'User guide and technical support',
      icon: 'help-circle-outline',
      onPress: () => handleFeaturePress('Help & Support'),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      onPress: () => handleFeaturePress('About'),
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Worker':
        return 'hammer';
      case 'Inspector':
        return 'search';
      case 'Admin':
        return 'shield-checkmark';
      default:
        return 'person';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Worker':
        return '#10b981';
      case 'Inspector':
        return '#3b82f6';
      case 'Admin':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(user?.role || '') + '20' }]}>
              <Ionicons
                name={getRoleIcon(user?.role || '')}
                size={40}
                color={getRoleColor(user?.role || '')}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.username || 'User'}</Text>
              <View style={styles.roleContainer}>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role || '') }]}>
                  <Text style={styles.roleText}>{user?.role || 'User'}</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>user@railways.gov.in</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="qr-code" size={20} color="#2563eb" />
              </View>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>QR Scans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="clipboard" size={20} color="#10b981" />
              </View>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Inspections</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="document-text" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemIcon}>
                  <Ionicons name={item.icon as any} size={24} color="#6b7280" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.appInfoSection}>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <Ionicons name="train" size={24} color="#2563eb" />
              <Text style={styles.appInfoTitle}>Railway Track Fittings QR System</Text>
            </View>
            <Text style={styles.appInfoVersion}>Version 1.0.0 (Demo)</Text>
            <Text style={styles.appInfoDescription}>
              Smart India Hackathon 2025 - Problem Statement ID 25021
            </Text>
            <Text style={styles.appInfoOrg}>Ministry of Railways</Text>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
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
  profileSection: {
    padding: 20,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  roleContainer: {
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  appInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  appInfoVersion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  appInfoOrg: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
