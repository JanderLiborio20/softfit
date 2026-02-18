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
import { getSuggestedRecipes } from '../services/meals';
import type { RecipeSuggestion } from '../services/meals';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SuggestedRecipes'>;
};

export default function SuggestedRecipesScreen({ navigation }: Props) {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [remainingMacros, setRemainingMacros] = useState<{
    remainingCalories: number;
    remainingCarbs: number;
    remainingProtein: number;
    remainingFat: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError(null);
      getSuggestedRecipes()
        .then((result) => {
          setRecipes(result.recipes);
          setRemainingMacros(result.remainingMacros);
        })
        .catch((err) => {
          setError(
            err instanceof Error
              ? err.message
              : 'Erro ao buscar sugestoes de receitas',
          );
        })
        .finally(() => setLoading(false));
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugestoes de Receitas</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>
            Gerando receitas com IA...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              getSuggestedRecipes()
                .then((result) => {
                  setRecipes(result.recipes);
                  setRemainingMacros(result.remainingMacros);
                })
                .catch((err) => {
                  setError(
                    err instanceof Error
                      ? err.message
                      : 'Erro ao buscar sugestoes',
                  );
                })
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteArea}>
            {/* Remaining macros banner */}
            {remainingMacros && (
              <View style={styles.macrosBanner}>
                <Text style={styles.macrosBannerTitle}>
                  Macros disponiveis hoje
                </Text>
                <View style={styles.macrosRow}>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: '#22c55e' }]}>
                      {remainingMacros.remainingCalories}
                    </Text>
                    <Text style={styles.macroLabel}>kcal</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: '#22c55e' }]}>
                      {remainingMacros.remainingProtein}g
                    </Text>
                    <Text style={styles.macroLabel}>Proteina</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: '#14b8a6' }]}>
                      {remainingMacros.remainingCarbs}g
                    </Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: '#eab308' }]}>
                      {remainingMacros.remainingFat}g
                    </Text>
                    <Text style={styles.macroLabel}>Gordura</Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>RECEITAS SUGERIDAS</Text>

            {recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard}>
                {/* Recipe header */}
                <TouchableOpacity
                  style={styles.recipeHeader}
                  onPress={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.recipeIconBadge}>
                    <Text style={styles.recipeIcon}>{'🥗'}</Text>
                  </View>
                  <View style={styles.recipeHeaderText}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <Text style={styles.recipeCalories}>
                      {recipe.estimatedCalories} kcal ·{' '}
                      {recipe.prepTimeMinutes} min
                    </Text>
                  </View>
                  <Text style={styles.expandArrow}>
                    {expandedIndex === index ? '▾' : '▸'}
                  </Text>
                </TouchableOpacity>

                {/* Macro pills */}
                <View style={styles.recipeMacroPills}>
                  <View
                    style={[styles.macroPill, { backgroundColor: '#f0fdf4' }]}
                  >
                    <Text
                      style={[styles.macroPillText, { color: '#22c55e' }]}
                    >
                      P: {recipe.estimatedMacros.protein}g
                    </Text>
                  </View>
                  <View
                    style={[styles.macroPill, { backgroundColor: '#f0fdfa' }]}
                  >
                    <Text
                      style={[styles.macroPillText, { color: '#14b8a6' }]}
                    >
                      C: {recipe.estimatedMacros.carbs}g
                    </Text>
                  </View>
                  <View
                    style={[styles.macroPill, { backgroundColor: '#fefce8' }]}
                  >
                    <Text
                      style={[styles.macroPillText, { color: '#eab308' }]}
                    >
                      G: {recipe.estimatedMacros.fat}g
                    </Text>
                  </View>
                </View>

                {/* Expanded content */}
                {expandedIndex === index && (
                  <>
                    <Text style={styles.recipeDescription}>
                      {recipe.description}
                    </Text>

                    <Text style={styles.subSectionTitle}>INGREDIENTES</Text>
                    {recipe.ingredients.map((ing, i) => (
                      <View key={i} style={styles.ingredientRow}>
                        <View style={styles.ingredientDot} />
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                        <Text style={styles.ingredientAmount}>
                          {ing.amount}
                        </Text>
                      </View>
                    ))}

                    <Text
                      style={[styles.subSectionTitle, { marginTop: 16 }]}
                    >
                      MODO DE PREPARO
                    </Text>
                    {recipe.preparationSteps.map((step, i) => (
                      <View key={i} style={styles.stepRow}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </>
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
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#71717a',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
  macrosBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  macrosBannerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
    marginBottom: 12,
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  recipeCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeIcon: {
    fontSize: 22,
  },
  recipeHeaderText: {
    flex: 1,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  recipeCalories: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },
  expandArrow: {
    fontSize: 18,
    color: '#a1a1aa',
  },
  recipeMacroPills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  macroPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  macroPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
    marginTop: 14,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a1a1aa',
    letterSpacing: 1,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  ingredientName: {
    fontSize: 14,
    color: '#18181b',
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 13,
    color: '#71717a',
    fontWeight: '500',
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 14,
    color: '#18181b',
    lineHeight: 20,
    flex: 1,
  },
});
