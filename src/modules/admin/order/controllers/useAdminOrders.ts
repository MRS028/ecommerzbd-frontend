import { useCallback, useEffect, useState } from 'react';
import {
  orderAdminService,
  OrderAdmin,
  OrderStatus,
} from '../services/order.admin.service';
import { toast } from 'sonner';

export function useAdminOrders() {
  const [items, setItems] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const reload = useCallback(() => setRefetchKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    orderAdminService
      .list()
      .then((res) => {
        if (cancelled) return;
        setItems(Array.isArray(res.items) ? res.items : []);
      })
      .catch((e) => {
        if (cancelled) return;
        toast.error(e?.response?.data?.message || 'Failed to load orders');
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refetchKey]);

  const updateStatus = async (
    id: string,
    status: OrderStatus,
    currentStatus?: OrderStatus
  ) => {
    const prev = items;
    // Optimistic update
    setItems((l) => l.map((o) => (o._id === id ? { ...o, status } : o)));

    try {
      await orderAdminService.updateStatus(id, status, undefined, currentStatus);
      toast.success(`Order updated to ${status}`);
      reload();
    } catch (e: any) {
      setItems(prev);
      // ✅ Show full error — could be transition validation OR backend error
      const backendMsg =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.[0]?.message ||
        e?.message ||
        'Update failed';
      toast.error(backendMsg);
    }
  };

  return { items, loading, updateStatus, reload };
}