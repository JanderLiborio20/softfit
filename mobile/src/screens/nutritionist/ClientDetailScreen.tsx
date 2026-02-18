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
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { getClientData, getClientNutritionPlans } from '../../services/nutritionist';
import type { ClientData, NutritionPlanResponse } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ClientDetail'>;
  route: RouteProp<RootStackParamList, 'ClientDetail'>;
};

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Perder peso',
  gain_weight: 'Ganhar peso',
  maintain_weight: 'Manter peso',
  gain_muscle: 'Ganhar massa muscular',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentario',
  lightly_active: 'Levemente ativo',
  moderately_active: 'Moderadamente ativo',
  very_active: 'Muito ativo',
  extremely_active: 'Extremamente ativo',
};

const GENDER_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
};

function formatMealTime(mealTimeStr: string): string {
  const date = new Date(mealTimeStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
}

export default function ClientDetailScreen({ navigation, route }: Props) {
  const { clientId, clientName } = route.params;
  const [data, setData] = useState<ClientData | null>(null);
  const [plans, setPlans] = useState<NutritionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError(null);
      Promise.all([
        getClientData(clientId),
        getClientNutritionPlans(clientId).catch(() => []),
      ])
        .then(([clientData, plansData]) => {
          setData(clientData);
          setPlans(plansData);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        })
        .finally(() => setLoading(false));
    }, [clientId]),
  );

  const activePlan = plans.find((p) => p.isActive && !p.isExpired);

  const profile = data?.profile;
  const meals = data?.meals || [];

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.macros.proteinGrams, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.macros.carbsGrams, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.macros.fatGrams, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{clientName}</Text>
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
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteArea}>
            {/* Profile info */}
            {profile && (
              <>
                <Text style={styles.sectionTitle}>PERFIL</Text>
                {profile.age == null && profile.heightCm == null ? (
                  <Text style={styles.emptyText}>Cliente ainda nao completou o perfil.</Text>
                ) : (
                  <View style={styles.infoGrid}>
                    {profile.age != null && <InfoItem label="Idade" value={`${profile.age} anos`} />}
                    {profile.gender != null && <InfoItem label="Sexo" value={GENDER_LABELS[profile.gender] || profile.gender} />}
                    {profile.heightCm != null && <InfoItem label="Altura" value={`${profile.heightCm} cm`} />}
                    {profile.weightKg != null && <InfoItem label="Peso" value={`${profile.weightKg} kg`} />}
                    {profile.bmi != null && <InfoItem label="IMC" value={`${profile.bmi}`} />}
                    {profile.goal != null && <InfoItem label="Objetivo" value={GOAL_LABELS[profile.goal] || profile.goal} />}
                    {profile.activityLevel != null && (
                      <InfoItem
                        label="Atividade"
                        value={ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel}
                      />
                    )}
                  </View>
                )}

                {/* Goals */}
                {profile.dailyCaloriesGoal != null && profile.dailyMacrosGoal != null && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 28 }]}>METAS DIARIAS</Text>
                    <View style={styles.goalsRow}>
                      <GoalCard
                        label="Calorias"
                        value={`${profile.dailyCaloriesGoal}`}
                        unit="kcal"
                        color="#22c55e"
                      />
                      <GoalCard
                        label="Proteinas"
                        value={`${profile.dailyMacrosGoal.proteinGrams}`}
                        unit="g"
                        color="#22c55e"
                      />
                      <GoalCard
                        label="Carbos"
                        value={`${profile.dailyMacrosGoal.carbsGrams}`}
                        unit="g"
                        color="#14b8a6"
                      />
                      <GoalCard
                        label="Gorduras"
                        value={`${profile.dailyMacrosGoal.fatGrams}`}
                        unit="g"
                        color="#eab308"
                      />
                    </View>
                  </>
                )}
              </>
            )}

            {/* Meal Plan section */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>PLANO ALIMENTAR</Text>

            {activePlan ? (
              <TouchableOpacity
                style={styles.planCard}
                onPress={() => navigation.navigate('MealPlanDetail', { planId: activePlan.id })}
                activeOpacity={0.7}
              >
                <View style={styles.planCardHeader}>
                  <View style={styles.planActiveBadge}>
                    <Text style={styles.planActiveBadgeText}>Ativo</Text>
                  </View>
                  {activePlan.daysRemaining != null && activePlan.daysRemaining > 0 && (
                    <Text style={styles.planDaysText}>{activePlan.daysRemaining}d restantes</Text>
                  )}
                </View>
                <Text style={styles.planCardTitle}>{activePlan.title}</Text>
                <Text style={styles.planCardMeals}>
                  {activePlan.plannedMeals.length} refeicoes planejadas
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.emptyText}>Nenhum plano ativo.</Text>
            )}

            <TouchableOpacity
              style={styles.createPlanButton}
              onPress={() => navigation.navigate('MealPlanCreate', { clientId, clientName })}
              activeOpacity={0.7}
            >
              <Text style={styles.createPlanButtonText}>
                {activePlan ? 'Criar Novo Plano' : 'Criar Plano Alimentar'}
              </Text>
            </TouchableOpacity>

            {/* Today's meals */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>REFEICOES DE HOJE</Text>

            {meals.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma refeicao registrada hoje.</Text>
            ) : (
              <>
                {/* Summary */}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryItem}>
                    <Text style={{ fontWeight: '700' }}>{Math.round(totalCalories)}</Text> kcal
                  </Text>
                  <Text style={styles.summaryItem}>
                    P: <Text style={{ fontWeight: '700', color: '#22c55e' }}>{Math.round(totalProtein)}g</Text>
                  </Text>
                  <Text style={styles.summaryItem}>
                    C: <Text style={{ fontWeight: '700', color: '#14b8a6' }}>{Math.round(totalCarbs)}g</Text>
                  </Text>
                  <Text style={styles.summaryItem}>
                    G: <Text style={{ fontWeight: '700', color: '#eab308' }}>{Math.round(totalFat)}g</Text>
                  </Text>
                </View>

                {/* Meal cards */}
                <View style={styles.mealsList}>
                  {meals.map((meal) => (
                    <View key={meal.id} style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealTime}>{formatMealTime(meal.mealTime)}</Text>
                      </View>
                      <Text style={styles.mealFoods}>{meal.foods.join(', ')}</Text>
                      <View style={styles.mealMacros}>
                        <Text style={styles.mealMacroItem}>{Math.round(meal.calories)} kcal</Text>
                        <Text style={styles.mealMacroItem}>P: {Math.round(meal.macros.proteinGrams)}g</Text>
                        <Text style={styles.mealMacroItem}>C: {Math.round(meal.macros.carbsGrams)}g</Text>
                        <Text style={styles.mealMacroItem}>G: {Math.round(meal.macros.fatGrams)}g</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function GoalCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <View style={styles.goalCard}>
      <Text style={[styles.goalValue, { color }]}>
        {value}
        <Text style={styles.goalUnit}> {unit}</Text>
      </Text>
      <Text style={styles.goalLabel}>{label}</Text>
    </View>
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
    minHeight: 600,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181b',
    letterSpacing: 1,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoItem: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '30%',
  },
  infoLabel: {
    fontSize: 11,
    color: '#71717a',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
    marginTop: 2,
  },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalCard: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '22%',
    flex: 1,
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  goalUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: '#71717a',
  },
  goalLabel: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    fontStyle: 'italic',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  summaryItem: {
    fontSize: 13,
    color: '#18181b',
  },
  mealsList: {
    gap: 10,
  },
  mealCard: {
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  mealTime: {
    fontSize: 12,
    color: '#71717a',
  },
  mealFoods: {
    fontSize: 13,
    color: '#71717a',
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  mealMacroItem: {
    fontSize: 12,
    color: '#52525b',
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planActiveBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  planActiveBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  planDaysText: {
    fontSize: 12,
    color: '#71717a',
  },
  planCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  planCardMeals: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 4,
  },
  createPlanButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  createPlanButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
