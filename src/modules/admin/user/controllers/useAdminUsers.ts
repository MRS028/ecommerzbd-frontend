import { useCallback, useEffect, useState } from 'react';
import { userAdminService } from '../services/user.admin.service';
import { User } from '@/shared/types';
import { toast } from 'sonner';

export function useAdminUsers(search?: string) {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const reload = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    userAdminService
      .list({ search })
      .then((res) => {
        if (cancelled) return;
        // 👇 filter out soft-deleted users
        const filtered = (res.items ?? []).filter(
          (u: any) => !u.isDeleted
        );
        setItems(filtered);
      })
      .catch((e) => {
        if (cancelled) return;
        toast.error(e?.response?.data?.message || 'Failed to load users');
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search, refetchKey]);

  const setRole = async (id: string, role: string) => {
    const prev = items;
    setItems((l) =>
      l.map((u) => (u._id === id ? { ...u, role: role as User['role'] } : u))
    );
    try {
      await userAdminService.setRole(id, role);
      toast.success('Role updated');
      reload();
    } catch (e: any) {
      setItems(prev);
      toast.error(e?.response?.data?.message || 'Failed to update role');
      throw e;
    }
  };

  const setStatus = async (id: string, status: string) => {
    const prev = items;
    setItems((l) =>
      l.map((u) => (u._id === id ? { ...u, status: status as User['status'] } : u))
    );
    try {
      await userAdminService.setStatus(id, status);
      toast.success('Status updated');
      reload();
    } catch (e: any) {
      setItems(prev);
      toast.error(e?.response?.data?.message || 'Failed to update status');
      throw e;
    }
  };

  const ban = async (id: string) => {
    const prev = items;
    setItems((l) =>
      l.map((u) =>
        u._id === id ? { ...u, status: 'blocked' as User['status'] } : u
      )
    );
    try {
      await userAdminService.ban(id);
      toast.success('User banned');
      reload();
    } catch (e) {
      setItems(prev);
      throw e;
    }
  };

  const remove = async (id: string) => {
    const prev = items;
    setItems((l) => l.filter((u) => u._id !== id));
    try {
      await userAdminService.remove(id);
      toast.success('User deleted');
      reload();
    } catch (e) {
      setItems(prev);
      throw e;
    }
  };

  return { items, loading, setRole, setStatus, ban, remove, reload };
}