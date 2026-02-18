import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getMyActivePlan } from '../services/nutritionist';
import type { NutritionPlanResponse } from '../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealPlanView'>;
};

export default function MealPlanViewScreen({ navigation }: Props) {
  const [plan, setPlan] = useState<NutritionPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getMyActivePlan()
        .then(setPlan)
        .catch(() => setPlan(null))
        .finally(() => setLoading(false));
    }, []),
  );

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Plano Alimentar</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : !plan ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{'📋'}</Text>
          <Text style={styles.emptyTitle}>Nenhum plano ativo</Text>
          <Text style={styles.emptyText}>
            Seu nutricionista ainda nao criou um plano alimentar para voce.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteArea}>
            {/* Status */}
            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Ativo</Text>
              </View>
              {plan.daysRemaining != null && plan.daysRemaining > 0 && (
                <Text style={styles.daysRemaining}>
                  {plan.daysRemaining} dias restantes
                </Text>
              )}
            </View>

            {/* Title */}
            <Text style={styles.planTitle}>{plan.title}</Text>
            {plan.description && (
              <Text style={styles.planDescription}>{plan.description}</Text>
            )}

            {/* Dates */}
            <View style={styles.datesRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Inicio</Text>
                <Text style={styles.dateValue}>{formatDate(plan.startDate)}</Text>
              </View>
              {plan.endDate && (
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Fim</Text>
                  <Text style={styles.dateValue}>{formatDate(plan.endDate)}</Text>
                </View>
              )}
            </View>

            {/* Guidelines */}
            {plan.generalGuidelines && (
              <>
                <Text style={styles.sectionTitle}>ORIENTACOES</Text>
                <View style={styles.guidelinesCard}>
                  <Text style={styles.guidelinesText}>
                    {plan.generalGuidelines}
                  </Text>
                </View>
              </>
            )}

            {/* Meals */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              REFEICOES
            </Text>

            {plan.plannedMeals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealIconContainer}>
                    <Text style={styles.mealIcon}>{'🍽'}</Text>
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    {meal.time && (
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    )}
                  </View>
                </View>

                {meal.foods.map((food, fIndex) => (
                  <View key={fIndex} style={styles.foodRow}>
                    <View style={styles.foodDot} />
                    <Text style={styles.foodName}>{food}</Text>
                    {meal.portions[fIndex] && (
                      <Text style={styles.foodPortion}>
                        {meal.portions[fIndex]}
                      </Text>
                    )}
                  </View>
                ))}

                {meal.observations && (
                  <View style={styles.obsContainer}>
                    <Text style={styles.mealObs}>{meal.observations}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bef264',
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
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
    minHeight: 600,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
  },
  daysRemaining: {
    fontSize: 12,
    color: '#71717a',
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#18181b',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
    marginBottom: 16,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateItem: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#71717a',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181b',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  guidelinesCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  guidelinesText: {
    fontSize: 14,
    color: '#18181b',
    lineHeight: 20,
  },
  mealCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIcon: {
    fontSize: 20,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181b',
  },
  mealTime: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 2,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  foodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  foodName: {
    fontSize: 14,
    color: '#18181b',
    flex: 1,
  },
  foodPortion: {
    fontSize: 13,
    color: '#71717a',
    fontWeight: '500',
  },
  obsContainer: {
    marginTop: 10,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 10,
  },
  mealObs: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
  },
});
