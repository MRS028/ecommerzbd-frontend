export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  variants: {
    _id: string;
    size?: string;
    color?: string;
    price: number;
    stock: number;
  }[];
}