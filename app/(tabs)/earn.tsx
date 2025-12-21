'use client';

import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { WebView } from 'react-native-webview';

export default function EarnScreen() {
  const { user, loading } = useAuth();

  // While auth is loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🔒 Block if not logged in
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Please sign in to access offers.
        </Text>
      </View>
    );
  }

  // 🔑 BitLabs Offerwall URL (with user id)
  const offerwallUrl = `https://web.bitlabs.ai/?token=8f2b299-d796-471b-94f8-69bf30lc003d&uid=${user.id}`;


  // 🌐 Web fallback (Vercel)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Offerwall is available on the mobile app.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: offerwallUrl }}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F4',
  },
  text: {
    fontSize: 16,
    color: '#444',
  },
});
