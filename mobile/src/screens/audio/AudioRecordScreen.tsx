import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AudioRecord'>;
};

export default function AudioRecordScreen({ navigation }: Props) {
  const [description, setDescription] = useState('');
  const inputRef = useRef<TextInput>(null);

  function handleSend() {
    const trimmed = description.trim();
    if (!trimmed) return;
    navigation.navigate('AudioAnalyzing', { description: trimmed });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>{'✕'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Descrever Refeição</Text>
          <View style={styles.headerButton} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.centerContent}>
          <View style={styles.iconBadge}>
            <Text style={styles.icon}>{'🍽'}</Text>
          </View>

          <Text style={styles.title}>O que você comeu?</Text>
          <Text style={styles.subtitle}>
            Descreva os alimentos e quantidades que você consumiu
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: 100g de arroz, 2 ovos mexidos e 150g de frango grelhado"
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </View>

          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Dicas:</Text>
            <Text style={styles.suggestionItem}>
              {'•'} Inclua quantidades quando possível (g, ml, unidades)
            </Text>
            <Text style={styles.suggestionItem}>
              {'•'} Mencione o modo de preparo (grelhado, frito, cozido)
            </Text>
            <Text style={styles.suggestionItem}>
              {'•'} Separe os alimentos por vírgula
            </Text>
          </View>
        </View>

        <SafeAreaView style={styles.bottomArea} edges={['bottom']}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !description.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!description.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.sendText}>Analisar</Text>
              <Text style={styles.sendArrow}>{'→'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  safeArea: {},
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
  closeIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(190, 242, 100, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(190, 242, 100, 0.2)',
    marginBottom: 20,
  },
  input: {
    color: '#ffffff',
    fontSize: 16,
    padding: 16,
    minHeight: 120,
    lineHeight: 24,
  },
  suggestions: {
    gap: 6,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  suggestionItem: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    lineHeight: 20,
  },
  bottomArea: {
    paddingBottom: 16,
  },
  controls: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  sendArrow: {
    fontSize: 18,
    color: '#18181b',
  },
});
