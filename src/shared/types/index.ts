export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  status: 'active' | 'inactive' | 'blocked' | 'pending_verification';
  emailVerified?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  isFeatured?: boolean;
  fullPath?: string;
}

export interface Variant {
  _id?: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock?: number;
  images: string[];
  category: string | CategoryRef;
  variants?: Variant[];
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user?: User | string;
  items: any[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  shippingAddress?: any;
}