import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  formatPrice,
  getCategoryName,
  getProductImage,
  getProductName,
  getProductPrice,
} from '@/shared/lib/utils';
import { ROUTES } from '@/shared/lib/constants';
import { Product } from '../../models/product.model';

export function ProductCard({ product }: { product: Product }) {
  // ✅ সব safe helper দিয়ে — null crash হবে না
  const name = getProductName(product);
  const price = getProductPrice(product);
  const image = getProductImage(product);
  const categoryName = getCategoryName(product?.category);

  return (
    <Link to={ROUTES.PRODUCT_DETAIL(product?.slug ?? '')}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={(e) => {
              // broken image হলে placeholder
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">
            {categoryName}
          </Badge>
          <h3 className="font-semibold truncate">{name}</h3>
          <p className="text-lg font-bold text-primary mt-1">
            {formatPrice(price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}