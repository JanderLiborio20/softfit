import { View, Text, StyleSheet } from 'react-native';

type Props = {
  icon: string;
  name: string;
  description: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function MealCard({
  icon,
  name,
  description,
  time,
  kcal,
  protein,
  carbs,
  fat,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <View style={styles.macros}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, styles.kcalValue]}>{kcal}</Text>
          <Text style={styles.macroLabel}>Kcal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{protein}g</Text>
          <Text style={styles.macroLabel}>Proteínas</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, styles.carbsValue]}>{carbs}g</Text>
          <Text style={styles.macroLabel}>Carboidratos</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, styles.fatValue]}>{fat}g</Text>
          <Text style={styles.macroLabel}>Gorduras</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  time: {
    fontSize: 12,
    color: '#71717a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  description: {
    fontSize: 13,
    color: '#71717a',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  macroLabel: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  kcalValue: {
    color: '#22c55e',
  },
  carbsValue: {
    color: '#22c55e',
  },
  fatValue: {
    color: '#22c55e',
  },
});
