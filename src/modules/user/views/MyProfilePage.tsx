import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useProfile, useUpdateProfile } from '../controllers/useUsers';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { UpdateProfileInput } from '../types/user.types';

export default function MyProfilePage() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateProfileInput>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, reset]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) return null;

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile.mutate(data);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link to="/orders">
          <Button variant="outline">My Orders</Button>
        </Link>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {(user.firstName?.[0] || user.name?.[0] || user.email[0]).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">
              {user.fullName || user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'No name'}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
              </Badge>
              {user.status && <Badge variant="outline">{user.status}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input {...register('firstName')} placeholder="First name" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input {...register('lastName')} placeholder="Last name" />
              </div>
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <Input {...register('name')} placeholder="Display name" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input {...register('phone')} placeholder="+8801XXXXXXXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input {...register('avatar')} placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateProfile.isPending || !isDirty}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Reset
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}