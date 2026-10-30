import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function useGoogleLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onMutate: () => setError(null),
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      navigate('/');
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          'Google login failed. Please try again.',
      );
    },
  });

  const loginWithGoogle = () => {
    // 👇 Requires Google Identity Services script loaded (see RegisterPage)
    const google = (window as any).google;
    if (!google?.accounts?.id) {
      setError('Google login is not ready. Please refresh the page.');
      return;
    }
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      callback: (response: { credential: string }) => {
        mutation.mutate(response.credential);
      },
    });
    google.accounts.id.prompt();
  };

  return {
    loginWithGoogle,
    loading: mutation.isPending,
    error,
  };
}