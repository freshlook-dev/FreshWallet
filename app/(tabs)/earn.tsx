'use client';

import { View, Text, StyleSheet } from 'react-native';

export default function EarnScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earn Fresh Points</Text>

      <Text style={styles.subtitle}>
        Soon you will be able to earn Fresh Points by completing offers,
        watching videos, and participating in promotions.
      </Text>

      <View style={styles.card}>
        <Text style={styles.task}>• Complete partner offers</Text>
        <Text style={styles.task}>• Visit Fresh Look Aesthetics</Text>
        <Text style={styles.task}>• Special promotions & bonuses</Text>
      </View>

      <Text style={styles.note}>
        🚧 This section is under development
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  task: {
    fontSize: 16,
    marginBottom: 10,
  },
  note: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
});
