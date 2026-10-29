import { Product } from '../../models/product.model';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="text-center text-muted-foreground py-12">No products found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}