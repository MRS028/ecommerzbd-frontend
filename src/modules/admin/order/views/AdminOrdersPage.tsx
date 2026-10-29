import { SEO } from '@/shared/components/common/SEO';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { formatPrice } from '@/shared/lib/utils';
import { getUserDisplayName } from '@/shared/lib/user-helpers';
import { useAdminOrders } from '../controllers/useAdminOrders';
import {
  getNextStatuses,
  OrderStatus,
} from '../services/order.admin.service';

const statusVariant = (s: OrderStatus) => {
  switch (s) {
    case 'DELIVERED':
      return 'default';
    case 'CANCELLED':
    case 'FAILED':
    case 'RETURNED':
    case 'REFUNDED':
      return 'destructive';
    case 'PENDING':
    case 'CONFIRMED':
      return 'secondary';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
    case 'PROCESSING':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function AdminOrdersPage() {
  const { items, loading, updateStatus } = useAdminOrders();

  return (
    <>
      <SEO title="Manage Orders" />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Orders</h2>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No orders yet.
          </p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Change Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => {
                  // ✅ শুধু valid transitions দেখান
                  const nextStatuses = getNextStatuses(o.status);

                  return (
                    <tr key={o._id} className="border-t">
                      <td className="p-3 font-mono text-xs">
                        #{o.orderNumber || o._id.slice(-8)}
                      </td>
                      <td className="p-3">
                        {getUserDisplayName((o as any).user)}
                      </td>
                      <td className="p-3 font-semibold">
                        {formatPrice(o.total)}
                      </td>
                      <td className="p-3">
                        <Badge variant={statusVariant(o.status)}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {nextStatuses.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            No further actions
                          </span>
                        ) : (
                          <Select
                            value=""
                            onValueChange={(val) =>
                              val &&
                              updateStatus(o._id, val as OrderStatus, o.status)
                            }
                          >
                            <SelectTrigger className="w-48 ml-auto">
                              <SelectValue placeholder="Change to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {nextStatuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}