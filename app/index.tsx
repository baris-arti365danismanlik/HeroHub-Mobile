import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('[Index] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'segments:', segments);

    if (isLoading) {
      console.log('[Index] Still loading, waiting...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    console.log('[Index] inAuthGroup:', inAuthGroup);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[Index] Not authenticated, redirecting to login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[Index] Authenticated in auth group, redirecting to tabs');
      router.replace('/(tabs)');
    } else if (isAuthenticated) {
      console.log('[Index] Authenticated, redirecting to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('[Index] Default case, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
