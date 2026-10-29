import api from '@/shared/lib/api';
import { LoginForm, RegisterForm } from '../models/auth.model';
import { User } from '@/shared/types';

export const authService = {
  async login(data: LoginForm) {
    const res = await api.post('/auth/login', data);
    return res.data.data as { user: User; accessToken: string; refreshToken: string };
  },
  async register(data: RegisterForm) {
    const res = await api.post('/auth/register', data);
    return res.data.data as { user: User; accessToken: string; refreshToken: string };
  },
  async me() {
    const res = await api.get('/auth/me');
    return res.data.data as User;
  },
  async logout() {
    await api.post('/auth/logout');
  },
};