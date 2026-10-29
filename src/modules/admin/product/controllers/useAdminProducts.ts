import { useCallback, useEffect, useState } from 'react';
import {
  productAdminService,
  ProductAdmin,
} from '../services/product.admin.service';
import { toast } from 'sonner';

export function useAdminProducts(search?: string) {
  const [items, setItems] = useState<ProductAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const reload = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productAdminService
      .list({ search })
      .then((res) => {
        if (cancelled) return;
        // 👇 filter out soft-deleted
        const filtered = (res.items ?? []).filter(
          (p: any) => !p.isDeleted && p.isActive !== false
        );
        setItems(filtered);
      })
      .catch((e) => {
        if (cancelled) return;
        toast.error(e?.response?.data?.message || 'Failed to load products');
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search, refetchKey]);

  const remove = async (id: string) => {
    const prev = items;
    // Optimistic remove
    setItems((list) => list.filter((p) => p._id !== id));
    try {
      await productAdminService.remove(id);
      toast.success('Product deleted');
      // ⬇️ Force refetch from server to confirm
      reload();
    } catch (e) {
      setItems(prev);
      throw e;
    }
  };

  return { items, loading, remove, reload };
}