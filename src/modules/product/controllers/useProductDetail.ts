import { useEffect, useState } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../models/product.model';

export function useProductDetail(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.bySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading };
}