import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// import type { CategoryRef } from '@/shared/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined, currency = 'USD') {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * ✅ Safe category name — null, undefined, string, object সব handle করে
 */
export function getCategoryName(
  category: any
): string {
  // 1) null/undefined
  if (category === null || category === undefined) return 'Uncategorized';

  // 2) string (ObjectId বা নাম)
  if (typeof category === 'string') {
    // ObjectId হলে "Uncategorized" দেখাই
    if (/^[a-f\d]{24}$/i.test(category)) return 'Uncategorized';
    // খালি string
    if (!category.trim()) return 'Uncategorized';
    return category;
  }

  // 3) object → name খুঁজি
  if (typeof category === 'object') {
    const name =
      category.name ??
      category.title ??
      category.label ??
      null;
    if (name && typeof name === 'string') return name;
  }

  return 'Uncategorized';
}

export function getCategorySlug(category: any): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.slug ?? category._id ?? '';
}

/**
 * ✅ Safe product price
 */
export function getProductPrice(product: any): number {
  if (!product) return 0;
  const v =
    product.price ??
    product.basePrice ??
    product.variants?.[0]?.price ??
    0;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * ✅ Safe product stock — stock, totalStock, variants সব handle
 */
export function getProductStock(product: any): number {
  if (!product) return 0;

  // 1) direct stock
  if (typeof product.stock === 'number' && product.stock > 0) {
    return product.stock;
  }

  // 2) totalStock
  if (typeof product.totalStock === 'number' && product.totalStock > 0) {
    return product.totalStock;
  }

  // 3) variants থেকে sum
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const total = product.variants.reduce(
      (sum: number, v: any) => sum + (Number(v?.stock) || 0),
      0
    );
    if (total > 0) return total;
  }

  return 0;
}

/**
 * ✅ Safe featured
 */
export function getProductFeatured(product: any): boolean {
  return Boolean(product?.featured ?? product?.isFeatured);
}

/**
 * ✅ Safe product image
 */
export function getProductImage(product: any): string {
  if (!product) return '/placeholder.png';
  if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  return '/placeholder.png';
}

/**
 * ✅ Safe product name
 */
export function getProductName(product: any): string {
  return product?.name ?? 'Untitled Product';
}