import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../controllers/useProductDetail';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatPrice } from '@/shared/lib/utils';
import { useCartStore } from '@/modules/cart/store/cart.store';
// import { APP_URL } from '@/shared/lib/constants';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { product, loading } = useProductDetail(slug);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (loading) return <div className="container mx-auto p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!product) return <div className="container mx-auto p-8">Product not found.</div>;

  const variant = product.variants[selectedVariant];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: variant?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.description?.slice(0, 160)}
        image={product.images?.[0]}
        canonical={`/products/${product.slug}`}
        type="product"
        jsonLd={jsonLd}
      />
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl overflow-hidden bg-muted">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-2xl text-primary font-bold mt-3">{formatPrice(product.price)}</p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <Button
                  key={v._id}
                  variant={i === selectedVariant ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVariant(i)}
                >
                  {v.size || v.color || `Variant ${i + 1}`}
                </Button>
              ))}
            </div>
          )}

          <Button
            className="mt-6 w-full md:w-auto"
            size="lg"
            disabled={!variant || variant.stock <= 0}
            onClick={() =>
              addItem({
                productId: product._id,
                variantId: variant._id,
                name: product.name,
                image: product.images?.[0],
                price: variant.price ?? product.price,
                quantity: 1,
              })
            }
          >
            {variant?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </>
  );
}