'use client';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';
import { Theme } from '../../constants/theme';

type Redemption = {
  id: string;
  points: number;
  redeemed_at: string;
  user_id: string;
  staff_id: string | null;
};

export default function StaffRedemptionHistoryScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Redemption[]>([]);

  /* 🔐 STAFF / ADMIN PROTECTION */
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
          router.replace('/');
        }
      });
  }, [user]);

  /* 📜 LOAD GLOBAL HISTORY */
  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('redemptions')
        .select('id, points, redeemed_at, user_id, staff_id')
        .eq('used', true)
        .order('redeemed_at', { ascending: false })
        .limit(200);

      if (!error && data) {
        setItems(data);
      }

      setLoading(false);
    };

    loadHistory();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          No redemptions have been recorded yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>All Redemptions</Text>
      <Text style={styles.subheader}>
        Global redemption activity
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: Theme.spacing.xl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.points}>
                {item.points} pts
              </Text>
              <Text style={styles.date}>
                {new Date(item.redeemed_at).toLocaleString()}
              </Text>
            </View>

            <Text style={styles.meta}>
              User: {item.user_id.slice(0, 8)}…
            </Text>

            {item.staff_id && (
              <Text style={styles.meta}>
                Staff: {item.staff_id.slice(0, 8)}…
              </Text>
            )}
          </View>
        )}
      />
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
    marginBottom: Theme.spacing.lg,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },

  emptyText: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadow.card,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  points: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.primary,
  },

  date: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },

  meta: {
    marginTop: Theme.spacing.xs,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
});
