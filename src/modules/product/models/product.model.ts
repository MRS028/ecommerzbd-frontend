export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  isFeatured?: boolean;
  fullPath?: string;
  id?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string | CategoryRef;
  variants: {
    _id: string;
    size?: string;
    color?: string;
    price: number;
    stock: number;
  }[];
}