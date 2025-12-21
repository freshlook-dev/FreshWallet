import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';

export default function StaffScannerScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  /* 🔐 STAFF / ADMIN CHECK */
  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.role !== 'staff' && data?.role !== 'admin') {
          Alert.alert('Access denied', 'Staff only');
          router.replace('/'); // kick non-staff out
        }
        setCheckingRole(false);
      });
  }, [user]);

  /* 📷 CAMERA PERMISSION */
  useEffect(() => {
    (async () => {
      const { status } =
        await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      const { data: success, error } = await supabase.rpc(
        'redeem_token',
        { t: data }
      );

      if (error) throw error;

      if (success) {
        Alert.alert('✅ Redeemed', 'Points successfully redeemed');
      } else {
        Alert.alert(
          '❌ Invalid QR',
          'Expired, already used, or invalid QR code'
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to redeem QR code');
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <View style={styles.center}>
        <Text>Checking access…</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff QR Scanner</Text>

      <View style={styles.scanner}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleScan}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {scanned && (
        <Pressable
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  scanner: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#C9A24D',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
