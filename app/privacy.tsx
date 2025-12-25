'use client';

import { ScrollView, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: January 2025</Text>

      <Text style={styles.text}>
        FreshWallet values your privacy. This Privacy Policy explains how we
        collect, use, and protect your information when you use our application.
      </Text>

      <Text style={styles.heading}>1. Information We Collect</Text>
      <Text style={styles.text}>
        We may collect the following information:
        {'\n'}• Account information (such as email or username)
        {'\n'}• Usage data (app interactions and features used)
        {'\n'}• Device information (platform, operating system)
      </Text>

      <Text style={styles.heading}>2. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use your information to:
        {'\n'}• Provide and maintain app functionality
        {'\n'}• Track earned points and rewards
        {'\n'}• Improve user experience
        {'\n'}• Prevent fraud and abuse
      </Text>

      <Text style={styles.heading}>3. Advertising</Text>
      <Text style={styles.text}>
        FreshWallet uses Google AdMob rewarded ads. AdMob may collect device
        identifiers and usage data to provide and improve advertising services.
        {'\n\n'}
        You can learn more about how Google uses data here:
        {'\n'}https://policies.google.com/privacy
      </Text>

      <Text style={styles.heading}>4. Data Sharing</Text>
      <Text style={styles.text}>
        We do not sell or rent your personal data. Data may be shared only with
        trusted third-party services required to operate the app (such as
        authentication, database, and ads).
      </Text>

      <Text style={styles.heading}>5. Data Security</Text>
      <Text style={styles.text}>
        We take reasonable measures to protect your data. However, no method of
        transmission over the internet is 100% secure.
      </Text>

      <Text style={styles.heading}>6. Children’s Privacy</Text>
      <Text style={styles.text}>
        FreshWallet is not intended for children under the age of 13. We do not
        knowingly collect personal data from children.
      </Text>

      <Text style={styles.heading}>7. Changes to This Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy from time to time. Changes will be
        reflected on this page.
      </Text>

      <Text style={styles.heading}>8. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions about this Privacy Policy, please contact us
        at:
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
    marginBottom: Theme.spacing.sm,
  },
  updated: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.lg,
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
