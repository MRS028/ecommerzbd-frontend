import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { formatPrice } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/lib/constants';
import { Product } from '../../models/product.model';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={ROUTES.PRODUCT_DETAIL(product.slug)}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-lg font-bold text-primary mt-1">{formatPrice(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}