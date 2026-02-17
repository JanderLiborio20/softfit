import { apiFetch } from './api';

export type ProfileResponse = {
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
  isGoalManuallySet: boolean;
};

export type OnboardingPayload = {
  dateOfBirth: string;
  gender: string;
  heightCm: number;
  weightKg: number;
  goal: string;
  activityLevel: string;
};

export async function getProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>('/profile');
}

export async function completeOnboarding(
  data: OnboardingPayload,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>('/profile/onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export type UpdateProfilePayload = {
  dateOfBirth?: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
};

export async function updateProfile(
  data: UpdateProfilePayload,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
