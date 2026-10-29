import { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';
import { Order } from '../models/order.model';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    orderService.list().then(setOrders).finally(() => setLoading(false));
  }, []);
  return { orders, loading };
}