import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const [name, setName] = useState('Mateus Silva');
  const [birthDate, setBirthDate] = useState('19/02/2000');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('80');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const formatDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    let formatted = '';
    if (numbers.length > 0) formatted += numbers.slice(0, 2);
    if (numbers.length > 2) formatted += '/' + numbers.slice(2, 4);
    if (numbers.length > 4) formatted += '/' + numbers.slice(4, 8);
    setBirthDate(formatted);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.logoutIcon}>{'⎋'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Data de Nascimento */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={birthDate}
                  onChangeText={formatDate}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text style={styles.calendarIcon}>{'📅'}</Text>
              </View>
            </View>

            {/* Altura */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Altura</Text>
              <View style={styles.rowInput}>
                <View style={[styles.inputWrapper, styles.flex]}>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>cm</Text>
                </View>
              </View>
            </View>

            {/* Peso */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Peso</Text>
              <View style={styles.rowInput}>
                <View style={[styles.inputWrapper, styles.flex]}>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>
            </View>

            {/* Sexo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderCard,
                    gender === 'male' && styles.genderCardSelected,
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.genderEmoji}>{'😊'}</Text>
                  <Text style={styles.genderLabel}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderCard,
                    gender === 'female' && styles.genderCardSelected,
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.genderEmoji}>{'😊'}</Text>
                  <Text style={styles.genderLabel}>Feminino</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
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
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: '#18181b',
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#18181b',
  },
  logoutIcon: {
    fontSize: 22,
    color: '#18181b',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 28,
  },
  form: {
    gap: 20,
    paddingTop: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  dateInput: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  calendarIcon: {
    fontSize: 18,
    paddingRight: 14,
    color: '#71717a',
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unitBadge: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717a',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  genderCardSelected: {
    backgroundColor: '#f7fee7',
    borderColor: '#bef264',
  },
  genderEmoji: {
    fontSize: 28,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  saveButton: {
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
});
