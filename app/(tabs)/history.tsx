import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
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
      <Text style={styles.points}>{item.points} pts</Text>
      <Text style={styles.meta}>
        User: {item.user_id.slice(0, 8)}…
      </Text>
      <Text style={styles.meta}>
        {new Date(item.redeemed_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redemption History</Text>

      {loading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
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
    marginBottom: 16,
  },
  loading: {
    color: '#ccc',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  points: {
    color: '#C9A24D',
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: '#aaa',
    marginTop: 4,
    fontSize: 12,
  },
});
