import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingBirthDate'
  >;
  route: RouteProp<RootStackParamList, 'OnboardingBirthDate'>;
};

export default function BirthDateScreen({ navigation, route }: Props) {
  const [date, setDate] = useState('');
  const { data } = route.params;

  const formatDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    let formatted = '';
    if (numbers.length > 0) formatted += numbers.slice(0, 2);
    if (numbers.length > 2) formatted += '/' + numbers.slice(2, 4);
    if (numbers.length > 4) formatted += '/' + numbers.slice(4, 8);
    setDate(formatted);
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={7}
      title="Que dia você nasceu?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingHeight', {
          data: { ...data, birthDate: date },
        })
      }
      canContinue={date.length === 10}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={formatDate}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#a1a1aa"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18181b',
  },
});
