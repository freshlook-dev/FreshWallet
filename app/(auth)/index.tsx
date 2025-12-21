import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../context/supabase';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔐 SIGN IN
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // 🔄 IMPORTANT: REFRESH USER SESSION
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User session not found');
      }

      // 🚫 BLOCK UNVERIFIED USERS
      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError('Please verify your email before logging in.');
        return;
      }

      // ✅ COPY METADATA → PROFILE (NOW GUARANTEED)
      await supabase
        .from('profiles')
        .update({
          full_name: user.user_metadata?.full_name ?? null,
          gender: user.user_metadata?.gender ?? null,
          city: user.user_metadata?.city ?? null,
          phone: user.user_metadata?.phone ?? null,
        })
        .eq('id', user.id);

      // ❗ DO NOT NAVIGATE HERE
      // TabsLayout will redirect automatically

    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      Alert.alert('Please enter your email first');
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Email sent',
        'Verification email has been resent. Check your inbox or spam.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FreshWallet</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>


      <Pressable onPress={() => router.replace('/signup')}>
        <Text style={styles.link}>Create account</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FAF8F4',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2B2B2B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#C9A24D',
    padding: 16,
    borderRadius: 10,
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#2B2B2B',
    fontWeight: '500',
  },
  error: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 10,
  },
});
