import { apiFetch, getStoredToken } from './api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export type MealResponse = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  audioUrl: string | null;
  foods: string[];
  calories: number;
  macros: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
  mealTime: string;
  confidence: number;
  canBeEdited: boolean;
  ageInDays: number;
  createdAt: string;
  updatedAt: string;
};

export type MealListResponse = {
  meals: MealResponse[];
  total: number;
  summary: {
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
  };
};

export async function getMealsByDate(date?: string): Promise<MealListResponse> {
  const query = date ? `?date=${date}` : '';
  return apiFetch<MealListResponse>(`/meals${query}`);
}

export type AIAnalysisResponse = {
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

export async function analyzeMealPhoto(photoUri: string): Promise<AIAnalysisResponse> {
  const token = await getStoredToken();

  const formData = new FormData();
  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'meal-photo.jpg',
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/meals/photo`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao analisar foto');
  }

  return data as AIAnalysisResponse;
}

export async function confirmMeal(data: {
  name: string;
  foods: string[];
  calories: number;
  macros: { carbsGrams: number; proteinGrams: number; fatGrams: number };
  mealTime?: string;
}): Promise<MealResponse> {
  return apiFetch<MealResponse>('/meals/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
