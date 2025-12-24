import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';

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
        setBalance(data.balance);
      }

      setLoading(false);
    };

    loadWallet();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C9A24D" />
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
          Earn points by watching ads or completing tasks
        </Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  /* Header */
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 15,
    color: '#6B6B6B',
    marginBottom: 32,
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    letterSpacing: 0.4,
    color: '#6B6B6B',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  balance: {
    fontSize: 44,
    fontWeight: '800',
    color: '#C9A24D',
    marginRight: 6,
  },
  points: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C9A24D',
    marginBottom: 6,
  },
  helper: {
    fontSize: 14,
    color: '#7A7A7A',
    lineHeight: 20,
  },
});
