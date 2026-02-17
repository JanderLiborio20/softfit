import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { describeMeal } from '../../services/meals';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AudioAnalyzing'>;
  route: RouteProp<RootStackParamList, 'AudioAnalyzing'>;
};

export default function AudioAnalyzingScreen({ navigation, route }: Props) {
  const { description } = route.params;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const size = 160;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    let cancelled = false;

    describeMeal(description)
      .then((analysis) => {
        if (!cancelled) {
          navigation.replace('AudioResult', { analysis });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Erro ao analisar refeição';
          Alert.alert('Erro', message, [
            { text: 'Voltar', onPress: () => navigation.goBack() },
          ]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigation, rotateAnim, pulseAnim, description]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Animated circle */}
      <Animated.View
        style={[
          styles.circleContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Svg width={size} height={size}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(190, 242, 100, 0.15)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#bef264"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${circumference * 0.6}`}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>
        </Animated.View>

        <View style={styles.centerIcon}>
          <Text style={styles.leafIcon}>{'🥗'}</Text>
        </View>
      </Animated.View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Analisando sua refeição...</Text>
        <Text style={styles.subtitle}>
          Está identificando os alimentos e calculando os nutrientes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  centerIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafIcon: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
