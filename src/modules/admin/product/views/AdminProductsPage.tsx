import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AlertModal } from '@/shared/components/common/AlertModal';
import { useAlert } from '@/shared/hooks/useAlert';
import { useAdminProducts } from '../controllers/useAdminProducts';
import {
  formatPrice,
  getCategoryName,
  getProductFeatured,
  getProductPrice,
  getProductStock,
} from '@/shared/lib/utils';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, remove } = useAdminProducts(search);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { alert, show, hide } = useAlert();

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await remove(confirmId);
      toast.success('Product deleted');
    } catch (e: any) {
      show({
        variant: 'error',
        title: 'Cannot delete product',
        description: e?.response?.data?.message || e?.message || 'Unknown error',
      });
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  return (
    <>
      <SEO title="Manage Products" />
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Products</h2>
          <Link to="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>

        <Input
          placeholder="Search products..."
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
          <p className="text-muted-foreground py-8 text-center">No products yet.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <img
                        src={p.images?.[0] || '/placeholder.png'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-2">
                        {p.name}
                        {getProductFeatured(p) && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">
                        {getCategoryName(p.category)}
                      </Badge>
                    </td>
                    <td className="p-3">{formatPrice(getProductPrice(p))}</td>
                    <td className="p-3">{getProductStock(p)}</td>
                    <td className="p-3 text-right">
                      <Link to={`/admin/products/${p._id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmId(p._id)}
                      >
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
        open={!!confirmId}
        onOpenChange={(o) => !o && !deleting && setConfirmId(null)}
        title="Delete product?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
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