import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoResult'>;
  route: RouteProp<RootStackParamList, 'PhotoResult'>;
};

export default function MealResultScreen({ navigation, route }: Props) {
  const { photoUri, analysis } = route.params;

  const result = {
    name: analysis.suggestedName,
    totalKcal: analysis.estimatedCalories,
    protein: analysis.estimatedMacros.proteinGrams,
    carbs: analysis.estimatedMacros.carbsGrams,
    fat: analysis.estimatedMacros.fatGrams,
    foods: analysis.identifiedFoods,
  };

  return (
    <View style={styles.container}>
      {/* Photo header */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.photoGradient}
        />
        <SafeAreaView style={styles.photoHeader} edges={['top']}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.headerIcon}>{'✕'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enviar Foto</Text>
          <View style={styles.headerButton} />
        </SafeAreaView>
      </View>

      {/* Results card */}
      <View style={styles.resultsCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Meal name and total */}
          <View style={styles.mealHeader}>
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
          </View>

          {/* Macro summary */}
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

          {/* Divider */}
          <View style={styles.divider} />

          {/* Items */}
          <Text style={styles.itemsTitle}>Alimentos identificados</Text>
          <View style={styles.itemsList}>
            {result.foods.map((food, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{food}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action buttons */}
        <SafeAreaView style={styles.bottomActions} edges={['bottom']}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => navigation.popToTop()}
            activeOpacity={0.7}
          >
            <Text style={styles.retakeText}>Tirar outra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() =>
              navigation.navigate('MealDetail', {
                meal: {
                  name: result.name,
                  totalKcal: result.totalKcal,
                  protein: result.protein,
                  carbs: result.carbs,
                  fat: result.fat,
                  items: result.foods.map((food) => {
                    const count = result.foods.length || 1;
                    return {
                      name: food,
                      amount: '',
                      kcal: Math.round(result.totalKcal / count),
                      protein: Math.round(result.protein / count),
                      carbs: Math.round(result.carbs / count),
                      fat: Math.round(result.fat / count),
                    };
                  }),
                  photoUri,
                },
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>Salvar refeição</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    height: 260,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  photoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 8,
  },
  mealHeader: {
    marginBottom: 20,
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
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
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
