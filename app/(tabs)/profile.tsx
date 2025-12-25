import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../context/supabase';
import { useEffect, useState } from 'react';

import { Theme } from '../../constants/theme';

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
          <Text style={styles.roleText}>
            {role.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* 👤 USER ONLY */}
        {role === 'user' && (
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.actionText}>
              My Redemptions
            </Text>
          </Pressable>
        )}

        {/* 🧑‍💼 STAFF / ADMIN */}
        {(role === 'staff' || role === 'admin') && (
          <>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push('/scanner')}
            >
              <Text style={styles.actionText}>
                Open QR Scanner
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => router.push('../staff-history')}
            >
              <Text style={styles.actionText}>
                Staff Redemption History
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Logout */}
      <Pressable
        style={styles.logoutButton}
        onPress={signOut}
      >
        <Text style={styles.logoutText}>
          Log out
        </Text>
      </Pressable>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },

  subheader: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },

  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadow.card,
  },

  cardLabel: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xs,
  },

  email: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },

  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },

  actions: {
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xxl,
  },

  actionButton: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadow.card,
  },

  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },

  logoutButton: {
    marginTop: 'auto',
    backgroundColor: Theme.colors.error,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadow.button,
  },

  logoutText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
