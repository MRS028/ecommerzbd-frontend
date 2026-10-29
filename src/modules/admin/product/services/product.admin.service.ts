import api from '@/shared/lib/api';
import { extractList, extractMeta, extractOne } from '@/shared/lib/api-response';
import { dummyUploadImage } from '@/shared/lib/dummy-upload';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  sku: string;
  basePrice: number;
  featured: boolean;
}

export interface ProductAdmin {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  basePrice?: number;
  stock: number;
  totalStock?: number;
  images: string[];
  category: string | { _id: string; name: string; slug: string };
  sku: string;
  featured?: boolean;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
}

export interface ListResult<T> {
  items: T[];
  meta: any;
}

// ✅ Normalize product from backend — handle সব field aliases
function normalizeProduct(p: any): ProductAdmin {
  const price = Number(p.price ?? p.basePrice ?? 0);
  const stock = Number(p.stock ?? p.totalStock ?? 0);
  return {
    _id: p._id,
    name: p.name ?? 'Untitled',
    slug: p.slug ?? '',
    description: p.description ?? '',
    price: Number.isFinite(price) ? price : 0,
    basePrice: Number(p.basePrice ?? p.price ?? 0),
    stock: Number.isFinite(stock) ? stock : 0,
    totalStock: Number(p.totalStock ?? p.stock ?? 0),
    images: Array.isArray(p.images) ? p.images : [],
    category: p.category ?? 'Uncategorized',
    sku: p.sku ?? '',
    featured: Boolean(p.featured ?? p.isFeatured),
    isFeatured: Boolean(p.isFeatured ?? p.featured),
    status: p.status,
    createdAt: p.createdAt,
  };
}

export const productAdminService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ListResult<ProductAdmin>> {
    const res = await api.get('/products', { params });
    const raw = extractList<any>(res);
    return {
      items: raw.map(normalizeProduct),  // ✅ normalize
      meta: extractMeta(res),
    };
  },

  async getById(id: string): Promise<ProductAdmin> {
    const res = await api.get(`/products/${id}`);
    const raw = extractOne<any>(res);
    if (!raw) throw new Error('Product not found');
    return normalizeProduct(raw);  // ✅ normalize
  },

  async create(input: CreateProductInput): Promise<ProductAdmin> {
    const payload = {
      name: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
      category: input.category.trim(),
      stock: Number(input.stock),
      images: input.images,
      sku: input.sku.trim().toUpperCase(),
      basePrice: Number(input.basePrice),
      featured: Boolean(input.featured),
    };
    const res = await api.post('/products', payload);
    const raw = extractOne<any>(res);
    if (!raw) throw new Error('Failed to create product');
    return normalizeProduct(raw);
  },

  async update(
    id: string,
    input: Partial<CreateProductInput>
  ): Promise<ProductAdmin> {
    const payload: any = { ...input };
    if (payload.sku) payload.sku = payload.sku.trim().toUpperCase();
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.basePrice !== undefined) payload.basePrice = Number(payload.basePrice);
    if (payload.stock !== undefined) payload.stock = Number(payload.stock);

    const res = await api.patch(`/products/${id}`, payload);
    const raw = extractOne<any>(res);
    if (!raw) throw new Error('Failed to update product');
    return normalizeProduct(raw);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async uploadImage(
    file: File,
    options?: {
      folder?: string;
      onProgress?: (pct: number) => void;
      signal?: AbortSignal;
    }
  ): Promise<string> {
    return dummyUploadImage(file, options);
  },

  async uploadImages(
    files: File[],
    options?: {
      folder?: string;
      onProgress?: (done: number, total: number) => void;
    }
  ): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await this.uploadImage(files[i], { folder: options?.folder });
      urls.push(url);
      options?.onProgress?.(i + 1, files.length);
    }
    return urls;
  },
};