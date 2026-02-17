import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OnboardingGoal'>;
};

const GOALS = [
  { id: 'lose', label: 'Perder peso' },
  { id: 'gain', label: 'Ganhar massa' },
  { id: 'maintain', label: 'Manter peso' },
];

export default function GoalScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingLayout
      step={1}
      totalSteps={7}
      title="Qual é seu objetivo?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingGender', {
          data: { goal: selected! },
        })
      }
      canContinue={!!selected}
    >
      <View style={styles.options}>
        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.option,
              selected === goal.id && styles.optionSelected,
            ]}
            onPress={() => setSelected(goal.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radio,
                selected === goal.id && styles.radioSelected,
              ]}
            >
              {selected === goal.id && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.optionText}>{goal.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#f7fee7',
    borderColor: '#bef264',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d4d4d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#65a30d',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#65a30d',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
});
