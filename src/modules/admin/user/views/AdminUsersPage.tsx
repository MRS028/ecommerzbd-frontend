import { useState } from 'react';
import { SEO } from '@/shared/components/common/SEO';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select';
import { Ban, Trash2, Shield } from 'lucide-react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AlertModal } from '@/shared/components/common/AlertModal';
import { useAlert } from '@/shared/hooks/useAlert';
import { useAdminUsers } from '../controllers/useAdminUsers';
import { getUserDisplayName, getUserEmail } from '@/shared/lib/user-helpers';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { toast } from 'sonner';

const ROLES = ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'];
const STATUSES = ['active', 'inactive', 'blocked', 'pending_verification'];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const { items, loading, setRole, setStatus, ban, remove } = useAdminUsers(search);
  const [confirmBan, setConfirmBan] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { alert, show, hide } = useAlert();
  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const handleBan = async () => {
    if (!confirmBan) return;
    setProcessing(true);
    try {
      await ban(confirmBan);
      toast.success('User banned');
    } catch (e: any) {
      show({ variant: 'error', title: 'Failed to ban user', description: e?.response?.data?.message || 'Unknown error' });
    } finally {
      setProcessing(false);
      setConfirmBan(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setProcessing(true);
    try {
      await remove(confirmDelete);
      toast.success('User deleted');
    } catch (e: any) {
      show({ variant: 'error', title: 'Failed to delete user', description: e?.response?.data?.message || 'Unknown error' });
    } finally {
      setProcessing(false);
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <SEO title="Manage Users" />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Users</h2>

        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No users found.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-3">{getUserDisplayName(u)}</td>
                    <td className="p-3">{getUserEmail(u)}</td>
                    <td className="p-3">
                      {/* Role change only for Super Admin */}
                      {isSuperAdmin ? (
                        <Select value={u.role} onValueChange={(v) => v && setRole(u._id, v)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Shield className="h-3 w-3" /> {u.role}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <Select value={u.status} onValueChange={(v) => v && setStatus(u._id, v)}>
                        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setConfirmBan(u._id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(u._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmBan}
        onOpenChange={(o) => !o && !processing && setConfirmBan(null)}
        title="Ban this user?"
        description="They will be blocked from logging in."
        onConfirm={handleBan}
        loading={processing}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && !processing && setConfirmDelete(null)}
        title="Delete this user?"
        description="This is a soft delete."
        onConfirm={handleDelete}
        loading={processing}
      />
      <AlertModal
        open={alert.open}
        onOpenChange={(o) => !o && hide()}
        variant={alert.variant}
        title={alert.title}
        description={alert.description}
        confirmText="Got it"
      />
    </>
  );
}