import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { RegisterForm } from '../models/auth.model';

export function useRegister() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RegisterForm) => authService.register(data),
    onMutate: () => setError(null),
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      navigate('/');
    },
    onError: (err: any) => {
      const res = err?.response?.data;
      // Backend validation errors
      if (Array.isArray(res?.errors) && res.errors.length > 0) {
        setError(res.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(res?.message || 'Registration failed. Please try again.');
      }
    },
  });

  return {
    register: mutation.mutate,
    loading: mutation.isPending,
    error,
  };
}