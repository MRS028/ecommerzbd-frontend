import api from '@/shared/lib/api';
import { LoginForm, RegisterForm } from '../models/auth.model';
import { User } from '@/shared/types';
import { extractOne } from '@/shared/lib/api-response';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Normalize backend response:
 *   { data: { user, tokens: { accessToken, refreshToken } } }
 * or { user, accessToken, refreshToken }
 */
const normalize = (res: any): AuthResponse => {
  const body = res.data?.data ?? res.data;
  return {
    user: body.user,
    accessToken: body.tokens?.accessToken ?? body.accessToken,
    refreshToken: body.tokens?.refreshToken ?? body.refreshToken,
  };
};

export const authService = {
  async login(data: LoginForm): Promise<AuthResponse> {
    const res = await api.post('/auth/login', {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    return normalize(res);
  },

  async register(data: RegisterForm): Promise<AuthResponse> {
    // Backend requires: email, password, confirmPassword, firstName, lastName, [phone]
    const payload: Record<string, unknown> = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirmPassword: data.confirmPassword, // ✅ required by backend
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
    };

    if (data.phone && data.phone.trim()) {
      payload.phone = data.phone.trim();
    }

    const res = await api.post('/auth/register', payload);
    return normalize(res);
  },

  async me(): Promise<User> {
    const res = await api.get('/auth/me');
    const u = extractOne<User>(res);
    if (!u) throw new Error('Failed to fetch user');
    return u;
  },

  async logout(refreshToken?: string) {
    await api.post('/auth/logout', refreshToken ? { refreshToken } : {});
  },

  async refresh() {
    const res = await api.post('/auth/refresh');
    return res.data?.data ?? res.data;
  },

  /**
   * Google OAuth login (requires backend POST /auth/google)
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const res = await api.post('/auth/google', { idToken });
    return normalize(res);
  },
};