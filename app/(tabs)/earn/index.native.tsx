'use client';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { supabase } from '../../../context/supabase';
import { useAuth } from '../../../context/AuthContext';
import { Theme } from '../../../constants/theme';

import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-6139607066788405/7709574753';

const rewardAmount = 10;

export default function EarnTab() {
  const { user, session } = useAuth();

  const rewardedAd = useRef<RewardedAd | null>(null);
  const [loadingAd, setLoadingAd] = useState(true);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewardedAd.current = ad;

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoadingAd(false);
    });

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
      <Text style={styles.header}>Earn Fresh Points</Text>
      <Text style={styles.subheader}>
        Complete simple actions and grow your balance
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Watch & Earn</Text>

        <Text style={styles.rewardValue}>
          +{rewardAmount} <Text style={styles.points}>pts</Text>
        </Text>

        <Text style={styles.cardDescription}>
          Watch a short sponsored video and instantly receive Fresh Points.
        </Text>

        <Pressable
          style={[styles.button, (loadingAd || showing) && styles.disabled]}
          onPress={showAd}
          disabled={loadingAd || showing}
        >
          {loadingAd || showing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Watch Ad</Text>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          Points have no cash value and can only be used for rewards.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muted: { color: Theme.colors.textMuted, fontSize: 15 },
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
    padding: Theme.spacing.xl,
    ...Theme.shadow.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
  },
  rewardValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  points: { fontSize: 18, fontWeight: '600', color: Theme.colors.primary },
  cardDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.lg,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    ...Theme.shadow.button,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 17, fontWeight: '600' },
  disclaimer: {
    marginTop: Theme.spacing.md,
    fontSize: 12,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});
