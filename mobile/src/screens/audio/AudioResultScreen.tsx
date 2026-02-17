import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AudioResult'>;
};

const MOCK_RESULT = {
  name: 'Almoço Fitness',
  totalKcal: 485,
  protein: 42,
  carbs: 38,
  fat: 15,
  items: [
    { name: 'Frango grelhado', amount: '125g', kcal: 195, protein: 32, carbs: 0, fat: 7 },
    { name: 'Arroz integral', amount: '100g', kcal: 130, protein: 3, carbs: 28, fat: 1 },
    { name: 'Ovo cozido', amount: '2 un', kcal: 65, protein: 1, carbs: 2, fat: 6.5 },
    { name: 'Feijão', amount: '150g', kcal: 95, protein: 6, carbs: 8, fat: 0.5 },
  ],
};

export default function AudioResultScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.closeIcon}>{'✕'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enviar Áudio</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Meal summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.mealNameRow}>
            <View style={styles.mealIconBadge}>
              <Text style={styles.mealIcon}>{'🍽'}</Text>
            </View>
            <View style={styles.mealNameCol}>
              <Text style={styles.mealName}>{MOCK_RESULT.name}</Text>
              <Text style={styles.mealKcal}>
                {MOCK_RESULT.totalKcal} kcal
              </Text>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.macroValue}>{MOCK_RESULT.protein}g</Text>
              <Text style={styles.macroLabel}>Proteína</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#f97316' }]} />
              <Text style={styles.macroValue}>{MOCK_RESULT.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbos</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#eab308' }]} />
              <Text style={styles.macroValue}>{MOCK_RESULT.fat}g</Text>
              <Text style={styles.macroLabel}>Gordura</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Items list */}
        <Text style={styles.itemsTitle}>Alimentos identificados</Text>
        <View style={styles.itemsList}>
          {MOCK_RESULT.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemAmount}>{item.amount}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
                <Text style={styles.itemMacros}>
                  P:{item.protein}g · C:{item.carbs}g · G:{item.fat}g
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => navigation.popToTop()}
          activeOpacity={0.7}
        >
          <Text style={styles.retakeText}>Gravar outro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            navigation.navigate('MealDetail', {
              meal: MOCK_RESULT,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Salvar refeição</Text>
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
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#18181b',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#18181b',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 8,
  },
  summaryCard: {
    gap: 20,
  },
  mealNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mealIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f7fee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIcon: {
    fontSize: 22,
  },
  mealNameCol: {
    flex: 1,
  },
  mealName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18181b',
  },
  mealKcal: {
    fontSize: 14,
    color: '#65a30d',
    fontWeight: '600',
    marginTop: 2,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  macroItem: {
    alignItems: 'center',
    gap: 4,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181b',
  },
  macroLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f4f4f5',
    marginVertical: 20,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  itemAmount: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemKcal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  itemMacros: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
  },
  retakeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18181b',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#bef264',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
});
