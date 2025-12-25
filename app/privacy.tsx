'use client';

import { ScrollView, Text, StyleSheet, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.text}>
        FreshWallet respects your privacy and is committed to protecting your personal data.
        This Privacy Policy explains how we collect, use, and protect your information.
      </Text>

      <Text style={styles.heading}>Information We Collect</Text>
      <Text style={styles.text}>
        • Full name{'\n'}
        • Email address{'\n'}
        • Phone number{'\n'}
        • City and gender{'\n'}
        • App usage data related to rewards
      </Text>

      <Text style={styles.heading}>How We Use Your Data</Text>
      <Text style={styles.text}>
        Your data is used to:
        {'\n'}• Create and manage your account
        {'\n'}• Track loyalty points
        {'\n'}• Prevent fraud and abuse
        {'\n'}• Improve app experience
      </Text>

      <Text style={styles.heading}>Advertising</Text>
      <Text style={styles.text}>
        FreshWallet uses Google AdMob rewarded ads.
        Watching ads is optional and rewards users with loyalty points.
        No real money or cash payouts are offered.
      </Text>

      <Text style={styles.heading}>Data Sharing</Text>
      <Text style={styles.text}>
        We do not sell or share personal data with third parties,
        except services required to operate the app (such as Supabase and Google AdMob).
      </Text>

      <Text style={styles.heading}>Your Rights</Text>
      <Text style={styles.text}>
        You may request account deletion at any time by contacting support.
      </Text>

      <Text style={styles.footer}>
        Last updated: {new Date().getFullYear()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  back: {
    color: Theme.colors.primary,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: Theme.spacing.md,
    color: Theme.colors.textPrimary,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Theme.colors.textSecondary,
  },
  footer: {
    marginTop: Theme.spacing.xl,
    fontSize: 12,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});
