'use client';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../context/supabase';
import { Theme } from '../../constants/theme';

const KOSOVO_CITIES = [
  'Prishtinë',
  'Prizren',
  'Pejë',
  'Gjakovë',
  'Mitrovicë',
  'Ferizaj',
  'Gjilan',
  'Vushtrri',
  'Podujevë',
  'Suharekë',
  'Rahovec',
  'Drenas',
  'Malishevë',
  'Skenderaj',
  'Kaçanik',
  'Istog',
  'Deçan',
  'Klinë',
  'Lipjan',
  'Obiliq',
  'Fushë Kosovë',
  'Shtime',
  'Dragash',
  'Kamenicë',
  'Viti',
];

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [city, setCity] = useState('');
  const [cityModal, setCityModal] = useState(false);
  const [phone, setPhone] = useState('+383');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- PASSWORD STRENGTH ---------------- */
  const passwordStrength = () => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
    return 'Medium';
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async () => {
    if (
      !fullName ||
      !gender ||
      !city ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return setError('Please fill all fields');
    }

    if (!phone.startsWith('+383')) {
      return setError('Phone number must start with +383');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!agree) {
      return setError('You must accept the Privacy Policy');
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            gender,
            city,
            phone,
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        'Account created',
        'Please verify your email before logging in.'
      );

      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <Text style={styles.logo}>FreshWallet</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {/* Card */}
      <View style={styles.card}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor={Theme.colors.inputPlaceholder}
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        {/* Gender */}
        <View style={styles.genderRow}>
          <Pressable
            style={[
              styles.genderBtn,
              gender === 'male' && styles.genderActive,
            ]}
            onPress={() => setGender('male')}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'male' && styles.genderTextActive,
              ]}
            >
              Male
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.genderBtn,
              gender === 'female' && styles.genderActive,
            ]}
            onPress={() => setGender('female')}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'female' && styles.genderTextActive,
              ]}
            >
              Female
            </Text>
          </Pressable>
        </View>

        {/* City */}
        <Pressable
          style={styles.input}
          onPress={() => setCityModal(true)}
        >
          <Text
            style={{
              color: city
                ? Theme.colors.textPrimary
                : Theme.colors.inputPlaceholder,
            }}
          >
            {city || 'Select city'}
          </Text>
        </Pressable>

        {/* Phone */}
        <TextInput
          placeholder="+383..."
          placeholderTextColor={Theme.colors.inputPlaceholder}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Email address"
          placeholderTextColor={Theme.colors.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={Theme.colors.inputPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.strength}>
          Password strength:{' '}
          <Text style={styles.strengthValue}>
            {passwordStrength()}
          </Text>
        </Text>

        <TextInput
          placeholder="Confirm password"
          placeholderTextColor={Theme.colors.inputPlaceholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* Privacy Policy */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAgree(!agree)}
        >
          <View style={[styles.checkbox, agree && styles.checked]} />
          <Text style={styles.checkboxText}>
            I agree to the{' '}
            <Text
              style={styles.policyLink}
              onPress={() => router.push('../privacy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </Pressable>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Create account</Text>
          )}
        </Pressable>
      </View>

      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.link}>
          Already have an account?{' '}
          <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </Pressable>

      {/* CITY MODAL */}
      <Modal visible={cityModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select city</Text>

          <ScrollView>
            {KOSOVO_CITIES.map((c) => (
              <Pressable
                key={c}
                style={styles.cityItem}
                onPress={() => {
                  setCity(c);
                  setCityModal(false);
                }}
              >
                <Text style={styles.cityText}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={[styles.button, { marginTop: Theme.spacing.md }]}
            onPress={() => setCityModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
  },

  logo: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 40,
    color: Theme.colors.primary,
  },

  subtitle: {
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.xs,
  },

  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.card,
  },

  input: {
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    borderRadius: Theme.radius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.inputBackground,
    color: Theme.colors.textPrimary,
  },

  genderRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },

  genderBtn: {
    flex: 1,
    borderRadius: Theme.radius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    backgroundColor: Theme.colors.inputBackground,
  },

  genderActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },

  genderText: {
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },

  genderTextActive: {
    color: '#000',
  },

  strength: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xs,
  },

  strengthValue: {
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginVertical: Theme.spacing.sm,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: Theme.radius.xs,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },

  checked: {
    backgroundColor: Theme.colors.primary,
  },

  checkboxText: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
  },

  policyLink: {
    textDecorationLine: 'underline',
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },

  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    ...Theme.shadow.button,
  },

  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  link: {
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
    color: Theme.colors.textSecondary,
  },

  linkBold: {
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.error,
  },

  errorText: {
    color: Theme.colors.error,
    fontSize: 13,
  },

  modalContainer: {
    flex: 1,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
  },

  cityItem: {
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },

  cityText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
  },
});
