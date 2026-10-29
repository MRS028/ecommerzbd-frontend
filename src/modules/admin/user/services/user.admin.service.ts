import api from '@/shared/lib/api';
import { extractList, extractOne } from '@/shared/lib/api-response';
import { User } from '@/shared/types';

export interface ListResult<T> {
  items: T[];
  meta: any;
}

export const userAdminService = {
  async list(params?: { search?: string; page?: number; limit?: number; role?: string; status?: string }): Promise<ListResult<User>> {
    const res = await api.get('/users', { params });
    return {
      items: extractList<User>(res),
      meta: res.data?.meta ?? null,
    };
  },

  async getById(id: string): Promise<User> {
    const res = await api.get(`/users/${id}`);
    const u = extractOne<User>(res);
    if (!u) throw new Error('User not found');
    return u;
  },

  async setRole(id: string, role: string): Promise<void> {
    // ⚠️ backend only allows SUPER_ADMIN for this endpoint
    await api.patch(`/users/${id}/role`, { role });
  },

  async setStatus(id: string, status: string): Promise<void> {
    await api.patch(`/users/${id}/status`, { status });
  },

  async ban(id: string): Promise<void> {
    // Backend does not have /ban — use status endpoint
    await api.patch(`/users/${id}/status`, { status: 'blocked' });
  },

  async unban(id: string): Promise<void> {
    await api.patch(`/users/${id}/status`, { status: 'active' });
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`); // ✅ correct path
  },
};