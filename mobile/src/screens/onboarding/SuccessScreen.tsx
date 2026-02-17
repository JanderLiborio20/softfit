import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingSuccess'
  >;
};

export default function SuccessScreen({ navigation }: Props) {
  const size = 180;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;

  return (
    <LinearGradient
      colors={['#22c55e', '#15803d', '#09090b']}
      locations={[0, 0.4, 0.8]}
      style={styles.container}
    >
      {/* Chart illustration */}
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius - 16}
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius - 32}
            stroke="#f97316"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${2 * Math.PI * radius}`}
            strokeDashoffset={`${2 * Math.PI * radius * 0.3}`}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius - 16}
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${2 * Math.PI * (radius - 16)}`}
            strokeDashoffset={`${2 * Math.PI * (radius - 16) * 0.4}`}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius - 32}
            stroke="#f97316"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${2 * Math.PI * (radius - 32)}`}
            strokeDashoffset={`${2 * Math.PI * (radius - 32) * 0.5}`}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Seu plano foi feito para{' '}
          <Text style={styles.highlight}>Perder Peso</Text> e melhorar sua
          alimentação
        </Text>
        <Text style={styles.subtitle}>
          Estamos personalizando o app para você
        </Text>
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.buttonText}>Vamos lá</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
  },
  highlight: {
    color: '#bef264',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  button: {
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
});
