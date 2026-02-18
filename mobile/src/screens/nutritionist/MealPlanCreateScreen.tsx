import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
import { createNutritionPlan } from '../../services/nutritionist';
import type { PlannedMeal } from '../../services/nutritionist';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealPlanCreate'>;
  route: RouteProp<RootStackParamList, 'MealPlanCreate'>;
};

type MealForm = {
  name: string;
  time: string;
  foods: string;
  portions: string;
  observations: string;
};

const EMPTY_MEAL: MealForm = {
  name: '',
  time: '',
  foods: '',
  portions: '',
  observations: '',
};

export default function MealPlanCreateScreen({ navigation, route }: Props) {
  const { clientId, clientName } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generalGuidelines, setGeneralGuidelines] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [meals, setMeals] = useState<MealForm[]>([
    { name: 'Cafe da Manha', time: '07:00', foods: '', portions: '', observations: '' },
    { name: 'Almoco', time: '12:00', foods: '', portions: '', observations: '' },
    { name: 'Jantar', time: '19:00', foods: '', portions: '', observations: '' },
  ]);
  const [saving, setSaving] = useState(false);

  function updateMeal(index: number, field: keyof MealForm, value: string) {
    setMeals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addMeal() {
    setMeals((prev) => [...prev, { ...EMPTY_MEAL }]);
  }

  function removeMeal(index: number) {
    if (meals.length <= 1) return;
    setMeals((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Erro', 'Informe o titulo do plano.');
      return;
    }

    const validMeals = meals.filter(
      (m) => m.name.trim() && m.foods.trim(),
    );
    if (validMeals.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma refeicao com alimentos.');
      return;
    }

    setSaving(true);
    try {
      const plannedMeals: PlannedMeal[] = validMeals.map((m) => ({
        name: m.name.trim(),
        time: m.time.trim() || '00:00',
        foods: m.foods.split(',').map((f) => f.trim()).filter(Boolean),
        portions: m.portions
          ? m.portions.split(',').map((p) => p.trim()).filter(Boolean)
          : m.foods.split(',').map(() => '1 porcao'),
        observations: m.observations.trim() || undefined,
      }));

      await createNutritionPlan({
        clientId,
        title: title.trim(),
        description: description.trim() || undefined,
        plannedMeals,
        generalGuidelines: generalGuidelines.trim() || undefined,
        durationDays: durationDays ? Number(durationDays) : undefined,
      });

      Alert.alert('Sucesso', 'Plano alimentar criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao criar plano';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Plano</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Client info */}
          <View style={styles.clientBadge}>
            <Text style={styles.clientBadgeLabel}>Cliente:</Text>
            <Text style={styles.clientBadgeName}>{clientName}</Text>
          </View>

          {/* Plan info */}
          <Text style={styles.sectionTitle}>INFORMACOES DO PLANO</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Titulo *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Plano para Emagrecimento"
                placeholderTextColor="#a1a1aa"
                maxLength={200}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descricao</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descricao do plano..."
                placeholderTextColor="#a1a1aa"
                multiline
                numberOfLines={3}
                maxLength={1000}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Orientacoes Gerais</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={generalGuidelines}
                onChangeText={setGeneralGuidelines}
                placeholder="Ex: Beber 2L de agua por dia..."
                placeholderTextColor="#a1a1aa"
                multiline
                numberOfLines={3}
                maxLength={1000}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Duracao (dias)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={durationDays}
                onChangeText={setDurationDays}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor="#a1a1aa"
              />
            </View>
          </View>

          {/* Meals */}
          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
            REFEICOES ({meals.length})
          </Text>

          {meals.map((meal, index) => (
            <View key={index} style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <Text style={styles.mealCardTitle}>
                  Refeicao {index + 1}
                </Text>
                {meals.length > 1 && (
                  <TouchableOpacity onPress={() => removeMeal(index)}>
                    <Text style={styles.removeButton}>Remover</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.mealField}>
                <Text style={styles.mealLabel}>Nome *</Text>
                <TextInput
                  style={styles.mealInput}
                  value={meal.name}
                  onChangeText={(v) => updateMeal(index, 'name', v)}
                  placeholder="Ex: Cafe da Manha"
                  placeholderTextColor="#a1a1aa"
                />
              </View>

              <View style={styles.mealField}>
                <Text style={styles.mealLabel}>Horario</Text>
                <TextInput
                  style={styles.mealInput}
                  value={meal.time}
                  onChangeText={(v) => updateMeal(index, 'time', v)}
                  placeholder="Ex: 08:00"
                  placeholderTextColor="#a1a1aa"
                />
              </View>

              <View style={styles.mealField}>
                <Text style={styles.mealLabel}>Alimentos * (separados por virgula)</Text>
                <TextInput
                  style={[styles.mealInput, styles.multilineInput]}
                  value={meal.foods}
                  onChangeText={(v) => updateMeal(index, 'foods', v)}
                  placeholder="Ex: Pao integral, Ovo mexido, Cafe"
                  placeholderTextColor="#a1a1aa"
                  multiline
                />
              </View>

              <View style={styles.mealField}>
                <Text style={styles.mealLabel}>Porcoes (separadas por virgula)</Text>
                <TextInput
                  style={[styles.mealInput, styles.multilineInput]}
                  value={meal.portions}
                  onChangeText={(v) => updateMeal(index, 'portions', v)}
                  placeholder="Ex: 2 fatias, 2 unidades, 200ml"
                  placeholderTextColor="#a1a1aa"
                  multiline
                />
              </View>

              <View style={styles.mealField}>
                <Text style={styles.mealLabel}>Observacoes</Text>
                <TextInput
                  style={styles.mealInput}
                  value={meal.observations}
                  onChangeText={(v) => updateMeal(index, 'observations', v)}
                  placeholder="Ex: Evitar acucar"
                  placeholderTextColor="#a1a1aa"
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addMealButton} onPress={addMeal}>
            <Text style={styles.addMealButtonText}>+ Adicionar Refeicao</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Save button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.5 }]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#18181b" />
            ) : (
              <Text style={styles.saveButtonText}>Criar Plano Alimentar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backArrow: {
    fontSize: 32,
    color: '#18181b',
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#18181b',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    gap: 6,
  },
  clientBadgeLabel: {
    fontSize: 13,
    color: '#71717a',
  },
  clientBadgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  fieldGroup: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },
  inputWrapper: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#18181b',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  mealCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  mealCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181b',
  },
  removeButton: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  mealField: {
    gap: 4,
    marginBottom: 12,
  },
  mealLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717a',
  },
  mealInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#18181b',
  },
  addMealButton: {
    borderWidth: 2,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addMealButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#22c55e',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  saveButton: {
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
});
