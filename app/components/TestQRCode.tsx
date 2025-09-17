import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface TestQRCodeProps {
  qrCode: string;
  onPress?: () => void;
}

export default function TestQRCode({ qrCode, onPress }: TestQRCodeProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCode}>
          <Ionicons name="qr-code" size={80} color={Colors.textPrimary} />
        </View>
        <Text style={styles.qrCodeText}>{qrCode}</Text>
        <Text style={styles.instructionText}>
          Tap to simulate scanning this QR code
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCode: {
    width: 120,
    height: 120,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
