import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CategoryRef } from '@/modules/product/models/product.model';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getCategoryName(
  category: string | CategoryRef | null | undefined
): string {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  return category.name ?? 'Uncategorized';
}

export function getCategorySlug(
  category: string | CategoryRef | null | undefined
): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.slug ?? category._id ?? '';
}