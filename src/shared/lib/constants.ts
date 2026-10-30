declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;       
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Spark Collection';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// ⚠️ API URL constant যোগ করুন
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
} as const;