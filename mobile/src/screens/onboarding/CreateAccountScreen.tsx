import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { useAuth } from '../../contexts/AuthContext';
import { completeOnboarding } from '../../services/profile';

const GOAL_MAP: Record<string, string> = {
  lose: 'lose_weight',
  gain: 'gain_weight',
  maintain: 'maintain_weight',
};

const ACTIVITY_MAP: Record<string, string> = {
  sedentary: 'sedentary',
  light: 'lightly_active',
  moderate: 'moderately_active',
  active: 'very_active',
  extra: 'extremely_active',
};

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingCreateAccount'
  >;
  route: RouteProp<RootStackParamList, 'OnboardingCreateAccount'>;
};

export default function CreateAccountScreen({ navigation, route }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const canSubmit =
    name.length > 0 && email.length > 0 && password.length > 0;

  async function handleCreateAccount() {
    if (password.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);

      // Send onboarding data to backend
      const { data } = route.params;
      if (data.goal && data.gender && data.birthDate && data.height && data.weight && data.activityLevel) {
        // Convert DD/MM/YYYY to YYYY-MM-DD for the backend
        const [dd, mm, yyyy] = data.birthDate.split('/');
        const isoDate = `${yyyy}-${mm}-${dd}`;

        await completeOnboarding({
          dateOfBirth: isoDate,
          gender: data.gender,
          heightCm: parseFloat(data.height),
          weightKg: parseFloat(data.weight),
          goal: GOAL_MAP[data.goal] || data.goal,
          activityLevel: ACTIVITY_MAP[data.activityLevel] || data.activityLevel,
        }).catch(() => {
          // Onboarding can be completed later, don't block account creation
        });
      }

      navigation.replace('OnboardingSuccess');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Crie sua conta</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder=""
              autoCapitalize="words"
            />
          </View>

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
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!canSubmit || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleCreateAccount}
            disabled={!canSubmit || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#18181b" />
            ) : (
              <Text style={styles.submitButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e4e4e7',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#bef264',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18181b',
    marginTop: 24,
  },
  form: {
    flex: 1,
    paddingTop: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 40,
    paddingTop: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#18181b',
    lineHeight: 28,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
});
