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
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useAuth } from '../../contexts/AuthContext';
import { createNutritionistProfile } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NutritionistRegister'>;
};

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export default function NutritionistRegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [crn, setCrn] = useState('');
  const [crnState, setCrnState] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atencao', 'Preencha nome, email e senha.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Atencao', 'A senha deve ter no minimo 8 caracteres.');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 5) {
      Alert.alert('Atencao', 'O nome profissional deve ter no minimo 5 caracteres.');
      return;
    }
    if (!crn.trim() || !/^\d{4,6}$/.test(crn.trim())) {
      Alert.alert('Atencao', 'O CRN deve conter 4 a 6 digitos.');
      return;
    }
    if (!crnState) {
      Alert.alert('Atencao', 'Selecione o estado do CRN.');
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password, 'nutritionist');
      await createNutritionistProfile({
        crn: crn.trim(),
        crnState,
        fullName: fullName.trim(),
      });
      navigation.reset({ index: 0, routes: [{ name: 'NutritionistHome' }] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/launch-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.greenOverlay} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />

        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>
              <Text style={styles.logoWhite}>food</Text>
              <Text style={styles.logoGreen}>ia</Text>
              <Text style={styles.logoWhite}>ry</Text>
            </Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Criar conta nutricionista</Text>

            {/* Account fields */}
            <Text style={styles.sectionLabel}>DADOS DA CONTA</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#a1a1aa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#a1a1aa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#a1a1aa"
              />
            </View>

            {/* Professional fields */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>DADOS PROFISSIONAIS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome profissional</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholderTextColor="#a1a1aa"
                placeholder="Ex: Dr. Joao Silva"
              />
            </View>

            <View style={styles.crnRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CRN</Text>
                <TextInput
                  style={styles.input}
                  value={crn}
                  onChangeText={setCrn}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor="#a1a1aa"
                  placeholder="12345"
                />
              </View>

              <View style={[styles.inputGroup, { width: 90 }]}>
                <Text style={styles.label}>Estado</Text>
                <TouchableOpacity
                  style={styles.stateButton}
                  onPress={() => setShowStatePicker(true)}
                >
                  <Text style={crnState ? styles.stateText : styles.statePlaceholder}>
                    {crnState || 'UF'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#18181b" />
              ) : (
                <Text style={styles.submitButtonText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Ja tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* State picker modal */}
      <Modal
        visible={showStatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatePicker(false)}
        >
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>Selecione o estado</Text>
            <FlatList
              data={STATES}
              keyExtractor={(item) => item}
              numColumns={4}
              contentContainerStyle={styles.stateGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.stateChip,
                    crnState === item && styles.stateChipActive,
                  ]}
                  onPress={() => {
                    setCrnState(item);
                    setShowStatePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.stateChipText,
                      crnState === item && styles.stateChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backArrow: {
    fontSize: 32,
    color: '#ffffff',
    lineHeight: 32,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 24,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fafafa',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  crnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stateButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  stateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  statePlaceholder: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  submitButton: {
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#ffffff',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bef264',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: 400,
  },
  pickerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d4d4d8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#18181b',
    marginBottom: 16,
  },
  stateGrid: {
    gap: 8,
  },
  stateChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
  },
  stateChipActive: {
    backgroundColor: '#22c55e',
  },
  stateChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  stateChipTextActive: {
    color: '#ffffff',
  },
});
