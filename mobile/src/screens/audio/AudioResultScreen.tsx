import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AudioResult'>;
  route: RouteProp<RootStackParamList, 'AudioResult'>;
};

export default function AudioResultScreen({ navigation, route }: Props) {
  const { analysis } = route.params;

  const result = {
    name: analysis.suggestedName,
    totalKcal: analysis.estimatedCalories,
    protein: analysis.estimatedMacros.proteinGrams,
    carbs: analysis.estimatedMacros.carbsGrams,
    fat: analysis.estimatedMacros.fatGrams,
    items: analysis.identifiedFoods.map((food) => {
      const count = analysis.identifiedFoods.length || 1;
      return {
        name: food,
        amount: '',
        kcal: Math.round(analysis.estimatedCalories / count),
        protein: Math.round(analysis.estimatedMacros.proteinGrams / count),
        carbs: Math.round(analysis.estimatedMacros.carbsGrams / count),
        fat: Math.round(analysis.estimatedMacros.fatGrams / count),
      };
    }),
  };

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
        <Text style={styles.headerTitle}>Resultado</Text>
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
              <Text style={styles.mealName}>{result.name}</Text>
              <Text style={styles.mealKcal}>
                {result.totalKcal} kcal
              </Text>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.macroValue}>{result.protein}g</Text>
              <Text style={styles.macroLabel}>Proteína</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#f97316' }]} />
              <Text style={styles.macroValue}>{result.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbos</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: '#eab308' }]} />
              <Text style={styles.macroValue}>{result.fat}g</Text>
              <Text style={styles.macroLabel}>Gordura</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Items list */}
        <Text style={styles.itemsTitle}>Alimentos identificados</Text>
        <View style={styles.itemsList}>
          {result.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
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
          <Text style={styles.retakeText}>Descrever outro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            navigation.navigate('MealDetail', { meal: result })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Ver detalhes</Text>
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
    gap: 10,
  },
  itemRow: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
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
