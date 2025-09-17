import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Mock QR code data for demonstration - realistic railway components
const mockQRData = {
  'QR001': {
    id: 'RFC-2024-7841',
    type: 'Pandrol e-Clip (Type PR401)',
    vendor: 'Pandrol India Pvt Ltd',
    lotNumber: 'PAN-EC-24-7841',
    manufactureDate: '2024-01-15',
    supplyDate: '2024-02-01',
    warrantyPeriod: '25 years',
    lastInspection: '2024-08-15',
    status: 'Active',
    location: 'New Delhi - Mumbai Corridor, KM 127+450',
  },
  'QR002': {
    id: 'RPD-2024-5632',
    type: 'Under Sleeper Pad (USP-Grade A)',
    vendor: 'Kamdhenu Rail Infrastructure Ltd',
    lotNumber: 'KAM-USP-24-5632',
    manufactureDate: '2024-02-10',
    supplyDate: '2024-02-20',
    warrantyPeriod: '15 years',
    lastInspection: '2024-09-01',
    status: 'Active',
    location: 'Chennai - Bangalore Line, KM 89+275',
  },
  'QR003': {
    id: 'SLR-2024-3298',
    type: 'Concrete Sleeper (PSC-09)',
    vendor: 'Railcon Systems Ltd',
    lotNumber: 'RAI-PSC-24-3298',
    manufactureDate: '2024-03-05',
    supplyDate: '2024-03-15',
    warrantyPeriod: '50 years',
    lastInspection: '2024-08-30',
    status: 'Needs Inspection',
    location: 'Howrah - Delhi Main Line, KM 234+680',
  },
};

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setShowCamera(false);
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate loading with progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 33.33;
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setIsLoading(false);
          
          // Check if we have mock data for this QR code
          const componentData = mockQRData[data as keyof typeof mockQRData];
          
          if (componentData) {
            router.push({
              pathname: '/component-detail',
              params: { componentData: JSON.stringify(componentData) }
            });
          } else {
            // If QR code not in our mock data, create a realistic railway component
            const railwayComponents = [
              { type: 'Rail Fastening System (RFS-14)', vendor: 'L&T Rail Infrastructure', warranty: '20 years' },
              { type: 'Elastic Rail Clip (ERC-7)', vendor: 'Vossloh Fastening Systems', warranty: '25 years' },
              { type: 'Rail Pad (EVA-Grade B)', vendor: 'Phoenix Yule Pvt Ltd', warranty: '10 years' },
              { type: 'Anchor Bolt (M24x160)', vendor: 'Usha Martin Rail Solutions', warranty: '30 years' },
              { type: 'Insulator (Nylon-66)', vendor: 'Kalindee Rail Nirman', warranty: '15 years' },
            ];
            
            const locations = [
              'Mumbai - Pune Expressway, KM 45+320',
              'Delhi - Jaipur Section, KM 156+890',
              'Kolkata - Bhubaneswar Route, KM 78+125',
              'Hyderabad - Bangalore Corridor, KM 203+450',
              'Chennai - Coimbatore Line, KM 112+675',
            ];
            
            const randomComponent = railwayComponents[Math.floor(Math.random() * railwayComponents.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            
            const genericComponent = {
              id: `RWY-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
              type: randomComponent.type,
              vendor: randomComponent.vendor,
              lotNumber: `${randomComponent.vendor.split(' ')[0].toUpperCase()}-${data}-24`,
              manufactureDate: '2024-01-01',
              supplyDate: '2024-02-01',
              warrantyPeriod: randomComponent.warranty,
              lastInspection: 'Recently Scanned',
              status: 'Active',
              location: randomLocation,
            };
            
            router.push({
              pathname: '/component-detail',
              params: { componentData: JSON.stringify(genericComponent) }
            });
          }
          return 100;
        }
        return Math.min(newProgress, 100); // Ensure it never exceeds 100%
      });
    }, 1000); // Update every second for 3 seconds
  };

  const startScanning = () => {
    if (hasPermission === null) {
      Alert.alert('Camera Permission', 'Requesting camera permission...');
      getCameraPermissions();
      return;
    }
    if (hasPermission === false) {
      Alert.alert('No Camera Access', 'Please enable camera permissions in settings to scan QR codes.');
      return;
    }
    setShowCamera(true);
    setScanned(false);
  };

  const simulateQRScan = (qrCode: string) => {
    handleBarcodeScanned({ type: 'QR', data: qrCode });
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={styles.camera}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Position QR code within the frame</Text>
            
            <View style={styles.scanInstructions}>
              <Ionicons name="qr-code-outline" size={60} color="rgba(255,255,255,0.8)" />
              <Text style={styles.instructionText}>
                Point your camera at a QR code{'\n'}
                The scan will happen automatically
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIcon}>
            <Ionicons name="qr-code" size={80} color={Colors.primary} />
          </View>
          <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
          
          <Text style={styles.loadingTitle}>Analyzing QR Code</Text>
          <Text style={styles.loadingSubtitle}>
            Fetching component details from database...
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${loadingProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(loadingProgress)}%</Text>
          </View>
          
          <View style={styles.loadingSteps}>
            <View style={styles.stepItem}>
              <Ionicons 
                name={loadingProgress > 0 ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={loadingProgress > 0 ? Colors.success : Colors.textLight} 
              />
              <Text style={[styles.stepText, { color: loadingProgress > 0 ? Colors.success : Colors.textLight }]}>
                QR Code Scanned
              </Text>
            </View>
            <View style={styles.stepItem}>
              <Ionicons 
                name={loadingProgress > 33 ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={loadingProgress > 33 ? Colors.success : Colors.textLight} 
              />
              <Text style={[styles.stepText, { color: loadingProgress > 33 ? Colors.success : Colors.textLight }]}>
                Connecting to Database
              </Text>
            </View>
            <View style={styles.stepItem}>
              <Ionicons 
                name={loadingProgress > 66 ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={loadingProgress > 66 ? Colors.success : Colors.textLight} 
              />
              <Text style={[styles.stepText, { color: loadingProgress > 66 ? Colors.success : Colors.textLight }]}>
                Loading Component Data
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle" size={40} color={Colors.primary} />
            <View>
              <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
              <Text style={styles.roleText}>{user?.role}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => router.replace('/login') },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanSection}>
          <View style={styles.scanCard}>
            <Ionicons name="qr-code" size={80} color={Colors.primary} />
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanDescription}>
              Scan QR codes on railway track fittings to view component details and inspection history
            </Text>
            <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/history')}
            >
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>View History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/sync')}
            >
              <Ionicons name="cloud-upload" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Sync Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  roleText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    padding: 8,
  },
  scanSection: {
    padding: 20,
  },
  scanCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  scanInstructions: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    gap: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingSteps: {
    width: '100%',
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
  },
  quickActions: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
});
