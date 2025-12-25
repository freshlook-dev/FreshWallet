import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';

import { Theme } from '../../constants/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadWallet = async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setBalance(data.balance ?? 0);
      }

      setLoading(false);
    };

    loadWallet();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>FreshWallet</Text>
      <Text style={styles.subheader}>Your loyalty balance</Text>

      {/* Balance Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Available Balance</Text>

        <View style={styles.balanceRow}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.points}>pts</Text>
        </View>

        <Text style={styles.helper}>
          Earn points by watching ads or completing tasks.
        </Text>

        <Text style={styles.disclaimer}>
          Points have no cash value and can only be used for rewards.
        </Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
  },

  /* Header */
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },

  subheader: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },

  /* Card */
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    ...Theme.shadow.card,
  },

  cardLabel: {
    fontSize: 14,
    letterSpacing: 0.4,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.sm,
    textTransform: 'uppercase',
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Theme.spacing.sm,
  },

  balance: {
    fontSize: 44,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginRight: Theme.spacing.xs,
  },

  points: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginBottom: 6,
  },

  helper: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },

  disclaimer: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },
});
