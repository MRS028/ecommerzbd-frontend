import { Product } from '../../models/product.model';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
  // ✅ null/undefined filter
  const validProducts = Array.isArray(products)
    ? products.filter((p) => p && p._id)
    : [];

  if (!validProducts.length) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {validProducts.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}