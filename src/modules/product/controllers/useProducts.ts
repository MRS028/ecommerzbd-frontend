import { useEffect, useState } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../models/product.model';

export function useProducts(search?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .list({ search })
      .then((data) => { if (!cancelled) setProducts(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search]);

  return { products, loading };
}