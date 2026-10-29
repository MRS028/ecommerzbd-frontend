import api from '@/shared/lib/api';
import { Order } from '../models/order.model';

export const orderService = {
  async list() {
    const res = await api.get('/orders');
    return (res.data.data || []) as Order[];
  },
  async byId(id: string) {
    const res = await api.get(`/orders/${id}`);
    return res.data.data as Order;
  },
};