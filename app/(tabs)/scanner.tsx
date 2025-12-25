'use client';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';
import { Theme } from '../../constants/theme';

type Role = 'admin' | 'staff' | 'user';

type Redemption = {
  id: string;
  user_id: string;
  token: string;
  points: number;
  used: boolean;
  expires_at: string | null;
};

export default function ScannerScreen() {
  const { user } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  /* ---------------- LOAD ROLE ---------------- */
  useEffect(() => {
    if (!user) return;

    const loadRole = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setRole(data?.role ?? null);
      setLoading(false);
    };

    loadRole();
  }, [user]);

  /* ---------------- PERMISSIONS ---------------- */
  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Camera access is required to scan QR codes.
        </Text>
        <Text style={styles.link} onPress={requestPermission}>
          Grant permission
        </Text>
      </View>
    );
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  /* ---------------- ROLE PROTECTION ---------------- */
  if (role !== 'admin' && role !== 'staff') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Restricted Access</Text>
        <Text style={styles.text}>
          This scanner is only available to staff and administrators.
        </Text>
      </View>
    );
  }

  /* ---------------- HANDLE SCAN ---------------- */
  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const payload = JSON.parse(data);

      if (
        payload.type !== 'FRESHWALLET_REDEEM' ||
        !payload.token
      ) {
        throw new Error('Invalid QR');
      }

      const { data: redemption, error } = await supabase
        .from('redemptions')
        .select('*')
        .eq('token', payload.token)
        .single();

      if (error || !redemption) {
        throw new Error('Invalid or expired QR');
      }

      if (redemption.used) {
        throw new Error('QR already used');
      }

      if (
        redemption.expires_at &&
        new Date(redemption.expires_at) < new Date()
      ) {
        throw new Error('QR expired');
      }

      Alert.alert(
        'Confirm Redemption',
        `Points: ${redemption.points}\n\nDo you want to confirm this redemption?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: 'Confirm',
            style: 'default',
            onPress: () => confirmRedemption(redemption),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Invalid QR', err.message || 'Scan failed');
      setScanned(false);
    }
  };

  /* ---------------- CONFIRM ---------------- */
  const confirmRedemption = async (redemption: Redemption) => {
    const { error } = await supabase
      .from('redemptions')
      .update({
        used: true,
        redeemed_at: new Date().toISOString(),
        staff_id: user?.id,
      })
      .eq('id', redemption.id)
      .eq('used', false);

    if (error) {
      Alert.alert('Error', 'Failed to confirm redemption');
      setScanned(false);
      return;
    }

    Alert.alert('Success', 'Redemption completed successfully');
    setScanned(false);
  };

  /* ---------------- CAMERA ---------------- */
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Align the QR code within the frame
        </Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },

  text: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  link: {
    marginTop: Theme.spacing.md,
    color: Theme.colors.primary,
    fontWeight: '600',
  },

  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  overlayText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
