import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getPendingLinks, acceptLink, rejectLink } from '../services/nutritionist';
import type { PendingLink } from '../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PendingRequests'>;
};

export default function PendingRequestsScreen({ navigation }: Props) {
  const [links, setLinks] = useState<PendingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    try {
      const data = await getPendingLinks();
      setLinks(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadLinks();
    }, [loadLinks]),
  );

  function onRefresh() {
    setRefreshing(true);
    loadLinks();
  }

  async function handleAccept(linkId: string) {
    setProcessingId(linkId);
    try {
      await acceptLink(linkId);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      Alert.alert('Sucesso', 'Vinculo aceito com sucesso!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao aceitar';
      Alert.alert('Erro', msg);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(linkId: string, name: string) {
    Alert.alert(
      'Rejeitar solicitacao',
      `Deseja rejeitar a solicitacao de ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(linkId);
            try {
              await rejectLink(linkId);
              setLinks((prev) => prev.filter((l) => l.id !== linkId));
            } catch (error) {
              const msg = error instanceof Error ? error.message : 'Erro ao rejeitar';
              Alert.alert('Erro', msg);
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitacoes</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
        }
      >
        <View style={styles.whiteArea}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22c55e" />
            </View>
          ) : links.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhuma solicitacao pendente.
              </Text>
            </View>
          ) : (
            <View style={styles.linksList}>
              {links.map((link) => {
                const isProcessing = processingId === link.id;
                return (
                  <View key={link.id} style={styles.linkCard}>
                    <View style={styles.linkAvatar}>
                      <Text style={styles.linkAvatarText}>
                        {link.nutritionistName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.linkInfo}>
                      <Text style={styles.linkName}>{link.nutritionistName}</Text>
                      <Text style={styles.linkCrn}>CRN: {link.nutritionistCrn}</Text>
                      <Text style={styles.linkDate}>Enviado em {formatDate(link.requestedAt)}</Text>
                    </View>
                    <View style={styles.linkActions}>
                      {isProcessing ? (
                        <ActivityIndicator color="#22c55e" />
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.acceptBtn}
                            activeOpacity={0.8}
                            onPress={() => handleAccept(link.id)}
                          >
                            <Text style={styles.acceptBtnText}>Aceitar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            activeOpacity={0.8}
                            onPress={() => handleReject(link.id, link.nutritionistName)}
                          >
                            <Text style={styles.rejectBtnText}>Rejeitar</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  whiteArea: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    minHeight: 400,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
  linksList: {
    gap: 12,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  linkAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
  },
  linkInfo: {
    flex: 1,
  },
  linkName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  linkCrn: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  linkDate: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
  },
  linkActions: {
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  rejectBtn: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
});
