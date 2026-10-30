import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '@/modules/user/controllers/useUsers';
import { CreateUserInput, Role } from '@/modules/user/types/user.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function AdminUserCreatePage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserInput>();

  const onSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: () => navigate('/admin/users'),
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle>Create New User</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input type="email" {...register('email', { required: true })} />
            {errors.email && <p className="text-xs text-red-500">Email required</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password *</label>
            <Input type="password" {...register('password', { required: true, minLength: 6 })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name *</label>
              <Input {...register('firstName', { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name *</label>
              <Input {...register('lastName', { required: true })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input {...register('phone')} />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <select className="border rounded px-3 py-2 w-full" {...register('role')}>
              {Object.values(Role).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}