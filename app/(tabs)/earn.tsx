'use client';

import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';

/* ================= CONFIG ================= */

// 🔴 TEST ID (use while testing)
const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-6139607066788405/7709574753'; // ✅ YOUR REAL AD UNIT

const rewardAmount = 10; // 🎁 points per ad

/* ================= SCREEN ================= */

export default function EarnTab() {
  const { user } = useAuth();

  const [loadingAd, setLoadingAd] = useState(false);
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);

  /* ---------- INIT AD ---------- */
  useEffect(() => {
    if (!user) return;

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    setRewardedAd(ad);

    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoadingAd(false);
      }
    );

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async () => {
        await rewardUser();
      }
    );

    ad.load();
    setLoadingAd(true);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [user]);

  /* ---------- REWARD LOGIC ---------- */
  const rewardUser = async () => {
    if (!user) return;

    try {
      // 1️⃣ Update wallet
      const { error } = await supabase.rpc('increment_wallet_balance', {
        p_user_id: user.id,
        p_amount: rewardAmount,
      });

      if (error) throw error;

      // 2️⃣ Log transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: rewardAmount,
        type: 'rewarded_ad',
      });

      Alert.alert(
        '🎉 Reward Earned!',
        `You received ${rewardAmount} points`
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to reward points');
    }
  };

  /* ---------- SHOW AD ---------- */
  const showAd = async () => {
    if (!rewardedAd) return;

    try {
      await rewardedAd.show();
    } catch {
      Alert.alert('Ad not ready', 'Please try again in a moment');
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Please log in to earn points</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earn Points</Text>

      <Text style={styles.subtitle}>
        Watch a short ad and earn {rewardAmount} points
      </Text>

      <Pressable
        style={styles.button}
        onPress={showAd}
        disabled={loadingAd}
      >
        {loadingAd ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Watch Ad</Text>
        )}
      </Pressable>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
});
