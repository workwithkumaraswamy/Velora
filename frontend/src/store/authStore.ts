import { create } from 'zustand';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credential: string, passwordPlain: string) => Promise<User>;
  register: (data: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => Promise<User>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('velora_user') || 'null'),
  token: localStorage.getItem('velora_token') || null,
  isAuthenticated: !!localStorage.getItem('velora_token'),
  isLoading: false,
  error: null,

  login: async (credential, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { credential, password });
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('velora_token', token);
      localStorage.setItem('velora_refresh_token', refreshToken);
      localStorage.setItem('velora_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      const { user, token, refreshToken } = res.data.data;
      localStorage.setItem('velora_token', token);
      localStorage.setItem('velora_refresh_token', refreshToken);
      localStorage.setItem('velora_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('velora_token');
    localStorage.removeItem('velora_refresh_token');
    localStorage.removeItem('velora_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    if (!get().token) return;
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data;
      localStorage.setItem('velora_user', JSON.stringify(user));
      set({ user });
    } catch {
      get().logout();
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/me', data);
      const user = res.data.data;
      localStorage.setItem('velora_user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  clearError: () => set({ error: null }),
}));
