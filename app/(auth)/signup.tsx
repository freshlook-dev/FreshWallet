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
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../context/supabase';

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
      return setError('You must accept Terms & Privacy Policy');
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo:
            Platform.OS === 'web'
              ? 'http://localhost:8081'
              : undefined,
          data: {
            full_name: fullName,
            gender,
            city,
            phone,
          },
        },
      });

      if (error) throw error;

      alert(
        'Account created successfully!\nPlease verify your email before logging in.'
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
          placeholderTextColor="#999"
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
          <Text style={{ color: city ? '#1F1F1F' : '#999' }}>
            {city || 'Select city'}
          </Text>
        </Pressable>

        {/* Phone */}
        <TextInput
          placeholder="+383..."
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
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
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* Terms */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAgree(!agree)}
        >
          <View style={[styles.checkbox, agree && styles.checked]} />
          <Text style={styles.checkboxText}>
            I agree to the Terms & Privacy Policy
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
            <ActivityIndicator color="#fff" />
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
            style={[styles.button, { marginTop: 16 }]}
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
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 24,
  },

  logo: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 40,
    color: '#1F1F1F',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B6B6B',
    marginBottom: 28,
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },

  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  genderBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
  },
  genderActive: {
    backgroundColor: '#C9A24D',
    borderColor: '#C9A24D',
  },
  genderText: {
    color: '#6B6B6B',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },

  strength: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  strengthValue: {
    fontWeight: '600',
    color: '#1F1F1F',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  checked: {
    backgroundColor: '#C9A24D',
  },
  checkboxText: {
    color: '#2B2B2B',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#C9A24D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B6B6B',
  },
  linkBold: {
    color: '#1F1F1F',
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  errorText: {
    color: '#C62828',
    fontSize: 13,
  },

  modalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FAF8F4',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
  },
  cityItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  cityText: {
    fontSize: 16,
    color: '#1F1F1F',
  },
});
