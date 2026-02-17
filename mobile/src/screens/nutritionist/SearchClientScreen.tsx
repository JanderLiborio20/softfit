import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { searchClientByEmail, requestLink } from '../../services/nutritionist';
import type { SearchClientResult } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SearchClient'>;
};

export default function SearchClientScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SearchClientResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSearch() {
    if (!email.trim()) {
      Alert.alert('Atencao', 'Digite o email do cliente.');
      return;
    }

    setSearching(true);
    setResult(null);
    setSearched(false);
    setSent(false);

    try {
      const data = await searchClientByEmail(email.trim());
      setResult(data);
      setSearched(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao buscar';
      Alert.alert('Erro', msg);
    } finally {
      setSearching(false);
    }
  }

  async function handleSendRequest() {
    if (!result) return;

    setSending(true);
    try {
      await requestLink(result.userId);
      setSent(true);
      Alert.alert('Sucesso', `Solicitacao enviada para ${result.name}!`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao enviar';
      Alert.alert('Erro', msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Cliente</Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.whiteArea}>
          <Text style={styles.subtitle}>
            Digite o email do cliente que deseja vincular
          </Text>

          {/* Search input */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemplo.com"
              placeholderTextColor="#a1a1aa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.searchBtn, searching && styles.btnDisabled]}
              activeOpacity={0.8}
              onPress={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.searchBtnText}>Buscar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Result */}
          {searched && !result && (
            <View style={styles.noResultBox}>
              <Text style={styles.noResultText}>
                Nenhum cliente encontrado com este email.
              </Text>
            </View>
          )}

          {result && (
            <View style={styles.resultCard}>
              <View style={styles.resultAvatar}>
                <Text style={styles.resultAvatarText}>
                  {result.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultEmail}>{result.email}</Text>
              </View>

              {sent ? (
                <View style={styles.sentBadge}>
                  <Text style={styles.sentBadgeText}>Enviado</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.linkBtn, sending && styles.btnDisabled]}
                  activeOpacity={0.8}
                  onPress={handleSendRequest}
                  disabled={sending}
                >
                  {sending ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.linkBtnText}>Vincular</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bef264',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#18181b',
  },
  content: {
    flex: 1,
  },
  whiteArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#18181b',
  },
  searchBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  noResultBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
  },
  noResultText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  resultAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  resultEmail: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },
  linkBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  sentBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sentBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },
});
