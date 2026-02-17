import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OnboardingGender'>;
  route: RouteProp<RootStackParamList, 'OnboardingGender'>;
};

export default function GenderScreen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { data } = route.params;

  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      title="Qual é seu gênero?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingBirthDate', {
          data: { ...data, gender: selected! },
        })
      }
      canContinue={!!selected}
    >
      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.card, selected === 'male' && styles.cardSelected]}
          onPress={() => setSelected('male')}
          activeOpacity={0.7}
        >
          <Text style={styles.genderIcon}>👨</Text>
          <Text style={styles.genderLabel}>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, selected === 'female' && styles.cardSelected]}
          onPress={() => setSelected('female')}
          activeOpacity={0.7}
        >
          <Text style={styles.genderIcon}>👩</Text>
          <Text style={styles.genderLabel}>Feminino</Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#f7fee7',
    borderColor: '#bef264',
  },
  genderIcon: {
    fontSize: 48,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
  },
});
