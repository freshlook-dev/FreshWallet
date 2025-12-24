import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

type Redemption = {
  id: string;
  points: number;
  redeemed_at: string;
  user_id: string;
};

export default function RedemptionHistoryScreen() {
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

  /* 📜 LOAD HISTORY */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('redemptions')
      .select('id, points, redeemed_at, user_id')
      .eq('used', true)
      .order('redeemed_at', { ascending: false })
      .limit(100);

    if (!error) {
      setItems(data ?? []);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: Redemption }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.points}>{item.points} pts</Text>
        <Text style={styles.date}>
          {new Date(item.redeemed_at).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.user}>
        User ID: {item.user_id.slice(0, 8)}…
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Redemption History</Text>
      <Text style={styles.subheader}>
        Recent redeemed rewards by customers
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C9A24D" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 15,
    color: '#6B6B6B',
    marginBottom: 22,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  points: {
    fontSize: 18,
    fontWeight: '800',
    color: '#C9A24D',
  },

  date: {
    fontSize: 12,
    color: '#777',
  },

  user: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
  },
});
