import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingWeight'
  >;
  route: RouteProp<RootStackParamList, 'OnboardingWeight'>;
};

export default function WeightScreen({ navigation, route }: Props) {
  const [weight, setWeight] = useState('');
  const { data } = route.params;

  return (
    <OnboardingLayout
      step={5}
      totalSteps={7}
      title="Qual é seu peso?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingActivity', {
          data: { ...data, weight },
        })
      }
      canContinue={weight.length > 0}
    >
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="70"
          placeholderTextColor="#a1a1aa"
          keyboardType="numeric"
        />
        <Text style={styles.unit}>kg</Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
  unit: {
    fontSize: 16,
    color: '#71717a',
    width: 30,
  },
});
