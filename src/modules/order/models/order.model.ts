import { CartItem } from '@/modules/cart/models/cart.model';

export interface Order {
  _id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}