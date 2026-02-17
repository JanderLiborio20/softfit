import { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AudioRecord'>;
};

type RecordingState = 'idle' | 'recording' | 'done';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function AudioRecordScreen({ navigation }: Props) {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  const size = 220;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Pulse animation during recording
  useEffect(() => {
    if (state === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  // Ring progress animation
  useEffect(() => {
    if (state === 'recording') {
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 60000, // 60s max
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (state === 'idle') {
      ringAnim.setValue(0);
    }
  }, [state, ringAnim]);

  const startRecording = useCallback(async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setState('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      // Permission denied or error
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // Already stopped
      }
      recordingRef.current = null;
    }

    setState('done');
  }, []);

  const handleSend = useCallback(() => {
    navigation.navigate('AudioAnalyzing');
  }, [navigation]);

  const handleReset = useCallback(() => {
    setState('idle');
    setDuration(0);
    ringAnim.setValue(0);
  }, [ringAnim]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const ringOffset = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>{'✕'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enviar Áudio</Text>
          <View style={styles.headerButton} />
        </View>
      </SafeAreaView>

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Animated ring */}
        <Animated.View
          style={[
            styles.ringContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Svg width={size} height={size}>
            {/* Background ring */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(190, 242, 100, 0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress ring */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke="#bef264"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={ringOffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
              opacity={state === 'idle' ? 0.3 : 1}
            />
          </Svg>

          {/* Center text */}
          <View style={styles.centerText}>
            {state === 'idle' && (
              <Text style={styles.exampleText}>
                Tente dizer algo como:{'\n'}
                <Text style={styles.exampleBold}>
                  100g de Arroz, 2 Ovos e{'\n'}150g de frango
                </Text>
              </Text>
            )}
            {state === 'recording' && (
              <>
                <Text style={styles.exampleText}>
                  Tente dizer algo como:{'\n'}
                  <Text style={styles.exampleBold}>
                    100g de Arroz, 2 Ovos e{'\n'}150g de frango
                  </Text>
                </Text>
              </>
            )}
            {state === 'done' && (
              <Text style={styles.doneText}>
                Áudio gravado!{'\n'}Toque em enviar para analisar
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Timer */}
        {(state === 'recording' || state === 'done') && (
          <Text style={styles.timer}>{formatTime(duration)}</Text>
        )}

        {/* Hint text */}
        {state === 'idle' && (
          <Text style={styles.hintText}>
            Clique no microfone{'\n'}para começar a gravar
          </Text>
        )}
      </View>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottomArea} edges={['bottom']}>
        <View style={styles.controls}>
          {state === 'idle' && (
            <TouchableOpacity
              style={styles.micButton}
              onPress={startRecording}
              activeOpacity={0.8}
            >
              <Text style={styles.micIcon}>{'🎙'}</Text>
            </TouchableOpacity>
          )}

          {state === 'recording' && (
            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopRecording}
                activeOpacity={0.8}
              >
                <View style={styles.stopSquare} />
              </TouchableOpacity>
            </View>
          )}

          {state === 'done' && (
            <View style={styles.doneControls}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Text style={styles.resetIcon}>{'↻'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                activeOpacity={0.8}
              >
                <Text style={styles.sendText}>Analisar</Text>
                <Text style={styles.sendArrow}>{'→'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  safeArea: {},
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
  closeIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  exampleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },
  exampleBold: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  doneText: {
    fontSize: 15,
    color: '#bef264',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 24,
    fontVariant: ['tabular-nums'],
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 22,
  },
  bottomArea: {
    paddingBottom: 16,
  },
  controls: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#bef264',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 32,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  stopButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 3,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  doneControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
    width: '100%',
  },
  resetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  sendArrow: {
    fontSize: 18,
    color: '#18181b',
  },
});
