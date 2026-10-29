import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AlertModal } from '@/shared/components/common/AlertModal';
import { useAlert } from '@/shared/hooks/useAlert';
import { useCategories } from '../controllers/useCategories';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const { items, loading, create, remove } = useCategories();
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { alert, show, hide } = useAlert();

  // CREATE
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      show({
        variant: 'warning',
        title: 'Missing name',
        description: 'Please enter a category name before adding.',
      });
      return;
    }
    setCreating(true);
    try {
      await create(name);
      setNewName('');
      show({
        variant: 'success',
        title: 'Category created',
        description: `"${name}" was added successfully.`,
      });
    } catch (e: any) {
      show({
        variant: 'error',
        title: 'Failed to create category',
        description: e?.response?.data?.message || e?.message || 'Unknown error',
      });
    } finally {
      setCreating(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await remove(confirmId);
      toast.success('Category deleted');
    } catch (e: any) {
      show({
        variant: 'error',
        title: 'Cannot delete category',
        description:
          e?.response?.data?.message ||
          e?.message ||
          'This category still has products. Reassign or delete them first.',
      });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  return (
    <>
      <SEO title="Manage Categories" />

      <div className="space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold">Categories</h2>

        {/* CREATE BAR */}
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="h-4 w-4 mr-1" />
            {creating ? 'Adding...' : 'Add'}
          </Button>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No categories yet. Add one above.
          </p>
        ) : (
          <div className="border rounded-lg divide-y">
            {items.map((c) => (
              <div
                key={c._id}
                className="p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  <Badge variant="outline">{c.slug}</Badge>
                  {c.isActive && <Badge variant="secondary">Active</Badge>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmId(c._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && !deleting && setConfirmId(null)}
        title="Delete category?"
        description="This action cannot be undone. Products in this category must be moved first."
        onConfirm={handleDelete}
        loading={deleting}
      />

      {/* RESULT MODAL */}
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