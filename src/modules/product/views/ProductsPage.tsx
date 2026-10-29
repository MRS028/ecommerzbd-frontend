import { useProducts } from '../controllers/useProducts';
import { ProductGrid } from './components/ProductGrid';
import { SEO } from '@/shared/components/common/SEO';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ProductsPage() {
  const { products, loading } = useProducts();

  return (
    <>
      <SEO title="Shop All Products" description="Browse the full Spark Collection catalog." canonical="/products" />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </>
  );
}