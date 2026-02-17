import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { getStoredUser } from '../services/auth';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), senha);
      const stored = await getStoredUser();
      const dest = stored?.role === 'nutritionist' ? 'NutritionistHome' : 'Home';
      navigation.replace(dest);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/launch-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.greenOverlay} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />

        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoWhite}>food</Text>
              <Text style={styles.logoGreen}>ia</Text>
              <Text style={styles.logoWhite}>ry</Text>
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Entre em sua conta</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder=""
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder=""
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#18181b" />
                ) : (
                  <Text style={styles.submitButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.nutritionistButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('NutritionistRegister')}
            >
              <Text style={styles.nutritionistButtonText}>
                Sou nutricionista
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#65a30d',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  greenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#10b981',
    opacity: 0.1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 67,
  },
  logo: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  logoWhite: {
    color: '#fafafa',
  },
  logoGreen: {
    color: '#bef264',
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fafafa',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  submitButton: {
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
    lineHeight: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  nutritionistButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: 16,
  },
  nutritionistButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fafafa',
    lineHeight: 24,
  },
});
