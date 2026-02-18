import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { getNutritionPlan, deactivateNutritionPlan } from '../../services/nutritionist';
import type { NutritionPlanResponse } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealPlanDetail'>;
  route: RouteProp<RootStackParamList, 'MealPlanDetail'>;
};

export default function MealPlanDetailScreen({ navigation, route }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<NutritionPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError(null);
      getNutritionPlan(planId)
        .then(setPlan)
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Erro ao carregar plano');
        })
        .finally(() => setLoading(false));
    }, [planId]),
  );

  function handleDeactivate() {
    Alert.alert(
      'Desativar Plano',
      'Deseja realmente desativar este plano alimentar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deactivateNutritionPlan(planId);
              Alert.alert('Sucesso', 'Plano desativado com sucesso.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Erro ao desativar';
              Alert.alert('Erro', msg);
            }
          },
        },
      ],
    );
  }

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
        <Text style={styles.headerTitle}>Plano Alimentar</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : plan ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteArea}>
            {/* Status badge */}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  plan.isActive && !plan.isExpired
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    plan.isActive && !plan.isExpired
                      ? styles.statusActiveText
                      : styles.statusInactiveText,
                  ]}
                >
                  {plan.isExpired ? 'Expirado' : plan.isActive ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
              {plan.daysRemaining != null && plan.daysRemaining > 0 && (
                <Text style={styles.daysRemaining}>
                  {plan.daysRemaining} dias restantes
                </Text>
              )}
            </View>

            {/* Title & description */}
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
              {plan.durationDays && (
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Duracao</Text>
                  <Text style={styles.dateValue}>{plan.durationDays} dias</Text>
                </View>
              )}
            </View>

            {/* Guidelines */}
            {plan.generalGuidelines && (
              <>
                <Text style={styles.sectionTitle}>ORIENTACOES GERAIS</Text>
                <View style={styles.guidelinesCard}>
                  <Text style={styles.guidelinesText}>
                    {plan.generalGuidelines}
                  </Text>
                </View>
              </>
            )}

            {/* Meals */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              REFEICOES ({plan.plannedMeals.length})
            </Text>

            {plan.plannedMeals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  {meal.time && <Text style={styles.mealTime}>{meal.time}</Text>}
                </View>

                {meal.foods.map((food, fIndex) => (
                  <View key={fIndex} style={styles.foodRow}>
                    <Text style={styles.foodName}>{food}</Text>
                    {meal.portions[fIndex] && (
                      <Text style={styles.foodPortion}>{meal.portions[fIndex]}</Text>
                    )}
                  </View>
                ))}

                {meal.observations && (
                  <Text style={styles.mealObs}>{meal.observations}</Text>
                )}
              </View>
            ))}

            {/* Deactivate button */}
            {plan.isActive && !plan.isExpired && (
              <TouchableOpacity
                style={styles.deactivateButton}
                onPress={handleDeactivate}
              >
                <Text style={styles.deactivateButtonText}>
                  Desativar Plano
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      ) : null}
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#f0fdf4',
  },
  statusInactive: {
    backgroundColor: '#fef2f2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusActiveText: {
    color: '#22c55e',
  },
  statusInactiveText: {
    color: '#ef4444',
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  mealObs: {
    fontSize: 12,
    color: '#71717a',
    fontStyle: 'italic',
    marginTop: 8,
  },
  deactivateButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  deactivateButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ef4444',
  },
});
