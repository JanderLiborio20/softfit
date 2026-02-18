import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  currentMl: number;
  goalMl: number;
};

export default function HydrationProgress({ currentMl, goalMl }: Props) {
  const size = 200;
  const strokeWidth = 16;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = goalMl > 0 ? Math.min(currentMl / goalMl, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.centerText}>
        <Text style={styles.icon}>💧</Text>
        <Text style={styles.currentValue}>{currentMl}ml</Text>
        <Text style={styles.goalValue}>de {goalMl}ml</Text>
        <Text style={styles.percentText}>{percent}%</Text>
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
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3b82f6',
  },
  goalValue: {
    fontSize: 13,
    color: '#a1a1aa',
    marginTop: 2,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717a',
    marginTop: 4,
  },
});
