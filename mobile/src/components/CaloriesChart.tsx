import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  current: number;
  total: number;
  protein: { current: number; total: number };
  carbs: { current: number; total: number };
  fat: { current: number; total: number };
};

const COLORS = {
  protein: '#22c55e',
  carbs: '#14b8a6',
  fat: '#eab308',
  bg: '#e5e7eb',
};

export default function CaloriesChart({
  current,
  total,
  protein,
  carbs,
  fat,
}: Props) {
  const width = 260;
  const strokeWidth = 14;
  const gap = 20;

  const outerR = width / 2 - strokeWidth / 2;
  const middleR = outerR - gap;
  const innerR = middleR - gap;

  const height = outerR + strokeWidth + 10;
  const cy = outerR + strokeWidth / 2;

  const proteinProg = protein.total > 0 ? Math.min(protein.current / protein.total, 1) : 0;
  const carbsProg = carbs.total > 0 ? Math.min(carbs.current / carbs.total, 1) : 0;
  const fatProg = fat.total > 0 ? Math.min(fat.current / fat.total, 1) : 0;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Background arcs */}
        <SemiArc cx={width / 2} cy={cy} r={outerR} color={COLORS.bg} sw={strokeWidth} progress={1} />
        <SemiArc cx={width / 2} cy={cy} r={middleR} color={COLORS.bg} sw={strokeWidth} progress={1} />
        <SemiArc cx={width / 2} cy={cy} r={innerR} color={COLORS.bg} sw={strokeWidth} progress={1} />

        {/* Progress arcs */}
        <SemiArc cx={width / 2} cy={cy} r={outerR} color={COLORS.protein} sw={strokeWidth} progress={proteinProg} />
        <SemiArc cx={width / 2} cy={cy} r={middleR} color={COLORS.carbs} sw={strokeWidth} progress={carbsProg} />
        <SemiArc cx={width / 2} cy={cy} r={innerR} color={COLORS.fat} sw={strokeWidth} progress={fatProg} />
      </Svg>

      {/* Center text (calories) */}
      <View style={[styles.centerText, { top: cy - 20 }]}>
        <Text style={styles.caloriesRow}>
          <Text style={styles.currentValue}>{Math.round(current)}</Text>
          <Text style={styles.totalValue}> / {total}</Text>
        </Text>
        <Text style={styles.caloriesLabel}>Calorias</Text>
      </View>
    </View>
  );
}

function SemiArc({
  cx,
  cy,
  r,
  color,
  sw,
  progress,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  sw: number;
  progress: number;
}) {
  const halfCirc = Math.PI * r;
  const fullCirc = 2 * Math.PI * r;
  const visible = halfCirc * progress;

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      strokeWidth={sw}
      fill="none"
      strokeDasharray={`${visible} ${fullCirc}`}
      strokeLinecap="round"
      rotation="180"
      origin={`${cx}, ${cy}`}
    />
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
  caloriesRow: {
    fontSize: 16,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#a1a1aa',
  },
  caloriesLabel: {
    fontSize: 13,
    color: '#a1a1aa',
    marginTop: 2,
  },
});
