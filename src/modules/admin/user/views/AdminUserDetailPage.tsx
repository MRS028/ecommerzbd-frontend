import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useUserById, useUpdateUser, useUpdateUserRole, useUpdateUserStatus,
} from '@/modules/user/controllers/useUsers';
import { Role, UserStatus, UpdateUserInput } from '@/modules/user/types/user.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserById(id);
  const updateUser = useUpdateUser();
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateUserInput>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        email: user.email,
      });
    }
  }, [user, reset]);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!user) return <p>User not found</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Button variant="outline" onClick={() => navigate('/admin/users')}>Back</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Email</span><span>{user.email}</span>
            <span className="text-muted-foreground">Role</span>
            <span className="space-x-2">
              <Badge className="capitalize">{user.role}</Badge>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={user.role}
                onChange={(e) => updateRole.mutate({ id: user._id, role: e.target.value as Role })}
              >
                {Object.values(Role).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </span>
            <span className="text-muted-foreground">Status</span>
            <span className="space-x-2">
              <Badge variant="outline">{user.status}</Badge>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={user.status}
                onChange={(e) => updateStatus.mutate({ id: user._id, status: e.target.value as UserStatus })}
              >
                {Object.values(UserStatus).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </span>
            <span className="text-muted-foreground">Email Verified</span><span>{user.emailVerified ? 'Yes' : 'No'}</span>
            <span className="text-muted-foreground">Phone</span><span>{user.phone || '—'}</span>
            <span className="text-muted-foreground">Last Login</span>
            <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}</span>
            <span className="text-muted-foreground">Created</span>
            <span>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Edit User</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) =>
              updateUser.mutate({ id: user._id, input: d })
            )}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm">First Name</label><Input {...register('firstName')} /></div>
              <div><label className="text-sm">Last Name</label><Input {...register('lastName')} /></div>
              <div><label className="text-sm">Display Name</label><Input {...register('name')} /></div>
              <div><label className="text-sm">Phone</label><Input {...register('phone')} /></div>
            </div>
            <Button type="submit" disabled={updateUser.isPending || !isDirty}>
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}