import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useAuth } from '../../contexts/AuthContext';
import { getMyClients } from '../../services/nutritionist';
import type { LinkedClient } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NutritionistHome'>;
};

export default function NutritionistHomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [clients, setClients] = useState<LinkedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      const data = await getMyClients();
      setClients(data);
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
      loadClients();
    }, [loadClients]),
  );

  function onRefresh() {
    setRefreshing(true);
    loadClients();
  }

  async function handleLogout() {
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Launch' }] });
  }

  const userName = user?.name || 'Nutricionista';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Nutricionista</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
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
          {/* Search button */}
          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SearchClient')}
          >
            <Text style={styles.searchIcon}>+</Text>
            <Text style={styles.searchLabel}>Buscar e vincular cliente</Text>
          </TouchableOpacity>

          {/* Clients section */}
          <Text style={styles.sectionTitle}>MEUS CLIENTES</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22c55e" />
            </View>
          ) : clients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum cliente vinculado ainda.{'\n'}
                Busque um cliente por email para enviar uma solicitacao.
              </Text>
            </View>
          ) : (
            <View style={styles.clientsList}>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.userId}
                  style={styles.clientCard}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('ClientDetail', {
                      clientId: client.userId,
                      clientName: client.name,
                    })
                  }
                >
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>
                      {client.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  greeting: {
    fontSize: 12,
    color: '#18181b',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181b',
  },
  logoutBtn: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
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
    minHeight: 500,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 28,
  },
  searchIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  searchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181b',
    letterSpacing: 1,
    marginBottom: 16,
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
    lineHeight: 22,
    textAlign: 'center',
  },
  clientsList: {
    gap: 10,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  clientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  clientEmail: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: '#a1a1aa',
  },
});
