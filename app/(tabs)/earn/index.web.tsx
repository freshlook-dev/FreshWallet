'use client';

import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';

const rewardAmount = 10;

export default function EarnTab() {
  const { user } = useAuth();

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
          Rewarded ads are available in the FreshWallet mobile app.
        </Text>

        <Text style={styles.webNotice}>
          Please use the Android or iOS app to earn points.
        </Text>

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
  webNotice: {
    textAlign: 'center',
    color: Theme.colors.textMuted,
    marginVertical: Theme.spacing.md,
  },
  disclaimer: {
    marginTop: Theme.spacing.md,
    fontSize: 12,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});
