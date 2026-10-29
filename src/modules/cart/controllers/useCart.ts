import { useCartStore } from '../store/cart.store';

export function useCart() {
  const store = useCartStore();
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQty: store.updateQty,
    clear: store.clear,
    subtotal: store.subtotal(),
    count: store.count(),
  };
}