import api from '@/shared/lib/api';
import { extractList, extractOne } from '@/shared/lib/api-response';
import { Order } from '@/shared/types';

export const orderService = {
  /** GET /orders/my-orders */
  async myOrders() {
    const res = await api.get('/orders/my-orders');
    return extractList<Order>(res);
  },
  /** GET /orders/:id */
  async byId(id: string) {
    const res = await api.get(`/orders/${id}`);
    const o = extractOne<Order>(res);
    if (!o) throw new Error('Order not found');
    return o;
  },
  /** POST /orders */
  async create(input: { shippingAddress: any; paymentMethod: string }) {
    const res = await api.post('/orders', input);
    const o = extractOne<Order>(res);
    if (!o) throw new Error('Failed to create order');
    return o;
  },
  /** POST /orders/:id/cancel (not PATCH) */
  async cancel(id: string, reason?: string) {
    await api.post(`/orders/${id}/cancel`, reason ? { reason } : {});
  },
};