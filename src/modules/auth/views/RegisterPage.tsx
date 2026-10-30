import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useRegister } from '../controllers/useRegister';
import { useGoogleLogin } from '../controllers/useGoogleLogin';
import { registerSchema, RegisterForm } from '../models/auth.model';

declare global {
  interface Window {
    google?: any;
  }
}

export default function RegisterPage() {
  const { register: registerUser, loading, error } = useRegister();
  const {
    loginWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  // Load Google Identity Services script once
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    if (document.getElementById('google-gsi')) return;

    const script = document.createElement('script');
    script.id = 'google-gsi';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <SEO title="Register" canonical="/register" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit((data) => registerUser(data))}
              className="space-y-3"
              noValidate
            >
              {/* Name row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="First Name"
                    autoComplete="given-name"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Last Name"
                    autoComplete="family-name"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Input
                  type="password"
                  placeholder="Password (min 8, upper, lower, number, special)"
                  autoComplete="new-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <Input
                  type="tel"
                  placeholder="Phone (optional, e.g. +8801712345678)"
                  autoComplete="tel"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Backend / Google error */}
              {(error || googleError) && (
                <p className="text-sm text-destructive">
                  {error || googleError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={loginWithGoogle}
              disabled={googleLoading}
            >
              <GoogleIcon />
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.7 34.6 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.6 5.6C40.9 35.9 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}