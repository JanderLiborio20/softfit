import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import OnboardingLayout from '../../components/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'OnboardingHeight'
  >;
  route: RouteProp<RootStackParamList, 'OnboardingHeight'>;
};

export default function HeightScreen({ navigation, route }: Props) {
  const [height, setHeight] = useState('');
  const { data } = route.params;

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="Qual é sua altura?"
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('OnboardingWeight', {
          data: { ...data, height },
        })
      }
      canContinue={height.length > 0}
    >
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder="170"
          placeholderTextColor="#a1a1aa"
          keyboardType="numeric"
        />
        <Text style={styles.unit}>cm</Text>
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
