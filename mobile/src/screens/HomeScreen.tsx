import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import CaloriesChart from '../components/CaloriesChart';
import MealCard from '../components/MealCard';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profile';
import { getMealsByDate } from '../services/meals';
import { getPendingLinks, getMyActivePlan } from '../services/nutritionist';
import { getHydrationByDate } from '../services/hydration';
import type { ProfileResponse } from '../services/profile';
import type { MealListResponse } from '../services/meals';
import type { HydrationDailyResponse } from '../services/hydration';
import type { NutritionPlanResponse } from '../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const MONTHS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

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

function formatMealTime(mealTimeStr: string): string {
  const date = new Date(mealTimeStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mealDate = new Date(date);
  mealDate.setHours(0, 0, 0, 0);

  const prefix = mealDate.getTime() === today.getTime() ? 'Hoje' : `${date.getDate()}/${date.getMonth() + 1}`;
  return `${prefix}, ${hours}h${minutes}`;
}

const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 67 };

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [mealsData, setMealsData] = useState<MealListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [hydrationData, setHydrationData] = useState<HydrationDailyResponse | null>(null);
  const [activePlan, setActivePlan] = useState<NutritionPlanResponse | null>(null);

  const goals = profile
    ? {
        calories: profile.dailyCaloriesGoal,
        protein: profile.dailyMacrosGoal.proteinGrams,
        carbs: profile.dailyMacrosGoal.carbsGrams,
        fat: profile.dailyMacrosGoal.fatGrams,
      }
    : DEFAULT_GOALS;

  const totals = mealsData?.summary
    ? {
        kcal: mealsData.summary.totalCalories,
        protein: mealsData.summary.totalProtein,
        carbs: mealsData.summary.totalCarbs,
        fat: mealsData.summary.totalFat,
      }
    : { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  const loadData = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const [profileRes, mealsRes, pending, hydrationRes, planRes] = await Promise.all([
        getProfile().catch(() => null),
        getMealsByDate(toDateString(date)),
        getPendingLinks().catch(() => []),
        getHydrationByDate(toDateString(date)).catch(() => null),
        getMyActivePlan().catch(() => null),
      ]);
      if (profileRes) setProfile(profileRes);
      setMealsData(mealsRes);
      setPendingCount(pending.length);
      setHydrationData(hydrationRes);
      setActivePlan(planRes);
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

  const userName = user?.name || 'Usuário';
  const userInitial = userName.charAt(0).toUpperCase();
  const meals = mealsData?.meals || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Olá, 👋</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {pendingCount > 0 && (
            <TouchableOpacity
              style={styles.pendingButton}
              onPress={() => navigation.navigate('PendingRequests')}
            >
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
              </View>
              <Text style={styles.pendingText}>Pendentes</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.metasButton}
            onPress={() => navigation.navigate('Metas')}
          >
            <Text style={styles.metasIcon}>⚙</Text>
            <Text style={styles.metasText}>Metas</Text>
          </TouchableOpacity>
        </View>
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
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <>
            {/* Calories chart */}
            <View style={styles.chartContainer}>
              <CaloriesChart
                current={totals.kcal}
                total={goals.calories}
                protein={{ current: totals.protein, total: goals.protein }}
                carbs={{ current: totals.carbs, total: goals.carbs }}
                fat={{ current: totals.fat, total: goals.fat }}
              />
            </View>

            {/* Macros summary */}
            <View style={styles.macrosSummary}>
              <View style={styles.macroSummaryItem}>
                <Text style={styles.macroSummaryValue}>
                  <Text style={{ color: '#22c55e', fontWeight: '700' }}>{Math.round(totals.protein)}</Text>
                  <Text style={{ color: '#a1a1aa' }}> / {goals.protein}g</Text>
                </Text>
                <Text style={styles.macroSummaryLabel}>Proteínas</Text>
              </View>
              <View style={styles.macroSummaryItem}>
                <Text style={styles.macroSummaryValue}>
                  <Text style={{ color: '#14b8a6', fontWeight: '700' }}>{Math.round(totals.carbs)}</Text>
                  <Text style={{ color: '#a1a1aa' }}> / {goals.carbs}g</Text>
                </Text>
                <Text style={styles.macroSummaryLabel}>Carboidratos</Text>
              </View>
              <View style={styles.macroSummaryItem}>
                <Text style={styles.macroSummaryValue}>
                  <Text style={{ color: '#eab308', fontWeight: '700' }}>{Math.round(totals.fat)}</Text>
                  <Text style={{ color: '#a1a1aa' }}> / {goals.fat}g</Text>
                </Text>
                <Text style={styles.macroSummaryLabel}>Gorduras</Text>
              </View>
            </View>

            {/* Hydration card */}
            <View style={styles.hydrationWrapper}>
              <TouchableOpacity
                style={styles.hydrationCard}
                onPress={() => navigation.navigate('Hydration')}
                activeOpacity={0.7}
              >
                <View style={styles.hydrationLeft}>
                  <Text style={styles.hydrationIcon}>💧</Text>
                  <View>
                    <Text style={styles.hydrationTitle}>Hidratação</Text>
                    <Text style={styles.hydrationSubtitle}>
                      {hydrationData ? `${hydrationData.totalVolumeMl}ml de ${hydrationData.dailyGoalMl}ml` : '0ml de 2000ml'}
                    </Text>
                  </View>
                </View>
                <View style={styles.hydrationRight}>
                  <View style={styles.hydrationBarBg}>
                    <View
                      style={[
                        styles.hydrationBarFill,
                        { width: `${Math.min(hydrationData?.progressPercent || 0, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.hydrationPercent}>
                    {Math.round(hydrationData?.progressPercent || 0)}%
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Meal Plan card */}
            {activePlan && (
              <View style={styles.mealPlanWrapper}>
                <TouchableOpacity
                  style={styles.mealPlanCard}
                  onPress={() => navigation.navigate('MealPlanView')}
                  activeOpacity={0.7}
                >
                  <View style={styles.mealPlanLeft}>
                    <Text style={styles.mealPlanIcon}>{'📋'}</Text>
                    <View>
                      <Text style={styles.mealPlanTitle}>Plano Alimentar</Text>
                      <Text style={styles.mealPlanSubtitle} numberOfLines={1}>
                        {activePlan.title}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.mealPlanRight}>
                    <View style={styles.mealPlanBadge}>
                      <Text style={styles.mealPlanBadgeText}>Ativo</Text>
                    </View>
                    {activePlan.daysRemaining != null && activePlan.daysRemaining > 0 && (
                      <Text style={styles.mealPlanDays}>{activePlan.daysRemaining}d</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* AI Recipe Suggestions card */}
            <View style={styles.recipesWrapper}>
              <TouchableOpacity
                style={styles.recipesCard}
                onPress={() => navigation.navigate('SuggestedRecipes')}
                activeOpacity={0.7}
              >
                <View style={styles.recipesLeft}>
                  <Text style={styles.recipesIcon}>{'✨'}</Text>
                  <View>
                    <Text style={styles.recipesTitle}>Sugestoes de Receitas</Text>
                    <Text style={styles.recipesSubtitle}>
                      {Math.max(0, goals.calories - totals.kcal)} kcal restantes
                    </Text>
                  </View>
                </View>
                <Text style={styles.recipesArrow}>{'›'}</Text>
              </TouchableOpacity>
            </View>

            {/* Meals section */}
            <View style={styles.mealsSection}>
              <Text style={styles.mealsTitle}>REFEIÇÕES</Text>

              {meals.length === 0 ? (
                <Text style={styles.emptyText}>
                  Cadastre sua primeira refeição através de uma das opções abaixo:
                </Text>
              ) : (
                <View style={styles.mealsList}>
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      icon="🍽"
                      name={meal.name}
                      description={meal.foods.join(', ')}
                      time={formatMealTime(meal.mealTime)}
                      kcal={meal.calories}
                      protein={meal.macros.proteinGrams}
                      carbs={meal.macros.carbsGrams}
                      fat={meal.macros.fatGrams}
                    />
                  ))}
                </View>
              )}

              {/* Add meal buttons - only show when no meals */}
              {meals.length === 0 && (
                <View style={styles.addMealButtons}>
                  <TouchableOpacity
                    style={styles.addMealButton}
                    onPress={() => navigation.navigate('AudioRecord')}
                  >
                    <Text style={styles.addMealIcon}>📝</Text>
                    <Text style={styles.addMealLabel}>Descrever</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addMealButton}
                    onPress={() => navigation.navigate('PhotoTake')}
                  >
                    <Text style={styles.addMealIcon}>📷</Text>
                    <Text style={styles.addMealLabel}>Foto</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* FAB */}
      {meals.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => setShowBottomSheet(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showBottomSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBottomSheet(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Cadastre sua refeição</Text>
            <View style={styles.bottomSheetButtons}>
              <TouchableOpacity
                style={styles.bottomSheetButton}
                onPress={() => {
                  setShowBottomSheet(false);
                  navigation.navigate('AudioRecord');
                }}
              >
                <Text style={styles.bottomSheetButtonIcon}>📝</Text>
                <Text style={styles.bottomSheetButtonLabel}>Descrever</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomSheetButton}
                onPress={() => {
                  setShowBottomSheet(false);
                  navigation.navigate('PhotoTake');
                }}
              >
                <Text style={styles.bottomSheetButtonIcon}>📷</Text>
                <Text style={styles.bottomSheetButtonLabel}>Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: '#f97316',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingBadge: {
    backgroundColor: '#ffffff',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  metasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metasIcon: {
    fontSize: 14,
  },
  metasText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  dateNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
  },
  macrosSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  macroSummaryItem: {
    alignItems: 'center',
  },
  macroSummaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181b',
  },
  macroSummaryLabel: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  hydrationWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  hydrationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
  },
  hydrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hydrationIcon: {
    fontSize: 28,
  },
  hydrationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  hydrationSubtitle: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  hydrationRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  hydrationBarBg: {
    width: 80,
    height: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 3,
    overflow: 'hidden',
  },
  hydrationBarFill: {
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  hydrationPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  mealPlanWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  mealPlanCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  mealPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mealPlanIcon: {
    fontSize: 28,
  },
  mealPlanTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  mealPlanSubtitle: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  mealPlanRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  mealPlanBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  mealPlanBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  mealPlanDays: {
    fontSize: 11,
    color: '#71717a',
  },
  recipesWrapper: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  recipesCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  recipesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recipesIcon: {
    fontSize: 28,
  },
  recipesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  recipesSubtitle: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  recipesArrow: {
    fontSize: 24,
    color: '#a1a1aa',
  },
  mealsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: '#f9fafb',
  },
  mealsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
    marginBottom: 20,
  },
  mealsList: {
    gap: 14,
    marginBottom: 20,
  },
  addMealButtons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addMealButton: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addMealIcon: {
    fontSize: 24,
  },
  addMealLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#18181b',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
    marginTop: -2,
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
    marginBottom: 24,
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  bottomSheetButton: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  bottomSheetButtonIcon: {
    fontSize: 28,
  },
  bottomSheetButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
});
