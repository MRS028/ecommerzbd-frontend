import api from '@/shared/lib/api';
import {
  extractList,
  extractMeta,
  extractOne,
} from '@/shared/lib/api-response';

// ✅ Backend-এর EXACT enum
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED'
  | 'FAILED';

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
  'RETURNED',
  'FAILED',
];

// ✅ Backend validateStatusTransition() এর mirror
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED', 'FAILED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  REFUNDED: [],
  RETURNED: ['REFUNDED'],
  FAILED: ['PENDING'],
};

/**
 * Return the list of statuses the current order can transition INTO.
 */
export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface OrderUserRef {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface OrderAdmin {
  _id: string;
  orderNumber?: string;
  user?: OrderUserRef | string;
  userId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: any;
  paymentStatus?: string;
}

export interface ListResult<T> {
  items: T[];
  meta: any;
}

export const orderAdminService = {
  async list(params?: {
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<ListResult<OrderAdmin>> {
    const res = await api.get('/orders', { params });
    return {
      items: extractList<OrderAdmin>(res),
      meta: extractMeta(res),
    };
  },

  async getById(id: string): Promise<OrderAdmin> {
    const res = await api.get(`/orders/${id}`);
    const order = extractOne<OrderAdmin>(res);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    message?: string,
    currentStatus?: OrderStatus
  ): Promise<OrderAdmin> {
    // ✅ Normalize
    const normalized = String(status).trim().toUpperCase() as OrderStatus;

    if (!ALL_ORDER_STATUSES.includes(normalized)) {
      throw new Error(
        `Invalid status "${status}". Allowed: ${ALL_ORDER_STATUSES.join(', ')}`
      );
    }

    // ✅ Client-side transition validation (backend-ও চেক করবে)
    if (currentStatus) {
      const allowed = getNextStatuses(currentStatus);
      if (!allowed.includes(normalized)) {
        throw new Error(
          `Cannot change status from ${currentStatus} to ${normalized}. Allowed next: ${
            allowed.length ? allowed.join(', ') : 'none (terminal state)'
          }`
        );
      }
    }

    const res = await api.patch(`/orders/${id}/status`, {
      status: normalized,
      message:
        message ??
        `Status updated to ${normalized} by admin`,
    });

    const order = extractOne<OrderAdmin>(res);
    if (!order) return this.getById(id);
    return order;
  },

  async cancel(id: string, reason?: string): Promise<OrderAdmin> {
    const res = await api.post(
      `/orders/${id}/cancel`,
      { reason: reason ?? 'Cancelled by admin' }
    );
    const order = extractOne<OrderAdmin>(res);
    if (!order) return this.getById(id);
    return order;
  },
};