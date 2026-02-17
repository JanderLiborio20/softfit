import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import LaunchScreen from './src/screens/LaunchScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MetasScreen from './src/screens/MetasScreen';
import GoalScreen from './src/screens/onboarding/GoalScreen';
import GenderScreen from './src/screens/onboarding/GenderScreen';
import BirthDateScreen from './src/screens/onboarding/BirthDateScreen';
import HeightScreen from './src/screens/onboarding/HeightScreen';
import WeightScreen from './src/screens/onboarding/WeightScreen';
import ActivityScreen from './src/screens/onboarding/ActivityScreen';
import CreateAccountScreen from './src/screens/onboarding/CreateAccountScreen';
import SuccessScreen from './src/screens/onboarding/SuccessScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TakePhotoScreen from './src/screens/photo/TakePhotoScreen';
import ConfirmPhotoScreen from './src/screens/photo/ConfirmPhotoScreen';
import AnalyzingScreen from './src/screens/photo/AnalyzingScreen';
import MealResultScreen from './src/screens/photo/MealResultScreen';
import MealDetailScreen from './src/screens/photo/MealDetailScreen';
import AudioRecordScreen from './src/screens/audio/AudioRecordScreen';
import AudioAnalyzingScreen from './src/screens/audio/AudioAnalyzingScreen';
import AudioResultScreen from './src/screens/audio/AudioResultScreen';
import NutritionistHomeScreen from './src/screens/nutritionist/NutritionistHomeScreen';
import SearchClientScreen from './src/screens/nutritionist/SearchClientScreen';
import ClientDetailScreen from './src/screens/nutritionist/ClientDetailScreen';
import PendingRequestsScreen from './src/screens/PendingRequestsScreen';
import NutritionistRegisterScreen from './src/screens/nutritionist/NutritionistRegisterScreen';

export type OnboardingData = {
  goal?: string;
  gender?: string;
  birthDate?: string;
  height?: string;
  weight?: string;
  activityLevel?: string;
};

export type AnalysisResult = {
  suggestedName: string;
  identifiedFoods: string[];
  estimatedCalories: number;
  estimatedMacros: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
  confidence: number;
};

export type MealData = {
  name: string;
  totalKcal: number;
  protein: number;
  carbs: number;
  fat: number;
  items: {
    name: string;
    amount: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  photoUri?: string;
};

export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  Home: undefined;
  Metas: undefined;
  Profile: undefined;
  PhotoTake: undefined;
  PhotoConfirm: { photoUri: string };
  PhotoAnalyzing: { photoUri: string };
  PhotoResult: { photoUri: string; analysis: AnalysisResult };
  MealDetail: { meal: MealData };
  AudioRecord: undefined;
  AudioAnalyzing: { description: string };
  AudioResult: { analysis: AnalysisResult };
  OnboardingGoal: undefined;
  OnboardingGender: { data: OnboardingData };
  OnboardingBirthDate: { data: OnboardingData };
  OnboardingHeight: { data: OnboardingData };
  OnboardingWeight: { data: OnboardingData };
  OnboardingActivity: { data: OnboardingData };
  OnboardingCreateAccount: { data: OnboardingData };
  OnboardingSuccess: undefined;
  NutritionistHome: undefined;
  SearchClient: undefined;
  ClientDetail: { clientId: string; clientName: string };
  PendingRequests: undefined;
  NutritionistRegister: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Launch"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Launch" component={LaunchScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Metas" component={MetasScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PhotoTake" component={TakePhotoScreen} />
            <Stack.Screen name="PhotoConfirm" component={ConfirmPhotoScreen} />
            <Stack.Screen
              name="PhotoAnalyzing"
              component={AnalyzingScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="PhotoResult" component={MealResultScreen} />
            <Stack.Screen name="MealDetail" component={MealDetailScreen} />
            <Stack.Screen name="AudioRecord" component={AudioRecordScreen} />
            <Stack.Screen
              name="AudioAnalyzing"
              component={AudioAnalyzingScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="AudioResult" component={AudioResultScreen} />
            <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
            <Stack.Screen name="OnboardingGender" component={GenderScreen} />
            <Stack.Screen
              name="OnboardingBirthDate"
              component={BirthDateScreen}
            />
            <Stack.Screen name="OnboardingHeight" component={HeightScreen} />
            <Stack.Screen name="OnboardingWeight" component={WeightScreen} />
            <Stack.Screen
              name="OnboardingActivity"
              component={ActivityScreen}
            />
            <Stack.Screen
              name="OnboardingCreateAccount"
              component={CreateAccountScreen}
            />
            <Stack.Screen
              name="OnboardingSuccess"
              component={SuccessScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="NutritionistHome"
              component={NutritionistHomeScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="SearchClient" component={SearchClientScreen} />
            <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
            <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
            <Stack.Screen name="NutritionistRegister" component={NutritionistRegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
