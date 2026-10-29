import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { SEO } from '@/shared/components/common/SEO';
import { useProducts } from '@/modules/product/controllers/useProducts';
import { ProductGrid } from '@/modules/product/views/components/ProductGrid';
import { APP_NAME } from '@/shared/lib/constants';

export default function HomePage() {
  const { products } = useProducts();

  return (
    <>
      <SEO
        title="Premium Fashion & Lifestyle"
        description="Discover curated fashion from Spark Collection. Shop the latest trends with fast delivery."
        canonical="/"
      />
      <section className="relative py-24 px-4 text-center bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Welcome to <span className="text-primary">{APP_NAME}</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
          Premium fashion & lifestyle products, curated for you.
        </p>
        <Link to="/products" className="inline-block mt-8">
          <Button size="lg" className="px-8">Shop Now</Button>
        </Link>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid products={products.slice(0, 8)} />
      </section>
    </>
  );
}