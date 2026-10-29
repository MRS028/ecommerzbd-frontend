import api from '@/shared/lib/api';
import { LoginForm, RegisterForm } from '../models/auth.model';
import { User } from '@/shared/types';
import { extractOne } from '@/shared/lib/api-response';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(data: LoginForm): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    // 👇 backend: { data: { user, tokens: { accessToken, refreshToken } } }
    const body = res.data?.data ?? res.data;
    return {
      user: body.user,
      accessToken: body.tokens?.accessToken ?? body.accessToken,
      refreshToken: body.tokens?.refreshToken ?? body.refreshToken,
    };
  },
  async register(data: RegisterForm): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    const body = res.data?.data ?? res.data;
    return {
      user: body.user,
      accessToken: body.tokens?.accessToken ?? body.accessToken,
      refreshToken: body.tokens?.refreshToken ?? body.refreshToken,
    };
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
};