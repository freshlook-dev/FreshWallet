'use client';

import { ScrollView, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';

export default function DeleteAccountScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account & Data Deletion</Text>

      <Text style={styles.text}>
        FreshWallet respects your privacy and your right to control your data.
      </Text>

      <Text style={styles.heading}>How to request account deletion</Text>
      <Text style={styles.text}>
        To request deletion of your FreshWallet account and associated data,
        please follow these steps:
        {'\n\n'}
        1. Send an email to:
        {'\n'}📧 support@freshlookaesthetics.com
        {'\n\n'}
        2. Use the subject line:
        {'\n'}“Delete FreshWallet Account”
        {'\n\n'}
        3. In the email body, include:
        {'\n'}• Your registered email address
        {'\n'}• A clear request to delete your account
      </Text>

      <Text style={styles.heading}>What data is deleted</Text>
      <Text style={styles.text}>
        Upon verification, we will permanently delete:
        {'\n'}• Your user account
        {'\n'}• Profile information
        {'\n'}• Earned points and rewards history
      </Text>

      <Text style={styles.heading}>Data retention</Text>
      <Text style={styles.text}>
        Some non-personal or legally required records may be retained for up to
        30 days for compliance and security purposes, after which they are
        permanently removed.
      </Text>

      <Text style={styles.heading}>Contact</Text>
      <Text style={styles.text}>
        If you have any questions, contact us at:
        {'\n'}📧 support@freshlookaesthetics.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  text: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
});
