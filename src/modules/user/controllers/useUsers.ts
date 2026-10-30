import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi } from '../services/user.api';
import {
  CreateUserInput,
  UpdateProfileInput,
  UpdateUserInput,
  UserListQuery,
  Role,
  UserStatus,
} from '../types/user.types';

const KEYS = {
  all: ['users'] as const,
  list: (q: UserListQuery) => ['users', 'list', q] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
  profile: ['users', 'profile'] as const,
  stats: ['users', 'statistics'] as const,
};

// ============ Profile ============
export function useProfile() {
  return useQuery({
    queryKey: KEYS.profile,
    queryFn: userApi.getProfile,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => userApi.updateProfile(input),
    onSuccess: (user) => {
      qc.setQueryData(KEYS.profile, user);
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    },
  });
}

// ============ Admin list ============
export function useUsers(query: UserListQuery = {}) {
  return useQuery({
    queryKey: KEYS.list(query),
    queryFn: () => userApi.getUsers(query),
  });
}

export function useUserStatistics() {
  return useQuery({
    queryKey: KEYS.stats,
    queryFn: userApi.getUserStatistics,
  });
}

export function useUserById(id?: string) {
  return useQuery({
    queryKey: KEYS.detail(id || ''),
    queryFn: () => userApi.getUserById(id!),
    enabled: !!id,
  });
}

// ============ Mutations ============
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => userApi.createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('User created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userApi.updateUser(id, input),
    onSuccess: (user) => {
      qc.setQueryData(KEYS.detail(user._id), user);
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('User updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update user');
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      userApi.updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Role updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update role'),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userApi.updateUserStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Status updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update status'),
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.banUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('User banned');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to ban user'),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('User deleted');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete user'),
  });
}