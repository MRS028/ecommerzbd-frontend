import { useCallback, useEffect, useState } from 'react';
import { categoryAdminService, Category } from '../services/category.service';

export function useCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await categoryAdminService.list();
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load categories');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (name: string) => {
    await categoryAdminService.create({ name });
    await load();
  };

  const update = async (id: string, input: Partial<Category>) => {
    await categoryAdminService.update(id, input);
    await load();
  };

  const remove = async (id: string) => {
    // Throw upstream so page can show modal on error.
    await categoryAdminService.remove(id);
    await load();
  };

  return { items, loading, error, create, update, remove, reload: load };
}