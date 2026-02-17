import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingActivity'
  >;
  route: RouteProp<RootStackParamList, 'OnboardingActivity'>;
};

const ACTIVITIES = [
  {
    id: 'sedentary',
    label: 'Sedentário',
    description: 'Pouca ou nenhuma atividade física',
  },
  {
    id: 'light',
    label: 'Levemente ativo',
    description: 'Exercício leve 1-3 dias por semana',
  },
  {
    id: 'moderate',
    label: 'Moderadamente ativo',
    description: 'Exercício moderado 3-5 dias por semana',
  },
  {
    id: 'active',
    label: 'Muito ativo',
    description: 'Exercício intenso 6-7 dias por semana',
  },
  {
    id: 'extra',
    label: 'Extremamente ativo',
    description: 'Exercício muito intenso, trabalho físico',
  },
];

export default function ActivityScreen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { data } = route.params;

  return (
    <OnboardingLayout
      step={6}
      totalSteps={7}
      title="Qual seu nível de atividade?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingCreateAccount', {
          data: { ...data, activityLevel: selected! },
        })
      }
      canContinue={!!selected}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.options}>
          {ACTIVITIES.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.option,
                selected === activity.id && styles.optionSelected,
              ]}
              onPress={() => setSelected(activity.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  selected === activity.id && styles.checkboxSelected,
                ]}
              >
                {selected === activity.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{activity.label}</Text>
                <Text style={styles.optionDescription}>
                  {activity.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d4d4d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#65a30d',
    borderColor: '#65a30d',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
  optionDescription: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },
});
