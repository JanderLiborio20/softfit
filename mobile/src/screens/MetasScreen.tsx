import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Metas'>;
};

export default function MetasScreen({ navigation }: Props) {
  const [calorias, setCalorias] = useState('2000');
  const [carboidratos, setCarboidratos] = useState('200');
  const [proteinas, setProteinas] = useState('175');
  const [gorduras, setGorduras] = useState('56');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suas Metas</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calorias</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={calorias}
              onChangeText={setCalorias}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>kcal</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carboidratos</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={carboidratos}
              onChangeText={setCarboidratos}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>g</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proteínas</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={proteinas}
              onChangeText={setProteinas}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>g</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gorduras</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={gorduras}
              onChangeText={setGorduras}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>g</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 32,
    color: '#18181b',
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  headerSpacer: {
    width: 24,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  unit: {
    fontSize: 14,
    color: '#71717a',
    width: 30,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});
