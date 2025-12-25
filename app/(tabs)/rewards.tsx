'use client';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

import { Theme } from '../../constants/theme';

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
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user!.id)
      .single();

    setPoints(wallet?.balance ?? 0);

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

      const { data, error } = await supabase.rpc('create_redemption', {
        uid: user.id,
        pts: reward.points_required,
      });

      if (error) throw error;

      setQrToken(data);
      setQrVisible(true);
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
      <View style={styles.rewardCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rewardTitle}>{item.title}</Text>
          <Text style={styles.rewardDesc}>{item.description}</Text>
        </View>

        <View style={styles.rewardFooter}>
          <Text style={styles.rewardPoints}>
            {item.points_required} pts
          </Text>

          <Pressable
            disabled={!canRedeem || loading}
            onPress={() => handleRedeem(item)}
            style={[
              styles.redeemButton,
              !canRedeem && styles.redeemDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.redeemText}>
                {canRedeem ? 'Redeem' : 'Locked'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Rewards</Text>
      <Text style={styles.subheader}>
        Redeem your Fresh Points for exclusive benefits
      </Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceValue}>{points}</Text>
        <Text style={styles.balanceLabel}>
          Fresh Points Available
        </Text>
      </View>

      {/* Rewards List */}
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: Theme.spacing.xl }}
        showsVerticalScrollIndicator={false}
      />

      {/* QR MODAL */}
      <Modal visible={qrVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Show this QR to our staff
            </Text>

            {qrToken && (
              <QRCode
                value={qrToken}
                size={220}
                backgroundColor="transparent"
                color={Theme.colors.textPrimary}
              />
            )}

            <Text style={styles.modalHint}>
              Valid for 10 minutes • One-time use
            </Text>

            <Pressable
              style={[
                styles.redeemButton,
                { marginTop: Theme.spacing.lg },
              ]}
              onPress={() => {
                setQrVisible(false);
                setQrToken(null);
              }}
            >
              <Text style={styles.redeemText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  balanceCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.xl,
    paddingVertical: Theme.spacing.xl,
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.card,
  },

  balanceValue: {
    fontSize: 38,
    fontWeight: '800',
    color: Theme.colors.primary,
  },

  balanceLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },

  rewardCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadow.card,
  },

  rewardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },

  rewardDesc: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },

  rewardFooter: {
    marginTop: Theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rewardPoints: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.primary,
  },

  redeemButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    ...Theme.shadow.button,
  },

  redeemDisabled: {
    backgroundColor: Theme.colors.border,
  },

  redeemText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },

  modalOverlay: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    width: '85%',
    ...Theme.shadow.card,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Theme.spacing.lg,
    color: Theme.colors.textPrimary,
  },

  modalHint: {
    marginTop: Theme.spacing.sm,
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
});
