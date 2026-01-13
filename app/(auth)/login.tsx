import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Info } from 'lucide-react-native';

export default function LoginScreen() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!userName || !password) {
      setError('Lütfen kullanıcı adı ve şifre giriniz');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login({ userName, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      const errorMessage = err.message || 'Giriş başarısız. Lütfen tekrar deneyin.';

      if (errorMessage.includes('locked') || errorMessage.includes('kilit') || errorMessage.includes('Lockout')) {
        setError('Hesabınız geçici olarak kilitlendi. 5 dakika sonra tekrar deneyin.');
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('geçersiz')) {
        setError('Kullanıcı adı veya şifre hatalı. 5 başarısız denemeden sonra hesabınız 5 dakika kilitlenecektir.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>HeroF2</Text>
        <Text style={styles.subtitle}>İnsan Kaynakları Yönetimi</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı / Telefon"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            keyboardType="default"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowPasswordPolicy(!showPasswordPolicy)}
          >
            <Info size={16} color="#007AFF" />
            <Text style={styles.infoButtonText}>Şifre Politikası</Text>
          </TouchableOpacity>

          {showPasswordPolicy && (
            <View style={styles.policyBox}>
              <Text style={styles.policyTitle}>Şifre Gereksinimleri:</Text>
              <Text style={styles.policyText}>• En az 6 karakter</Text>
              <Text style={styles.policyText}>• En az 1 büyük harf</Text>
              <Text style={styles.policyText}>• En az 1 küçük harf</Text>
              <Text style={styles.policyText}>• En az 1 rakam</Text>
              <View style={styles.policySeparator} />
              <Text style={styles.policyWarning}>
                <AlertCircle size={12} color="#ff9500" /> 5 başarısız giriş denemesinden sonra hesabınız 5 dakika kilitlenecektir.
              </Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#ff3b30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/reset-password')}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  infoButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  policyBox: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  policySeparator: {
    height: 1,
    backgroundColor: '#b3d9ff',
    marginVertical: 12,
  },
  policyWarning: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500',
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
});
