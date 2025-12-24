'use client';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import { supabase } from '../../context/supabase';
import { useAuth } from '../../context/AuthContext';

/* ================= CONFIG ================= */

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-6139607066788405/7709574753';

const rewardAmount = 10;

/* ================= SCREEN ================= */

export default function EarnTab() {
  const { user, session } = useAuth();

  const rewardedAd = useRef<RewardedAd | null>(null);
  const [loadingAd, setLoadingAd] = useState(true);
  const [showing, setShowing] = useState(false);

  /* ---------- INIT AD ---------- */
  useEffect(() => {
    if (!user) return;

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewardedAd.current = ad;

    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoadingAd(false);
      }
    );

    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async () => {
        await rewardUser();
      }
    );

    ad.load();

    return () => {
      unsubLoaded();
      unsubEarned();
    };
  }, [user]);

  /* ---------- CALL EDGE FUNCTION ---------- */
  const rewardUser = async () => {
    if (!user || !session) return;

    try {
      const response = await fetch(
        'https://iajjypnqzeyyhdfzrxvw.supabase.co/functions/v1/earn_rewarded_ad',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            amount: rewardAmount,
          }),
        }
      );

      if (!response.ok) throw new Error('Reward failed');

      Alert.alert(
        '🎉 Points Added',
        `${rewardAmount} Fresh Points have been added to your wallet`
      );
    } catch {
      Alert.alert('Error', 'Failed to reward points');
    }
  };

  /* ---------- SHOW AD ---------- */
  const showAd = async () => {
    if (!rewardedAd.current) return;

    try {
      setShowing(true);
      await rewardedAd.current.show();
      rewardedAd.current.load();
      setShowing(false);
    } catch {
      setShowing(false);
      Alert.alert('Ad not ready', 'Please try again shortly');
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Please log in to earn points</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Earn Fresh Points</Text>
      <Text style={styles.subheader}>
        Complete simple actions and grow your balance
      </Text>

      {/* Earn Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Watch & Earn</Text>

        <Text style={styles.rewardValue}>
          +{rewardAmount} <Text style={styles.points}>pts</Text>
        </Text>

        <Text style={styles.cardDescription}>
          Watch a short sponsored video and instantly receive Fresh Points.
        </Text>

        <Pressable
          style={[
            styles.button,
            (loadingAd || showing) && styles.disabled,
          ]}
          onPress={showAd}
          disabled={loadingAd || showing}
        >
          {loadingAd || showing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Watch Ad</Text>
          )}
        </Pressable>
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
  muted: {
    color: '#777',
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 24,
    paddingTop: 40,
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
    marginBottom: 28,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2B2B2B',
  },
  rewardValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#C9A24D',
    marginBottom: 8,
  },
  points: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    marginBottom: 24,
  },

  button: {
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
