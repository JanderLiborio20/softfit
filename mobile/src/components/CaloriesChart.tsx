import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  current: number;
  total: number;
  protein: { current: number; total: number };
  carbs: { current: number; total: number };
  fat: { current: number; total: number };
};

export default function CaloriesChart({
  current,
  total,
  protein,
  carbs,
  fat,
}: Props) {
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(current / total, 1);
  const proteinProgress = Math.min(protein.current / protein.total, 1);
  const carbsProgress = Math.min(carbs.current / carbs.total, 1);
  const fatProgress = Math.min(fat.current / fat.total, 1);

  // Outer ring = calories total
  const calorieOffset = circumference * (1 - progress);

  // Inner rings for macros
  const innerRadius1 = radius - 18;
  const innerCircumference1 = 2 * Math.PI * innerRadius1;
  const proteinOffset = innerCircumference1 * (1 - proteinProgress);

  const innerRadius2 = radius - 36;
  const innerCircumference2 = 2 * Math.PI * innerRadius2;
  const carbsOffset = innerCircumference2 * (1 - carbsProgress);

  const innerRadius3 = radius - 54;
  const innerCircumference3 = 2 * Math.PI * innerRadius3;
  const fatOffset = innerCircumference3 * (1 - fatProgress);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background rings */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius1}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius2}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius3}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Calories (outer - red/orange) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={calorieOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Protein (green) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius1}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={innerCircumference1}
          strokeDashoffset={proteinOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Carbs (orange) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius2}
          stroke="#f97316"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={innerCircumference2}
          strokeDashoffset={carbsOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Fat (yellow) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius3}
          stroke="#eab308"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={innerCircumference3}
          strokeDashoffset={fatOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.currentCalories}>
          <Text style={styles.currentValue}>{current}</Text>
          <Text style={styles.totalValue}> / {total}</Text>
        </Text>
        <Text style={styles.caloriesLabel}>Calorias</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  currentCalories: {
    fontSize: 16,
  },
  currentValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717a',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
});
