import { apiFetch } from './api';

export type NutritionistProfile = {
  userId: string;
  crn: string;
  crnState: string;
  fullName: string;
  bio: string | null;
  specialties: string[];
  isVerified: boolean;
  activeClientsCount: number;
};

export type SearchClientResult = {
  userId: string;
  name: string;
  email: string;
};

export type LinkResponse = {
  id: string;
  clientId: string;
  nutritionistId: string;
  status: string;
  requestedAt: string;
  respondedAt: string | null;
  endedAt: string | null;
};

export type LinkedClient = {
  userId: string;
  name: string;
  email: string;
  linkedAt: string;
};

export type PendingLink = {
  id: string;
  nutritionistId: string;
  nutritionistName: string;
  nutritionistCrn: string;
  requestedAt: string;
  status: string;
};

export type ClientMeal = {
  id: string;
  name: string;
  foods: string[];
  calories: number;
  macros: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
  mealTime: string;
};

export type ClientData = {
  profile: {
    userId: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    bmi: number;
    goal: string;
    activityLevel: string;
    dailyCaloriesGoal: number;
    dailyMacrosGoal: {
      carbsGrams: number;
      proteinGrams: number;
      fatGrams: number;
    };
  };
  meals: ClientMeal[];
};

export async function createNutritionistProfile(data: {
  crn: string;
  crnState: string;
  fullName: string;
  bio?: string;
  specialties?: string[];
}): Promise<NutritionistProfile> {
  return apiFetch<NutritionistProfile>('/nutritionists/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchClientByEmail(
  email: string,
): Promise<SearchClientResult | null> {
  return apiFetch<SearchClientResult | null>(
    `/nutritionists/search-clients?email=${encodeURIComponent(email)}`,
  );
}

export async function requestLink(clientId: string): Promise<LinkResponse> {
  return apiFetch<LinkResponse>('/nutritionists/link', {
    method: 'POST',
    body: JSON.stringify({ clientId }),
  });
}

export async function getMyClients(): Promise<LinkedClient[]> {
  return apiFetch<LinkedClient[]>('/nutritionists/my-clients');
}

export async function getClientData(clientId: string): Promise<ClientData> {
  return apiFetch<ClientData>(`/nutritionists/clients/${clientId}`);
}

export async function getPendingLinks(): Promise<PendingLink[]> {
  return apiFetch<PendingLink[]>('/nutritionists/my-links/pending');
}

export async function acceptLink(linkId: string): Promise<LinkResponse> {
  return apiFetch<LinkResponse>(`/nutritionists/link/${linkId}/accept`, {
    method: 'PUT',
  });
}

export async function rejectLink(linkId: string): Promise<LinkResponse> {
  return apiFetch<LinkResponse>(`/nutritionists/link/${linkId}/reject`, {
    method: 'PUT',
  });
}
