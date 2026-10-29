import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../controllers/useProductDetail';
import { SEO } from '@/shared/components/common/SEO';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  formatPrice,
  getCategoryName,
  getProductImage,
  getProductName,
  getProductPrice,
  getProductStock,
} from '@/shared/lib/utils';
import { useCartStore } from '@/modules/cart/store/cart.store';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { product, loading } = useProductDetail(slug);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!product) return <div className="container mx-auto p-8">Product not found.</div>;

  const name = getProductName(product);
  const price = getProductPrice(product);
  const image = getProductImage(product);
  const categoryName = getCategoryName(product.category);
  const stock = getProductStock(product);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const variant = variants[selectedVariant];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: product.description ?? '',
    image: product.images ?? [],
    category: categoryName,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability:
        stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SEO
        title={name}
        description={product.description?.slice(0, 160)}
        image={image}
        canonical={`/products/${product.slug ?? ''}`}
        type="product"
        jsonLd={jsonLd}
      />
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl overflow-hidden bg-muted">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <Badge variant="secondary">{categoryName}</Badge>
          <h1 className="text-3xl font-bold mt-2">{name}</h1>
          <p className="text-2xl text-primary font-bold mt-3">{formatPrice(price)}</p>
          <p className="mt-4 text-muted-foreground">{product.description ?? ''}</p>

          {variants.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {variants.map((v: any, i: number) => (
                <Button
                  key={v._id ?? i}
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
            disabled={stock <= 0}
            onClick={() =>
              addItem({
                productId: product._id,
                variantId: variant?._id,
                name,
                image,
                price: variant?.price ?? price,
                quantity: 1,
              })
            }
          >
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </>
  );
}