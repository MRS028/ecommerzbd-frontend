import api from '@/shared/lib/api';
import { Product } from '../models/product.model';

export const productService = {
  async list(params?: { search?: string; category?: string }) {
    const res = await api.get('/products', { params });
    return (res.data.data || []) as Product[];
  },
  async bySlug(slug: string) {
    const res = await api.get(`/products/slug/${slug}`);
    return res.data.data as Product;
  },
};