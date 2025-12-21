'use client';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

type Reward = {
  id: string;
  title: string;
  points_required: number;
  description: string;
};

export default function RewardsScreen() {
  const { user } = useAuth();

  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    // ✅ Load wallet balance (CORRECT)
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user!.id)
      .single();

    setPoints(wallet?.balance ?? 0);

    // ✅ Load rewards
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .order('points_required', { ascending: true });

    setRewards(data ?? []);
  };

  const handleRedeem = async (reward: Reward) => {
    const confirmed =
      Platform.OS === 'web'
        ? window.confirm(
            `Redeem ${reward.points_required} points for this reward?`
          )
        : true;

    if (!confirmed || !user) return;

    try {
      setLoading(true);

      // 🔐 Create one-time redemption token
      const { data, error } = await supabase.rpc('create_redemption', {
        uid: user.id,
        pts: reward.points_required,
      });

      if (error) throw error;

      setQrToken(data);
      setQrVisible(true);

      // Refresh balance
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to generate redemption QR.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Reward }) => {
    const canRedeem = points >= item.points_required;

    return (
      <View style={styles.card}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
        <Text style={styles.points}>{item.points_required} points</Text>
        <Text style={styles.desc}>{item.description}</Text>

        <Pressable
          disabled={!canRedeem || loading}
          onPress={() => handleRedeem(item)}
          style={[
            styles.button,
            { backgroundColor: canRedeem ? '#C9A24D' : '#ccc' },
          ]}
        >
          <Text style={styles.buttonText}>
            {canRedeem ? 'Redeem' : 'Not enough points'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Rewards</Text>
      <Text style={styles.subtitle}>
        Use your Fresh Points for discounts
      </Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balance}>{points}</Text>
        <Text style={styles.balanceLabel}>Fresh Points</Text>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* 🔳 QR MODAL */}
      <Modal visible={qrVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Show this QR to staff</Text>

            {qrToken && <QRCode value={qrToken} size={220} />}

            <Text style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
              Valid for 10 minutes • One-time use
            </Text>

            <Pressable
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => {
                setQrVisible(false);
                setQrToken(null);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    color: '#ccc',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#2B2B2B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  balance: {
    fontSize: 36,
    fontWeight: '800',
    color: '#C9A24D',
  },
  balanceLabel: {
    color: '#fff',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  points: {
    marginTop: 4,
    color: '#C9A24D',
    fontWeight: '600',
  },
  desc: {
    color: '#666',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#C9A24D',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalOverlay: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});
