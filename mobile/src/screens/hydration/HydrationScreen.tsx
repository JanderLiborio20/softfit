import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import HydrationProgress from '../../components/HydrationProgress';
import {
  getHydrationByDate,
  logHydration,
  deleteHydration,
} from '../../services/hydration';
import type { HydrationDailyResponse, HydrationEntry } from '../../services/hydration';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Hydration'>;
};

const MONTHS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

const DRINK_OPTIONS = [
  { type: 'water', icon: '💧', label: 'Água' },
  { type: 'coffee', icon: '☕', label: 'Café' },
  { type: 'juice', icon: '🧃', label: 'Suco' },
  { type: 'tea', icon: '🍵', label: 'Chá' },
  { type: 'milk', icon: '🥛', label: 'Leite' },
  { type: 'other', icon: '🥤', label: 'Outro' },
];

const QUICK_VOLUMES = [150, 250, 500];

function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];

  if (target.getTime() === today.getTime()) {
    return `HOJE, ${day} DE ${month}`;
  }
  return `${day} DE ${month}`;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
}

export default function HydrationScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<HydrationDailyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const loadData = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const result = await getHydrationByDate(toDateString(date));
      setData(result);
    } catch {
      // silently fail, show defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(selectedDate);
    }, [selectedDate, loadData]),
  );

  function navigateDate(direction: -1 | 1) {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + direction);
      return next;
    });
  }

  async function handleQuickAdd(volumeMl: number, drinkType: string) {
    setAdding(true);
    try {
      await logHydration({ volumeMl, drinkType });
      setShowDrinkModal(false);
      setSelectedDrink(null);
      await loadData(selectedDate);
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar. Tente novamente.');
    } finally {
      setAdding(false);
    }
  }

  function handleDrinkSelect(drinkType: string) {
    setSelectedDrink(drinkType);
  }

  async function handleDelete(entry: HydrationEntry) {
    Alert.alert(
      'Remover registro',
      `Remover ${entry.volumeMl}ml de ${entry.drinkIcon}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHydration(entry.id);
              await loadData(selectedDate);
            } catch {
              Alert.alert('Erro', 'Não foi possível remover.');
            }
          },
        },
      ],
    );
  }

  const currentMl = data?.totalVolumeMl || 0;
  const goalMl = data?.dailyGoalMl || 2000;
  const entries = data?.entries || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hidratação</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date navigation */}
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={() => navigateDate(-1)}>
            <Text style={styles.dateArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDateLabel(selectedDate)}</Text>
          <TouchableOpacity onPress={() => navigateDate(1)}>
            <Text style={styles.dateArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <>
            {/* Progress circle */}
            <View style={styles.progressContainer}>
              <HydrationProgress currentMl={currentMl} goalMl={goalMl} />
            </View>

            {/* Quick add buttons */}
            <View style={styles.quickAddSection}>
              <Text style={styles.sectionTitle}>ADICIONAR RÁPIDO</Text>
              <View style={styles.quickAddButtons}>
                {QUICK_VOLUMES.map((vol) => (
                  <TouchableOpacity
                    key={vol}
                    style={styles.quickAddButton}
                    onPress={() => handleQuickAdd(vol, 'water')}
                    disabled={adding}
                  >
                    <Text style={styles.quickAddIcon}>💧</Text>
                    <Text style={styles.quickAddLabel}>+{vol}ml</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.quickAddButton}
                  onPress={() => setShowDrinkModal(true)}
                  disabled={adding}
                >
                  <Text style={styles.quickAddIcon}>🥤</Text>
                  <Text style={styles.quickAddLabel}>Outro</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Entries list */}
            <View style={styles.entriesSection}>
              <Text style={styles.sectionTitle}>REGISTROS DO DIA</Text>

              {entries.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhum registro ainda. Use os botões acima para adicionar.
                </Text>
              ) : (
                <View style={styles.entriesList}>
                  {entries.map((entry) => (
                    <TouchableOpacity
                      key={entry.id}
                      style={styles.entryCard}
                      onLongPress={() => handleDelete(entry)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.entryLeft}>
                        <Text style={styles.entryIcon}>{entry.drinkIcon}</Text>
                        <View>
                          <Text style={styles.entryVolume}>{entry.volumeMl}ml</Text>
                          <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDelete(entry)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.deleteIcon}>✕</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Drink type selection modal */}
      <Modal
        visible={showDrinkModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowDrinkModal(false);
          setSelectedDrink(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDrinkModal(false);
            setSelectedDrink(null);
          }}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>
              {selectedDrink ? 'Escolha o volume' : 'Tipo de bebida'}
            </Text>

            {!selectedDrink ? (
              <View style={styles.drinkGrid}>
                {DRINK_OPTIONS.map((drink) => (
                  <TouchableOpacity
                    key={drink.type}
                    style={styles.drinkOption}
                    onPress={() => handleDrinkSelect(drink.type)}
                  >
                    <Text style={styles.drinkOptionIcon}>{drink.icon}</Text>
                    <Text style={styles.drinkOptionLabel}>{drink.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.volumeButtons}>
                {[100, 150, 200, 250, 300, 500].map((vol) => (
                  <TouchableOpacity
                    key={vol}
                    style={styles.volumeButton}
                    onPress={() => handleQuickAdd(vol, selectedDrink)}
                    disabled={adding}
                  >
                    <Text style={styles.volumeButtonText}>{vol}ml</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 32,
    color: '#18181b',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181b',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dateNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dateArrow: {
    fontSize: 24,
    color: '#18181b',
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181b',
    letterSpacing: 1,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  quickAddSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181b',
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickAddButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  quickAddButton: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flex: 1,
  },
  quickAddIcon: {
    fontSize: 22,
  },
  quickAddLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  entriesSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
  },
  entriesList: {
    gap: 10,
  },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 14,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryIcon: {
    fontSize: 24,
  },
  entryVolume: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  entryTime: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  deleteIcon: {
    fontSize: 16,
    color: '#a1a1aa',
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d4d4d8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181b',
    marginBottom: 20,
  },
  drinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  drinkOption: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '30%',
  },
  drinkOptionIcon: {
    fontSize: 28,
  },
  drinkOptionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#18181b',
  },
  volumeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  volumeButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: '28%',
    alignItems: 'center',
  },
  volumeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
