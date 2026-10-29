import { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';
import { Order } from '@/shared/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .myOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading };
}