import { create } from 'zustand';
import { api } from '../lib/api';

export type User = {
  id: string;
  email: string;
  full_name: string;
  tenant_id: string;
  role_id?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'error';
  error?: string;
  hydrate: () => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const saveAuth = (token: string, user: User) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: 'idle',
  error: undefined,
  hydrate: () => {
    const token = localStorage.getItem('auth_token');
    const userRaw = localStorage.getItem('auth_user');
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({ token: token ?? null, user, status: 'idle', error: undefined });
  },
  login: async (payload) => {
    set({ status: 'loading', error: undefined });
    try {
      const res = await api.post('/auth/login', payload);
      const token = res.data.access_token as string;
      const user = res.data.user as User;
      saveAuth(token, user);
      set({ token, user, status: 'idle' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      set({ status: 'error', error: msg });
      throw err;
    }
  },
  signup: async (payload) => {
    set({ status: 'loading', error: undefined });
    try {
      const res = await api.post('/auth/signup', payload);
      const token = res.data.access_token as string;
      const user = res.data.user as User;
      saveAuth(token, user);
      set({ token, user, status: 'idle' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Signup failed';
      set({ status: 'error', error: msg });
      throw err;
    }
  },
  logout: () => {
    clearAuth();
    set({ token: null, user: null, status: 'idle', error: undefined });
  },
}));