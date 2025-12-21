import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../context/supabase';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'staff' | 'admin'>('user');

  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.role) setRole(data.role);
      });
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {/* 🔐 STAFF ONLY BUTTON */}
      {(role === 'staff' || role === 'admin') && (
        <Pressable
          style={styles.scannerButton}
          onPress={() => router.push('../scanner')}
        >
          <Text style={styles.scannerText}>Open QR Scanner</Text>
        </Pressable>
      )}

      <Pressable
  style={styles.scannerButton}
  onPress={() => router.push('/history')}
>
  <Text style={styles.scannerText}>Redemption History</Text>
</Pressable>


      <Pressable style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FAF8F4',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    marginBottom: 24,
    color: '#555',
  },
  scannerButton: {
    backgroundColor: '#C9A24D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  scannerText: {
    color: '#fff',
    fontWeight: '700',
  },
  logout: {
    backgroundColor: '#2B2B2B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});
