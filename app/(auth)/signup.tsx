import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      {/* GENDER */}
      <View style={styles.row}>
        <Pressable
          style={[
            styles.genderBtn,
            gender === 'male' && styles.genderActive,
          ]}
          onPress={() => setGender('male')}
        >
          <Text>Male</Text>
        </Pressable>

        <Pressable
          style={[
            styles.genderBtn,
            gender === 'female' && styles.genderActive,
          ]}
          onPress={() => setGender('female')}
        >
          <Text>Female</Text>
        </Pressable>
      </View>

      {/* CITY DROPDOWN */}
      <Pressable
        style={styles.input}
        onPress={() => setCityModal(true)}
      >
        <Text style={{ color: city ? '#000' : '#999' }}>
          {city || 'Select City'}
        </Text>
      </Pressable>

      {/* CITY MODAL */}
      <Modal visible={cityModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select City</Text>

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
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => setCityModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      <TextInput
        placeholder="+383..."
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

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

      <Text style={styles.strength}>
        Password strength: {passwordStrength()}
      </Text>

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* TERMS */}
      <Pressable
        style={styles.checkboxRow}
        onPress={() => setAgree(!agree)}
      >
        <View style={[styles.checkbox, agree && styles.checked]} />
        <Text>I agree to the Terms & Privacy Policy</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  genderBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderActive: {
    backgroundColor: '#C9A24D',
  },
  strength: {
    marginBottom: 8,
    color: '#2B2B2B',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#C9A24D',
  },
  button: {
    backgroundColor: '#C9A24D',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
  error: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FAF8F4',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  cityItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cityText: {
    fontSize: 16,
  },
});
