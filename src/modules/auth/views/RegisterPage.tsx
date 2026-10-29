import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useRegister } from '../controllers/useRegister';
import { registerSchema, RegisterForm } from '../models/auth.model';

export default function RegisterPage() {
  const { register: registerUser, loading, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  return (
    <>
      <SEO title="Register" canonical="/register" />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input placeholder="First Name" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Input placeholder="Last Name" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Input placeholder="Email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Input type="password" placeholder="Password" {...register('password')} />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>
              <div>
                <Input placeholder="Phone (optional)" {...register('phone')} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              Have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}