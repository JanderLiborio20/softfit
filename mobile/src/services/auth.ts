import * as SecureStore from 'expo-secure-store';
import { apiFetch, storeToken, removeToken } from './api';

const USER_KEY = 'auth_user';

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
  role: 'client' | 'nutritionist';
};

type AuthResponse = AuthUser & {
  accessToken: string;
};

async function saveUser(user: AuthUser): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as AuthUser;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  await storeToken(response.accessToken);
  const user: AuthUser = {
    userId: response.userId,
    email: response.email,
    name: response.name,
    role: response.role,
  };
  await saveUser(user);
  return user;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'client' | 'nutritionist' = 'client',
): Promise<AuthUser> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });

  await storeToken(response.accessToken);
  const user: AuthUser = {
    userId: response.userId,
    email: response.email,
    name: response.name,
    role: response.role,
  };
  await saveUser(user);
  return user;
}

export async function logout(): Promise<void> {
  await removeToken();
  await SecureStore.deleteItemAsync(USER_KEY);
}
