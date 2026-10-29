import { Link } from 'react-router-dom';
import { SEO } from '@/shared/components/common/SEO';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { formatPrice } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/lib/constants';
import { useOrders } from '../controllers/useOrders';

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  return (
    <>
      <SEO title="My Orders" canonical="/orders" />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Link key={o._id} to={ROUTES.ORDER_DETAIL(o._id)}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Order #{o._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge>{o.status}</Badge>
                      <p className="font-bold mt-1">{formatPrice(o.total)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}