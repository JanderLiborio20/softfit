import type { ReactNode } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
  onBack: () => void;
  onContinue: () => void;
  canContinue?: boolean;
  continueLabel?: string;
};

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  children,
  onBack,
  onContinue,
  canContinue = true,
  continueLabel = 'Continuar',
}: Props) {
  const progress = step / totalSteps;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          onPress={onContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>{continueLabel}</Text>
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
  progressBar: {
    height: 4,
    backgroundColor: '#e4e4e7',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#bef264',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18181b',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#18181b',
    lineHeight: 28,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
});
