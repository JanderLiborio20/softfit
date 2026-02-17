import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { confirmMeal } from '../../services/meals';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealDetail'>;
  route: RouteProp<RootStackParamList, 'MealDetail'>;
};

function MacroRing({
  value,
  total,
  color,
  label,
}: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const size = 56;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / total, 1);

  return (
    <View style={ringStyles.container}>
      <View style={ringStyles.svgContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#f4f4f5"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress)}`}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>
        <Text style={ringStyles.value}>{value}g</Text>
      </View>
      <Text style={ringStyles.label}>{label}</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '700',
    color: '#18181b',
  },
  label: {
    fontSize: 12,
    color: '#71717a',
  },
});

export default function MealDetailScreen({ navigation, route }: Props) {
  const { meal } = route.params;
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await confirmMeal({
        name: meal.name,
        foods: meal.items.map((item) => item.name),
        calories: meal.totalKcal,
        macros: {
          carbsGrams: meal.carbs,
          proteinGrams: meal.protein,
          fatGrams: meal.fat,
        },
      });
      navigation.navigate('Home');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar refeição';
      Alert.alert('Erro', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{meal.name}</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo */}
        {meal.photoUri && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: meal.photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Calories card */}
        <View style={styles.caloriesCard}>
          <View style={styles.caloriesMain}>
            <Text style={styles.caloriesValue}>{meal.totalKcal}</Text>
            <Text style={styles.caloriesLabel}>kcal</Text>
          </View>

          <View style={styles.macroRings}>
            <MacroRing
              value={meal.protein}
              total={175}
              color="#ef4444"
              label="Proteína"
            />
            <MacroRing
              value={meal.carbs}
              total={200}
              color="#f97316"
              label="Carbos"
            />
            <MacroRing
              value={meal.fat}
              total={56}
              color="#eab308"
              label="Gordura"
            />
          </View>
        </View>

        {/* Food items */}
        <Text style={styles.sectionTitle}>ALIMENTOS</Text>
        <View style={styles.itemsList}>
          {meal.items.map(
            (
              item: {
                name: string;
                amount: string;
                kcal: number;
                protein: number;
                carbs: number;
                fat: number;
              },
              index: number,
            ) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAmount}>{item.amount}</Text>
                  </View>
                  <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
                </View>
                <View style={styles.itemMacros}>
                  <View style={styles.itemMacro}>
                    <View
                      style={[
                        styles.itemMacroDot,
                        { backgroundColor: '#ef4444' },
                      ]}
                    />
                    <Text style={styles.itemMacroText}>
                      {item.protein}g Prot
                    </Text>
                  </View>
                  <View style={styles.itemMacro}>
                    <View
                      style={[
                        styles.itemMacroDot,
                        { backgroundColor: '#f97316' },
                      ]}
                    />
                    <Text style={styles.itemMacroText}>
                      {item.carbs}g Carb
                    </Text>
                  </View>
                  <View style={styles.itemMacro}>
                    <View
                      style={[
                        styles.itemMacroDot,
                        { backgroundColor: '#eab308' },
                      ]}
                    />
                    <Text style={styles.itemMacroText}>
                      {item.fat}g Gord
                    </Text>
                  </View>
                </View>
              </View>
            ),
          )}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#18181b" />
          ) : (
            <Text style={styles.saveText}>Salvar refeição</Text>
          )}
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
  backArrow: {
    fontSize: 28,
    color: '#18181b',
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#18181b',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  photoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: 200,
  },
  caloriesCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  caloriesMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 20,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#18181b',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#71717a',
    fontWeight: '500',
  },
  macroRings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1,
    marginBottom: 12,
  },
  itemsList: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  itemKcal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65a30d',
  },
  itemMacros: {
    flexDirection: 'row',
    gap: 16,
  },
  itemMacro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemMacroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemMacroText: {
    fontSize: 12,
    color: '#71717a',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
  },
  saveButton: {
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
});
