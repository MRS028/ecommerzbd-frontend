import api from '@/shared/lib/api';

export const dashboardService = {
  async stats() {
    // If backend exposes /users/statistics, reuse; else fallback to client count
    try {
      const res = await api.get('/users/statistics');
      return res.data.data as {
        totalUsers: number;
        activeUsers: number;
        blockedUsers: number;
      };
    } catch {
      return { totalUsers: 0, activeUsers: 0, blockedUsers: 0 };
    }
  },
  async productCount() {
    const res = await api.get('/products');
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload) ? payload.length : payload?.total ?? 0;
  },
  async orderCount() {
    const res = await api.get('/orders');
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload) ? payload.length : payload?.total ?? 0;
  },
};