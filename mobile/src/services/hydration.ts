import { apiFetch } from './api';

export type HydrationEntry = {
  id: string;
  userId: string;
  volumeMl: number;
  drinkType: string;
  drinkIcon: string;
  timestamp: string;
  createdAt: string;
};

export type HydrationDailyResponse = {
  entries: HydrationEntry[];
  total: number;
  totalVolumeMl: number;
  dailyGoalMl: number;
  progressPercent: number;
};

export async function getHydrationByDate(date?: string): Promise<HydrationDailyResponse> {
  const query = date ? `?date=${date}` : '';
  return apiFetch<HydrationDailyResponse>(`/hydration${query}`);
}

export async function logHydration(data: {
  volumeMl: number;
  drinkType: string;
}): Promise<HydrationEntry> {
  return apiFetch<HydrationEntry>('/hydration', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteHydration(id: string): Promise<void> {
  await apiFetch<void>(`/hydration/${id}`, {
    method: 'DELETE',
  });
}
