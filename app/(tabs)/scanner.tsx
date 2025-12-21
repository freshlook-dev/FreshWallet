import { View, Text, StyleSheet, Platform } from 'react-native';

export default function ScannerScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>
        Scanner will be enabled in a future update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
