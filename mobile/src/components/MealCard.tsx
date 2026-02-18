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
      {/* Top row: icon + info + calories badge */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.kcalBadge}>
          <Text style={styles.kcalValue}>{kcal}</Text>
          <Text style={styles.kcalLabel}>kcal</Text>
        </View>
      </View>

      {/* Macros bar */}
      <View style={styles.macrosRow}>
        <View style={styles.macroChip}>
          <View style={[styles.macroDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.macroText}>
            <Text style={[styles.macroValue, { color: '#22c55e' }]}>{protein}g</Text>
            <Text style={styles.macroLabel}> prot</Text>
          </Text>
        </View>
        <View style={styles.macroChip}>
          <View style={[styles.macroDot, { backgroundColor: '#14b8a6' }]} />
          <Text style={styles.macroText}>
            <Text style={[styles.macroValue, { color: '#14b8a6' }]}>{carbs}g</Text>
            <Text style={styles.macroLabel}> carb</Text>
          </Text>
        </View>
        <View style={styles.macroChip}>
          <View style={[styles.macroDot, { backgroundColor: '#eab308' }]} />
          <Text style={styles.macroText}>
            <Text style={[styles.macroValue, { color: '#eab308' }]}>{fat}g</Text>
            <Text style={styles.macroLabel}> gord</Text>
          </Text>
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
    gap: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  description: {
    fontSize: 13,
    color: '#71717a',
  },
  time: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
  },
  kcalBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  kcalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  kcalLabel: {
    fontSize: 10,
    color: '#71717a',
    marginTop: 1,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroText: {
    fontSize: 12,
  },
  macroValue: {
    fontWeight: '700',
  },
  macroLabel: {
    color: '#a1a1aa',
    fontWeight: '400',
  },
});
