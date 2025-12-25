import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === '(auth)';
    const isPublicRoute = firstSegment === 'privacy';

    // ✅ Allow public routes (Privacy Policy)
    if (isPublicRoute) return;

    if (!user && !inAuthGroup) {
      router.replace('/(auth)');
      return;
    }

    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
