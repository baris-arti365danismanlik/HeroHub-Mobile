import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [forceRedirect, setForceRedirect] = useState(false);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.log('Index - Fallback timeout, forcing redirect to login');
      setForceRedirect(true);
      router.replace('/(auth)/login');
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [router]);

  useEffect(() => {
    console.log('Index - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

    if (!isLoading && !forceRedirect) {
      const timer = setTimeout(() => {
        console.log('Index - Redirecting to:', isAuthenticated ? '/(tabs)' : '/(auth)/login');
        try {
          if (isAuthenticated) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router, forceRedirect]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Yükleniyor...</Text>
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
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
