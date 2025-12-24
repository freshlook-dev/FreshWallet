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
      {/* Header */}
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.subheader}>Your account details</Text>

      {/* Account Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Signed in as</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role.toUpperCase()}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {(role === 'staff' || role === 'admin') && (
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('../scanner')}
          >
            <Text style={styles.actionText}>Open QR Scanner</Text>
          </Pressable>
        )}

        {(role === 'staff' || role === 'admin') && (
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.actionText}>Redemption History</Text>
          </Pressable>
        )}
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 24,
    paddingTop: 36,
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 15,
    color: '#6B6B6B',
    marginBottom: 28,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 14,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF4E8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C9A24D',
  },

  actions: {
    gap: 14,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
  },

  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#2B2B2B',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
